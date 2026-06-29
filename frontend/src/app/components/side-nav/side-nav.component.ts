import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="side-nav">
      <div class="logo-wrap">
        <div class="logo">VP</div>
      </div>

      <div class="nav-items">
        <a class="nav-item" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" title="Day Planner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span class="nav-label">DAY</span>
        </a>

        <a class="nav-item" routerLink="/skills" routerLinkActive="active" title="Skills">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span class="nav-label">SKILLS</span>
        </a>

        <a class="nav-item" routerLink="/settings" routerLinkActive="active" title="Settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span class="nav-label">CONFIG</span>
        </a>
      </div>

      <div class="nav-bottom">
        <button class="theme-cycle" (click)="cycleTheme()" [title]="'Theme: ' + themeService.currentTheme().toUpperCase()">
          <span class="theme-dot"></span>
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
      background: var(--color-bg);
      border-right: 2px solid var(--color-primary);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 0;
      z-index: 50;
    }
    .logo-wrap {
      margin-bottom: 2rem;
      padding: 4px 0;
    }
    .logo {
      font-family: var(--font-display);
      font-size: 1.1rem;
      color: var(--color-primary);
      letter-spacing: 0.15em;
      text-shadow: 0 0 20px var(--color-glow);
    }
    .nav-items {
      display: flex;
      flex-direction: column;
      gap: 2px;
      width: 100%;
      align-items: center;
      flex: 1;
    }
    .nav-item {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      padding: 10px 0;
      color: var(--color-text-dim);
      border-left: 3px solid transparent;
      border-bottom: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
      transition: background 0.05s, border-color 0.05s, color 0.05s;
      cursor: pointer;
      text-decoration: none;
    }
    .nav-item svg {
      width: 18px;
      height: 18px;
    }
    .nav-label {
      font-family: var(--font-display);
      font-size: 0.55rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
    .nav-item:hover {
      background: color-mix(in srgb, var(--color-primary) 15%, transparent);
      color: var(--color-text);
      border-left-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
    }
    .nav-item.active {
      background: var(--color-primary);
      border-left: 4px solid var(--color-accent);
      color: #fff;
    }
    .nav-item.active svg {
      filter: drop-shadow(0 0 6px var(--color-glow));
    }
    .nav-item.active .nav-label {
      color: var(--color-accent);
    }
    .nav-bottom {
      margin-top: auto;
      padding-top: 1rem;
    }
    .theme-cycle {
      width: 36px;
      height: 36px;
      background: var(--color-surface);
      border: 2px solid var(--color-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.05s, box-shadow 0.05s;
      box-shadow: 2px 2px 0 var(--color-primary);
    }
    .theme-cycle:hover {
      background: var(--color-primary);
      box-shadow: 3px 3px 0 var(--color-accent);
    }
    .theme-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--color-primary);
      box-shadow: 0 0 8px var(--color-glow);
    }
    .theme-cycle:hover .theme-dot {
      background: var(--color-accent);
      box-shadow: 0 0 10px var(--color-glow);
    }
  `]
})
export class SideNavComponent {
  themeService = inject(ThemeService);

  cycleTheme() {
    this.themeService.cycleTheme();
  }
}
