import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getUser, signOut } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  LogOut, 
  Calendar, 
  Shield,
  Clock
} from 'lucide-react';

const AdminPanel = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [auctionName, setAuctionName] = useState('');
  const [auctionLink, setAuctionLink] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [auctions, setAuctions] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getUser();
      if (!currentUser) {
        navigate('/admin');
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado com sucesso!",
        description: "Você foi desconectado do painel administrativo.",
      });
      navigate('/admin');
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Houve um problema ao desconectar.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAuction = async () => {
    if (!auctionName || !auctionLink || !startDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, link e data de início.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('auctions')
        .insert({
          name: auctionName,
          link: auctionLink,
          start_date: startDate,
          end_date: endDate || null,
          is_active: true,
        });

      if (error) {
        toast({
          title: "Erro ao salvar",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Leilão salvo com sucesso!",
        description: "O leilão foi configurado e estará ativo na data definida.",
      });

      // Limpar formulário
      setAuctionName('');
      setAuctionLink('');
      setStartDate('');
      setEndDate('');
      
      // Recarregar leilões
      loadAuctions();
    } catch (error) {
      console.error('Erro ao salvar leilão:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const loadAuctions = async () => {
    try {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar leilões:', error);
        return;
      }

      setAuctions(data || []);
    } catch (error) {
      console.error('Erro ao carregar leilões:', error);
    }
  };

  const deleteAuction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('auctions')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao excluir",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Leilão excluído",
        description: "O leilão foi removido com sucesso.",
      });

      loadAuctions();
    } catch (error) {
      console.error('Erro ao excluir leilão:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadAuctions();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Painel */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Painel Administrativo
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {user?.email}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leilões Ativos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auctions.length}</div>
              <p className="text-xs text-muted-foreground">Leilões configurados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Online</div>
              <p className="text-xs text-muted-foreground">Sistema funcionando</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Funcionalidades */}
        <Tabs defaultValue="auctions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="auctions">Leilões</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="auctions" className="space-y-4">
            {/* Formulário para Criar Leilão */}
            <Card>
              <CardHeader>
                <CardTitle>Criar Novo Leilão</CardTitle>
                <CardDescription>
                  Configure um novo leilão que será exibido na página de catálogos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="auctionName">Nome do Leilão</Label>
                    <Input
                      id="auctionName"
                      type="text"
                      placeholder="Ex: Leilão de Arte Contemporânea"
                      value={auctionName}
                      onChange={(e) => setAuctionName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="auctionLink">Link do Leilão</Label>
                    <Input
                      id="auctionLink"
                      type="url"
                      placeholder="https://exemplo.com/leilao"
                      value={auctionLink}
                      onChange={(e) => setAuctionLink(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Data e Hora de Início</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Data e Hora de Encerramento (Opcional)</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Se não preenchido, o leilão ficará aberto indefinidamente
                    </p>
                  </div>
                </div>
                
                <Button onClick={handleSaveAuction} className="w-full">
                  Salvar Leilão
                </Button>
              </CardContent>
            </Card>
            
            {/* Lista de Leilões Existentes */}
            <Card>
              <CardHeader>
                <CardTitle>Leilões Configurados</CardTitle>
                <CardDescription>
                  Lista de todos os leilões criados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {auctions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum leilão configurado ainda.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {auctions.map((auction) => (
                      <div key={auction.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{auction.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Link: <a href={auction.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{auction.link}</a>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Início: {new Date(auction.start_date).toLocaleString('pt-BR')}
                            </p>
                            {auction.end_date && (
                              <p className="text-sm text-muted-foreground">
                                Encerramento: {new Date(auction.end_date).toLocaleString('pt-BR')}
                              </p>
                            )}
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteAuction(auction.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Sistema</CardTitle>
                <CardDescription>
                  Ajustes gerais e configurações avançadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Funcionalidade em desenvolvimento. Aqui você poderá:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Configurar informações da empresa</li>
                  <li>Gerenciar configurações de email</li>
                  <li>Ajustar configurações de segurança</li>
                  <li>Configurar integrações</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
