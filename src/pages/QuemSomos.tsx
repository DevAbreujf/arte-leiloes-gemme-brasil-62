
import React from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Página Quem Somos
 */
const QuemSomos = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero Section com imagem overlay */}
      <div className="relative">
        {/* Imagem de fundo */}
        <div 
          className="h-64 md:h-80 bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: `url('/images/hero/quem-somos-bg.png')`
          }}
        >
          {/* Overlay escuro para melhor legibilidade do texto */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          {/* Conteúdo do título */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
            <div className="text-sm text-white mb-2 tracking-wider">
              SAIBA MAIS
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-white">
              {t('aboutUs')}
            </h1>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none text-lagemme-medium">
            <p className="mb-6 text-justify">
              A La Gemme nasceu em Livorno na Toscana, Itália.
            </p>
            
            <p className="mb-6 text-justify">
              Nos anos 50 e 60 era repleta de objetos de arte muito interessantes vindos da Europa e da América.
            </p>
            
            <p className="mb-6 text-justify">
              Seu fundador Bruno Rossi foi um grande conhecedor de Artes e Jóias, reconhecido até hoje na Europa e Estados Unidos.
            </p>
            
            <p className="mb-6 text-justify">
              A loja era frequentada por Celebridades da época do cinema italiano como Paulo Panelli, Marcello Mastroianni, Nino Rovelli, Juliette Mayniel, Clara Agnelli, o grande Maestro Nino Rota que foi sempre especialmente atendido por Luca.
            </p>
            
            <p className="mb-6 text-justify">
              O Duque Amedeo D'Aosta Herdeiro da Coroa Italiana nos escolheu na época como loja de referência para sua lista de casamento.
            </p>
            
            <p className="mb-6 text-justify">
              Depois abrimos loja em Florença, atendendo outras tantas pessoas da Nobreza como Príncipe Fabrizio Ruffo Di Calábria, o Marquês Frescolbaldi, Marqueses Antinori, Família Ferragamo.
            </p>
            
            <p className="mb-6 text-justify">
              Vendemos a Star of South Africa II para Harry Winston via Billy Goldbergh.
            </p>
            
            <p className="mb-6 text-justify">
              Museu Vancleef, Sultão de Brunei via Mussaheff.
            </p>
            
            <p className="mb-6 text-justify">
              Imelda Marcos, Cartier, SJ Phillips, Isabeli Fontana, o Presidente Della Republica Italiana Carlo Azeglio Ciampi.
            </p>
            
            <p className="mb-6 text-justify">
              Atualmente na terceira geração de Joalheiros está à frente da empresa Luca Rossi, Diamantário, e especialista em pérolas naturais reconhecido internacionalmente.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuemSomos;
