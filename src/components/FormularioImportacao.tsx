import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calculator, DollarSign, Ship, FileText, Settings, Package } from "lucide-react";
import { InputMonetario } from "@/components/InputMonetario";
import { DadosImportacao } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface FormularioImportacaoProps {
  onCalcular: (dados: DadosImportacao) => void;
}

export const FormularioImportacao = ({ onCalcular }: FormularioImportacaoProps) => {
  const { toast } = useToast();
  
  const [dados, setDados] = useState<DadosImportacao>({
    // Dados do Produto
    incoterm: 'FOB',
    origem: '',
    destino: '',
    container: '',
    peso_bruto: 0,
    produto: '',
    ncm: '',
    quantidade: 1,
    // Dados Financeiros
    cotacao_usd: 0,
    valor_fob: 0,
    frete_internacional: 0,
    seguro_internacional: 0,
    capatazias: 0,
    aliq_ii: 0,
    aliq_ipi: 0,
    aliq_pis: 0,
    aliq_cofins: 0,
    aliq_icms: 0,
    taxa_siscomex: 0,
    adicional_marinha: 0,
    // Despesas Locais
    armazenagem: 0,
    desova: 0,
    lacre: 0,
    scanner: 0,
    mov_carga: 0,
    gerenciamento_risco: 0,
    desconsolidacao: 0,
    outras_despesas: 0,
    // Serviços
    honorarios: 0,
    sdas: 0,
    emissao_li: 0,
    taxa_expediente: 0
  });

  const validarDados = () => {
    if (dados.cotacao_usd <= 0) {
      toast({ title: "Erro", description: "Cotação USD deve ser maior que zero", variant: "destructive" });
      return false;
    }
    if (dados.valor_fob <= 0) {
      toast({ title: "Erro", description: "Valor FOB deve ser maior que zero", variant: "destructive" });
      return false;
    }
    if (dados.aliq_ii < 0 || dados.aliq_ii > 100) {
      toast({ title: "Erro", description: "Alíquota II deve estar entre 0 e 100%", variant: "destructive" });
      return false;
    }
    if (dados.aliq_icms < 0 || dados.aliq_icms > 100) {
      toast({ title: "Erro", description: "Alíquota ICMS deve estar entre 0 e 100%", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validarDados()) {
      onCalcular(dados);
      toast({ title: "Sucesso", description: "Cálculo realizado com sucesso!" });
    }
  };

  const atualizarCampo = (campo: keyof DadosImportacao, valor: any) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados do Produto */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-maritime-light" />
          <h3 className="font-semibold">Dados do Produto</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="incoterm">Incoterm</Label>
            <select
              id="incoterm"
              value={dados.incoterm}
              onChange={(e) => atualizarCampo('incoterm', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maritime-light"
            >
              <option value="FOB">FOB</option>
              <option value="CIF">CIF</option>
              <option value="EXW">EXW</option>
              <option value="FCA">FCA</option>
              <option value="CPT">CPT</option>
              <option value="CIP">CIP</option>
              <option value="DAP">DAP</option>
              <option value="DPU">DPU</option>
              <option value="DDP">DDP</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="origem">Origem</Label>
            <input
              id="origem"
              type="text"
              value={dados.origem}
              onChange={(e) => atualizarCampo('origem', e.target.value)}
              placeholder="Porto de origem"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maritime-light"
            />
          </div>
          
          <div>
            <Label htmlFor="destino">Destino</Label>
            <input
              id="destino"
              type="text"
              value={dados.destino}
              onChange={(e) => atualizarCampo('destino', e.target.value)}
              placeholder="Porto de destino"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maritime-light"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="container">Container</Label>
            <input
              id="container"
              type="text"
              value={dados.container}
              onChange={(e) => atualizarCampo('container', e.target.value)}
              placeholder="Ex: 20', 40', 40'HC"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maritime-light"
            />
          </div>
          
          <div>
            <Label htmlFor="peso_bruto">Peso Bruto (kg)</Label>
            <InputMonetario
              id="peso_bruto"
              value={dados.peso_bruto || 0}
              onChange={(valor) => atualizarCampo('peso_bruto', valor)}
              placeholder="0"
              decimals={3}
            />
          </div>
          
          <div>
            <Label htmlFor="quantidade">Quantidade</Label>
            <InputMonetario
              id="quantidade"
              value={dados.quantidade || 1}
              onChange={(valor) => atualizarCampo('quantidade', valor)}
              placeholder="1"
              decimals={0}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="produto">Produto</Label>
            <input
              id="produto"
              type="text"
              value={dados.produto}
              onChange={(e) => atualizarCampo('produto', e.target.value)}
              placeholder="Descrição do produto"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maritime-light"
            />
          </div>
          
          <div>
            <Label htmlFor="ncm">NCM</Label>
            <input
              id="ncm"
              type="text"
              value={dados.ncm}
              onChange={(e) => atualizarCampo('ncm', e.target.value)}
              placeholder="0000.00.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maritime-light"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Moeda e Câmbio */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-maritime-light" />
          <h3 className="font-semibold">Moeda e Câmbio</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="cotacao">Cotação USD/BRL</Label>
            <InputMonetario
              id="cotacao"
              value={dados.cotacao_usd}
              onChange={(valor) => atualizarCampo('cotacao_usd', valor)}
              placeholder="0"
              prefix="R$ "
              decimals={4}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Mercadoria e Frete */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Ship className="w-4 h-4 text-maritime-light" />
          <h3 className="font-semibold">Mercadoria e Frete (USD)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fob">Valor FOB</Label>
            <InputMonetario
              id="fob"
              value={dados.valor_fob}
              onChange={(valor) => atualizarCampo('valor_fob', valor)}
              placeholder="0"
              prefix="$ "
            />
          </div>
          <div>
            <Label htmlFor="frete">Frete Internacional</Label>
            <InputMonetario
              id="frete"
              value={dados.frete_internacional}
              onChange={(valor) => atualizarCampo('frete_internacional', valor)}
              placeholder="0"
              prefix="$ "
            />
          </div>
          <div>
            <Label htmlFor="seguro">Seguro Internacional</Label>
            <InputMonetario
              id="seguro"
              value={dados.seguro_internacional}
              onChange={(valor) => atualizarCampo('seguro_internacional', valor)}
              placeholder="0"
              prefix="$ "
            />
          </div>
          <div>
            <Label htmlFor="capatazias">Capatazias (BRL)</Label>
            <InputMonetario
              id="capatazias"
              value={dados.capatazias}
              onChange={(valor) => atualizarCampo('capatazias', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Alíquotas */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-maritime-light" />
          <h3 className="font-semibold">Alíquotas (%)</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="ii">II (%)</Label>
            <InputMonetario
              id="ii"
              value={dados.aliq_ii}
              onChange={(valor) => atualizarCampo('aliq_ii', valor)}
              placeholder="0"
              suffix=" %"
            />
          </div>
          <div>
            <Label htmlFor="ipi">IPI (%)</Label>
            <InputMonetario
              id="ipi"
              value={dados.aliq_ipi}
              onChange={(valor) => atualizarCampo('aliq_ipi', valor)}
              placeholder="0"
              suffix=" %"
            />
          </div>
          <div>
            <Label htmlFor="pis">PIS (%)</Label>
            <InputMonetario
              id="pis"
              value={dados.aliq_pis}
              onChange={(valor) => atualizarCampo('aliq_pis', valor)}
              placeholder="0"
              suffix=" %"
            />
          </div>
          <div>
            <Label htmlFor="cofins">COFINS (%)</Label>
            <InputMonetario
              id="cofins"
              value={dados.aliq_cofins}
              onChange={(valor) => atualizarCampo('aliq_cofins', valor)}
              placeholder="0"
              suffix=" %"
            />
          </div>
          <div>
            <Label htmlFor="icms">ICMS (%)</Label>
            <InputMonetario
              id="icms"
              value={dados.aliq_icms}
              onChange={(valor) => atualizarCampo('aliq_icms', valor)}
              placeholder="0"
              suffix=" %"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Taxas */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-maritime-light" />
          <h3 className="font-semibold">Taxas (BRL)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="siscomex">Taxa SISCOMEX</Label>
            <InputMonetario
              id="siscomex"
              value={dados.taxa_siscomex}
              onChange={(valor) => atualizarCampo('taxa_siscomex', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          <div>
            <Label htmlFor="marinha">Adicional Marinha</Label>
            <InputMonetario
              id="marinha"
              value={dados.adicional_marinha}
              onChange={(valor) => atualizarCampo('adicional_marinha', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Despesas Locais */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-maritime-light" />
          <h3 className="font-semibold">Despesas Locais (BRL)</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="armazenagem">Armazenagem</Label>
            <InputMonetario
              id="armazenagem"
              value={dados.armazenagem}
              onChange={(valor) => atualizarCampo('armazenagem', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          
          <div>
            <Label htmlFor="desova">Desova</Label>
            <InputMonetario
              id="desova"
              value={dados.desova}
              onChange={(valor) => atualizarCampo('desova', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          
          <div>
            <Label htmlFor="lacre">Lacre</Label>
            <InputMonetario
              id="lacre"
              value={dados.lacre}
              onChange={(valor) => atualizarCampo('lacre', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          
          <div>
            <Label htmlFor="scanner">Scanner</Label>
            <InputMonetario
              id="scanner"
              value={dados.scanner}
              onChange={(valor) => atualizarCampo('scanner', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          
          <div>
            <Label htmlFor="mov_carga">Movimentação de Carga</Label>
            <InputMonetario
              id="mov_carga"
              value={dados.mov_carga}
              onChange={(valor) => atualizarCampo('mov_carga', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          
          <div>
            <Label htmlFor="gerenciamento_risco">Gerenciamento de Risco</Label>
            <InputMonetario
              id="gerenciamento_risco"
              value={dados.gerenciamento_risco}
              onChange={(valor) => atualizarCampo('gerenciamento_risco', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          
          <div>
            <Label htmlFor="desconsolidacao">Desconsolidação</Label>
            <InputMonetario
              id="desconsolidacao"
              value={dados.desconsolidacao}
              onChange={(valor) => atualizarCampo('desconsolidacao', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          
          <div>
            <Label htmlFor="outras_despesas">Outras Despesas</Label>
            <InputMonetario
              id="outras_despesas"
              value={dados.outras_despesas}
              onChange={(valor) => atualizarCampo('outras_despesas', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Serviços Fixos */}
      <div className="space-y-4">
        <h3 className="font-semibold">Serviços Fixos (BRL)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="honorarios">Honorários</Label>
            <InputMonetario
              id="honorarios"
              value={dados.honorarios}
              onChange={(valor) => atualizarCampo('honorarios', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          <div>
            <Label htmlFor="sdas">SDAs</Label>
            <InputMonetario
              id="sdas"
              value={dados.sdas}
              onChange={(valor) => atualizarCampo('sdas', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          <div>
            <Label htmlFor="li">Emissão LI</Label>
            <InputMonetario
              id="li"
              value={dados.emissao_li}
              onChange={(valor) => atualizarCampo('emissao_li', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          <div>
            <Label htmlFor="expediente">Taxa Expediente</Label>
            <InputMonetario
              id="expediente"
              value={dados.taxa_expediente}
              onChange={(valor) => atualizarCampo('taxa_expediente', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
        </div>
      </div>

      <Button type="submit" variant="maritime" className="w-full font-semibold py-3">
        <Calculator className="w-4 h-4 mr-2" />
        Calcular Pré-Custo
      </Button>
    </form>
  );
};