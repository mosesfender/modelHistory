<?php

use yii\db\Migration;

/**
 * Class m200928_112946_history
 */
class m200928_112946_history extends Migration {

    /**
     * {@inheritdoc}
     */
    public function safeUp() {

        $this->createTable("model_history_data",
                           [
                "id"         => $this->primaryKey(),
                "c_name"     => $this->string(512),
                "c_id"       => $this->string(32),
                "a_type"     => $this->string(128),
                "direction"  => $this->string(32),
                "activation" => $this->string(32),
                "c_state"    => $this->string(32),
                "control"    => $this->string(32),
        ]);

        $this->createTable("queue_statuses",
                           [
                "id"           => $this->primaryKey(),
                "changed_id"   => $this->integer(11)->comment("ID изменяемой модели"),
                "log_time"     => $this->bigInteger()->comment("Время записи"),
                "user_id"      => $this->integer()->comment("Пользователь, создавший изменения"),
                "class"        => $this->string(255)->comment("Класс объекта с изменениями"),
                "field"        => $this->string(40)->comment("Поле, в котором случилось изменение"),
                "value_before" => $this->binary()->comment("Значение поля до изменения"),
                "value_after"  => $this->binary()->comment("Значение поля после изменения"),
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function safeDown() {
        $this->dropTable("queue_statuses");
        $this->dropTable("model_history_data");
    }

}
