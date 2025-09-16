import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Loader2, 
  Search,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calculator,
  ArrowLeft,
  Home,
  User,
  Crown
} from 'lucide-react';
import { ContactButtons } from '@/components/ContactButtons';

export interface Client {
  id: string;
  user_id: string;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  owner_email?: string;
  is_own_client?: boolean;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      // Usar a função SQL para buscar clientes com dados do proprietário
      const { data, error } = await supabase.rpc('get_clients_with_owners');

      if (error) throw error;

      // Processar dados para adicionar flag is_own_client
      const processedData = (data || []).map((client: any) => ({
        ...client,
        is_own_client: client.user_id === user?.id
      }));

      setClients(processedData);
    } catch (error: any) {
      console.error('Erro ao buscar clientes:', error);
      toast({
        title: 'Erro ao carregar clientes',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome do cliente é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    setFormLoading(true);

    try {
      if (editingClient) {
        // Update existing client
        const { error } = await supabase
          .from('clients')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingClient.id);

        if (error) throw error;

        toast({
          title: 'Cliente atualizado',
          description: `"${formData.name}" foi atualizado com sucesso`,
        });
      } else {
        // Create new client
        const { error } = await supabase
          .from('clients')
          .insert({
            ...formData,
            user_id: user!.id
          });

        if (error) throw error;

        toast({
          title: 'Cliente cadastrado',
          description: `"${formData.name}" foi cadastrado com sucesso`,
        });
      }

      // Reset form and close dialog
      setFormData({
        name: '',
        document: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      });
      setEditingClient(null);
      setIsDialogOpen(false);
      
      // Refresh clients list
      fetchClients();
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      toast({
        title: 'Erro ao salvar cliente',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      document: client.document || '',
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      notes: client.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));
      toast({
        title: 'Cliente excluído',
        description: 'O cliente foi removido com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error);
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleNewClient = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      document: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    });
    setIsDialogOpen(true);
  };

  const filteredClients = clients.filter(client => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.document?.toLowerCase().includes(searchLower) ||
      client.email?.toLowerCase().includes(searchLower) ||
      client.phone?.toLowerCase().includes(searchLower)
    );
  });

  const formatDocument = (doc: string) => {
    // Format CNPJ: 00.000.000/0000-00
    if (doc.length === 14) {
      return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    // Format CPF: 000.000.000-00
    if (doc.length === 11) {
      return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return doc;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Carregando clientes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botão Voltar e Navegação */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.history.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="w-4 h-4" />
          <span>/</span>
          <span className="text-foreground">Clientes</span>
        </div>
      </div>
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Clientes</h1>
        </div>
        <p className="text-muted-foreground">
          Clientes compartilhados da equipe - todos podem visualizar, apenas o proprietário pode editar
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, documento, email ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewClient}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                </DialogTitle>
                <DialogDescription>
                  {editingClient 
                    ? 'Atualize os dados do cliente' 
                    : 'Preencha os dados do novo cliente'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome / Razão Social *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Digite o nome do cliente"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="document">CPF / CNPJ</Label>
                  <Input
                    id="document"
                    value={formData.document}
                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                    placeholder="Digite o documento"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Rua, número, cidade, estado"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Informações adicionais sobre o cliente"
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={formLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      {editingClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Clients List */}
      {filteredClients.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Building className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? 'Tente buscar com outros termos'
                  : 'Comece cadastrando seu primeiro cliente'}
              </p>
              {!searchQuery && (
                <Button onClick={handleNewClient}>
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Primeiro Cliente
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card 
              key={client.id} 
              className={`hover:shadow-lg transition-shadow ${
                client.is_own_client 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'border-border'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg line-clamp-1">
                        {client.name}
                      </CardTitle>
                      {client.is_own_client && (
                        <Crown className="w-4 h-4 text-primary flex-shrink-0" title="Seu cliente" />
                      )}
                    </div>
                    
                    {/* Mostrar proprietário */}
                    <div className="flex items-center gap-1 mb-2">
                      <User className="w-3 h-3" />
                      <span className={`text-xs ${client.is_own_client ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {client.is_own_client 
                          ? 'Você' 
                          : client.owner_email?.split('@')[0] || 'Desconhecido'
                        }
                      </span>
                    </div>
                    
                    {client.document && (
                      <CardDescription className="text-sm">
                        {formatDocument(client.document)}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  {client.email && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    </div>
                  )}
                  
                  {client.phone && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Botões de Contato */}
                  {(client.phone || client.email) && (
                    <div className="flex justify-end pt-1">
                      <ContactButtons 
                        clientName={client.name}
                        phone={client.phone}
                        email={client.email}
                        userName={user?.email?.split('@')[0]}
                      />
                    </div>
                  )}
                  
                  {client.address && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span className="line-clamp-2 text-xs">{client.address}</span>
                    </div>
                  )}
                  
                  {client.notes && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <FileText className="w-4 h-4 mt-0.5" />
                      <span className="line-clamp-2 text-xs">{client.notes}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  {/* Editar apenas para próprios clientes */}
                  {client.is_own_client ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(client)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 opacity-50 cursor-not-allowed"
                      disabled
                      title="Apenas o proprietário pode editar este cliente"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                  
                  {/* Excluir apenas para próprios clientes */}
                  {client.is_own_client ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          disabled={deletingId === client.id}
                        >
                          {deletingId === client.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir "{client.name}"? 
                            Os orçamentos associados a este cliente não serão excluídos, mas ficarão sem cliente vinculado.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(client.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled
                      title="Apenas o proprietário pode excluir este cliente"
                      className="opacity-50 cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}