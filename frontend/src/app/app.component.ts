import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationStart } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { StatService, TierUpEvent } from './services/stat.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent],
  template: `
    @if (transitionClass()) {
      <div [class]="'transition-overlay ' + transitionClass()"></div>
    }

    @if (tierUpEvent()) {
      <div class="tier-up-overlay" [attr.data-theme]="themeService.currentTheme()">
        <div class="tier-up-content">
          <div class="tier-up-stars">★ ★ ★</div>
          <div class="tier-up-label">TIER UP</div>
          <div class="tier-up-stat">{{ tierUpEvent()!.statName }}</div>
          <div class="tier-up-numbers">{{ tierUpEvent()!.oldTier }} → {{ tierUpEvent()!.newTier }}</div>
        </div>
      </div>
    }

    <app-side-nav />
    <main class="main-content">
      <router-outlet />
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      min-height: 100vh;
    }
    .main-content {
      margin-left: 60px;
      flex: 1;
      min-height: 100vh;
    }

    /* Tier-up overlay */
    .tier-up-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      animation: tier-up-appear 1.5s ease-out forwards;
    }
    .tier-up-overlay[data-theme="p5"] { background: rgba(200, 16, 16, 0.85); }
    .tier-up-overlay[data-theme="p4"] { background: rgba(255, 215, 0, 0.85); }
    .tier-up-overlay[data-theme="p3"] { background: rgba(20, 60, 80, 0.88); }

    .tier-up-content {
      text-align: center;
      color: #fff;
    }
    .tier-up-stars {
      font-size: 3rem;
      animation: tier-up-bounce 0.4s ease-out;
      margin-bottom: 0.5rem;
    }
    .tier-up-label {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 3.5rem;
      letter-spacing: 0.15em;
      text-shadow: 0 0 40px rgba(255,255,255,0.8);
      animation: tier-up-scale 0.4s ease-out;
    }
    .tier-up-stat {
      font-family: var(--font-display);
      font-size: 1.5rem;
      letter-spacing: 0.2em;
      margin-top: 0.5rem;
      opacity: 0.9;
    }
    .tier-up-numbers {
      font-family: var(--font-display);
      font-size: 1.2rem;
      letter-spacing: 0.15em;
      margin-top: 0.25rem;
      opacity: 0.75;
    }

    @keyframes tier-up-appear {
      0%   { opacity: 0; }
      10%  { opacity: 1; }
      70%  { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes tier-up-bounce {
      0%   { transform: scale(0.5); opacity: 0; }
      50%  { transform: scale(1.2); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes tier-up-scale {
      0%   { transform: scale(0.8); }
      50%  { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private statService = inject(StatService);
  themeService = inject(ThemeService);

  transitionClass = signal('');
  tierUpEvent = signal<TierUpEvent | null>(null);

  private tierUpSub?: Subscription;
  private swipeHandler = (e: WheelEvent) => {
    // Disable macOS Safari two-finger swipe-back/forward gesture
    // Safari uses ctrlKey + deltaX for the gesture
    if (e.ctrlKey && Math.abs(e.deltaX) > 0) {
      e.preventDefault();
    }
  };

  ngOnInit() {
    window.addEventListener('wheel', this.swipeHandler, { passive: false });

    this.router.events.pipe(
      filter(e => e instanceof NavigationStart)
    ).subscribe(() => {
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'p5') {
        this.transitionClass.set('p5-transition-overlay');
      } else if (theme === 'p4') {
        this.transitionClass.set('p4-transition-overlay');
      } else {
        this.transitionClass.set('p3-transition-overlay');
      }
      setTimeout(() => this.transitionClass.set(''), 500);
    });

    // Tier-up overlay: subscribe globally so it fires from any page
    this.tierUpSub = this.statService.tierUp$.subscribe(event => {
      this.tierUpEvent.set(event);
      setTimeout(() => this.tierUpEvent.set(null), 1500);
    });
  }

  ngOnDestroy() {
    this.tierUpSub?.unsubscribe();
    window.removeEventListener('wheel', this.swipeHandler);
  }
}
