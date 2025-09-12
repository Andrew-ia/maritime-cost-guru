import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputMonetarioProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const InputMonetario = ({ 
  id, 
  value, 
  onChange, 
  placeholder = "0,00", 
  prefix = "", 
  suffix = "",
  className 
}: InputMonetarioProps) => {
  
  const formatarParaExibicao = (val: number) => {
    if (val === 0) return "";
    
    // Para porcentagens, não formatamos
    if (suffix.includes('%')) {
      return val.toString().replace('.', ',');
    }
    
    // Para valores monetários, formatamos em pt-BR
    return val.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const parseValorBrasileiro = (inputStr: string): number => {
    if (!inputStr) return 0;
    
    // Remove espaços e prefixos/sufixos
    let cleanStr = inputStr.replace(/[^\d.,]/g, '');
    
    // Se tem ponto E vírgula, assume formato brasileiro (1.234,56)
    if (cleanStr.includes('.') && cleanStr.includes(',')) {
      // Remove pontos (separadores de milhares) e substitui vírgula por ponto
      cleanStr = cleanStr.replace(/\./g, '').replace(',', '.');
    }
    // Se tem apenas vírgula, assume que é decimal brasileiro
    else if (cleanStr.includes(',') && !cleanStr.includes('.')) {
      cleanStr = cleanStr.replace(',', '.');
    }
    // Se tem apenas ponto, pode ser decimal ou milhares
    // Assumimos decimal se houver 1-2 dígitos após o ponto
    else if (cleanStr.includes('.')) {
      const parts = cleanStr.split('.');
      if (parts.length === 2 && parts[1].length <= 2) {
        // Provavelmente decimal: 123.45
        // Mantém como está
      } else {
        // Provavelmente separador de milhares: 1.234
        cleanStr = cleanStr.replace(/\./g, '');
      }
    }
    
    const result = parseFloat(cleanStr) || 0;
    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numeroValue = parseValorBrasileiro(inputValue);
    onChange(numeroValue);
  };

  const displayValue = formatarParaExibicao(value);

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
          {prefix}
        </span>
      )}
      <Input
        id={id}
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "bg-background border-input",
          prefix && "pl-12",
          suffix && "pr-12",
          className
        )}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
};