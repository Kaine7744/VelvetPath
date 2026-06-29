import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="side-nav">
      <div class="logo">VP</div>
      <div class="nav-items">
        <a class="nav-item" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" title="Day Planner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </a>
        <a class="nav-item" routerLink="/stats" routerLinkActive="active" title="Stats">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </a>
      </div>
      <div class="nav-bottom">
        <button class="theme-btn" (click)="cycleTheme()" [title]="'Theme: ' + themeService.currentTheme().toUpperCase()">
          <span class="theme-dot" [style.background]="getThemeColor()"></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .side-nav {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: 60px;
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 0;
      z-index: 50;
    }
    .logo {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 1.1rem;
      color: var(--color-primary);
      letter-spacing: 0.05em;
      margin-bottom: 2rem;
      text-shadow: 0 0 20px var(--color-glow);
    }
    .nav-items {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      align-items: center;
      flex: 1;
    }
    .nav-item {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.35);
      text-decoration: none;
      border-left: 3px solid transparent;
      transition: all 0.2s ease;
    }
    .nav-item:hover {
      color: rgba(255,255,255,0.8);
    }
    .nav-item.active {
      color: var(--color-primary);
      border-left-color: var(--color-primary);
      box-shadow: inset 0 0 20px var(--color-glow);
    }
    .nav-item svg {
      width: 22px;
      height: 22px;
    }
    .nav-bottom {
      margin-top: auto;
    }
    .theme-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-card);
      border: 2px solid var(--color-border);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .theme-btn:hover {
      border-color: var(--color-primary);
      box-shadow: 0 0 15px var(--color-glow);
    }
    .theme-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      transition: background 0.3s ease;
    }
  `]
})
export class SideNavComponent {
  themeService = inject(ThemeService);

  cycleTheme() {
    this.themeService.cycleTheme();
  }

  getThemeColor(): string {
    return this.themeService.getThemeConfig(this.themeService.currentTheme()).color;
  }
}
