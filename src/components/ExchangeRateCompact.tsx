import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { InputMonetario } from '@/components/InputMonetario';
import { getCachedUSDToBRLRate, formatLastUpdated, formatExchangeRate } from '@/utils/exchangeRate';

interface ExchangeRateCompactProps {
  currentRate: number;
  onRateUpdate: (newRate: number) => void;
  className?: string;
}

export const ExchangeRateCompact = ({ currentRate, onRateUpdate, className = '' }: ExchangeRateCompactProps) => {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [rateChange, setRateChange] = useState<'up' | 'down' | null>(null);
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
  const [liveRate, setLiveRate] = useState<number>(0);
  const { toast } = useToast();

  // Carregar cotação automaticamente quando o componente carrega
  useEffect(() => {
    if (!hasLoadedInitially) {
      loadInitialRate();
    }
  }, [hasLoadedInitially]);

  const loadInitialRate = async () => {
    try {
      setLoading(true);
      const rateData = await getCachedUSDToBRLRate();
      
      if (!rateData.error && rateData.rate > 0) {
        setLiveRate(rateData.rate);
        setLastUpdated(rateData.lastUpdated);
        setHasLoadedInitially(true);
        
        // Auto-preencher apenas se o campo estiver vazio
        if (currentRate === 0) {
          onRateUpdate(rateData.rate);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar cotação inicial:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRate = async () => {
    setLoading(true);
    
    try {
      const rateData = await getCachedUSDToBRLRate();
      
      if (rateData.error) {
        toast({
          title: 'Erro ao buscar cotação',
          description: rateData.error,
          variant: 'destructive',
        });
        return;
      }
      
      const newRate = rateData.rate;
      const previousRate = liveRate;
      
      // Determinar se subiu ou desceu
      if (newRate > previousRate) {
        setRateChange('up');
      } else if (newRate < previousRate) {
        setRateChange('down');
      } else {
        setRateChange(null);
      }
      
      setLiveRate(newRate);
      setLastUpdated(rateData.lastUpdated);
      
      toast({
        title: 'Cotação atualizada!',
        description: `USD/BRL: R$ ${formatExchangeRate(newRate)}`,
      });
      
      // Reset do indicador após 3 segundos
      setTimeout(() => setRateChange(null), 3000);
      
    } catch (error) {
      console.error('Erro ao atualizar cotação:', error);
      toast({
        title: 'Erro na atualização',
        description: 'Não foi possível obter a cotação atual',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseLiveRate = () => {
    if (liveRate > 0) {
      onRateUpdate(liveRate);
      toast({
        title: 'Cotação aplicada',
        description: `Campo preenchido com R$ ${formatExchangeRate(liveRate)}`,
      });
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Linha da Cotação Atual */}
      {liveRate > 0 && (
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Cotação atual:</span>
                <span className="font-bold text-lg text-blue-600">R$ {formatExchangeRate(liveRate)}</span>
                {rateChange && (
                  <Badge 
                    variant="secondary"
                    className={`text-xs gap-1 ${
                      rateChange === 'up' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {rateChange === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {rateChange === 'up' ? 'Subiu' : 'Desceu'}
                  </Badge>
                )}
              </div>
              {lastUpdated && (
                <div className="text-xs text-muted-foreground">
                  Atualizada {formatLastUpdated(lastUpdated)}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUseLiveRate}
              className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Usar Esta
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUpdateRate}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>
        </div>
      )}

      {/* Campo de Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cotacao">Cotação USD/BRL</Label>
          <InputMonetario
            id="cotacao"
            value={currentRate}
            onChange={(valor) => onRateUpdate(valor)}
            placeholder="0"
            prefix="R$ "
            decimals={4}
          />
        </div>
      </div>
    </div>
  );
};