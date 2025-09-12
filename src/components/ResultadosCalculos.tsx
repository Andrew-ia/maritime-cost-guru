import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, DollarSign, FileText, Calculator, Target } from "lucide-react";
import { ResultadosCalculados } from "@/pages/Index";

interface ResultadosCalculosProps {
  resultados: ResultadosCalculados;
}

export const ResultadosCalculos = ({ resultados }: ResultadosCalculosProps) => {
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const CardResultado = ({ 
    titulo, 
    valor, 
    icon: Icon, 
    destacar = false, 
    cor = "default" 
  }: { 
    titulo: string; 
    valor: number; 
    icon: any; 
    destacar?: boolean;
    cor?: "default" | "success" | "warning" | "primary";
  }) => (
    <Card className={`
      shadow-card transition-all duration-200 hover:shadow-elegant
      ${destacar ? 'ring-2 ring-primary/20 bg-gradient-subtle' : ''}
    `}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Icon className={`w-4 h-4 ${
            cor === 'success' ? 'text-success' :
            cor === 'warning' ? 'text-warning' :
            cor === 'primary' ? 'text-primary' :
            'text-maritime-light'
          }`} />
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <span className={`text-2xl font-bold ${
            destacar ? 'text-primary' : 'text-foreground'
          }`}>
            {formatarMoeda(valor)}
          </span>
          {destacar && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Final
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Valores Base */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-maritime-light" />
          <h3 className="font-semibold">Valores Base</h3>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <CardResultado
            titulo="CIF (Custo + Seguro + Frete)"
            valor={resultados.cif}
            icon={DollarSign}
            cor="primary"
          />
        </div>
      </div>

      <Separator />

      {/* Impostos Individuais */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-maritime-light" />
          <h3 className="font-semibold">Impostos</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardResultado titulo="II (Imposto de Importação)" valor={resultados.ii} icon={FileText} />
          <CardResultado titulo="IPI" valor={resultados.ipi} icon={FileText} />
          <CardResultado titulo="PIS" valor={resultados.pis} icon={FileText} />
          <CardResultado titulo="COFINS" valor={resultados.cofins} icon={FileText} />
          <CardResultado titulo="Base ICMS" valor={resultados.base_icms} icon={Calculator} />
          <CardResultado titulo="ICMS" valor={resultados.icms} icon={FileText} />
        </div>
      </div>

      <Separator />

      {/* Totalizadores */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-maritime-light" />
          <h3 className="font-semibold">Totalizadores</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardResultado 
            titulo="Total Impostos" 
            valor={resultados.total_impostos} 
            icon={Calculator} 
            cor="warning"
          />
          <CardResultado 
            titulo="Total Despesas" 
            valor={resultados.total_despesas} 
            icon={DollarSign}
          />
          <CardResultado 
            titulo="Total Serviços" 
            valor={resultados.total_servicos} 
            icon={FileText}
          />
          <CardResultado 
            titulo="Total Custo Impostos" 
            valor={resultados.total_custo_impostos} 
            icon={Calculator}
            cor="warning"
          />
        </div>
      </div>

      <Separator />

      {/* Custo Final */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-success" />
          <h3 className="font-semibold">Resultado Final</h3>
        </div>
        <CardResultado 
          titulo="CUSTO FINAL TOTAL" 
          valor={resultados.custo_final} 
          icon={Target} 
          destacar={true}
          cor="success"
        />
      </div>

      {/* Resumo Percentual */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-3 text-center">Composição do Custo Final</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
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
      </div>
    </div>
  );
};