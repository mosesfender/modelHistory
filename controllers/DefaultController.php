<?php

namespace svs\modules\modelHistory\controllers;

use svs\modules\modelHistory\models\ModelHistoryData as mhd;
use svs\modules\modelHistory\models\QueueStatuses as qs;
use yii\web\Response;
use yii\helpers\StringHelper;

class DefaultController extends \yii\web\Controller {

    public function init() {
        $this->enableCsrfValidation = false;
        parent::init();
    }

    public function actionIndex() {
        return $this->render("index");
    }

    public function actionDoQueue() {
        \yii::$app->response->format = Response::FORMAT_JSON;

        $model   = $this->getQueueModel();
        $changed = qs::find()
            ->where(["log_time" => qs::find()
                ->select("max(log_time)")])
            ->all();
        if ($model) {
            return [
                "model"   => $model,
                "changed" => $changed,
            ];
        }

        throw new \yii\base\UserException("Нет данных");
    }

    public function actionChangeQueue() {
        \yii::$app->response->format = Response::FORMAT_JSON;

        $data = \yii::$app->request->bodyParams;

        $model = $this->getQueueModel();
        if (!$model) {
            $model = new mhd();
        }
        $model->load($data, "");
        $dirty = $model->getDirtyAttributes();
        $model->save();
        return [
            "model" => $model,
            "dirty" => $dirty
        ];
    }

    public function actionGetQueue() {
        \yii::$app->response->format = Response::FORMAT_JSON;

        $model = $this->getQueueModel();

        $schema = mhd::getTableSchema();
        $keys   = array_keys($schema->columns);


        $load = function($fields = [])use(&$model, &$schema) {
            if (!$model) {
                $model  = new mhd();
                $fields = array_keys($schema->columns);
            }

            /* Текст, из которого случайным образом берём изменения */
            $text = $this->module->getText();

            foreach ($fields as $fieldName) {
                /* Случайное место в тексте */
                $entire            = random_int(1, mb_strlen($text) - 10);
                $model->$fieldName = mb_substr($text, $entire,
                                               $schema->columns[$fieldName]->size);
            }
        };

        /* Первоначальная установка модели */
        if (!$model) {
            $load();
        }

        $is = random_int(0, 10);
        /* Если меньше - изменяем данные в модели */
        if ($is < 5) {
            /* Прикидываем сколько полей в записи хотим изменить */
            $fieldCount = random_int(1, count($schema->columns));
            $fields     = [];
            /* Обозначаем поля для изменения */
            for ($i = 0; $i < $fieldCount; $i++) {
                $fields[] = $keys[random_int(0, count($keys) - 1)];
            }
            $fields = array_unique($fields);
            $load($fields);
        }

        return $model;
    }

    /**
     * @return svs\modules\modelHistory\models\ModelHistoryData|null
     */
    protected function getQueueModel() {
        return mhd::find()->limit(1)->one();
    }

}
