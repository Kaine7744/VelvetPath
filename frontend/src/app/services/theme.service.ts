import { Injectable, signal, effect } from '@angular/core';

export type ThemeId = 'p3' | 'p4' | 'p5';

interface ThemeConfig {
  id: ThemeId;
  name: string;
  color: string;
  cssVars: Record<string, string>;
}

const THEMES: Record<ThemeId, ThemeConfig> = {
  p3: {
    id: 'p3',
    name: 'P3',
    color: '#1a237e',
    cssVars: {
      '--color-primary': '#1a237e',
      '--color-accent': '#3949ab',
      '--color-glow': 'rgba(26,35,126,0.5)',
      '--color-bg': '#0d1b2a',
      '--color-surface': '#152238',
      '--color-card': '#1d2d44',
      '--color-border': '#2a3a5a',
    },
  },
  p4: {
    id: 'p4',
    name: 'P4',
    color: '#ffca28',
    cssVars: {
      '--color-primary': '#ffca28',
      '--color-accent': '#ffb300',
      '--color-glow': 'rgba(255,202,40,0.4)',
      '--color-bg': '#121212',
      '--color-surface': '#1e1e1e',
      '--color-card': '#2a2a2a',
      '--color-border': '#3a3a3a',
    },
  },
  p5: {
    id: 'p5',
    name: 'P5',
    color: '#e91e63',
    cssVars: {
      '--color-primary': '#e91e63',
      '--color-accent': '#ff1744',
      '--color-glow': 'rgba(233,30,99,0.5)',
      '--color-bg': '#0a0a0f',
      '--color-surface': '#1a1a24',
      '--color-card': '#252532',
      '--color-border': '#3a3a4a',
    },
  },
};

const THEME_ORDER: ThemeId[] = ['p5', 'p4', 'p3'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  currentTheme = signal<ThemeId>(this.loadTheme());

  constructor() {
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  private loadTheme(): ThemeId {
    const saved = localStorage.getItem('velvetpath-theme');
    if (saved && saved in THEMES) return saved as ThemeId;
    return 'p5';
  }

  private applyTheme(themeId: ThemeId) {
    const theme = THEMES[themeId];
    const root = document.documentElement;
    for (const [key, value] of Object.entries(theme.cssVars)) {
      root.style.setProperty(key, value);
    }
    root.setAttribute('data-theme', themeId);
    localStorage.setItem('velvetpath-theme', themeId);
  }

  cycleTheme() {
    const current = this.currentTheme();
    const idx = THEME_ORDER.indexOf(current);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    this.currentTheme.set(next);
  }

  getThemeConfig(id: ThemeId): ThemeConfig {
    return THEMES[id];
  }

  getAllThemes(): ThemeConfig[] {
    return THEME_ORDER.map(id => THEMES[id]);
  }
}
