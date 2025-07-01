
import React from 'react';
import Layout from '../components/Layout';

/**
 * Página principal do site La Gemme Leilões
 * Componente que renderiza a estrutura completa da página inicial
 */
const Index = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-800 mb-8">
            Bem-vindos à La Gemme Leilões
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Casa de leilões especializada em obras de arte. 
            Catálogos exclusivos e atendimento personalizado para colecionadores e apreciadores.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
