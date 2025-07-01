
import React from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Página de Catálogos
 */
const Catalogos = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-800 mb-8">
            {t('catalogs')}
          </h1>
          <p className="text-lg text-gray-600">
            Conteúdo em breve...
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Catalogos;
