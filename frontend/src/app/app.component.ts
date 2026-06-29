import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNavComponent } from './components/side-nav/side-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SideNavComponent],
  template: `
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
export class AppComponent {}
