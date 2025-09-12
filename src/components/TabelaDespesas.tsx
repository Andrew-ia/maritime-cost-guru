import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { InputMonetario } from "@/components/InputMonetario";

interface Despesa {
  descricao: string;
  valor: number;
  moeda: 'BRL' | 'USD';
}

interface TabelaDespesasProps {
  despesas: Despesa[];
  onChange: (despesas: Despesa[]) => void;
}

export const TabelaDespesas = ({ despesas, onChange }: TabelaDespesasProps) => {
  const [novaDespesa, setNovaDespesa] = useState<Despesa>({
    descricao: '',
    valor: 0,
    moeda: 'BRL'
  });

  const adicionarDespesa = () => {
    if (novaDespesa.descricao.trim() && novaDespesa.valor > 0) {
      onChange([...despesas, novaDespesa]);
      setNovaDespesa({ descricao: '', valor: 0, moeda: 'BRL' });
    }
  };

  const removerDespesa = (index: number) => {
    onChange(despesas.filter((_, i) => i !== index));
  };

  const formatarMoeda = (valor: number, moeda: 'BRL' | 'USD') => {
    const prefix = moeda === 'BRL' ? 'R$ ' : '$ ';
    return prefix + valor.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  return (
    <div className="space-y-4">
      {/* Formulário para adicionar despesa */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Descrição da despesa"
          value={novaDespesa.descricao}
          onChange={(e) => setNovaDespesa(prev => ({ ...prev, descricao: e.target.value }))}
          className="flex-1"
        />
        
        <div className="flex gap-2">
          <div className="w-32">
            <InputMonetario
              value={novaDespesa.valor}
              onChange={(valor) => setNovaDespesa(prev => ({ ...prev, valor }))}
              placeholder="0.00"
              prefix={novaDespesa.moeda === 'BRL' ? 'R$ ' : '$ '}
            />
          </div>
          
          <Select 
            value={novaDespesa.moeda} 
            onValueChange={(moeda: 'BRL' | 'USD') => setNovaDespesa(prev => ({ ...prev, moeda }))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BRL">BRL</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            type="button"
            onClick={adicionarDespesa}
            size="sm"
            className="bg-success hover:bg-success/90 text-white"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabela de despesas */}
      {despesas.length > 0 && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Moeda</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {despesas.map((despesa, index) => (
                <TableRow key={index}>
                  <TableCell>{despesa.descricao}</TableCell>
                  <TableCell className="font-medium">
                    {formatarMoeda(despesa.valor, despesa.moeda)}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                      {despesa.moeda}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerDespesa(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {despesas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma despesa adicionada
        </div>
      )}
    </div>
  );
};