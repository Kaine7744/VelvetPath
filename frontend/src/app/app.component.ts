import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="app-container">
      <header>
        <h1>VelvetPath</h1>
      </header>
      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      padding: 1rem 2rem;
      background: var(--color-surface);
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    header h1 {
      font-size: 1.5rem;
      color: var(--color-primary);
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    main {
      flex: 1;
    }
  `]
})
export class AppComponent {}
