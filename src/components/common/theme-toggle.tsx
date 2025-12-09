import { useThemeStore } from '@/store';
import { Moon, Sun } from 'lucide-react';
import { type FC } from 'react';

const ThemeToggle: FC = () => {
  const { isDark, theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="
         top-6 right-6
        w-10 h-10
        rounded-full
        flex items-center justify-center
        transition-all
        active:scale-95
        cursor-pointer
      "
    >
      {isDark ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
