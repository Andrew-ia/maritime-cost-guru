import { useState } from "react";
import { Ship, Calculator, TrendingUp, History, Users } from "lucide-react";
import { FormularioImportacao } from "@/components/FormularioImportacao";
import { ResultadosCalculos } from "@/components/ResultadosCalculos";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import { useNavigate } from "react-router-dom";

export interface DadosImportacao {
  // Dados do Produto
  incoterm?: string;
  origem?: string;
  destino?: string;
  container?: string;
  peso_bruto?: number;
  produto?: string;
  ncm?: string;
  quantidade?: number;
  
  // Dados Financeiros
  cotacao_usd: number;
  valor_fob: number;
  frete_internacional: number;
  seguro_internacional: number;
  capatazias: number;
  aliq_ii: number;
  aliq_ipi: number;
  aliq_pis: number;
  aliq_cofins: number;
  aliq_icms: number;
  taxa_siscomex: number;
  adicional_marinha: number;
  
  // Despesas Locais (campos individuais)
  armazenagem: number;
  desova: number;
  lacre: number;
  scanner: number;
  mov_carga: number;
  gerenciamento_risco: number;
  desconsolidacao: number;
  outras_despesas: number;
  
  honorarios: number;
  sdas: number;
  emissao_li: number;
  taxa_expediente: number;
}

export interface ResultadosCalculados {
  cif: number;
  cif_usd: number;
  ii: number;
  ipi: number;
  pis: number;
  cofins: number;
  base_icms: number;
  icms: number;
  total_impostos: number;
  total_despesas: number;
  total_servicos: number;
  total_custo_impostos: number;
  custo_final: number;
}

const Index = () => {
  const [dados, setDados] = useState<DadosImportacao | null>(null);
  const [resultados, setResultados] = useState<ResultadosCalculados | null>(null);
  const navigate = useNavigate();

  const calcularImportacao = (dadosForm: DadosImportacao) => {
    // 1. CIF - Cálculo baseado no Incoterm
    let cif: number;
    
    switch (dadosForm.incoterm) {
      case 'CIF':
        // CIF: O valor já inclui custo, seguro e frete
        cif = dadosForm.valor_fob * dadosForm.cotacao_usd;
        break;
      
      case 'FOB':
      default:
        // FOB: Adicionar frete e seguro ao valor FOB
        cif = (dadosForm.valor_fob + dadosForm.frete_internacional + dadosForm.seguro_internacional) * dadosForm.cotacao_usd;
        break;
      
      case 'EXW':
        // EXW: Valor ex-works + todos os custos de transporte
        cif = (dadosForm.valor_fob + dadosForm.frete_internacional + dadosForm.seguro_internacional) * dadosForm.cotacao_usd;
        break;
      
      case 'FCA':
        // FCA: Free Carrier - similar ao FOB mas com entrega diferente
        cif = (dadosForm.valor_fob + dadosForm.frete_internacional + dadosForm.seguro_internacional) * dadosForm.cotacao_usd;
        break;
      
      case 'CPT':
        // CPT: Carriage Paid To - frete incluído, seguro por conta do comprador
        cif = (dadosForm.valor_fob + dadosForm.seguro_internacional) * dadosForm.cotacao_usd;
        break;
      
      case 'CIP':
        // CIP: Carriage and Insurance Paid - frete e seguro incluídos
        cif = dadosForm.valor_fob * dadosForm.cotacao_usd;
        break;
      
      case 'DAP':
      case 'DPU':
      case 'DDP':
        // DAP/DPU/DDP: Delivered - custos já incluídos no valor
        cif = dadosForm.valor_fob * dadosForm.cotacao_usd;
        break;
    }
    
    // 2. II
    const ii = cif * (dadosForm.aliq_ii / 100);
    
    // 3. IPI
    const ipi = (cif + ii) * (dadosForm.aliq_ipi / 100);
    
    // 4. PIS
    const pis = cif * (dadosForm.aliq_pis / 100);
    
    // 5. COFINS
    const cofins = cif * (dadosForm.aliq_cofins / 100);
    
    // 6. Base ICMS
    const base_icms = (cif + ii + ipi + pis + cofins + dadosForm.capatazias + dadosForm.taxa_siscomex + dadosForm.adicional_marinha) / (1 - dadosForm.aliq_icms/100);
    
    // 7. ICMS
    const icms = base_icms * (dadosForm.aliq_icms / 100);
    
    // 8. TOTAL IMPOSTOS
    const total_impostos = ii + ipi + pis + cofins + icms + dadosForm.taxa_siscomex + dadosForm.adicional_marinha;
    
    // 9. TOTAL DESPESAS (campos individuais em BRL)
    const total_despesas = dadosForm.armazenagem + dadosForm.desova + dadosForm.lacre + 
                          dadosForm.scanner + dadosForm.mov_carga + dadosForm.gerenciamento_risco + 
                          dadosForm.desconsolidacao + dadosForm.outras_despesas;
    
    // 10. TOTAL SERVIÇOS
    const total_servicos = dadosForm.honorarios + dadosForm.sdas + dadosForm.emissao_li + dadosForm.taxa_expediente;
    
    // 11. TOTAL CUSTO IMPOSTOS
    const total_custo_impostos = total_impostos + total_despesas + total_servicos;
    
    // 12. CUSTO FINAL
    const custo_final = cif + total_custo_impostos;

    // Calcular CIF em USD baseado no Incoterm
    let cif_usd: number;
    
    switch (dadosForm.incoterm) {
      case 'CIF':
      case 'CIP':
      case 'DAP':
      case 'DPU':
      case 'DDP':
        cif_usd = dadosForm.valor_fob;
        break;
      
      case 'CPT':
        cif_usd = dadosForm.valor_fob + dadosForm.seguro_internacional;
        break;
      
      case 'FOB':
      case 'EXW':
      case 'FCA':
      default:
        cif_usd = dadosForm.valor_fob + dadosForm.frete_internacional + dadosForm.seguro_internacional;
        break;
    }

    const resultadosCalculados = {
      cif,
      cif_usd,
      ii,
      ipi,
      pis,
      cofins,
      base_icms,
      icms,
      total_impostos,
      total_despesas,
      total_servicos,
      total_custo_impostos,
      custo_final
    };

    setDados(dadosForm);
    setResultados(resultadosCalculados);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-gradient-maritime shadow-elegant">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Pré-Custo Importação Marítima</h1>
                <p className="text-maritime-accent/90">Calcule todos os impostos e custos de importação</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Menu de Navegação Principal */}
              <nav className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/calculations')}
                  className="text-white hover:bg-white/20 gap-2"
                >
                  <History className="w-4 h-4" />
                  Cálculos
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/clients')}
                  className="text-white hover:bg-white/20 gap-2"
                >
                  <Users className="w-4 h-4" />
                  Clientes
                </Button>
              </nav>
              
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div>
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calculator className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Dados da Importação</h2>
                </div>
                <FormularioImportacao onCalcular={calcularImportacao} />
              </CardContent>
            </Card>
          </div>

          {/* Resultados */}
          <div>
            {resultados ? (
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <h2 className="text-xl font-semibold">Resultados Calculados</h2>
                  </div>
                  <ResultadosCalculos resultados={resultados} dados={dados} />
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-card">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Calculator className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Aguardando Cálculo</h3>
                      <p className="text-muted-foreground">Preencha os dados ao lado para ver os resultados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;