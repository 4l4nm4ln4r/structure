import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'dark' | 'light' | 'system';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('dashboard-theme', 'system');

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (themeName: 'dark' | 'light') => {
      root.classList.remove('light', 'dark');
      root.classList.add(themeName);
    };

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      applyTheme(systemTheme);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  return { theme, setTheme };
}