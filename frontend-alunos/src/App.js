import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/Auth/AuthForm';
import Dashboard from './pages/Dashboard';

// Componente para proteger as rotas
const PrivateRoute = ({ children }) => {
    const isLogged = localStorage.getItem('logado') === 'true';
    return isLogged ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Rota inicial redireciona para login ou dashboard */}
                <Route path="/" element={<Navigate to="/login" />} />
                
                {/* Rotas Públicas */}
                <Route path="/login" element={<AuthForm />} />
                
                {/* Rotas Protegidas */}
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />

                {/* Rota 404 - Não Encontrado */}
                <Route path="*" element={<h2>Página não encontrada</h2>} />
            </Routes>
        </Router>
    );
}

export default App;