import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatService, PeriodStats } from '../../services/stat.service';
import { Stat } from '../../models';
import { SpiderChartComponent } from '../../components/spider-chart/spider-chart.component';

type Period = 'day' | 'week' | 'month' | 'year';

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [CommonModule, SpiderChartComponent],
  template: `
    <div class="stats-page">
      <div class="page-title">STATS</div>

      <div class="period-tabs">
        @for (p of periods; track p) {
          <button
            class="period-tab"
            [class.active]="activePeriod() === p"
            (click)="setPeriod(p)">
            {{ p.toUpperCase() }}
          </button>
        }
      </div>

      <div class="summary-row">
        <div class="summary-card completion-card">
          <div class="summary-label">COMPLETION RATE</div>
          <div class="summary-value primary">{{ periodStats()?.completionRate ?? 0 }}%</div>
          <div class="summary-sub">{{ periodStats()?.completedSlots ?? 0 }}/{{ periodStats()?.totalSlots ?? 0 }} SLOTS</div>
          <div class="slot-breakdown">
            <span class="slot-pill morning">☀ {{ periodStats()?.bySlot?.morning?.rate ?? 0 }}%</span>
            <span class="slot-pill afternoon">🌤 {{ periodStats()?.bySlot?.afternoon?.rate ?? 0 }}%</span>
            <span class="slot-pill evening">🌙 {{ periodStats()?.bySlot?.evening?.rate ?? 0 }}%</span>
          </div>
        </div>

        <div class="summary-card streak-card">
          <div class="summary-label">CURRENT STREAK</div>
          <div class="summary-value streak">{{ periodStats()?.streakDays ?? 0 }}</div>
          <div class="summary-sub">🔥 DAY{{ (periodStats()?.streakDays ?? 0) === 1 ? '' : 'S' }}</div>
        </div>

        @if (activePeriod() === 'day' && todayGains().length > 0) {
          <div class="summary-card gains-card">
            <div class="summary-label">TODAY'S GAINS</div>
            @for (gain of todayGains(); track gain.statId) {
              <div class="gain-row">
                <span class="gain-name">{{ gain.statName }}</span>
                <span class="gain-value">+{{ gain.gain }}</span>
              </div>
            }
          </div>
        }
      </div>

      <div class="chart-container">
        <app-spider-chart [skills]="stats()" />
      </div>

      <div class="stats-grid">
        @for (stat of stats(); track stat.id) {
          <div class="stat-card" [attr.data-stat]="stat.id">
            <div class="stat-icon">{{ getStatIcon(stat.id) }}</div>
            <div class="stat-info">
              <div class="stat-name">{{ stat.name }}</div>
              <div class="stat-bar-track">
                <div class="stat-bar-fill" [style.width.%]="getInnerValue(stat.currentValue)" [style.background]="getStatColor(stat.id)"></div>
              </div>
            </div>
            <div class="stat-tier">★×{{ getTier(stat.currentValue) }}</div>
            <div class="stat-value">{{ stat.currentValue }}</div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .stats-page {
      min-height: 100vh;
      padding: 2rem;
      position: relative;
    }
    .page-title {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 2.5rem;
      color: var(--color-primary);
      letter-spacing: 0.15em;
      text-shadow: 0 0 40px var(--color-glow);
      margin-bottom: 2rem;
      transform: rotate(var(--text-angle));
      display: inline-block;
      text-transform: var(--text-transform);
    }
    .period-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .period-tab {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      padding: 0.5rem 1.25rem;
      background: var(--color-card);
      border: 1px solid var(--color-border);
      color: var(--color-text);
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
    }
    .period-tab:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .period-tab.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-bg);
    }
    .summary-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .summary-card {
      background: var(--color-card);
      border: 1px solid var(--color-border);
      padding: 1.25rem 1.5rem;
      flex: 1;
      min-width: 160px;
    }
    .summary-label {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: var(--color-text);
      opacity: 0.6;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .summary-value {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 2.5rem;
      line-height: 1;
      margin-bottom: 0.25rem;
    }
    .summary-value.primary { color: var(--color-primary); text-shadow: 0 0 20px var(--color-glow); }
    .summary-value.streak { color: #f97316; text-shadow: 0 0 20px rgba(249,115,22,0.5); }
    .summary-sub {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      color: var(--color-text);
      opacity: 0.5;
      text-transform: uppercase;
    }
    .slot-breakdown {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
      flex-wrap: wrap;
    }
    .slot-pill {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.65rem;
      letter-spacing: 0.05em;
      padding: 0.2rem 0.5rem;
      background: color-mix(in srgb, var(--color-text) 8%, transparent);
      border-radius: 2px;
    }
    .gains-card { min-width: 180px; }
    .gain-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.2rem 0;
    }
    .gain-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      color: var(--color-text);
      text-transform: uppercase;
    }
    .gain-value {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 0.9rem;
      color: var(--color-primary);
      text-shadow: 0 0 10px var(--color-glow);
    }
    .chart-container {
      background: var(--color-card);
      border: var(--card-border-width) var(--card-border-style) var(--color-border);
      border-radius: var(--corner-radius);
      backdrop-filter: blur(var(--glass-blur));
      padding: 2.5rem;
      margin-bottom: 2rem;
      position: relative;
    }
    .chart-container::before {
      content: '';
      position: absolute;
      inset: -1px;
      border: 1px solid var(--color-primary);
      opacity: 0.2;
      pointer-events: none;
      border-radius: inherit;
    }
    .stats-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: var(--color-card);
      border: 1px solid var(--color-border);
      transition: all 0.2s ease;
    }
    .stat-card:hover {
      border-color: var(--stat-color);
      box-shadow: 0 0 20px var(--stat-glow);
    }
    .stat-icon {
      font-size: 1.6rem;
      width: 36px;
      text-align: center;
      flex-shrink: 0;
    }
    .stat-info {
      flex: 1;
      min-width: 0;
    }
    .stat-name {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      color: var(--color-text);
      text-transform: var(--text-transform);
      margin-bottom: 0.4rem;
    }
    .stat-bar-track {
      height: 6px;
      background: color-mix(in srgb, var(--color-text) 8%, transparent);
      overflow: hidden;
    }
    .stat-bar-fill {
      height: 100%;
      transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      box-shadow: 0 0 8px currentColor;
    }
    .stat-tier {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 1.2rem;
      color: var(--color-primary);
      text-shadow: 0 0 20px var(--color-glow);
      width: 48px;
      text-align: center;
      flex-shrink: 0;
    }
    .stat-value {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 1.5rem;
      color: var(--color-text);
      width: 52px;
      text-align: right;
      flex-shrink: 0;
    }
    /* Stat colors */
    .stat-card[data-stat="academics"] { --stat-color: #1565c0; --stat-glow: rgba(21,101,192,0.4); }
    .stat-card[data-stat="proficiency"] { --stat-color: #2e7d32; --stat-glow: rgba(46,125,50,0.4); }
    .stat-card[data-stat="kindness"] { --stat-color: #c2185b; --stat-glow: rgba(194,24,91,0.4); }
    .stat-card[data-stat="guts"] { --stat-color: #e65100; --stat-glow: rgba(230,81,0,0.4); }
    .stat-card[data-stat="courage"] { --stat-color: #f9a825; --stat-glow: rgba(249,168,37,0.4); }
  `]
})
export class StatsPageComponent implements OnInit {
  private statService = inject(StatService);
  stats = signal<Stat[]>([]);
  periodStats = signal<PeriodStats | null>(null);
  activePeriod = signal<Period>('week');
  periods: Period[] = ['day', 'week', 'month', 'year'];

  todayGains = computed(() => this.periodStats()?.todayGains ?? []);

  ngOnInit() {
    this.statService.getStats().subscribe(stats => this.stats.set(stats));
    this.loadPeriodStats('week');
  }

  setPeriod(period: Period) {
    this.activePeriod.set(period);
    this.loadPeriodStats(period);
  }

  private loadPeriodStats(period: Period) {
    this.statService.getStatistics(period).subscribe(stats => this.periodStats.set(stats));
  }

  getStatIcon(statId: string): string {
    const icons: Record<string, string> = {
      academics: '📚', proficiency: '🔧', kindness: '💗', guts: '⚔️', courage: '💪',
    };
    return icons[statId] || '⭐';
  }

  getStatColor(statId: string): string {
    const colors: Record<string, string> = {
      academics: '#1565c0', proficiency: '#2e7d32', kindness: '#c2185b', guts: '#e65100', courage: '#f9a825',
    };
    return colors[statId] || '#e91e63';
  }

  getTier(value: number): number {
    return Math.floor(value / 100) + 1;
  }

  getInnerValue(value: number): number {
    if (value === 0) return 0;
    const inner = value % 100;
    return inner === 0 ? 100 : inner;
  }
}
