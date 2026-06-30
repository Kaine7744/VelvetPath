import { Component, Input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-completion-ring',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ring-wrapper">
      <svg class="ring-svg" viewBox="0 0 120 120" aria-label="Completion rate">
        <!-- Background track -->
        <circle
          class="ring-track"
          cx="60" cy="60" r="48"
          fill="none"
          stroke-width="10"
        />
        <!-- Filled arc -->
        <circle
          class="ring-fill"
          cx="60" cy="60" r="48"
          fill="none"
          stroke-width="10"
          stroke-linecap="round"
          [style.stroke-dasharray]="circumference"
          [style.stroke-dashoffset]="dashOffset()"
        />
      </svg>
      <div class="ring-center">
        <div class="ring-pct">{{ rate() }}</div>
        <div class="ring-pct-sign">%</div>
        <div class="ring-slots">{{ completed() }}/{{ total() }} SLOTS</div>
      </div>
    </div>
  `,
  styles: [`
    .ring-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
      flex-shrink: 0;
    }
    .ring-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
    .ring-track {
      stroke: color-mix(in srgb, var(--color-primary) 15%, transparent);
    }
    .ring-fill {
      stroke: var(--color-primary);
      filter: drop-shadow(0 0 6px var(--color-glow));
      transition: stroke-dashoffset 0.8s ease-out;
    }
    .ring-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
    .ring-pct {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 1.75rem;
      color: var(--color-primary);
      text-shadow: 0 0 20px var(--color-glow);
    }
    .ring-pct-sign {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.75rem;
      color: var(--color-primary);
      opacity: 0.7;
      margin-top: -2px;
    }
    .ring-slots {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.5rem;
      letter-spacing: 0.1em;
      color: var(--color-text);
      opacity: 0.5;
      text-transform: uppercase;
      margin-top: 2px;
    }
  `]
})
export class CompletionRingComponent {
  // Writable signals for inputs
  private _rate = signal(0);
  private _completed = signal(0);
  private _total = signal(0);

  // Public readonly signals
  rate = this._rate.asReadonly();
  completed = this._completed.asReadonly();
  total = this._total.asReadonly();

  // Derived
  readonly circumference = 2 * Math.PI * 48; // ≈ 301.59
  dashOffset = computed(() => this.circumference * (1 - this._rate() / 100));

  @Input() set rateInput(v: number) { this._rate.set(v ?? 0); }
  @Input() set completedInput(v: number) { this._completed.set(v ?? 0); }
  @Input() set totalInput(v: number) { this._total.set(v ?? 0); }
}
