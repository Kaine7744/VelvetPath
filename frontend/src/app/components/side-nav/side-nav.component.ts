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
      background: #0a0a0a;
      border-right: 2px solid #e8001a;
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
      font-family: 'Impact', sans-serif;
      font-size: 1.1rem;
      color: #e8001a;
      letter-spacing: 0.15em;
      text-shadow: 0 0 20px rgba(232,0,26,0.6);
      transform: skewX(-8deg);
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
      color: rgba(240,240,240,0.4);
      border-left: 3px solid transparent;
      border-bottom: 1px solid rgba(232,0,26,0.1);
      transition: background 0.05s, border-color 0.05s, color 0.05s;
      cursor: pointer;
      text-decoration: none;
    }
    .nav-item svg {
      width: 18px;
      height: 18px;
    }
    .nav-label {
      font-family: 'Impact', sans-serif;
      font-size: 0.55rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
    .nav-item:hover {
      background: rgba(232,0,26,0.15);
      color: rgba(240,240,240,0.8);
      border-left-color: rgba(232,0,26,0.4);
    }
    .nav-item.active {
      background: #e8001a;
      border-left: 4px solid #ffd700;
      border-left-color: #ffd700;
      color: #fff;
    }
    .nav-item.active svg {
      filter: drop-shadow(0 0 6px rgba(255,215,0,0.8));
    }
    .nav-item.active .nav-label {
      color: #ffd700;
    }
    .nav-bottom {
      margin-top: auto;
      padding-top: 1rem;
    }
    .theme-cycle {
      width: 36px;
      height: 36px;
      background: #111;
      border: 2px solid #e8001a;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.05s, box-shadow 0.05s;
      box-shadow: 2px 2px 0 #e8001a;
    }
    .theme-cycle:hover {
      background: #e8001a;
      box-shadow: 3px 3px 0 #ffd700;
    }
    .theme-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #e8001a;
      box-shadow: 0 0 8px rgba(232,0,26,0.6);
    }
    .theme-cycle:hover .theme-dot {
      background: #ffd700;
      box-shadow: 0 0 10px rgba(255,215,0,0.8);
    }
  `]
})
export class SideNavComponent {
  themeService = inject(ThemeService);

  cycleTheme() {
    this.themeService.cycleTheme();
  }
}
