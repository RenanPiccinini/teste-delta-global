<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateAlunosTable extends Migration
{
    public function up() {
        $this->forge->addField([
            'id'          => ['type' => 'INT', 'constraint' => 5, 'unsigned' => true, 'auto_increment' => true],
            'nome'        => ['type' => 'VARCHAR', 'constraint' => '100'],
            'email'       => ['type' => 'VARCHAR', 'constraint' => '100'],
            'telefone'    => ['type' => 'VARCHAR', 'constraint' => '20'],
            'endereco'    => ['type' => 'TEXT', 'null' => true],
            'foto'        => ['type' => 'VARCHAR', 'constraint' => '255', 'null' => true],
            'created_at'  => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->createTable('alunos');
    }

    public function down()
    {
        //
    }
}
