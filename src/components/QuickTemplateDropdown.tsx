import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DadosImportacao } from '@/pages/Index';
import { 
  ChevronDown,
  Globe,
  Ship, 
  Smartphone, 
  Shirt, 
  Car, 
  Zap
} from 'lucide-react';

interface QuickTemplate {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  dados: Partial<DadosImportacao>;
}

interface QuickTemplateDropdownProps {
  onApplyTemplate: (dados: Partial<DadosImportacao>) => void;
  className?: string;
}

const templates: QuickTemplate[] = [
  {
    id: 'china-fob',
    name: 'Importação China FOB',
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

export const QuickTemplateDropdown = ({ onApplyTemplate, className = '' }: QuickTemplateDropdownProps) => {
  const handleApplyTemplate = (template: QuickTemplate) => {
    onApplyTemplate(template.dados);
  };

  // Agrupar templates por categoria
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, QuickTemplate[]>);

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Zap className="w-4 h-4" />
            Templates Rápidos
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuLabel>Escolha um template</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {Object.entries(templatesByCategory).map(([category, categoryTemplates], categoryIndex) => (
            <div key={category}>
              {categoryIndex > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1">
                {category}
              </DropdownMenuLabel>
              {categoryTemplates.map((template) => {
                const IconComponent = template.icon;
                return (
                  <DropdownMenuItem
                    key={template.id}
                    onClick={() => handleApplyTemplate(template)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <IconComponent className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{template.name}</span>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>
          ))}
          
          <DropdownMenuSeparator />
          <div className="px-2 py-2 text-xs text-muted-foreground">
            💡 Valores padrão que você pode ajustar
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};