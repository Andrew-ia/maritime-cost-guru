interface ExchangeRateResponse {
  amount: number;
  base: string;
  date: string;
  rates: {
    BRL: number;
  };
}

interface ExchangeRateData {
  rate: number;
  lastUpdated: string;
  isLoading: boolean;
  error?: string;
}

// API gratuita Frankfurter - sem necessidade de conta
const FRANKFURTER_API_URL = 'https://api.frankfurter.app/latest';

export async function fetchUSDToBRLRate(): Promise<{ rate: number; lastUpdated: string }> {
  try {
    const response = await fetch(`${FRANKFURTER_API_URL}?from=USD&to=BRL`);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }
    
    const data: ExchangeRateResponse = await response.json();
    
    if (!data.rates?.BRL) {
      throw new Error('Taxa BRL não encontrada na resposta');
    }
    
    return {
      rate: data.rates.BRL,
      lastUpdated: data.date
    };
  } catch (error) {
    console.error('Erro ao buscar cotação USD/BRL:', error);
    throw new Error('Não foi possível obter a cotação atual');
  }
}

// Cache simples para evitar muitas requisições
let cachedRate: ExchangeRateData | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

export async function getCachedUSDToBRLRate(): Promise<ExchangeRateData> {
  const now = Date.now();
  
  // Se tem cache válido, retorna
  if (cachedRate && !cachedRate.error) {
    const cacheTime = new Date(cachedRate.lastUpdated).getTime();
    if (now - cacheTime < CACHE_DURATION) {
      return cachedRate;
    }
  }
  
  // Buscar nova cotação
  const loadingState: ExchangeRateData = {
    rate: cachedRate?.rate || 5.5, // fallback
    lastUpdated: cachedRate?.lastUpdated || new Date().toISOString(),
    isLoading: true
  };
  
  try {
    const { rate, lastUpdated } = await fetchUSDToBRLRate();
    
    cachedRate = {
      rate,
      lastUpdated,
      isLoading: false
    };
    
    return cachedRate;
  } catch (error) {
    const errorState: ExchangeRateData = {
      rate: cachedRate?.rate || 5.5, // fallback para valor anterior ou padrão
      lastUpdated: cachedRate?.lastUpdated || new Date().toISOString(),
      isLoading: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
    
    return errorState;
  }
}

export function formatLastUpdated(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `há ${diffHours}h${diffMinutes > 0 ? ` ${diffMinutes}min` : ''}`;
    } else if (diffMinutes > 0) {
      return `há ${diffMinutes} min`;
    } else {
      return 'agora';
    }
  } catch {
    return 'data inválida';
  }
}

export function formatExchangeRate(rate: number): string {
  return rate.toFixed(4);
}