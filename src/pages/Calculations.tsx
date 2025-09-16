import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { History, Trash2, Download, Eye, Loader2, Calculator, DollarSign, Building, ArrowLeft, Home, User, Crown } from 'lucide-react';
import { generatePDF } from '@/utils/generatePDF';
import { DadosImportacao, ResultadosCalculados } from '@/pages/Index';
import ShipmentButtons from '@/components/ShipmentButtons';

interface CalculationRecord {
  id: string;
  calculation_name: string;
  client_id?: string;
  user_id: string;
  client?: {
    id: string;
    name: string;
    document?: string;
  };
  author?: {
    email: string;
  };
  calculation_data: {
    dados: DadosImportacao;
    resultados: ResultadosCalculados;
    savedAt: string;
  };
  created_at: string;
  is_own_calculation?: boolean;
}

export default function Calculations() {
  const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [authorFilter, setAuthorFilter] = useState<string>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCalculations();
    }
  }, [user]);

  const fetchCalculations = async () => {
    try {
      // Usar SQL direto para fazer JOIN com auth.users
      const { data, error } = await supabase.rpc('get_calculations_with_authors');

      if (error) throw error;

      // Processar dados para adicionar flag is_own_calculation
      const processedData = (data || []).map((calculation: any) => ({
        ...calculation,
        is_own_calculation: calculation.user_id === user?.id,
        author: {
          email: calculation.author_email || 'Usuário excluído'
        },
        client: calculation.client_name ? {
          id: calculation.client_id,
          name: calculation.client_name,
          document: calculation.client_document
        } : null
      }));

      setCalculations(processedData);
    } catch (error: any) {
      console.error('Erro ao buscar cálculos:', error);
      toast({
        title: 'Erro ao carregar cálculos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('calculations_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCalculations(prev => prev.filter(calc => calc.id !== id));
      toast({
        title: 'Cálculo excluído',
        description: 'O cálculo foi removido com sucesso',
      });
    } catch (error: any) {
      console.error('Erro ao excluir cálculo:', error);
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadPDF = (calculation: CalculationRecord) => {
    try {
      generatePDF(calculation.calculation_data.dados, calculation.calculation_data.resultados);
      toast({
        title: 'PDF gerado',
        description: 'O relatório foi baixado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: 'Erro ao gerar PDF',
        description: 'Não foi possível gerar o relatório',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Filtrar cálculos baseado na seleção
  const filteredCalculations = useMemo(() => {
    switch (authorFilter) {
      case 'mine':
        return calculations.filter(calc => calc.is_own_calculation);
      case 'others':
        return calculations.filter(calc => !calc.is_own_calculation);
      default:
        return calculations;
    }
  }, [calculations, authorFilter]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Carregando cálculos...</p>
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
          <span className="text-foreground">Cálculos Salvos</span>
        </div>
      </div>
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <History className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Cálculos Salvos</h1>
              <p className="text-muted-foreground">
                Histórico de todos os cálculos de importação marítima da equipe
              </p>
            </div>
          </div>
          
          {/* Filtro por autor */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Mostrar:</span>
            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  Todos ({calculations.length})
                </SelectItem>
                <SelectItem value="mine">
                  Meus cálculos ({calculations.filter(c => c.is_own_calculation).length})
                </SelectItem>
                <SelectItem value="others">
                  De outros ({calculations.filter(c => !c.is_own_calculation).length})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredCalculations.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Calculator className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">
                {calculations.length === 0 
                  ? 'Nenhum cálculo salvo' 
                  : 'Nenhum cálculo encontrado'
                }
              </h3>
              <p className="text-muted-foreground mb-6">
                {calculations.length === 0
                  ? 'Nenhum cálculo foi salvo ainda. Comece criando seu primeiro cálculo de importação.'
                  : `Não há cálculos ${
                      authorFilter === 'mine' ? 'seus' :
                      authorFilter === 'others' ? 'de outros usuários' : ''
                    } para exibir.`
                }
              </p>
              {calculations.length === 0 && (
                <Button onClick={() => window.location.href = '/'}>
                  Fazer Novo Cálculo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCalculations.map((calculation) => (
            <Card 
              key={calculation.id} 
              className={`hover:shadow-lg transition-shadow ${
                calculation.is_own_calculation 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'border-border'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {calculation.calculation_name}
                      </CardTitle>
                      {calculation.is_own_calculation && (
                        <Crown className="w-4 h-4 text-primary flex-shrink-0" title="Seu cálculo" />
                      )}
                    </div>
                    <CardDescription className="text-sm space-y-1">
                      {/* Autor */}
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className={calculation.is_own_calculation ? 'text-primary font-medium' : 'text-muted-foreground'}>
                          {calculation.is_own_calculation 
                            ? 'Você' 
                            : calculation.author?.email.split('@')[0] || 'Desconhecido'
                          }
                        </span>
                      </div>
                      
                      {/* Cliente */}
                      {calculation.client && (
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          <span className="font-medium">{calculation.client.name}</span>
                        </div>
                      )}
                      
                      {/* Data */}
                      <div>{formatDate(calculation.created_at)}</div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-muted/50 p-2 rounded">
                      <div className="text-muted-foreground text-xs mb-1">CIF</div>
                      <div className="font-medium">
                        {formatCurrency(calculation.calculation_data.resultados.cif)}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-2 rounded">
                      <div className="text-muted-foreground text-xs mb-1">Custo Final</div>
                      <div className="font-medium text-primary">
                        {formatCurrency(calculation.calculation_data.resultados.custo_final)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-xs">
                      <DollarSign className="w-3 h-3 mr-1" />
                      USD {calculation.calculation_data.dados.cotacao_usd.toFixed(4)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      FOB ${calculation.calculation_data.dados.valor_fob.toLocaleString()}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  {/* Botões de envio de orçamento (apenas se tem cliente) */}
                  {calculation.client && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground font-medium">Enviar orçamento:</span>
                      <ShipmentButtons
                        calculationId={calculation.id}
                        calculationName={calculation.calculation_name}
                        client={calculation.client}
                        dados={calculation.calculation_data.dados}
                        resultados={calculation.calculation_data.resultados}
                        userName={calculation.is_own_calculation ? 'Você' : calculation.author?.email?.split('@')[0]}
                        size="sm"
                      />
                    </div>
                  )}
                  
                  {calculation.client && <Separator />}
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDownloadPDF(calculation)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                    
                    {/* Botão de excluir apenas para próprios cálculos */}
                    {calculation.is_own_calculation ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            disabled={deletingId === calculation.id}
                          >
                            {deletingId === calculation.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir cálculo</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir "{calculation.calculation_name}"? 
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(calculation.id)}
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
                        title="Apenas o autor pode excluir este cálculo"
                        className="opacity-50 cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}