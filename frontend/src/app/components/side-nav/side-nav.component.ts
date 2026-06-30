import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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

        <a class="nav-item" routerLink="/summary" routerLinkActive="active" title="Summary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <span class="nav-label">SUMMARY</span>
        </a>

        <a class="nav-item" routerLink="/tasks" routerLinkActive="active" title="Tasks">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <span class="nav-label">TASKS</span>
        </a>

        <a class="nav-item" routerLink="/skills" routerLinkActive="active" title="Skills">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span class="nav-label">SKILLS</span>
        </a>

        <a class="nav-item" routerLink="/templates" routerLinkActive="active" title="Recurring Tasks">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span class="nav-label">RECURRING</span>
        </a>

        <a class="nav-item" routerLink="/stats" routerLinkActive="active" title="Statistics">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          <span class="nav-label">STATS</span>
        </a>
        <a class="nav-item" routerLink="/settings" routerLinkActive="active" title="Settings">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span class="nav-label">CONFIG</span>
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
      padding: 6px 0;
    }
    .logo {
      font-family: var(--font-display);
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--color-primary);
      letter-spacing: 0.3em;
      text-transform: uppercase;
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
  `]
})
export class SideNavComponent {
}
