import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { getCachedUSDToBRLRate, formatLastUpdated, formatExchangeRate } from '@/utils/exchangeRate';

interface ExchangeRateButtonProps {
  currentRate: number;
  onRateUpdate: (newRate: number) => void;
  className?: string;
}

export const ExchangeRateButton = ({ currentRate, onRateUpdate, className = '' }: ExchangeRateButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [rateChange, setRateChange] = useState<'up' | 'down' | null>(null);
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
  const { toast } = useToast();

  // Carregar cotação automaticamente quando o componente carrega
  useEffect(() => {
    if (!hasLoadedInitially && currentRate === 0) {
      loadInitialRate();
    }
  }, [hasLoadedInitially, currentRate]);

  const loadInitialRate = async () => {
    try {
      setLoading(true);
      const rateData = await getCachedUSDToBRLRate();
      
      if (!rateData.error && rateData.rate > 0) {
        onRateUpdate(rateData.rate);
        setLastUpdated(rateData.lastUpdated);
        setHasLoadedInitially(true);
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
      const previousRate = currentRate;
      
      // Determinar se subiu ou desceu
      if (newRate > previousRate) {
        setRateChange('up');
      } else if (newRate < previousRate) {
        setRateChange('down');
      } else {
        setRateChange(null);
      }
      
      // Atualizar a cotação no formulário
      onRateUpdate(newRate);
      setLastUpdated(rateData.lastUpdated);
      
      toast({
        title: 'Cotação atualizada!',
        description: `USD/BRL: R$ ${formatExchangeRate(newRate)} ${formatLastUpdated(rateData.lastUpdated)}`,
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

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Cotação Atual Destacada */}
      {currentRate > 0 && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <DollarSign className="w-4 h-4 text-blue-600" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">USD/BRL:</span>
              <span className="font-bold text-blue-600">R$ {formatExchangeRate(currentRate)}</span>
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
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleUpdateRate}
        disabled={loading}
        className="gap-2"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Atualizando...' : 'Atualizar Cotação'}
      </Button>
    </div>
  );
};