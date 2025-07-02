
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getActiveAuction } from '../lib/supabase';

/**
 * Página de Catálogos
 */
const Catalogos = () => {
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuction = async () => {
      setLoading(true);
      const activeAuction = await getActiveAuction();
      setAuction(activeAuction);
      setLoading(false);
    };

    fetchAuction();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-light text-gray-800 mb-8">
            Catálogos
          </h1>
          {loading ? (
            <p className="text-lg text-gray-600">Carregando...</p>
          ) : auction ? (
            <div className="space-y-4">
              <p className="text-xl font-semibold">
                Leilão Ativo: {auction.name}
              </p>
              <p className="text-lg">
                <a 
                  href={auction.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  Acesse o Leilão
                </a>
              </p>
              <p>
                <span className="font-medium">Data de Início:</span>{' '}
                {new Date(auction.start_date).toLocaleString('pt-BR')}
              </p>
              {auction.end_date && (
                <p>
                  <span className="font-medium">Data de Encerramento:</span>{' '}
                  {new Date(auction.end_date).toLocaleString('pt-BR')}
                </p>
              )}
            </div>
          ) : (
            <p className="text-lg text-gray-600">
              Estamos em captação para nosso próximo leilão.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Catalogos;
