import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SideNavComponent } from './components/side-nav/side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent],
  template: `
    @if (showFlash()) {
      <div class="p5-flash-overlay"></div>
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
  `]
})
export class AppComponent {
  private router = inject(Router);
  showFlash = signal(false);

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart)
    ).subscribe(() => {
      if (document.documentElement.getAttribute('data-theme') === 'p5') {
        this.showFlash.set(true);
        setTimeout(() => this.showFlash.set(false), 300);
      }
    });
  }
}
