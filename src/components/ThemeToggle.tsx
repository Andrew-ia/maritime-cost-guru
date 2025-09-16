import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  className?: string;
}

export const ThemeToggle = ({ 
  size = 'default', 
  variant = 'outline',
  className = ''
}: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`transition-all duration-200 ${className}`}
      title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
      <span className="sr-only">
        {theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      </span>
    </Button>
  );
};

export default ThemeToggle;