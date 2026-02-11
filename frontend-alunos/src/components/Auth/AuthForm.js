import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';

const AuthForm = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [authData, setAuthData] = useState({ email: '', senha: '' });
    const navigate = useNavigate(); // Hook para redirecionamento

    const handleAuth = async (e) => {
        e.preventDefault();
        const endpoint = showRegister ? '/auth/register' : '/auth/login';
        
        try {
            const res = await api.post(endpoint, authData); 
            
            if (showRegister) {
                Swal.fire('Sucesso!', 'Conta criada, agora faça login.', 'success');
                setShowRegister(false);
            } else {
                localStorage.setItem('logado', 'true');
                Swal.fire({
                    icon: 'success',
                    title: 'Bem-vindo!',
                    text: 'Login realizado com sucesso.',
                    timer: 1500,
                    showConfirmButton: false
                });
                navigate('/dashboard'); // Redireciona para a rota protegida
            }
        } catch (err) {
            Swal.fire('Erro!', 'Falha na operação. Verifique os dados.', 'error');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>{showRegister ? '📝 Criar Conta' : '🔐 Acesso Restrito'}</h2>
                <form onSubmit={handleAuth} style={styles.form}>
                    <input style={styles.input} type="email" placeholder="E-mail" 
                        onChange={e => setAuthData({...authData, email: e.target.value})} required />
                    <input style={styles.input} type="password" placeholder="Senha" 
                        onChange={e => setAuthData({...authData, senha: e.target.value})} required />
                    <button type="submit" style={styles.button}>{showRegister ? 'Registrar' : 'Entrar'}</button>
                </form>
                <p onClick={() => setShowRegister(!showRegister)} style={styles.toggle}>
                    {showRegister ? 'Já tenho conta. Login' : 'Não tem conta? Registre-se'}
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
    card: { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #dadce0', outline: 'none' },
    button: { padding: '12px', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', background: '#1a73e8' },
    toggle: { cursor: 'pointer', color: '#1a73e8', marginTop: '15px' }
};

export default AuthForm;