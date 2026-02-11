<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\AlunoModel;

class AlunosController extends ResourceController
{
    protected $modelName = 'App\Models\AlunoModel';
    protected $format    = 'json';

    /**
     * LISTAR TODOS - GET /alunos
     */
    public function index()
    {
        $data = $this->model->findAll();
        
        // Forçamos o retorno como JSON limpo
        return $this->response->setJSON($data);
    }

    /**
     * VER UM ALUNO - GET /alunos/(:num)
     */
    public function show($id = null)
    {
        $data = $this->model->find($id);
        
        if (!$data) {
            return $this->failNotFound('Aluno não encontrado');
        }
        
        return $this->respond($data);
    }

    /**
     * CRIAR NOVO - POST /alunos
     */
    public function create()
    {
        // Pega a foto
        $img = $this->request->getFile('foto');
        $nomeFoto = null;

        // Validação básica manual para debugar se os campos estão chegando
        $nome = $this->request->getPost('nome');
        if (!$nome) {
            return $this->fail("O campo nome é obrigatório.");
        }

        if ($img && $img->isValid() && !$img->hasMoved()) {
            $nomeFoto = $img->getRandomName();
            // Garante que a pasta existe antes de mover
            if (!is_dir(FCPATH . 'uploads/fotos')) {
                mkdir(FCPATH . 'uploads/fotos', 0777, true);
            }
            $img->move(FCPATH . 'uploads/fotos', $nomeFoto);
        }

        $data = [
            'nome'     => $nome,
            'email'    => $this->request->getPost('email'),
            'telefone' => $this->request->getPost('telefone'),
            'endereco' => $this->request->getPost('endereco'),
            'foto'     => $nomeFoto
        ];

        if ($this->model->insert($data)) {
            // Retorne um JSON estruturado para o Axios entender como sucesso
            return $this->respondCreated([
                'status' => 201,
                'message' => 'Aluno salvo com sucesso!'
            ]);
        }

        return $this->fail($this->model->errors());
    }

    /**
     * ATUALIZAR - PUT ou PATCH /alunos/(:num)
     */
    public function update($id = null)
    {
        // Verifica se o aluno existe
        $alunoAntigo = $this->model->find($id);
        if (!$alunoAntigo) {
            return $this->failNotFound('Aluno não existe');
        }

        // Tenta pegar imagem nova
        $img = $this->request->getFile('foto');
        $nomeFoto = $alunoAntigo['foto']; // Mantém a antiga por padrão

        if ($img && $img->isValid() && !$img->hasMoved()) {
            // Se enviou foto nova, apaga a antiga da pasta
            if ($alunoAntigo['foto'] && file_exists(FCPATH . 'uploads/fotos/' . $alunoAntigo['foto'])) {
                @unlink(FCPATH . 'uploads/fotos/' . $alunoAntigo['foto']);
            }
            $nomeFoto = $img->getRandomName();
            $img->move(FCPATH . 'uploads/fotos', $nomeFoto);
        }

        $data = [
            'nome'     => $this->request->getPost('nome') ?? $alunoAntigo['nome'],
            'email'    => $this->request->getPost('email') ?? $alunoAntigo['email'],
            'telefone' => $this->request->getPost('telefone') ?? $alunoAntigo['telefone'],
            'endereco' => $this->request->getPost('endereco') ?? $alunoAntigo['endereco'],
            'foto'     => $nomeFoto
        ];

        if ($this->model->update($id, $data)) {
            return $this->respond([
                'status'  => 200,
                'message' => 'Aluno atualizado com sucesso'
            ]);
        }

        return $this->fail($this->model->errors());
    }

    /**
     * DELETAR - DELETE /alunos/(:num)
     */
    public function delete($id = null)
    {
        $data = $this->model->find($id);

        if (!$data) {
            return $this->failNotFound('Aluno não encontrado');
        }

        if ($this->model->delete($id)) {
            return $this->respondDeleted([
                'status'  => 200,
                'message' => 'Aluno removido do sistema'
            ]);
        }

        return $this->fail('Não foi possível deletar.');
    }
}