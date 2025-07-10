import React, { useState, useEffect, useRef } from 'react';
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
  Clock,
  Upload,
  Trash2,
  Users,
  UserPlus,
  Eye,
  Edit3,
  Info
} from 'lucide-react';
import { formatDateBR, utcToLocal, localToUTC } from '../utils/dateUtils';

interface AuctionFormData {
  name: string;
  link: string;
  start_date: string;
  end_date: string;
  image_file: File | null;
}

interface AdminFormData {
  email: string;
  password: string;
}

const AdminPanel = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeAuctions, setActiveAuctions] = useState(0);
  const navigate = useNavigate();

  // Estados para formulário de leilão
  const [auctionForm, setAuctionForm] = useState<AuctionFormData>({
    name: '',
    link: '',
    start_date: '',
    end_date: '',
    image_file: null
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [auctions, setAuctions] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para edição de leilões
  const [editingAuction, setEditingAuction] = useState<any>(null);
  const [editForm, setEditForm] = useState<AuctionFormData>({
    name: '',
    link: '',
    start_date: '',
    end_date: '',
    image_file: null
  });
  const [editImagePreview, setEditImagePreview] = useState<string>('');

  // Estados para gerenciamento de usuários
  const [adminForm, setAdminForm] = useState<AdminFormData>({
    email: '',
    password: ''
  });
  const [admins, setAdmins] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  // REALTIME SUBSCRIPTIONS
  useEffect(() => {
    if (!user) return;

    // Subscription para tabela de leilões
    const auctionsSubscription = supabase
      .channel('auctions-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'auctions' },
        (payload) => {
          console.log('Mudança nos leilões:', payload);
          
          // Recarregar dados quando há mudanças
          loadDashboardData();
          
          // Toast de notificação baseado no evento
          switch (payload.eventType) {
            case 'INSERT':
              toast({
                title: "Novo leilão criado",
                description: `Leilão "${payload.new.name}" foi adicionado.`,
              });
              break;
            case 'UPDATE':
              toast({
                title: "Leilão atualizado",
                description: `Leilão "${payload.new.name}" foi modificado.`,
              });
              break;
            case 'DELETE':
              toast({
                title: "Leilão removido",
                description: "Um leilão foi removido do sistema.",
              });
              break;
          }
        }
      )
      .subscribe();

    // Subscription para tabela de admins
    const adminsSubscription = supabase
      .channel('admins-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'admins' },
        (payload) => {
          console.log('Mudança nos admins:', payload);
          
          // Recarregar lista de admins
          loadAdmins();
          
          // Toast de notificação
          switch (payload.eventType) {
            case 'INSERT':
              toast({
                title: "Novo administrador",
                description: `Admin "${payload.new.email}" foi adicionado.`,
              });
              break;
            case 'DELETE':
              toast({
                title: "Administrador removido",
                description: "Um administrador foi removido do sistema.",
              });
              break;
          }
        }
      )
      .subscribe();

    // Cleanup das subscriptions
    return () => {
      auctionsSubscription.unsubscribe();
      adminsSubscription.unsubscribe();
    };
  }, [user]);

  const checkUser = async () => {
    try {
      const currentUser = await getUser();
      if (!currentUser) {
        navigate('/admin');
        return;
      }
      setUser(currentUser);
      loadDashboardData();
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    await Promise.all([
      loadAuctions(),
      loadAdmins(),
      countActiveAuctions()
    ]);
  };

  const countActiveAuctions = async () => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('auctions')
        .select('id')
        .eq('is_active', true)
        .lte('start_date', now)
        .or(`end_date.is.null,end_date.gt.${now}`);

      if (!error && data) {
        setActiveAuctions(data.length);
      }
    } catch (error) {
      console.error('Erro ao contar leilões ativos:', error);
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

  // FUNÇÕES DE UPLOAD DE IMAGEM
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Formato inválido",
          description: "Suporta JPG, PNG, WebP e GIF (máx. 5MB).",
          variant: "destructive",
        });
        return;
      }

      setAuctionForm({ ...auctionForm, image_file: file });
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileName = `auction-${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('auction-images')
        .upload(fileName, file);

      if (error) {
        console.error('Erro no upload:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('auction-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      return null;
    }
  };

  const handleSaveAuction = async () => {
    if (!auctionForm.name || !auctionForm.link || !auctionForm.start_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, link e data de início.",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = null;
      
      if (auctionForm.image_file) {
        imageUrl = await uploadImage(auctionForm.image_file);
        if (!imageUrl) {
          toast({
            title: "Erro no upload da imagem",
            description: "Tente novamente.",
            variant: "destructive",
          });
          return;
        }
      }

      const { error } = await supabase
        .from('auctions')
        .insert({
          name: auctionForm.name,
          link: auctionForm.link,
          start_date: localToUTC(auctionForm.start_date),
          end_date: auctionForm.end_date ? localToUTC(auctionForm.end_date) : null,
          image_url: imageUrl,
          is_active: true,
          created_by: user.id
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
      setAuctionForm({
        name: '',
        link: '',
        start_date: '',
        end_date: '',
        image_file: null
      });
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      loadDashboardData();
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

  const endAuction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('auctions')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao encerrar",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Leilão encerrado",
        description: "O leilão foi encerrado com sucesso.",
      });

      loadDashboardData();
    } catch (error) {
      console.error('Erro ao encerrar leilão:', error);
    }
  };

  const deleteAuction = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar o leilão "${name}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('auctions')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao deletar",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Leilão deletado",
        description: "O leilão foi removido permanentemente.",
      });

      loadDashboardData();
    } catch (error) {
      console.error('Erro ao deletar leilão:', error);
    }
  };

  // FUNÇÕES PARA EDIÇÃO DE LEILÕES
  const startEditAuction = (auction: any) => {
    setEditingAuction(auction);
    setEditForm({
      name: auction.name,
      link: auction.link,
      start_date: auction.start_date ? utcToLocal(auction.start_date) : '',
      end_date: auction.end_date ? utcToLocal(auction.end_date) : '',
      image_file: null
    });
    setEditImagePreview(auction.image_url || '');
  };

  const cancelEdit = () => {
    setEditingAuction(null);
    setEditForm({
      name: '',
      link: '',
      start_date: '',
      end_date: '',
      image_file: null
    });
    setEditImagePreview('');
  };

  const handleEditImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Formato inválido",
          description: "Suporta JPG, PNG, WebP e GIF (máx. 5MB).",
          variant: "destructive",
        });
        return;
      }

      setEditForm({ ...editForm, image_file: file });
      
      // Preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEditedAuction = async () => {
    if (!editForm.name || !editForm.link || !editForm.start_date || !editingAuction) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, link e data de início.",
        variant: "destructive",
      });
      return;
    }

    try {
      let imageUrl = editingAuction.image_url;
      
      if (editForm.image_file) {
        const newImageUrl = await uploadImage(editForm.image_file);
        if (!newImageUrl) {
          toast({
            title: "Erro no upload da imagem",
            description: "Tente novamente.",
            variant: "destructive",
          });
          return;
        }
        imageUrl = newImageUrl;
      }

      const { error } = await supabase
        .from('auctions')
        .update({
          name: editForm.name,
          link: editForm.link,
          start_date: localToUTC(editForm.start_date),
          end_date: editForm.end_date ? localToUTC(editForm.end_date) : null,
          image_url: imageUrl
        })
        .eq('id', editingAuction.id);

      if (error) {
        toast({
          title: "Erro ao atualizar",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Leilão atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });

      cancelEdit();
      loadDashboardData();
    } catch (error) {
      console.error('Erro ao atualizar leilão:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  // FUNÇÕES DE ADMINISTRADORES
  const loadAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar admins:', error);
        return;
      }

      setAdmins(data || []);
    } catch (error) {
      console.error('Erro ao carregar admins:', error);
    }
  };

  const addAdmin = async () => {
    if (!adminForm.email || !adminForm.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha.",
        variant: "destructive",
      });
      return;
    }

    if (adminForm.password.length < 8) {
      toast({
        title: "Senha muito curta",
        description: "Mín. 8 caracteres",
        variant: "destructive",
      });
      return;
    }

    try {
      // Criar usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminForm.email,
        password: adminForm.password,
      });

      if (authError) {
        toast({
          title: "Erro ao criar usuário",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // Adicionar na tabela admins
        const { error: adminError } = await supabase
          .from('admins')
          .insert({
            user_id: authData.user.id,
            email: adminForm.email,
            role: 'admin',
            is_active: true
          });

        if (adminError) {
          toast({
            title: "Erro ao adicionar admin",
            description: adminError.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Administrador adicionado!",
          description: "O novo administrador foi criado com sucesso.",
        });

        setAdminForm({ email: '', password: '' });
        loadAdmins();
      }
    } catch (error) {
      console.error('Erro ao adicionar admin:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const removeAdmin = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: "Erro ao remover",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Administrador removido",
        description: "O administrador foi removido com sucesso.",
      });

      loadAdmins();
    } catch (error) {
      console.error('Erro ao remover admin:', error);
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
              <div className="text-2xl font-bold">{activeAuctions}</div>
              <p className="text-xs text-muted-foreground">Leilões ativos agora</p>
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
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="auctionName">
                        Nome do Leilão <span className="text-red-500">*</span>
                      </Label>
                      <div className="group relative">
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                          Nome que aparecerá no catálogo do site
                        </div>
                      </div>
                    </div>
                    <Input
                      id="auctionName"
                      type="text"
                      placeholder="Ex: Leilão de Arte Contemporânea"
                      value={auctionForm.name}
                      onChange={(e) => setAuctionForm({ ...auctionForm, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="auctionLink">
                        Link do Leilão <span className="text-red-500">*</span>
                      </Label>
                      <div className="group relative">
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                          URL onde o leilão será realizado
                        </div>
                      </div>
                    </div>
                    <Input
                      id="auctionLink"
                      type="url"
                      placeholder="https://exemplo.com/leilao"
                      value={auctionForm.link}
                      onChange={(e) => setAuctionForm({ ...auctionForm, link: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="startDate">
                        Data e Hora de Início <span className="text-red-500">*</span>
                      </Label>
                      <div className="group relative">
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                          Quando o leilão ficará disponível
                        </div>
                      </div>
                    </div>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={auctionForm.start_date}
                      onChange={(e) => setAuctionForm({ ...auctionForm, start_date: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="endDate">Data e Hora de Encerramento (Opcional)</Label>
                      <div className="group relative">
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                          Quando o leilão será encerrado automaticamente
                        </div>
                      </div>
                    </div>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={auctionForm.end_date}
                      onChange={(e) => setAuctionForm({ ...auctionForm, end_date: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Se não preenchido, o leilão ficará aberto indefinidamente
                    </p>
                  </div>
                </div>

                {/* Upload de Imagem */}
                <div className="space-y-2">
                  <Label>Imagem do Leilão (Opcional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          Arraste uma imagem aqui ou clique para selecionar
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Suporta JPG, PNG, WebP e GIF (máx. 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview da Imagem */}
                {imagePreview && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="border rounded-lg p-4 bg-gray-50 relative">
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setAuctionForm({ ...auctionForm, image_file: null });
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                      >
                        ✕
                      </button>
                      <div className="flex justify-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-xs max-h-48 object-cover rounded"
                        />
                      </div>
                      <p className="text-center text-sm text-gray-600 mt-2">Imagem atual</p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-500">
                  Selecione uma imagem (JPG, PNG, WebP ou GIF - máximo 5MB)
                </p>
                
                <Button onClick={handleSaveAuction} className="w-full bg-gray-600 hover:bg-gray-700">
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
                      <div key={auction.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            {/* Imagem pequena do leilão */}
                            {auction.image_url ? (
                              <div className="flex-shrink-0">
                                <img
                                  src={auction.image_url}
                                  alt={auction.name}
                                  className="w-12 h-12 object-cover rounded-lg border"
                                />
                              </div>
                            ) : (
                              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center">
                                <span className="text-gray-400 text-xs font-medium">IMG</span>
                              </div>
                            )}
                            
                            {/* Informações principais */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-900 truncate">{auction.name}</h4>
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full shrink-0 ${
                                  auction.is_active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {auction.is_active ? 'Ativo' : 'Inativo'}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                Link: <a href={auction.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{auction.link}</a>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Início: {formatDateBR(auction.start_date)}
                              </p>
                              {auction.end_date && (
                                <p className="text-sm text-muted-foreground">
                                  Encerramento: {formatDateBR(auction.end_date)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(auction.link, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startEditAuction(auction)}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteAuction(auction.id, auction.name)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {/* Gerenciamento de Usuários */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Gerenciamento de Usuários
                </CardTitle>
                <CardDescription>
                  Adicione, remova e gerencie usuários administradores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Adicionar Novo Administrador */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center mb-4">
                    <UserPlus className="h-5 w-5 mr-2" />
                    <h3 className="font-medium">Adicionar Novo Administrador</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">
                        Email do Usuário <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@exemplo.com"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminPassword">
                        Senha <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        placeholder="Mín. 8 caracteres"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={addAdmin} className="mt-4 bg-gray-600 hover:bg-gray-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Administrador
                  </Button>
                </div>

                {/* Lista de Administradores Atuais */}
                <div>
                  <h3 className="font-medium mb-4">Administradores Atuais</h3>
                  <div className="space-y-3">
                    {admins.map((admin) => (
                      <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {admin.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{admin.email}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>{admin.role || 'super_admin'}</span>
                              <span>•</span>
                              <span>
                                Último login: {admin.last_login 
                                  ? formatDateBR(admin.last_login)
                                  : 'Nunca'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            admin.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {admin.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                          {admin.email !== user?.email && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeAdmin(admin.id)}
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal de Edição de Leilão */}
      {editingAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Editar Leilão</h2>
                <Button variant="outline" size="sm" onClick={cancelEdit}>
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">
                      Nome do Leilão <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="editName"
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editLink">
                      Link do Leilão <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="editLink"
                      type="url"
                      value={editForm.link}
                      onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editStartDate">
                      Data e Hora de Início <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="editStartDate"
                      type="datetime-local"
                      value={editForm.start_date}
                      onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="editEndDate">Data e Hora de Encerramento (Opcional)</Label>
                    <Input
                      id="editEndDate"
                      type="datetime-local"
                      value={editForm.end_date}
                      onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
                    />
                  </div>
                </div>

                {/* Upload de Nova Imagem */}
                <div className="space-y-2">
                  <Label>Alterar Imagem (Opcional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageSelect}
                      className="hidden"
                      id="editImageInput"
                    />
                    <div className="space-y-2">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto" />
                      <div>
                        <button
                          type="button"
                          onClick={() => document.getElementById('editImageInput')?.click()}
                          className="text-blue-600 hover:text-blue-500"
                        >
                          Selecionar nova imagem
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, WebP e GIF (máx. 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview da Imagem */}
                {editImagePreview && (
                  <div className="space-y-2">
                    <Label>Preview da Imagem</Label>
                    <div className="border rounded-lg p-4 bg-gray-50 relative">
                      <button
                        type="button"
                        onClick={() => {
                          setEditImagePreview('');
                          setEditForm({ ...editForm, image_file: null });
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                      >
                        ✕
                      </button>
                      <div className="flex justify-center">
                        <img
                          src={editImagePreview}
                          alt="Preview"
                          className="max-w-xs max-h-48 object-cover rounded"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <Button onClick={saveEditedAuction} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Salvar Alterações
                  </Button>
                  <Button variant="outline" onClick={cancelEdit} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
