import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ 
  className = ''
}: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        theme === 'dark' 
          ? 'bg-primary' 
          : 'bg-gray-200 dark:bg-gray-700'
      } ${className}`}
      title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
    >
      {/* Slider circle */}
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      
      {/* Sun icon (left side - light mode) */}
      <Sun 
        className={`absolute left-1 h-3 w-3 transition-opacity duration-200 ${
          theme === 'light' ? 'opacity-60 text-gray-600' : 'opacity-30 text-gray-400'
        }`}
      />
      
      {/* Moon icon (right side - dark mode) */}
      <Moon 
        className={`absolute right-1 h-3 w-3 transition-opacity duration-200 ${
          theme === 'dark' ? 'opacity-90 text-white' : 'opacity-30 text-gray-400'
        }`}
      />
      
      <span className="sr-only">
        {theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
      </span>
    </button>
  );
};

export default ThemeToggle;