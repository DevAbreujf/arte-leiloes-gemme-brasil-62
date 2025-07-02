import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import AdminPanel from '@/pages/AdminPanel';
import ProtectedRoute from '@/components/ProtectedRoute';

// Função para detectar se estamos no subdomínio admin
const isAdminSubdomain = () => {
  const hostname = window.location.hostname;
  
  // Para desenvolvimento local
  if (hostname === 'admin.localhost' || hostname === 'localhost:8080') {
    return window.location.pathname.startsWith('/admin');
  }
  
  // Para produção
  return hostname.startsWith('admin.');
};

const SubdomainRouter: React.FC = () => {
  // Se estivermos no subdomínio admin, mostrar apenas rotas admin
  if (isAdminSubdomain()) {
    return (
      <Routes>
        {/* Rota raiz do subdomínio admin vai para login */}
        <Route path="/" element={<Login />} />
        
        {/* Rota do painel administrativo */}
        <Route 
          path="/painel" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        
        {/* Rota alternativa para /admin no subdomínio */}
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route path="/admin/painel" element={<Navigate to="/painel" replace />} />
        
        {/* Catch-all para redirecionar para login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Se não estivermos no subdomínio admin, retornar null
  // (o App.tsx principal vai gerenciar as rotas normais)
  return null;
};

export default SubdomainRouter;
