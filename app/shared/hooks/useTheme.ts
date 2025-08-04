import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize from localStorage if available, otherwise default to system
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    
    console.log('Applying theme:', newTheme); // Debug log
    
    const html = document.documentElement;
    
    // Remove existing theme classes
    html.classList.remove('light', 'dark');
    
    if (newTheme === 'system') {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const actualTheme = systemPrefersDark ? 'dark' : 'light';
      console.log('System theme detected:', actualTheme);
      html.classList.add(actualTheme);
    } else {
      console.log('Adding class:', newTheme);
      html.classList.add(newTheme);
    }
    
    console.log('HTML classes after apply:', html.classList.toString());
  };

  const updateTheme = (newTheme: Theme) => {
    console.log('Updating theme to:', newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    // Apply theme on mount
    console.log('Initial theme application:', theme);
    applyTheme(theme);
  }, []);

  useEffect(() => {
    // Listen for system theme changes when using system theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const getSystemPreference = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  return {
    theme,
    setTheme: updateTheme,
    isLight: theme === 'light' || (theme === 'system' && !getSystemPreference()),
    isDark: theme === 'dark' || (theme === 'system' && getSystemPreference()),
  };
}