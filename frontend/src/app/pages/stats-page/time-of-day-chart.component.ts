import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BySlot {
  morning: { rate: number; total: number; completed: number };
  afternoon: { rate: number; total: number; completed: number };
  evening: { rate: number; total: number; completed: number };
}

interface SlotRow {
  icon: string;
  label: string;
  key: keyof BySlot;
}

@Component({
  selector: 'app-time-of-day-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tod-chart">
      @for (row of rows; track row.key) {
        <div class="tod-row">
          <div class="tod-label">
            <span class="tod-icon">{{ row.icon }}</span>
            <span class="tod-name">{{ row.label }}</span>
          </div>
          <div class="tod-bar-track">
            <div
              class="tod-bar-fill"
              [style.width.%]="bySlot ? bySlot[row.key].rate : 0"
            ></div>
          </div>
          <div class="tod-pct">{{ bySlot ? bySlot[row.key].rate : 0 }}%</div>
        </div>
      }
    </div>
  `,
  styles: [`
    .tod-chart {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      width: 100%;
    }
    .tod-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .tod-label {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      width: 80px;
      flex-shrink: 0;
    }
    .tod-icon {
      font-size: 0.85rem;
      line-height: 1;
    }
    .tod-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.6rem;
      letter-spacing: 0.1em;
      color: var(--color-text);
      opacity: 0.7;
      text-transform: uppercase;
    }
    .tod-bar-track {
      flex: 1;
      height: 8px;
      background: color-mix(in srgb, var(--color-primary) 12%, transparent);
      border-radius: 2px;
      overflow: hidden;
    }
    .tod-bar-fill {
      height: 100%;
      background: var(--color-primary);
      border-radius: 2px;
      box-shadow: 0 0 6px var(--color-glow);
      transition: width 0.6s ease-out;
    }
    .tod-pct {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 0.7rem;
      color: var(--color-primary);
      width: 30px;
      text-align: right;
      flex-shrink: 0;
    }
  `]
})
export class TimeOfDayChartComponent {
  @Input() bySlot: BySlot | null = null;

  readonly rows: SlotRow[] = [
    { icon: '☀', label: 'Morning', key: 'morning' },
    { icon: '🌤', label: 'Afternoon', key: 'afternoon' },
    { icon: '🌙', label: 'Evening', key: 'evening' },
  ];
}
