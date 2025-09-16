import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClients } from '@/contexts/ClientsContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Plus, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DadosImportacao, ResultadosCalculados } from '@/pages/Index';

interface SaveCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dados: DadosImportacao;
  resultados: ResultadosCalculados;
}

export function SaveCalculationModal({
  isOpen,
  onClose,
  dados,
  resultados,
}: SaveCalculationModalProps) {
  const [calculationName, setCalculationName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { clients, loading: clientsLoading } = useClients();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para salvar cálculos',
        variant: 'destructive',
      });
      return;
    }

    if (!calculationName.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, digite um nome para o cálculo',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const calculationData = {
        dados,
        resultados,
        savedAt: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('calculations_history')
        .insert({
          user_id: user.id,
          client_id: selectedClientId || null,
          calculation_name: calculationName.trim(),
          calculation_data: calculationData,
        });

      if (error) {
        throw error;
      }

      toast({
        title: 'Cálculo salvo!',
        description: `"${calculationName}" foi salvo com sucesso`,
      });

      setCalculationName('');
      setSelectedClientId('');
      onClose();
    } catch (error: any) {
      console.error('Erro ao salvar cálculo:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message || 'Não foi possível salvar o cálculo',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setCalculationName('');
      setSelectedClientId('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Salvar Cálculo
          </DialogTitle>
          <DialogDescription>
            Dê um nome para este cálculo para encontrá-lo facilmente depois.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client">Cliente (Opcional)</Label>
            <Select
              value={selectedClientId}
              onValueChange={setSelectedClientId}
              disabled={isLoading || clientsLoading}
            >
              <SelectTrigger id="client">
                <SelectValue placeholder="Selecione um cliente..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem cliente</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                    {client.document && ` - ${client.document}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {clients.length === 0 && !clientsLoading && (
              <p className="text-xs text-muted-foreground">
                <Users className="w-3 h-3 inline mr-1" />
                Nenhum cliente cadastrado.
                <a href="/clients" className="text-primary hover:underline ml-1">
                  Cadastrar cliente
                </a>
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calculation-name">Nome do Cálculo *</Label>
            <Input
              id="calculation-name"
              placeholder="Ex: Importação Container 40ft - Janeiro 2025"
              value={calculationName}
              onChange={(e) => setCalculationName(e.target.value)}
              disabled={isLoading}
              maxLength={100}
              required
            />
          </div>
          
          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium">CIF:</span> {resultados.cif.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
              <div>
                <span className="font-medium">Custo Final:</span> {resultados.custo_final.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !calculationName.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}