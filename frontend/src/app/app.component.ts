import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="app-container">
      <header>
        <h1>VelvetPath</h1>
      </header>
      <main>
        <p>Welcome to VelvetPath</p>
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
      border-bottom: 1px solid var(--color-border);
    }
    header h1 {
      font-size: 1.5rem;
      color: var(--color-primary);
    }
    main {
      flex: 1;
      padding: 2rem;
    }
  `]
})
export class AppComponent {}
