
import React from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Phone, Mail } from 'lucide-react';

/**
 * Página de Contato - Implementada conforme design fornecido
 */
const Contato = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Seção Hero com Imagem de Fundo */}
      <div className="relative h-64 bg-gray-600 overflow-hidden">
        {/* Imagem de fundo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(/images/contact/contato-topo2.png)'
          }}
        ></div>
        
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-gray-800 bg-opacity-60"></div>
        
        {/* Título */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white">
          <div className="text-center">
            <p className="text-sm mb-2 font-light tracking-wider">ENTRE EM</p>
            <h1 className="text-4xl md:text-5xl font-light tracking-wider">
              CONTATO
            </h1>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          {/* Texto Introdutório */}
          <div className="text-center mb-16">
            <p className="text-lg text-gray-600 mb-2">
              Se você tiver <span className="text-gray-700 font-medium">alguma pergunta</span>, <span className="text-gray-700 font-medium">comentário</span> ou <span className="text-gray-700 font-medium">sugestão</span>,
            </p>
            <p className="text-lg text-gray-600 mb-6">
              sinta-se à vontade para entrar em contato conosco!
            </p>
            <p className="text-lg text-gray-500">
              Oferecemos os seguintes meios:
            </p>
          </div>

          {/* Cards de Contato */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {/* Card Telefone */}
            <Card className="bg-white shadow-lg border-0 overflow-hidden">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-light text-gray-700 mb-8">Telefone</h3>
                
                {/* Imagem do boneco telefone */}
                <div className="mb-8 flex justify-center">
                  <div className="w-48 h-48 flex items-center justify-center">
                    <img 
                      src="/images/contact/telefone.png" 
                      alt="Contato por telefone" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">(21) 2541-3192</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">(21) 96984-8592</span>
                  </div>
                  <div className="text-gray-600 text-sm space-y-1">
                    <p>Atendimento segunda a sexta das 10h às 12h ou</p>
                    <p>das 14h30 às 17h</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card E-mail */}
            <Card className="bg-white shadow-lg border-0 overflow-hidden">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-light text-gray-700 mb-8">Por e-mail</h3>
                
                {/* Imagem do boneco email */}
                <div className="mb-8 flex justify-center">
                  <div className="w-48 h-48 flex items-center justify-center">
                    <img 
                      src="/images/contact/email.png" 
                      alt="Contato por email" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <a 
                      href="mailto:lagemmerio2@gmail.com" 
                      className="text-blue-600 font-medium hover:underline"
                    >
                      lagemmerio2@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contato;
