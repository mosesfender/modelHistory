<?php

namespace svs\modules\modelHistory\behaviors;

use svs\modules\modelHistory\models\QueueStatuses;
use yii\base\UserException;

/**
 * 
 * Объект поведения предназначен для моделей, помогает сохранять изменения 
 * в моделях, опираясь на DirtyAttributes.
 * 
 * Примерная конфигурация для подключения в модели:
 * 
 *  "log" => [
 *      "class"         => \svs\modules\modelHistory\behaviors\QueueStatusesBehavior::class,
 *      "idField"       => "id",
 *      "ignoredFields" => ["updated_at"]
 *  ]
 */
class QueueStatusesBehavior extends \yii\base\Behavior {

    /**
     * @var \yii\db\ActiveRecord
     */
    public $owner;

    /**
     * Класс модели, сохраняющей лог
     * @var class
     */
    public $storageModel = 'svs\modules\modelHistory\models\QueueStatuses';

    /**
     * Имя поля в модели, значение которого однозначно 
     * идентифицирует запись модели-владельца
     * @var string
     */
    public $idField;

    /**
     * Классы, для которых производится поиск в записях
     */
    public $searchClasses = ["*"];

    /**
     * Список полей модели, которые следует игнорировать 
     * и не регистрировать изменения в логе.
     * Скалярный массив.
     * @var array
     * @example ['fieldOne', 'fieldTwo', …]
     */
    public $ignoredFields = [];

    /**
     * Временное хранилище данных между событиями модели 
     * @var array
     */
    private $_buffer = [];

    /**
     * Таймштамп для регистрации изменений
     * @var int
     */
    private $_logtime;

    public function init() {
        parent::init();
        if (!$this->idField) {
            throw new UserException("Необходимо указать поле, "
                    . "идентифицирующее сохраняемую модель.");
        }

        $this->_logtime = time();
    }

    public function events(): array {
        return [
            \yii\db\ActiveRecord::EVENT_BEFORE_UPDATE => "beforeUpdate",
            \yii\db\ActiveRecord::EVENT_AFTER_UPDATE  => "afterUpdate"
        ];
    }

    public function beforeUpdate(\yii\base\ModelEvent $ev) {
        /* @var $model \yii\db\ActiveRecord */
        $model  = $ev->sender;
        /* @var $schema \yii\db\TableSchema */
        $schema = $model->getTableSchema();

        foreach ($model->dirtyAttributes as $key => $value) {
            if (in_array($key, $this->ignoredFields)) {
                continue;
            }
            $oldAttribute = $model->getOldAttribute($key);
            $attribute    = $model->getAttribute($key);
            switch ($schema->columns[$key]->phpType) {
                case "string":
                    $attribute = strval($attribute);
                    break;
                case "integer":
                    $attribute = intval($attribute);
                    break;
                case "double":
                    $attribute = floatval($attribute);
                    break;
            }

            if ($oldAttribute === $attribute) {
                continue;
            }

            $this->_buffer[$key] = [
                "before" => $oldAttribute,
                "after"  => $attribute
            ];
        }
        return $ev;
    }

    public function afterUpdate(\yii\db\AfterSaveEvent $ev) {
        /* @var $model \yii\db\ActiveRecord */
        $model = $ev->sender;

        foreach ($this->_buffer as $key => $values) {
            $log = new $this->storageModel([
                "class"        => get_class($this->owner),
                "log_time"     => $this->_logtime,
                "user_id"      => 1,
                "changed_id"   => $this->owner->getAttribute($this->idField),
                "field"        => $key,
                "value_before" => $values["before"],
                "value_after"  => $values["after"]
            ]);
            $log->save(false);

            unset($log);
        }

        return $ev;
    }

}
