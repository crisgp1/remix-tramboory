// Theme initialization script that should run as early as possible
export function initializeTheme() {
  if (typeof window === 'undefined') return;

  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
  const theme = savedTheme || 'system';
  
  const html = document.documentElement;
  html.classList.remove('light', 'dark');
  
  if (theme === 'system') {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.classList.add(systemPrefersDark ? 'dark' : 'light');
  } else {
    html.classList.add(theme);
  }
}

// Call immediately if in browser
if (typeof window !== 'undefined') {
  initializeTheme();
}