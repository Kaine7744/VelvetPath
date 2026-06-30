import { Component, Input, computed, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatGrowthData {
  dates: string[];
  stats: {
    [statId: string]: {
      name: string;
      values: number[];
    };
  };
}

interface StatLine {
  id: string;
  name: string;
  values: number[];
}

@Component({
  selector: 'app-stat-growth-chart',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="growth-chart" [class.empty]="!hasData()">
      @if (!hasData()) {
        <div class="empty-state">No growth data for this period</div>
      } @else {
        <svg class="chart-svg" [attr.viewBox]="'0 0 ' + width + ' ' + height" preserveAspectRatio="xMidYMid meet">
          <!-- Grid lines -->
          @for (y of gridLines(); track y) {
            <line
              class="grid-line"
              [attr.x1]="paddingL"
              [attr.x2]="width - paddingR"
              [attr.y1]="y"
              [attr.y2]="y"
            />
          }

          <!-- Area fills -->
          @for (stat of statLines(); track stat.id; let i = $index) {
            <polygon
              class="area-fill"
              [attr.points]="getAreaPoints(buildPoints(stat.values))"
              [style.fill]="statColors[i % statColors.length]"
              [style.fill-opacity]="0.08"
            />
          }

          <!-- Polylines -->
          @for (stat of statLines(); track stat.id; let i = $index) {
            <polyline
              class="stat-line"
              [attr.points]="getPolylinePoints(buildPoints(stat.values))"
              [style.stroke]="statColors[i % statColors.length]"
            />
          }

          <!-- X-axis labels -->
          @for (label of xLabels(); track label.date) {
            <text
              class="axis-label"
              [attr.x]="label.x"
              [attr.y]="height - 4"
              text-anchor="middle">{{ label.short }}</text>
          }

          <!-- Y-axis labels -->
          @for (label of yLabels(); track label.value) {
            <text
              class="axis-label y-label"
              [attr.x]="paddingL - 6"
              [attr.y]="label.y + 4"
              text-anchor="end">{{ label.value }}</text>
          }
        </svg>

        <!-- Legend -->
        <div class="legend">
          @for (stat of statLines(); track stat.id; let i = $index) {
            <div class="legend-item">
              <span class="legend-dot" [style.background]="statColors[i % statColors.length]"></span>
              <span class="legend-name">{{ stat.name }}</span>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .growth-chart {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .growth-chart.empty {
      min-height: 120px;
      align-items: center;
      justify-content: center;
    }
    .empty-state {
      font-family: var(--font-display);
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      color: var(--color-text);
      opacity: 0.4;
      text-transform: uppercase;
    }
    .chart-svg {
      width: 100%;
      height: auto;
      overflow: visible;
    }
    .grid-line {
      stroke: color-mix(in srgb, var(--color-primary) 10%, transparent);
      stroke-width: 1;
    }
    .stat-line {
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter: drop-shadow(0 0 4px currentColor);
    }
    .area-fill {
      stroke: none;
    }
    .axis-label {
      font-family: var(--font-display);
      font-size: 8px;
      fill: var(--color-text);
      opacity: 0.5;
      letter-spacing: 0.05em;
    }
    .y-label { font-size: 7px; }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem 1rem;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .legend-name {
      font-family: var(--font-display);
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--color-text);
      text-transform: uppercase;
      opacity: 0.8;
    }
  `]
})
export class StatGrowthChartComponent {
  @Input() set dataInput(v: StatGrowthData | null) { this._data.set(v); }

  private _data = signal<StatGrowthData | null>(null);
  protected readonly width = 480;
  protected readonly height = 160;
  protected readonly paddingL = 36;
  protected readonly paddingR = 12;
  private readonly paddingT = 12;
  private readonly paddingB = 20;

  protected readonly statColors = [
    'var(--color-primary)',
    '#f97316',
    '#22c55e',
    '#a855f7',
    '#3b82f6',
  ];

  constructor() {
    // Precompute points cache when data changes
    effect(() => {
      this._pointsCache = new Map();
      const d = this._data();
      if (!d) return;
      for (const stat of this.statLines()) {
        this._pointsCache.set(stat.id, stat.values.map((v, i) => ({
          x: this.getX(i, d.dates.length),
          y: this.getY(v),
        })));
      }
    });
  }

  private _pointsCache = new Map<string, { x: number; y: number }[]>();

  hasData = computed(() => {
    const d = this._data();
    return !!(d?.dates?.length && Object.keys(d.stats ?? {}).length > 0);
  });

  statLines = computed<StatLine[]>(() => {
    const data = this._data();
    if (!data) return [];
    return Object.entries(data.stats)
      .filter(([, s]) => s.values?.length > 0)
      .map(([id, s]) => ({ id, name: s.name, values: s.values }));
  });

  private get chartWidth() { return this.width - this.paddingL - this.paddingR; }
  private get chartHeight() { return this.height - this.paddingT - this.paddingB; }

  private get maxValue(): number {
    let max = 0;
    for (const stat of this.statLines()) {
      for (const v of stat.values) {
        if (v > max) max = v;
      }
    }
    return max || 100;
  }

  private getY(val: number): number {
    return this.paddingT + this.chartHeight - (val / this.maxValue) * this.chartHeight;
  }

  private getX(i: number, n: number): number {
    return this.paddingL + (i / Math.max(n - 1, 1)) * this.chartWidth;
  }

  buildPoints(values: number[]): { x: number; y: number }[] {
    return values.map((v, i) => {
      const d = this._data();
      return { x: this.getX(i, d?.dates?.length ?? 1), y: this.getY(v) };
    });
  }

  getPolylinePoints(pts: { x: number; y: number }[]): string {
    return pts.map(p => `${p.x},${p.y}`).join(' ');
  }

  getAreaPoints(pts: { x: number; y: number }[]): string {
    if (!pts.length) return '';
    const bottom = this.height - this.paddingB;
    const line = pts.map(p => `${p.x},${p.y}`).join(' ');
    return `${pts[0].x},${bottom} ${line} ${pts[pts.length - 1].x},${bottom}`;
  }

  gridLines = computed(() => {
    const lines: number[] = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      lines.push(this.getY((this.maxValue / steps) * i));
    }
    return lines;
  });

  yLabels = computed(() => {
    const labels: { value: number; y: number }[] = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const val = Math.round((this.maxValue / steps) * i);
      labels.push({ value: val, y: this.getY(val) });
    }
    return labels;
  });

  xLabels = computed(() => {
    const dates = this._data()?.dates ?? [];
    const n = dates.length;
    if (!n) return [];
    const step = Math.max(1, Math.floor(n / 5));
    const labels: { date: string; short: string; x: number }[] = [];
    for (let i = 0; i < n; i += step) {
      const d = new Date(dates[i] + 'T00:00:00');
      labels.push({
        date: dates[i],
        short: d.toLocaleDateString('en', { month: 'numeric', day: 'numeric' }),
        x: this.getX(i, n),
      });
    }
    return labels;
  });
}
