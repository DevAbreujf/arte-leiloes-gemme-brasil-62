
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';

interface Auction {
  id: string;
  name: string;
  link: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  image_url?: string;
  created_at: string;
}

/**
 * Página de Catálogos - Implementada conforme as imagens
 */
const Catalogos = () => {
  const [activeTab, setActiveTab] = useState<'ativos' | 'finalizados'>('ativos');
  const [activeAuctions, setActiveAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useLanguage();

  useEffect(() => {
    loadActiveAuctions();
  }, []);

  // REALTIME SUBSCRIPTION
  useEffect(() => {
    // Subscription para atualizações em tempo real dos leilões
    const auctionsSubscription = supabase
      .channel('catalog-auctions-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'auctions' },
        (payload) => {
          console.log('Mudança nos leilões (catálogo):', payload);
          
          // Recarregar dados quando há mudanças
          loadActiveAuctions();
        }
      )
      .subscribe();

    // Cleanup da subscription
    return () => {
      auctionsSubscription.unsubscribe();
    };
  }, []);

  const loadActiveAuctions = async () => {
    try {
      setLoading(true);
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .or(`end_date.is.null,end_date.gt.${now}`)
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Erro ao carregar leilões:', error);
        return;
      }

      setActiveAuctions(data || []);
    } catch (error) {
      console.error('Erro ao carregar leilões:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizadosClick = () => {
    // Redireciona para o site conforme especificado
    window.open('https://www.iarremate.com/', '_blank');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Título Principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-8">
            Catálogos
          </h1>
          
          {/* Tabs Ativos/Finalizados */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab('ativos')}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'ativos'
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Ativos
              </button>
              <button
                onClick={() => {
                  setActiveTab('finalizados');
                  handleFinalizadosClick();
                }}
                className={`px-6 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'finalizados'
                    ? 'bg-gray-700 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Finalizados
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo dos Leilões */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Carregando leilões...</p>
          </div>
        ) : activeAuctions.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 gap-8 max-w-2xl w-full px-4">
              {activeAuctions.map((auction) => (
                <div key={auction.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Imagem do Leilão */}
                  {auction.image_url ? (
                    <div className="relative h-80">
                      <img
                        src={auction.image_url}
                        alt={auction.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-80 bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-400 text-6xl font-bold tracking-wider">
                        LA GEMME
                      </div>
                    </div>
                  )}
                  
                  {/* Conteúdo do Card */}
                  <div className="p-6 text-center">
                    <h2 className="text-2xl font-light text-gray-800 mb-4">
                      {auction.name}
                    </h2>
                    
                    <div className="space-y-2 mb-6">
                      <p className="text-gray-600">
                        <span className="font-medium">Início do Leilão</span>
                      </p>
                      <p className="text-gray-800">
                        {new Date(auction.start_date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => window.open(auction.link, '_blank')}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 text-lg"
                    >
                      Participar do Leilão
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Layout quando não há leilões ativos - fundo com opacidade mais escura e largura total
          <div className="absolute left-0 right-0 text-center py-20">
            <div className="bg-gray-600 bg-opacity-90 text-white py-20 px-8 w-full">
              <h2 className="text-2xl font-light mb-4">
                Estamos em captação para nosso próximo leilão
              </h2>
              
              <div className="space-y-4 text-lg">
                <p>
                  <span className="font-medium">(21) 2541-3192 | (21) 96984-8592</span> Petrópolis
                </p>
                <p>
                  <span className="font-medium">lagemmerio2@gmail.com</span>
                </p>
                <p className="mt-6 text-base">
                  Fique atento às nossas redes sociais para saber quando o próximo leilão começará.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Catalogos;
