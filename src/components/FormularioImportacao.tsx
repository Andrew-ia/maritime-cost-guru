import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign, Ship, FileText, Settings, Package } from "lucide-react";
import { InputMonetario } from "@/components/InputMonetario";
import { ExchangeRateCompact } from "@/components/ExchangeRateCompact";
import { QuickTemplateDropdown } from "@/components/QuickTemplateDropdown";
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
    // Despesas
    armazenagem: 0,
    agenciamento: 0,
    taxas_locais_armador_usd: 0,
    taxas_locais_armador_brl: 0
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

  const atualizarCampo = (campo: keyof DadosImportacao, valor: string | number) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const aplicarTemplate = (templateData: Partial<DadosImportacao>) => {
    setDados(prev => ({ ...prev, ...templateData }));
    toast({ 
      title: "Template aplicado", 
      description: "Os campos foram preenchidos com valores padrão. Ajuste conforme necessário." 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header com Templates */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dados da Importação</h2>
          <p className="text-sm text-muted-foreground">Preencha os dados para calcular os custos</p>
        </div>
        <QuickTemplateDropdown onApplyTemplate={aplicarTemplate} />
      </div>
      
      <Separator />

      {/* Cotação USD/BRL - Primeira coisa */}
      <ExchangeRateCompact 
        currentRate={dados.cotacao_usd}
        onRateUpdate={(newRate) => atualizarCampo('cotacao_usd', newRate)}
      />

      <Separator />

      {/* Dados do Produto */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-maritime-light" />
          <h3 className="font-semibold">Dados do Produto</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="incoterm">Incoterm</Label>
            <Select value={dados.incoterm} onValueChange={(value) => atualizarCampo('incoterm', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Incoterm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FOB">FOB</SelectItem>
                <SelectItem value="CIF">CIF</SelectItem>
                <SelectItem value="EXW">EXW</SelectItem>
                <SelectItem value="FCA">FCA</SelectItem>
                <SelectItem value="CPT">CPT</SelectItem>
                <SelectItem value="CIP">CIP</SelectItem>
                <SelectItem value="DAP">DAP</SelectItem>
                <SelectItem value="DPU">DPU</SelectItem>
                <SelectItem value="DDP">DDP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="origem">Origem</Label>
            <Input
              id="origem"
              type="text"
              value={dados.origem}
              onChange={(e) => atualizarCampo('origem', e.target.value)}
              placeholder="Porto de origem"
            />
          </div>
          
          <div>
            <Label htmlFor="destino">Destino</Label>
            <Input
              id="destino"
              type="text"
              value={dados.destino}
              onChange={(e) => atualizarCampo('destino', e.target.value)}
              placeholder="Porto de destino"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="container">Container</Label>
            <Select value={dados.container || undefined} onValueChange={(value) => atualizarCampo('container', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20'">20'</SelectItem>
                <SelectItem value="40'">40'</SelectItem>
                <SelectItem value="LCL">LCL</SelectItem>
                <SelectItem value="RORO">RORO</SelectItem>
                <SelectItem value="Open Top">Open Top</SelectItem>
                <SelectItem value="Flat Rack">Flat Rack</SelectItem>
              </SelectContent>
            </Select>
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
            <Input
              id="produto"
              type="text"
              value={dados.produto}
              onChange={(e) => atualizarCampo('produto', e.target.value)}
              placeholder="Descrição do produto"
            />
          </div>
          
          <div>
            <Label htmlFor="ncm">NCM</Label>
            <Input
              id="ncm"
              type="text"
              value={dados.ncm}
              onChange={(e) => atualizarCampo('ncm', e.target.value)}
              placeholder="0000.00.00"
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
            <Label htmlFor="fob">Valor {dados.incoterm || 'FOB'}</Label>
            <InputMonetario
              id="fob"
              value={dados.valor_fob}
              onChange={(valor) => atualizarCampo('valor_fob', valor)}
              placeholder="0"
              prefix="$ "
            />
          </div>
          {/* Mostrar Frete apenas se necessário para o Incoterm */}
          {!['CIF', 'CIP', 'CPT', 'DAP', 'DPU', 'DDP'].includes(dados.incoterm || 'FOB') && (
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
          )}
          
          {/* Mostrar Seguro apenas se necessário para o Incoterm */}
          {!['CIF', 'CIP', 'DAP', 'DPU', 'DDP'].includes(dados.incoterm || 'FOB') && (
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
          )}
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

      {/* Despesas */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-maritime-light" />
          <h3 className="font-semibold">Despesas</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="armazenagem">Armazenagem (BRL)</Label>
            <InputMonetario
              id="armazenagem"
              value={dados.armazenagem}
              onChange={(valor) => atualizarCampo('armazenagem', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          
          <div>
            <Label htmlFor="agenciamento">Agenciamento (BRL)</Label>
            <InputMonetario
              id="agenciamento"
              value={dados.agenciamento}
              onChange={(valor) => atualizarCampo('agenciamento', valor)}
              placeholder="0"
              prefix="R$ "
            />
          </div>
          
          <div>
            <Label htmlFor="taxas_locais_armador_usd">Taxas Locais de Frete Internacional (Armador) em Dólar</Label>
            <InputMonetario
              id="taxas_locais_armador_usd"
              value={dados.taxas_locais_armador_usd}
              onChange={(valor) => atualizarCampo('taxas_locais_armador_usd', valor)}
              placeholder="0"
              prefix="$ "
            />
          </div>
          
          <div>
            <Label htmlFor="taxas_locais_armador_brl">Taxas Locais de Frete Internacional (Armador) em Reais</Label>
            <InputMonetario
              id="taxas_locais_armador_brl"
              value={dados.taxas_locais_armador_brl}
              onChange={(valor) => atualizarCampo('taxas_locais_armador_brl', valor)}
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