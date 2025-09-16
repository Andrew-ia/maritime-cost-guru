import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { History, Trash2, Download, Eye, Loader2, Calculator, DollarSign, Building, ArrowLeft, Home } from 'lucide-react';
import { generatePDF } from '@/utils/generatePDF';
import { DadosImportacao, ResultadosCalculados } from '@/pages/Index';

interface CalculationRecord {
  id: string;
  calculation_name: string;
  client_id?: string;
  client?: {
    id: string;
    name: string;
    document?: string;
  };
  calculation_data: {
    dados: DadosImportacao;
    resultados: ResultadosCalculados;
    savedAt: string;
  };
  created_at: string;
}

export default function Calculations() {
  const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCalculations();
    }
  }, [user]);

  const fetchCalculations = async () => {
    try {
      const { data, error } = await supabase
        .from('calculations_history')
        .select(`
          *,
          client:clients (
            id,
            name,
            document
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCalculations(data || []);
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
        <div className="flex items-center gap-3 mb-2">
          <History className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Cálculos Salvos</h1>
        </div>
        <p className="text-muted-foreground">
          Histórico de todos os seus cálculos de importação marítima
        </p>
      </div>

      {calculations.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Calculator className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Nenhum cálculo salvo</h3>
              <p className="text-muted-foreground mb-6">
                Você ainda não salvou nenhum cálculo. Comece criando seu primeiro cálculo de importação.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Fazer Novo Cálculo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {calculations.map((calculation) => (
            <Card key={calculation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2 mb-1">
                      {calculation.calculation_name}
                    </CardTitle>
                    <CardDescription className="text-sm space-y-1">
                      {calculation.client && (
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          <span className="font-medium">{calculation.client.name}</span>
                        </div>
                      )}
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