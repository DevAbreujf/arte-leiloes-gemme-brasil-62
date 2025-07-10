
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import JewelryCarousel from '../components/JewelryCarousel';
import FeaturedJewelryGrid from '../components/FeaturedJewelryGrid';
import GalleryModal from '../components/GalleryModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Clock, Shield, Award } from 'lucide-react';

/**
 * Página principal do site La Gemme Leilões
 * Componente que renderiza a estrutura completa da página inicial
 */
const Index = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const handleCategoryClick = () => {
    setModalTitle('Destaques');
    setModalOpen(true);
  };
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-lagemme-dark" />,
      title: "Joias Raras",
      description: "Peças únicas e extraordinárias de todo o mundo, selecionadas por especialistas."
    },
    {
      icon: <Clock className="w-8 h-8 text-lagemme-dark" />,
      title: "Relógios Exclusivos",
      description: "Relógios de alta relojoaria das marcas mais prestigiadas do mundo."
    },
    {
      icon: <Shield className="w-8 h-8 text-lagemme-dark" />,
      title: "Autenticidade Garantida",
      description: "Todas as peças com certificado de autenticidade e avaliação especializada."
    },
    {
      icon: <Award className="w-8 h-8 text-lagemme-dark" />,
      title: "Excelência no Atendimento",
      description: "Atendimento personalizado para colecionadores e investidores exigentes."
    }
  ];

  const highlights = [
    {
      image: "/images/home/24.jpg",
      title: "Diamantes Excepcionais",
      description: "Diamantes certificados com corte perfeito e clareza excepcional.",
      ctaText: "Ver Coleção"
    },
    {
      image: "/images/home/32.jpg",
      title: "Joias Históricas",
      description: "Peças com proveniência histórica e valor inestimável.",
      ctaText: "Explorar"
    },
    {
      image: "/images/home/47.jpg",
      title: "Relógios Raros",
      description: "Edições limitadas e peças únicas de alta relojoaria.",
      ctaText: "Descobrir"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-b from-lagemme-light/10 to-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-light text-lagemme-dark mb-6 tracking-wide">
            Bem-vindos à <br className="sm:hidden" />
            La Gemme Leilões
          </h1>
          <p className="text-base sm:text-lg md:text-lg lg:text-xl text-lagemme-medium max-w-3xl mx-auto mb-8 leading-relaxed px-4 sm:px-0 break-words">
            Casa de leilões especializada em joias raras, diamantes deslumbrantes e relógios exclusivos.
            <br className="hidden sm:block" />
            Explore nossa coleção cuidadosamente selecionada para verdadeiros conhecedores e colecionadores.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-lagemme-dark hover:bg-lagemme-medium text-white"
              onClick={() => navigate('/catalogos')}
            >
              Ver Próximo Leilão
            </Button>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-3xl font-light text-lagemme-dark text-center mb-4">
            Destaques da Coleção
          </h2>
          <p className="text-lagemme-medium text-center mb-12 max-w-2xl mx-auto">
            Peças excepcionais selecionadas por nossos especialistas
          </p>
          <JewelryCarousel />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-lagemme-light/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-3xl font-light text-lagemme-dark text-center mb-12">
            Por que escolher La Gemme
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-lagemme-light/30 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl font-light">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lagemme-medium">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-3xl font-light text-lagemme-dark text-center mb-12">
            Categorias em Destaque
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <div 
                key={index} 
                className="group cursor-pointer"
                onClick={() => handleCategoryClick()}
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img 
                    src={highlight.image} 
                    alt={highlight.title}
                    className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl lg:text-2xl font-light text-lagemme-dark mb-2">{highlight.title}</h3>
                <p className="text-lagemme-medium mb-4">{highlight.description}</p>
                <Button variant="link" className="text-lagemme-dark p-0 hover:text-lagemme-medium">
                  {highlight.ctaText} →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-lagemme-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-3xl font-light mb-8">
            Faça Parte do Mundo Exclusivo La Gemme
          </h2>
          <Button 
            size="lg" 
            variant="outline" 
className="border-white text-lagemme-dark hover:bg-white/10"
            onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
          >
            Falar com Especialista
          </Button>
        </div>
      </section>

      {/* Gallery Modal */}
      <GalleryModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
      />
    </Layout>
  );
};

export default Index;
