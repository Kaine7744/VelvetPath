import { Injectable, signal, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ThemeId = 'p3' | 'p4' | 'p5';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  stars: string;
  cssVars: Record<string, string>;
  animationClass: string;
}

const THEMES: Record<ThemeId, ThemeConfig> = {
  p5: {
    id: 'p5',
    name: 'Persona 5',
    stars: '★',
    animationClass: 'hover-glitch',
    cssVars: {
      '--color-primary': '#e8001a',
      '--color-accent': '#8b0011',
      '--color-glow': 'rgba(232,0,26,0.5)',
      '--color-bg': '#0a0a0a',
      '--color-surface': '#111111',
      '--color-card': '#111111',
      '--color-border': '#2a2a2a',
      '--color-text': '#f0f0f0',
      '--color-text-dim': '#444444',
      '--color-success': '#76ff03',
      '--font-display': "'Bebas Neue', Impact, sans-serif",
      '--font-body': "'Noto Sans', sans-serif",
      '--text-angle': '-8deg',
      '--text-transform': 'uppercase',
      '--corner-radius': '0px',
      '--card-border-width': '3px',
      '--card-border-style': 'solid',
      '--glow-spread': '8px',
      '--glass-blur': '0px',
      '--animation-style': 'glitch',
    },
  },
  p4: {
    id: 'p4',
    name: 'Persona 4',
    stars: '★',
    animationClass: 'hover-bounce',
    cssVars: {
      '--color-primary': '#f7d000',
      '--color-accent': '#ffb300',
      '--color-glow': 'rgba(255,202,40,0.45)',
      '--color-bg': '#0c0c0c',
      '--color-surface': '#181818',
      '--color-card': '#202020',
      '--color-border': '#2e2e2e',
      '--color-text': '#fffde7',
      '--color-text-dim': 'rgba(255,253,231,0.45)',
      '--color-success': '#76ff03',
      '--font-display': "'Fredoka One', cursive",
      '--font-body': "'Noto Sans', sans-serif",
      '--text-angle': '0deg',
      '--text-transform': 'none',
      '--corner-radius': '6px',
      '--card-border-width': '1px',
      '--card-border-style': 'inset',
      '--glow-spread': '12px',
      '--glass-blur': '0px',
      '--animation-style': 'elastic',
    },
  },
  p3: {
    id: 'p3',
    name: 'Persona 3',
    stars: '★',
    animationClass: 'card-wave-float',
    cssVars: {
      '--color-primary': '#3949ab',
      '--color-accent': '#1a237e',
      '--color-glow': 'rgba(57,73,171,0.35)',
      '--color-bg': '#0d1520',
      '--color-surface': 'rgba(21,37,60,0.7)',
      '--color-card': 'rgba(30,50,80,0.55)',
      '--color-border': 'rgba(100,150,200,0.18)',
      '--color-text': '#e0e8f0',
      '--color-text-dim': 'rgba(224,232,240,0.45)',
      '--color-success': '#4dd0e1',
      '--font-display': "'Cinzel', serif",
      '--font-body': "'Noto Sans', sans-serif",
      '--text-angle': '0deg',
      '--text-transform': 'uppercase',
      '--corner-radius': '2px',
      '--card-border-width': '1px',
      '--card-border-style': 'solid',
      '--glow-spread': '25px',
      '--glass-blur': '12px',
      '--animation-style': 'wave',
    },
  },
};

const THEME_ORDER: ThemeId[] = ['p5', 'p4', 'p3'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private http = inject(HttpClient);

  currentTheme = signal<ThemeId>(this.loadTheme());

  constructor() {
    // Sync theme from backend on init (localStorage as fast fallback)
    this.http.get<Record<string, string>>('/api/settings').subscribe({
      next: settings => {
        const backendTheme = settings['theme'] as ThemeId | undefined;
        if (backendTheme && backendTheme in THEMES) {
          this.currentTheme.set(backendTheme);
          localStorage.setItem('velvetpath-theme', backendTheme);
        }
        this.applyTheme(this.currentTheme());
      },
      error: () => {
        // Backend unavailable — fall back to localStorage
        this.applyTheme(this.currentTheme());
      }
    });

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

  setTheme(themeId: ThemeId) {
    this.currentTheme.set(themeId);
    localStorage.setItem('velvetpath-theme', themeId);
    // Persist to backend
    this.http.put('/api/settings', { key: 'theme', value: themeId }).subscribe({
      error: err => console.error('Failed to persist theme to backend:', err)
    });
  }

  getConfig(id: ThemeId): ThemeConfig {
    return THEMES[id];
  }

  getCurrentConfig(): ThemeConfig {
    return THEMES[this.currentTheme()];
  }

  getAllConfigs(): ThemeConfig[] {
    return THEME_ORDER.map(id => THEMES[id]);
  }
}
