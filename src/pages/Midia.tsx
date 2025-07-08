
import React from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Página Mídia
 */
const Midia = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero Section com overlay */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {/* Imagem de fundo */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero/quem-somos-bg.png')`,
            backgroundSize: 'auto 100%',
            backgroundPosition: 'center'
          }}
        >
        </div>
        
        {/* Faixa com opacidade apenas na área do texto */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full bg-black bg-opacity-50 py-8">
            <div className="text-center px-4">
              <div className="text-sm text-white mb-2 tracking-wider uppercase underline">
                LA GEMME NA
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-white uppercase">
                MÍDIA
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Imagens em estilo de jornal */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <img src="/images/midia_1.jpg" alt="Mídia 1" className="w-full mb-6 rounded-lg shadow-lg" />
          <img src="/images/midia_2.jpg" alt="Mídia 2" className="w-full mb-6 rounded-lg shadow-lg" />
          <img src="/images/midia_3.jpg" alt="Mídia 3" className="w-full mb-6 rounded-lg shadow-lg" />
          <img src="/images/midia_4.jpg" alt="Mídia 4" className="w-full mb-6 rounded-lg shadow-lg" />
          <img src="/images/midia_5.jpg" alt="Mídia 5" className="w-full mb-6 rounded-lg shadow-lg" />
          <img src="/images/midia_6_1.jpg" alt="Mídia 6.1" className="w-full mb-6 rounded-lg shadow-lg" />
          <img src="/images/midia_6_2.jpg" alt="Mídia 6.2" className="w-full mb-6 rounded-lg shadow-lg" />
          <img src="/images/midia_7.jpg" alt="Mídia 7" className="w-full mb-6 rounded-lg shadow-lg" />
          <img src="/images/midia_8.jpg" alt="Mídia 8" className="w-full mb-6 rounded-lg shadow-lg" />
        </div>
      </div>
    </Layout>
  );
};

export default Midia;
