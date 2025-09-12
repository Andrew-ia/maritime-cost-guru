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
  placeholder = "0.00", 
  prefix = "", 
  suffix = "",
  className 
}: InputMonetarioProps) => {
  
  const formatarValor = (val: number) => {
    if (val === 0) return "";
    return val.toString();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/[^0-9.,]/g, '');
    
    // Substitui vírgula por ponto para parsing
    inputValue = inputValue.replace(',', '.');
    
    // Limita a 2 casas decimais se não for porcentagem
    if (!suffix.includes('%') && inputValue.includes('.')) {
      const parts = inputValue.split('.');
      if (parts[1] && parts[1].length > 2) {
        inputValue = parts[0] + '.' + parts[1].substring(0, 2);
      }
    }
    
    const numeroValue = inputValue === '' ? 0 : parseFloat(inputValue) || 0;
    onChange(numeroValue);
  };

  const displayValue = value === 0 ? "" : value.toString();

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