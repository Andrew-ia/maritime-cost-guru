import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calculator, DollarSign, Ship, FileText, Settings } from "lucide-react";
import { InputMonetario } from "@/components/InputMonetario";
import { TabelaDespesas } from "@/components/TabelaDespesas";
import { DadosImportacao } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface FormularioImportacaoProps {
  onCalcular: (dados: DadosImportacao) => void;
}

export const FormularioImportacao = ({ onCalcular }: FormularioImportacaoProps) => {
  const { toast } = useToast();
  
  const [dados, setDados] = useState<DadosImportacao>({
    cotacao_usd: 5.417,
    valor_fob: 72500.00,
    frete_internacional: 6510.08,
    seguro_internacional: 43.69,
    capatazias: 0,
    aliq_ii: 35,
    aliq_ipi: 0,
    aliq_pis: 2.62,
    aliq_cofins: 12.57,
    aliq_icms: 18,
    taxa_siscomex: 154.23,
    adicional_marinha: 2840.35,
    despesas_locais: [
      { descricao: 'Armazenagem', valor: 31072.59, moeda: 'BRL' },
      { descricao: 'Agenciamento', valor: 3250.44, moeda: 'BRL' },
      { descricao: 'Taxas Locais (Frete Internacional – Armador) em US$', valor: 1335.30, moeda: 'USD' },
      { descricao: 'Taxas Locais (Frete Internacional – Armador) em R$', valor: 2095.00, moeda: 'BRL' }
    ],
    honorarios: 800.00,
    sdas: 400.00,
    emissao_li: 120.00,
    taxa_expediente: 0.00
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
              placeholder="Ex: 5.50"
              prefix="R$ "
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
              placeholder="0.00"
              prefix="$ "
            />
          </div>
          <div>
            <Label htmlFor="frete">Frete Internacional</Label>
            <InputMonetario
              id="frete"
              value={dados.frete_internacional}
              onChange={(valor) => atualizarCampo('frete_internacional', valor)}
              placeholder="0.00"
              prefix="$ "
            />
          </div>
          <div>
            <Label htmlFor="seguro">Seguro Internacional</Label>
            <InputMonetario
              id="seguro"
              value={dados.seguro_internacional}
              onChange={(valor) => atualizarCampo('seguro_internacional', valor)}
              placeholder="0.00"
              prefix="$ "
            />
          </div>
          <div>
            <Label htmlFor="capatazias">Capatazias (BRL)</Label>
            <InputMonetario
              id="capatazias"
              value={dados.capatazias}
              onChange={(valor) => atualizarCampo('capatazias', valor)}
              placeholder="0.00"
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
              placeholder="0.00"
              prefix="R$ "
            />
          </div>
          <div>
            <Label htmlFor="marinha">Adicional Marinha</Label>
            <InputMonetario
              id="marinha"
              value={dados.adicional_marinha}
              onChange={(valor) => atualizarCampo('adicional_marinha', valor)}
              placeholder="0.00"
              prefix="R$ "
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Despesas Locais */}
      <div className="space-y-4">
        <h3 className="font-semibold">Despesas Locais</h3>
        <TabelaDespesas
          despesas={dados.despesas_locais}
          onChange={(despesas) => atualizarCampo('despesas_locais', despesas)}
        />
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
              placeholder="0.00"
              prefix="R$ "
            />
          </div>
          <div>
            <Label htmlFor="sdas">SDAs</Label>
            <InputMonetario
              id="sdas"
              value={dados.sdas}
              onChange={(valor) => atualizarCampo('sdas', valor)}
              placeholder="0.00"
              prefix="R$ "
            />
          </div>
          <div>
            <Label htmlFor="li">Emissão LI</Label>
            <InputMonetario
              id="li"
              value={dados.emissao_li}
              onChange={(valor) => atualizarCampo('emissao_li', valor)}
              placeholder="0.00"
              prefix="R$ "
            />
          </div>
          <div>
            <Label htmlFor="expediente">Taxa Expediente</Label>
            <InputMonetario
              id="expediente"
              value={dados.taxa_expediente}
              onChange={(valor) => atualizarCampo('taxa_expediente', valor)}
              placeholder="0.00"
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