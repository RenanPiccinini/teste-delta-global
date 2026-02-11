# Sistema de Gestão de Alunos - CRUD Acadêmico

Este projeto é uma aplicação Fullstack desenvolvida como parte do teste técnico para a **Delta Global**. A solução consiste em um sistema de gerenciamento de alunos com autenticação de usuários, permitindo o controle total (CRUD) dos registros.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Framework:** CodeIgniter
- **Linguagem:** PHP
- **Banco de Dados:** MySQL (via XAMPP/DBeaver)
- **Arquitetura:** RESTful API com Resource Controllers.

### Frontend
- **Biblioteca:** ReactJS
- **Gerenciamento de Rotas:** React Router Dom
- **Comunicação API:** Axios
- **UI/UX:** SweetAlert2 (Modais), CSS-in-JS.

---

## 🚀 Instruções de Instalação e Execução

### Pré-requisitos
- Servidor local (XAMPP, WAMP ou Laragon).
- PHP 8.2 ou superior.
- Composer.
- Node.js e NPM.

### Passo 1: Configuração do Backend (PHP)
1. Clone o repositório.
2. Navegue até a pasta do backend: `cd teste-delta-global`.
3. Instale as dependências: `composer install`.
4. Configure o arquivo `.env`:
   - Renomeie `env` para `.env`.
   - Configure as credenciais do seu banco de dados (`database.default.database = escola_db`).
5. Crie o banco de dados `escola_db` no seu MySQL.
6. Execute as migrations para criar as tabelas:
   ```bash
   php spark migrate
