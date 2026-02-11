<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use Config\Database;
use App\Models\UsuarioModel;

class AuthController extends ResourceController {
    protected $format = 'json';

    public function register() 
    {
        $model = new UsuarioModel();
        $data = $this->request->getJSON(true);
        $data['senha'] = password_hash($data['senha'], PASSWORD_BCRYPT);
        
        return $model->insert($data) ? $this->respondCreated(['msg' => 'OK']) : $this->fail('Erro');
    }

    public function login() {
        $db = Database::connect();
        $data = $this->request->getJSON(true);
        
        $usuario = $db->table('usuarios')->where('email', $data['email'])->get()->getRowArray();

        if ($usuario && password_verify($data['senha'], $usuario['senha'])) {
            return $this->respond(['status' => 'success', 'user' => $usuario['email']]);
        }

        return $this->failUnauthorized('E-mail ou senha incorretos.');
    }
}