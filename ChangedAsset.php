<?php

namespace svs\modules\modelHistory;

use yii\web\AssetBundle;

class ChangedAsset extends AssetBundle {

    public $sourcePath     = "@svs/modules/modelHistory/views/default/assets/dist";
    public $css            = [
        'changed.css',
    ];
    public $js             = [
        'changed.js',
    ];
    public $depends        = [
        'yii\web\YiiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
    public $publishOptions = [
        "forceCopy" => YII_ENV != "prod"
    ];

}
