import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface InputMonetarioProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export const InputMonetario = ({ 
  id, 
  value, 
  onChange, 
  placeholder = "0", 
  prefix = "", 
  suffix = "",
  className,
  decimals = 2
}: InputMonetarioProps) => {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  // Converte string para número
  const parseNumber = (str: string): number => {
    if (!str || str.trim() === "") return 0;
    
    // Remove tudo exceto números, vírgula e ponto
    let cleanStr = str.replace(/[^\d,.-]/g, '');
    
    // Se não tem vírgula nem ponto, é um número inteiro
    if (!cleanStr.includes(',') && !cleanStr.includes('.')) {
      return parseFloat(cleanStr) || 0;
    }
    
    // Se tem apenas vírgula, substitui por ponto (formato brasileiro)
    if (cleanStr.includes(',') && !cleanStr.includes('.')) {
      cleanStr = cleanStr.replace(',', '.');
    }
    
    return parseFloat(cleanStr) || 0;
  };

  // Formata o número para exibição quando não está focado
  const formatNumber = (num: number): string => {
    if (num === 0) return "";
    
    const isPercentage = suffix.includes('%');
    
    if (isPercentage) {
      return num.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    
    return num.toLocaleString('pt-BR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    });
  };
  
  // Atualiza o valor exibido quando o valor prop muda e o campo não está focado
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumber(value));
    }
  }, [value, isFocused]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Permite digitação livre enquanto focado
    setDisplayValue(inputValue);
    
    // Parse e notifica mudança
    const numericValue = parseNumber(inputValue);
    onChange(numericValue);
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    // Quando focar, mostra o valor sem formatação para facilitar edição
    if (value > 0) {
      setDisplayValue(value.toString().replace('.', ','));
    } else {
      setDisplayValue("");
    }
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    // Quando sair do foco, formata o valor
    const numericValue = parseNumber(displayValue);
    if (numericValue > 0) {
      setDisplayValue(formatNumber(numericValue));
    } else {
      setDisplayValue("");
    }
    // Garante que o valor final seja passado corretamente
    onChange(numericValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite navegação e teclas especiais
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 
                        'Home', 'End', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    
    if (allowedKeys.includes(e.key)) return;
    
    // Permite Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey || e.metaKey) return;
    
    // Permite números
    if (e.key >= '0' && e.key <= '9') return;
    
    // Permite vírgula e ponto como separador decimal
    if (e.key === ',' || e.key === '.') return;
    
    // Permite sinal de menos no início
    if (e.key === '-' && e.currentTarget.selectionStart === 0) return;
    
    // Bloqueia outras teclas
    e.preventDefault();
  };

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none z-10">
          {prefix}
        </span>
      )}
      <Input
        id={id}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={cn(
          "bg-background border-input",
          prefix && "pl-12",
          suffix && "pr-12",
          className
        )}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none z-10">
          {suffix}
        </span>
      )}
    </div>
  );
};