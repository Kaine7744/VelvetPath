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
      '--color-bg': '#050508',
      '--color-surface': '#0a0a0f',
      '--color-card': '#111111',
      '--color-border': '#2a1a1a',
      '--color-text': '#f0f0f0',
      '--color-text-dim': 'rgba(240,240,240,0.45)',
      '--color-success': '#76ff03',
      '--color-danger': '#ff1744',
      '--color-warning': '#ff9100',
      '--font-display': "'Bebas Neue', Impact, sans-serif",
      '--font-body': "'Arial Black', sans-serif",
      '--font-display-scale': '1.2',
      '--text-angle': '-8deg',
      '--text-transform': 'uppercase',
      '--corner-radius': '0px',
      '--card-border-width': '3px',
      '--card-border-style': 'solid',
      '--glow-spread': '8px',
      '--glass-blur': '0px',
      '--animation-style': 'glitch',
      '--card-shadow': '5px 5px 0 #e8001a',
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
      '--color-glow': 'rgba(247,208,0,0.45)',
      '--color-bg': '#1a1a1a',
      '--color-surface': '#222222',
      '--color-card': '#2c2c2c',
      '--color-border': '#f7d000',
      '--color-text': '#ffffff',
      '--color-text-dim': 'rgba(255,255,255,0.5)',
      '--color-success': '#76ff03',
      '--color-danger': '#e03030',
      '--color-warning': '#ffb300',
      '--font-display': "'Arial Black', 'Franklin Gothic Heavy', sans-serif",
      '--font-body': "'Arial', sans-serif",
      '--font-display-scale': '0.9',
      '--text-angle': '0deg',
      '--text-transform': 'uppercase',
      '--corner-radius': '4px',
      '--card-border-width': '5px',
      '--card-border-style': 'solid',
      '--glow-spread': '12px',
      '--glass-blur': '0px',
      '--animation-style': 'elastic',
      '--card-shadow': 'inset 0 0 40px rgba(0,0,0,0.6), 0 0 20px rgba(247,208,0,0.2)',
    },
  },
  p3: {
    id: 'p3',
    name: 'Persona 3',
    stars: '★',
    animationClass: 'card-wave-float',
    cssVars: {
      '--color-primary': '#00b4c8',
      '--color-accent': '#008fa8',
      '--color-glow': 'rgba(0,180,200,0.4)',
      '--color-bg': '#0a0e1a',
      '--color-surface': 'rgba(13,27,62,0.85)',
      '--color-card': 'rgba(13,27,62,0.7)',
      '--color-border': 'rgba(0,180,200,0.25)',
      '--color-text': '#c8e8f0',
      '--color-text-dim': 'rgba(200,232,240,0.5)',
      '--color-success': '#4dd0e1',
      '--color-danger': '#ef5350',
      '--color-warning': '#ffa726',
      '--font-display': "'Cinzel', serif",
      '--font-body': "'Share Tech Mono', 'Courier New', monospace",
      '--font-display-scale': '1.0',
      '--text-angle': '0deg',
      '--text-transform': 'uppercase',
      '--corner-radius': '2px',
      '--card-border-width': '1px',
      '--card-border-style': 'solid',
      '--glow-spread': '25px',
      '--glass-blur': '12px',
      '--animation-style': 'wave',
      '--card-shadow': '0 8px 32px rgba(0,0,0,0.5)',
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
