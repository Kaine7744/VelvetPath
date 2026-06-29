import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService, ThemeId } from '../../services/theme.service';
import { isDevMode } from '@angular/core';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <div class="settings-page">
      <div class="page-title skew-heading">
        <div class="skew-heading-inner">SETTINGS</div>
      </div>

      <!-- Sub-nav -->
      <div class="settings-sub-nav">
        <a class="sub-nav-item" routerLink="/settings" routerLinkActive="active">Appearance</a>
        @if (devMode()) {
          <a class="sub-nav-item" routerLink="/settings/dev" routerLinkActive="active">Dev</a>
        }
      </div>

      <!-- Appearance section -->
      <div class="settings-section">
        <div class="section-label">— APPEARANCE —</div>
        <div class="theme-cards">
          @for (config of themeService.getAllConfigs(); track config.id) {
            <div
              class="theme-card"
              [class.active]="themeService.currentTheme() === config.id"
              [attr.data-theme-preview]="config.id"
              [style.--preview-primary]="config.cssVars['--color-primary']"
              [style.--preview-glow]="config.cssVars['--color-glow']"
              [style.--preview-card]="config.cssVars['--color-card']"
              [style.--preview-border]="config.cssVars['--color-border']"
              [style.--preview-text]="config.cssVars['--color-text']"
              (click)="selectTheme(config.id)"
            >
              <div class="theme-header">
                <span class="theme-stars">★</span>
                <span class="theme-name">{{ config.name }}</span>
                <span class="theme-stars">★</span>
              </div>
              <div class="mini-preview">
                <div class="mini-card" [style.--mini-accent]="config.cssVars['--color-primary']">
                  <div class="mini-label">MORNING</div>
                  <div class="mini-content">Study</div>
                  <div class="mini-stat">ACADEMICS +2</div>
                </div>
              </div>
              @if (themeService.currentTheme() === config.id) {
                <div class="active-badge">● ACTIVE</div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      padding: 20px;
      max-width: 600px;
    }
    .page-title {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 3rem;
      color: var(--color-primary);
      letter-spacing: 0.15em;
      text-shadow: 0 0 30px var(--color-glow);
      margin-bottom: 24px;
      transform: skewX(-8deg);
      display: inline-block;
    }
    .settings-sub-nav {
      display: flex;
      gap: 0;
      margin-bottom: 24px;
      border-left: 4px solid var(--color-primary);
    }
    .sub-nav-item {
      padding: 10px 20px;
      font-family: var(--font-display);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--color-text-dim);
      border: 2px solid var(--color-border);
      border-left: none;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.05s, color 0.05s;
    }
    .sub-nav-item:hover,
    .sub-nav-item.active {
      background: var(--color-primary);
      color: #fff;
      border-color: var(--color-primary);
    }
    .settings-section {
      margin-bottom: 24px;
    }
    .section-label {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--color-text-dim);
      margin-bottom: 12px;
    }
    .theme-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      max-width: 520px;
    }
    .theme-card {
      background: var(--color-surface);
      border: 2px solid var(--color-border);
      padding: 16px;
      cursor: pointer;
      transition: border-color 0.05s, box-shadow 0.05s;
      position: relative;
    }
    .theme-card:hover {
      border-color: var(--preview-primary, var(--color-primary));
      box-shadow: 3px 3px 0 var(--preview-primary, var(--color-primary));
    }
    .theme-card.active {
      border-color: var(--preview-primary, var(--color-primary));
      border-left-width: 4px;
      box-shadow: 4px 4px 0 var(--preview-primary, var(--color-primary));
    }
    .theme-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-bottom: 12px;
    }
    .theme-stars {
      font-size: 0.8rem;
      color: var(--preview-primary, var(--color-primary));
    }
    .theme-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.1em;
      color: var(--preview-text, var(--color-text));
    }
    .mini-preview {
      display: flex;
      justify-content: center;
    }
    .mini-card {
      width: 130px;
      background: var(--preview-card, var(--color-card));
      border: 2px solid var(--preview-border, var(--color-border));
      padding: 8px 12px;
      position: relative;
      overflow: hidden;
    }
    .mini-card::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: var(--mini-accent, var(--color-primary));
    }
    .mini-label {
      font-family: var(--font-display);
      font-size: 0.45rem;
      letter-spacing: 0.15em;
      color: var(--color-text-dim);
      margin-bottom: 4px;
    }
    .mini-content {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 0.9rem;
      color: var(--preview-text, var(--color-text));
      margin-bottom: 4px;
    }
    .mini-stat {
      font-size: 0.45rem;
      letter-spacing: 0.1em;
      color: var(--mini-accent, var(--color-primary));
      font-weight: 700;
    }
    .active-badge {
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--preview-primary, var(--color-primary));
      color: #fff;
      font-family: var(--font-display);
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      padding: 2px 10px;
      white-space: nowrap;
    }
  `]
})
export class SettingsPageComponent implements OnInit {
  themeService = inject(ThemeService);
  private router = inject(Router);

  devMode = signal(isDevMode());

  ngOnInit() {
  }

  selectTheme(id: ThemeId) {
    this.themeService.setTheme(id);
    this.router.navigate(['/']);
  }
}
