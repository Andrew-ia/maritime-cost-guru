import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
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
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Trash2, 
  Download, 
  Moon, 
  Sun,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const settingsSchema = z.object({
  notifications_email: z.boolean(),
  notifications_browser: z.boolean(),
  auto_save_calculations: z.boolean(),
  default_currency: z.enum(['BRL', 'USD']),
  theme_preference: z.enum(['light', 'dark', 'system']),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      notifications_email: true,
      notifications_browser: false,
      auto_save_calculations: true,
      default_currency: 'BRL',
      theme_preference: 'system',
    },
  });

  const handleSaveSettings = async (data: SettingsFormData) => {
    setLoading(true);
    try {
      // Aqui você salvaria as configurações no localStorage ou no banco
      localStorage.setItem('user_settings', JSON.stringify(data));
      
      toast({
        title: 'Configurações salvas',
        description: 'Suas preferências foram atualizadas com sucesso',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as configurações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const userData = {
        user_id: user?.id,
        email: user?.email,
        exported_at: new Date().toISOString(),
        note: 'Dados exportados do Maritime Cost Guru'
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `maritime-cost-guru-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Dados exportados',
        description: 'Seus dados foram baixados com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível exportar os dados',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Aqui você implementaria a lógica de exclusão da conta
      toast({
        title: 'Funcionalidade em desenvolvimento',
        description: 'A exclusão de conta será implementada em breve',
        variant: 'destructive',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir conta',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
          <span className="text-foreground">Configurações</span>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Configurações</h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <div className="space-y-6">
        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você quer receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Notificações por email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações importantes por email
                </p>
              </div>
              <Switch 
                checked={form.watch('notifications_email')}
                onCheckedChange={(checked) => form.setValue('notifications_email', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Notificações no navegador</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações push no navegador
                </p>
              </div>
              <Switch 
                checked={form.watch('notifications_browser')}
                onCheckedChange={(checked) => form.setValue('notifications_browser', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferências */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Preferências
            </CardTitle>
            <CardDescription>
              Configure o comportamento padrão do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Salvar cálculos automaticamente</Label>
                <p className="text-sm text-muted-foreground">
                  Salva automaticamente seus cálculos no histórico
                </p>
              </div>
              <Switch 
                checked={form.watch('auto_save_calculations')}
                onCheckedChange={(checked) => form.setValue('auto_save_calculations', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Moeda padrão</Label>
                <select 
                  className="w-full p-2 border border-input bg-background rounded-md"
                  value={form.watch('default_currency')}
                  onChange={(e) => form.setValue('default_currency', e.target.value as 'BRL' | 'USD')}
                >
                  <option value="BRL">Real Brasileiro (BRL)</option>
                  <option value="USD">Dólar Americano (USD)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label>Tema</Label>
                <select 
                  className="w-full p-2 border border-input bg-background rounded-md"
                  value={form.watch('theme_preference')}
                  onChange={(e) => form.setValue('theme_preference', e.target.value as 'light' | 'dark' | 'system')}
                >
                  <option value="system">Sistema</option>
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={form.handleSubmit(handleSaveSettings)} 
                disabled={loading}
                className="w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Configurações'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacidade e Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacidade e Dados
            </CardTitle>
            <CardDescription>
              Gerencie seus dados pessoais e privacidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" onClick={handleExportData} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Exportar Meus Dados
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Conta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                      Excluir conta permanentemente
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso irá excluir permanentemente sua conta
                      e remover todos os seus dados dos nossos servidores, incluindo:
                      <br /><br />
                      • Todos os cálculos salvos<br />
                      • Informações do perfil<br />
                      • Configurações personalizadas<br />
                      • Histórico de atividades
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Sim, excluir minha conta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <p className="font-medium mb-2">Informações sobre privacidade:</p>
              <ul className="space-y-1">
                <li>• Seus dados são criptografados e protegidos</li>
                <li>• Não compartilhamos informações com terceiros</li>
                <li>• Você pode exportar seus dados a qualquer momento</li>
                <li>• A exclusão da conta é permanente e irreversível</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}