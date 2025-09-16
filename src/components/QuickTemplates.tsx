import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DadosImportacao } from '@/pages/Index';
import { 
  Ship, 
  ShoppingBag, 
  Smartphone, 
  Shirt, 
  Car, 
  Zap,
  Package,
  Globe
} from 'lucide-react';

interface QuickTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  dados: Partial<DadosImportacao>;
}

interface QuickTemplatesProps {
  onApplyTemplate: (dados: Partial<DadosImportacao>) => void;
  className?: string;
}

const templates: QuickTemplate[] = [
  {
    id: 'china-fob',
    name: 'Importação China FOB',
    description: 'Template para produtos da China via FOB',
    icon: Globe,
    category: 'Origem',
    dados: {
      incoterm: 'FOB',
      origem: 'Shanghai, China',
      destino: 'Santos, Brasil',
      container: "40'",
      cotacao_usd: 5.50,
      frete_internacional: 2500,
      seguro_internacional: 150,
      aliq_ii: 35,
      aliq_ipi: 0,
      aliq_pis: 2.62,
      aliq_cofins: 12.57,
      aliq_icms: 18,
      taxa_siscomex: 229.50,
      adicional_marinha: 40,
      capatazias: 850,
      armazenagem: 1200,
      desova: 450,
      lacre: 85,
      scanner: 120,
      mov_carga: 350,
      gerenciamento_risco: 280,
      honorarios: 1500,
      sdas: 95,
      emissao_li: 180,
      taxa_expediente: 250
    }
  },
  {
    id: 'usa-cif',
    name: 'Importação EUA CIF',
    description: 'Template para produtos dos EUA via CIF',
    icon: Ship,
    category: 'Origem',
    dados: {
      incoterm: 'CIF',
      origem: 'Miami, EUA',
      destino: 'Santos, Brasil',
      container: "20'",
      cotacao_usd: 5.50,
      aliq_ii: 20,
      aliq_ipi: 15,
      aliq_pis: 2.62,
      aliq_cofins: 12.57,
      aliq_icms: 18,
      taxa_siscomex: 229.50,
      adicional_marinha: 40,
      capatazias: 650,
      armazenagem: 950,
      desova: 380,
      lacre: 85,
      scanner: 120,
      mov_carga: 280,
      gerenciamento_risco: 220,
      honorarios: 1200,
      sdas: 95,
      emissao_li: 150,
      taxa_expediente: 200
    }
  },
  {
    id: 'eletronicos',
    name: 'Produtos Eletrônicos',
    description: 'Smartphones, tablets, componentes',
    icon: Smartphone,
    category: 'Produto',
    dados: {
      ncm: '8517.12.31',
      aliq_ii: 20,
      aliq_ipi: 15,
      aliq_pis: 2.62,
      aliq_cofins: 12.57,
      aliq_icms: 18,
      peso_bruto: 500,
      quantidade: 1000,
      taxa_siscomex: 229.50,
      adicional_marinha: 40,
      scanner: 150,
      gerenciamento_risco: 400
    }
  },
  {
    id: 'textil',
    name: 'Têxtil/Vestuário',
    description: 'Roupas, tecidos, calçados',
    icon: Shirt,
    category: 'Produto',
    dados: {
      ncm: '6203.42.00',
      aliq_ii: 35,
      aliq_ipi: 0,
      aliq_pis: 2.62,
      aliq_cofins: 12.57,
      aliq_icms: 18,
      peso_bruto: 800,
      quantidade: 2000,
      taxa_siscomex: 229.50,
      adicional_marinha: 40,
      gerenciamento_risco: 180
    }
  },
  {
    id: 'automoveis',
    name: 'Automóveis/Autopeças',
    description: 'Veículos e componentes automotivos',
    icon: Car,
    category: 'Produto',
    dados: {
      ncm: '8703.23.10',
      aliq_ii: 35,
      aliq_ipi: 25,
      aliq_pis: 2.62,
      aliq_cofins: 12.57,
      aliq_icms: 18,
      container: 'RORO',
      taxa_siscomex: 229.50,
      adicional_marinha: 40,
      scanner: 200,
      gerenciamento_risco: 800
    }
  },
  {
    id: 'maquinas',
    name: 'Máquinas/Equipamentos',
    description: 'Equipamentos industriais e máquinas',
    icon: Zap,
    category: 'Produto',
    dados: {
      ncm: '8479.89.99',
      aliq_ii: 14,
      aliq_ipi: 10,
      aliq_pis: 2.62,
      aliq_cofins: 12.57,
      aliq_icms: 18,
      container: "40'",
      peso_bruto: 5000,
      taxa_siscomex: 229.50,
      adicional_marinha: 40,
      mov_carga: 500,
      gerenciamento_risco: 350
    }
  }
];

export const QuickTemplates = ({ onApplyTemplate, className = '' }: QuickTemplatesProps) => {
  const handleApplyTemplate = (template: QuickTemplate) => {
    onApplyTemplate(template.dados);
  };

  const getIconColor = (category: string) => {
    switch (category) {
      case 'Origem': return 'text-blue-600';
      case 'Produto': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getBadgeVariant = (category: string) => {
    switch (category) {
      case 'Origem': return 'default';
      case 'Produto': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Templates Rápidos</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Clique em um template para preencher automaticamente os campos com valores padrão
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card 
              key={template.id} 
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleApplyTemplate(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors`}>
                      <IconComponent className={`w-5 h-5 ${getIconColor(template.category)} group-hover:text-primary transition-colors`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium leading-tight">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant={getBadgeVariant(template.category)} className="text-xs">
                    {template.category}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-8 px-2 text-xs">
                    Aplicar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          💡 Dica: Os templates preenchem valores padrão que você pode ajustar conforme necessário
        </p>
      </div>
    </div>
  );
};