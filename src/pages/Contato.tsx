
import React from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Página Contato
 */
const Contato = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-light text-lagemme-dark mb-8">
            {t('contact')}
          </h1>
          <p className="text-lg text-lagemme-medium">
            Conteúdo em breve...
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contato;
