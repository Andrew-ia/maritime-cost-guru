import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, FileText, Calculator, Target, Download, Save } from "lucide-react";
import { ResultadosCalculados, DadosImportacao } from "@/pages/Index";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generatePDF } from "@/utils/generatePDF";
import { useToast } from "@/hooks/use-toast";
import { SaveCalculationModal } from "@/components/SaveCalculationModal";

interface ResultadosCalculosProps {
  resultados: ResultadosCalculados;
  dados: DadosImportacao;
}

export const ResultadosCalculos = ({ resultados, dados }: ResultadosCalculosProps) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const { toast } = useToast();
  const formatarMoeda = (valor: number, moeda: 'BRL' | 'USD' = 'BRL') => {
    return valor.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: moeda,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const converterParaUSD = (valorBRL: number) => {
    return valorBRL / dados.cotacao_usd;
  };

  const handleGeneratePDF = () => {
    try {
      console.log('Iniciando geração do PDF...');
      console.log('Dados:', dados);
      console.log('Resultados:', resultados);
      
      if (!dados || !resultados) {
        toast({
          title: "Dados incompletos",
          description: "Por favor, calcule os valores antes de exportar o PDF.",
          variant: "destructive"
        });
        return;
      }
      
      generatePDF(dados, resultados);
      toast({
        title: "PDF Gerado com Sucesso!",
        description: "O arquivo foi baixado para seu computador.",
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao gerar o arquivo.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button 
          onClick={() => setShowSaveModal(true)}
          variant="outline"
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          Salvar Cálculo
        </Button>
        <Button 
          onClick={handleGeneratePDF}
          variant="default"
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar PDF
        </Button>
      </div>
      
      {/* Valores Base - CIF */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-maritime-light" />
          <h3 className="font-semibold">Valores Base</h3>
        </div>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Total R$</TableHead>
                  <TableHead className="text-right">Total US$</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">CIF (FOB + Frete + Seguro)</TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {formatarMoeda(resultados.cif, 'BRL')}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-primary">
                    {formatarMoeda(resultados.cif_usd, 'USD')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Impostos */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-maritime-light" />
          <h3 className="font-semibold">Impostos</h3>
        </div>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imposto</TableHead>
                  <TableHead className="text-center">Alíquota</TableHead>
                  <TableHead className="text-right">Total R$</TableHead>
                  <TableHead className="text-right">Total US$</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">II (Imposto de Importação)</TableCell>
                  <TableCell className="text-center">35%</TableCell>
                  <TableCell className="text-right">{formatarMoeda(resultados.ii, 'BRL')}</TableCell>
                  <TableCell className="text-right">{formatarMoeda(converterParaUSD(resultados.ii), 'USD')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">IPI</TableCell>
                  <TableCell className="text-center">0%</TableCell>
                  <TableCell className="text-right">{formatarMoeda(resultados.ipi, 'BRL')}</TableCell>
                  <TableCell className="text-right">{formatarMoeda(converterParaUSD(resultados.ipi), 'USD')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">PIS</TableCell>
                  <TableCell className="text-center">2,62%</TableCell>
                  <TableCell className="text-right">{formatarMoeda(resultados.pis, 'BRL')}</TableCell>
                  <TableCell className="text-right">{formatarMoeda(converterParaUSD(resultados.pis), 'USD')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">COFINS</TableCell>
                  <TableCell className="text-center">12,57%</TableCell>
                  <TableCell className="text-right">{formatarMoeda(resultados.cofins, 'BRL')}</TableCell>
                  <TableCell className="text-right">{formatarMoeda(converterParaUSD(resultados.cofins), 'USD')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Base ICMS</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-right">{formatarMoeda(resultados.base_icms, 'BRL')}</TableCell>
                  <TableCell className="text-right">{formatarMoeda(converterParaUSD(resultados.base_icms), 'USD')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">ICMS</TableCell>
                  <TableCell className="text-center">18%</TableCell>
                  <TableCell className="text-right">{formatarMoeda(resultados.icms, 'BRL')}</TableCell>
                  <TableCell className="text-right">{formatarMoeda(converterParaUSD(resultados.icms), 'USD')}</TableCell>
                </TableRow>
                <TableRow className="border-t-2">
                  <TableCell className="font-bold" colSpan={2}>TOTAL IMPOSTOS</TableCell>
                  <TableCell className="text-right font-bold text-warning">
                    {formatarMoeda(resultados.total_impostos, 'BRL')}
                  </TableCell>
                  <TableCell className="text-right font-bold text-warning">
                    {formatarMoeda(converterParaUSD(resultados.total_impostos), 'USD')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Despesas e Serviços */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-maritime-light" />
          <h3 className="font-semibold">Despesas e Serviços</h3>
        </div>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Total R$</TableHead>
                  <TableHead className="text-right">Total US$</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Total Despesas</TableCell>
                  <TableCell className="text-right">{formatarMoeda(resultados.total_despesas, 'BRL')}</TableCell>
                  <TableCell className="text-right">{formatarMoeda(converterParaUSD(resultados.total_despesas), 'USD')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Serviços</TableCell>
                  <TableCell className="text-right">{formatarMoeda(resultados.total_servicos, 'BRL')}</TableCell>
                  <TableCell className="text-right">{formatarMoeda(converterParaUSD(resultados.total_servicos), 'USD')}</TableCell>
                </TableRow>
                <TableRow className="border-t-2">
                  <TableCell className="font-bold">TOTAL CUSTO + IMPOSTOS</TableCell>
                  <TableCell className="text-right font-bold">
                    {formatarMoeda(resultados.total_custo_impostos, 'BRL')}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatarMoeda(converterParaUSD(resultados.total_custo_impostos), 'USD')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Custo Final */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-success" />
          <h3 className="font-semibold">Resultado Final</h3>
        </div>
        <Card className="shadow-card ring-2 ring-primary/20 bg-gradient-subtle">
          <CardContent className="pt-6">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-bold text-lg">
                    CUSTO TOTAL + VALOR DE AQUISIÇÃO DO PRODUTO
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary">
                        {formatarMoeda(resultados.custo_final, 'BRL')}
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        TOTAL R$
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary">
                        {formatarMoeda(converterParaUSD(resultados.custo_final), 'USD')}
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        TOTAL US$
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Percentual */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-3 text-center">Composição do Custo Final</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex justify-between mb-2">
              <span>CIF:</span>
              <span className="font-medium">
                {((resultados.cif / resultados.custo_final) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Impostos + Despesas:</span>
              <span className="font-medium">
                {((resultados.total_custo_impostos / resultados.custo_final) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="text-right text-muted-foreground">
            <div className="mb-2">Câmbio: R$ {dados.cotacao_usd.toFixed(4)}</div>
            <div>Data: {new Date().toLocaleDateString('pt-BR')}</div>
          </div>
        </div>
      </div>

      {/* Modal de Salvamento */}
      <SaveCalculationModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        dados={dados}
        resultados={resultados}
      />
    </div>
  );
};