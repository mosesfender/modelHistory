<?php

namespace svs\modules\modelHistory;

class Module extends \yii\base\Module {

    public function getText() {
        return file_get_contents(dirname(__FILE__) . "/loremIpsum");
    }

}
