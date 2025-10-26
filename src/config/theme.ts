// config/theme.ts - Configuration centralisée du thème

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  spacing: {
    small: string;
    medium: string;
    large: string;
  };
}

export const defaultTheme: ThemeConfig = {
  mode: 'auto',
  colors: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    accent: 'var(--accent-primary)',
    background: 'var(--bg-primary)',
    text: 'var(--text-primary)',
  },
  transitions: {
    fast: 'var(--transition-fast)',
    normal: 'var(--transition-normal)',
    slow: 'var(--transition-slow)',
  },
  spacing: {
    small: 'var(--spacing-2)',
    medium: 'var(--spacing-4)',
    large: 'var(--spacing-6)',
  },
};

// Fonction utilitaire pour appliquer un thème
export function applyTheme(theme: ThemeMode): void {
  const html = document.documentElement;

  if (theme === 'auto') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Supprimer les classes existantes
  html.classList.remove('light', 'dark');

  // Appliquer le nouveau thème
  html.classList.add(theme);

  // Sauvegarder la préférence
  localStorage.setItem('theme', theme);
}

// Fonction pour obtenir le thème actuel
export function getCurrentTheme(): ThemeMode {
  const saved = localStorage.getItem('theme') as ThemeMode;
  return saved || 'auto';
}

// Fonction pour basculer entre les thèmes
export function toggleTheme(): void {
  const current = getCurrentTheme();
  const newTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}