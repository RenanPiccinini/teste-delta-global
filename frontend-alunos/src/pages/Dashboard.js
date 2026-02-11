import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

const Dashboard = () => {
    const [alunos, setAlunos] = useState([]);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', endereco: '' });
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    const BASE_UPLOAD_URL = "http://localhost:8080/uploads/fotos/";

    useEffect(() => {
        buscarAlunos();
    }, []);

    const buscarAlunos = async () => {
        try {
            const res = await api.get('/alunos');
            setAlunos(res.data);
        } catch (err) {
            console.error("Erro ao carregar lista:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('logado');
        navigate('/login'); // Redireciona para login após sair
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (foto) data.append('foto', foto);

        try {
            const url = editId ? `/alunos/update/${editId}` : '/alunos';
            await api.post(url, data);
            Swal.fire('Sucesso!', 'Dados salvos!', 'success');
            limparForm();
            buscarAlunos();
        } catch (err) {
            Swal.fire('Erro!', 'Falha ao salvar.', 'error');
        }
    };

    const limparForm = () => {
        setEditId(null);
        setFormData({ nome: '', email: '', telefone: '', endereco: '' });
        setFoto(null); setPreview(null);
        if(document.getElementById('foto-input')) document.getElementById('foto-input').value = "";
    };

    const prepararEdicao = (aluno) => {
        setEditId(aluno.id);
        setFormData({ nome: aluno.nome, email: aluno.email, telefone: aluno.telefone || '', endereco: aluno.endereco || '' });
        setPreview(aluno.foto ? `${BASE_UPLOAD_URL}${aluno.foto}` : null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const excluirAluno = async (id) => {
        const result = await Swal.fire({
            title: 'Deseja excluir?',
            text: "Esta ação não pode ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ea4335',
            confirmButtonText: 'Sim, excluir'
        });
        if (result.isConfirmed) {
            try {
                await api.delete(`/alunos/${id}`);
                buscarAlunos();
                Swal.fire('Deletado!', 'O aluno foi removido.', 'success');
            } catch (err) {
                Swal.fire('Erro!', 'Não foi possível excluir.', 'error');
            }
        }
    };

    return (
        <div style={{ fontFamily: 'Segoe UI', backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#1a73e8' }}>Gestão Delta Global</h1>
                    <button 
                        onClick={handleLogout} 
                        style={{ background: '#ea4335', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Sair do Sistema
                    </button>
                </header>

                <div style={cardStyle}>
                    <h3>{editId ? '📝 Editando Aluno' : '➕ Novo Aluno'}</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <input style={inputStyle} type="text" placeholder="Nome" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
                        <input style={inputStyle} type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                        <input style={inputStyle} type="text" placeholder="Telefone" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} required/>
                        <input style={inputStyle} type="text" placeholder="Endereço" value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} required/>
                        <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #eee', padding: '10px', borderRadius: '8px' }}>
                            <div style={{flex: 1}}>
                                <label style={{fontSize: '12px', display: 'block', marginBottom: '5px'}}>Foto do Aluno:</label>
                                <input id="foto-input" type="file" onChange={handleFileChange} required={!editId} />
                            </div>
                            {preview && <img src={preview} alt="preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #1a73e8' }} />}
                        </div>
                        <button type="submit" style={{...btnPrimary, backgroundColor: editId ? '#f4b400' : '#1a73e8'}}>{editId ? 'Salvar Alterações' : 'Cadastrar Aluno'}</button>
                        {editId && <button type="button" onClick={limparForm} style={{gridColumn: 'span 2', background: '#ccc', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer'}}>Cancelar Edição</button>}
                    </form>
                </div>

                <div style={cardStyle}>
                    <h3 style={{marginBottom: '20px'}}>Alunos Cadastrados</h3>
                    <table width="100%" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                                <th style={thStyle}>Perfil</th>
                                <th style={thStyle}>Nome / Email</th>
                                <th style={thStyle}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alunos.length > 0 ? alunos.map(aluno => (
                                <tr key={aluno.id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={tdStyle}>
                                        <img 
                                            src={aluno.foto ? `${BASE_UPLOAD_URL}${aluno.foto}` : 'https://via.placeholder.com/40'} 
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                                            alt="perfil" 
                                        />
                                    </td>
                                    <td style={tdStyle}>
                                        <strong>{aluno.nome}</strong><br/>
                                        <small style={{color: '#666'}}>{aluno.email}</small>
                                    </td>
                                    <td style={tdStyle}>
                                        <button onClick={() => prepararEdicao(aluno)} style={{ background: '#f4b400', color: '#fff', border: 'none', padding: '6px 12px', marginRight: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
                                        <button onClick={() => excluirAluno(aluno.id)} style={{ background: '#ea4335', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Excluir</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="3" style={{textAlign: 'center', padding: '20px', color: '#999'}}>Nenhum aluno encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const cardStyle = { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '30px' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #dadce0', outline: 'none' };
const btnPrimary = { padding: '12px', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };
const thStyle = { padding: '12px', color: '#5f6368', fontSize: '14px' };
const tdStyle = { padding: '12px' };

export default Dashboard;