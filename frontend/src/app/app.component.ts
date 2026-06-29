import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SideNavComponent } from './components/side-nav/side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent],
  template: `
    @if (transitionClass()) {
      <div [class]="'transition-overlay ' + transitionClass()"></div>
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
  transitionClass = signal('');

  constructor() {
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
  }
}
