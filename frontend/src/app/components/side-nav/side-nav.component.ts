import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </a>
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
    }
    .nav-item {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.4);
      text-decoration: none;
      border-left: 3px solid transparent;
      transition: all 0.2s ease;
      position: relative;
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
  `]
})
export class SideNavComponent {}
