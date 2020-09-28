<?php

namespace svs\modules\modelHistory\models;

use Yii;

/**
 * This is the model class for table "model_history_data".
 *
 * @property string|null $c_name
 * @property string|null $c_id
 * @property string|null $a_type
 * @property string|null $direction
 * @property string|null $activation
 * @property string|null $c_state
 * @property string|null $control
 */
class ModelHistoryData extends \yii\db\ActiveRecord {

    /**
     * {@inheritdoc}
     */
    public static function tableName() {
        return 'model_history_data';
    }

    public function behaviors(): array {
        return [
            "log" => [
                "class"         => \svs\modules\modelHistory\behaviors\QueueStatusesBehavior::class,
                "idField"       => "id",
                "ignoredFields" => []
            ]
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function rules() {
        return [
            [['c_name'], 'string', 'max' => 512],
            [['c_id', 'direction', 'activation', 'c_state', 'control'], 'string',
                'max' => 32],
            [['a_type'], 'string', 'max' => 128],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels() {
        return [
            'c_name'     => 'C Name',
            'c_id'       => 'C ID',
            'a_type'     => 'A Type',
            'direction'  => 'Direction',
            'activation' => 'Activation',
            'c_state'    => 'C State',
            'control'    => 'Control',
        ];
    }

}
