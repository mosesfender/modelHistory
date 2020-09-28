<?php

namespace svs\modules\modelHistory\models;

use Yii;

/**
 * @property int $id
 * @property int|null $changed_id ID изменённой модели
 * @property int|null $log_time Время записи
 * @property int|null $user_id Пользователь, создавший изменения
 * @property string|null $class Класс объекта с изменениями
 * @property string|null $field Поле, в котором случилось изменение
 * @property resource|null $value_before Значение поля до изменения
 * @property resource|null $value_after Значение поля после изменения
 */
class QueueStatuses extends \yii\db\ActiveRecord {

     /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return '{{%queue_statuses}}';
    }

    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['changed_id', 'log_time', 'user_id'], 'integer'],
            [['class', 'value_before', 'value_after'], 'string'],
            [['field'], 'string', 'max' => 40],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'id'           => 'ID',
            'changed_id'   => 'ID модели',
            'log_time'     => 'Время записи',
            'user_id'      => 'Пользователь, создавший изменения',
            'class'        => 'Класс объекта с изменениями',
            'field'        => 'Поле, в котором случилось изменение',
            'value_before' => 'Значение поля до изменения',
            'value_after'  => 'Значение поля после изменения',
        ];
    }

}
