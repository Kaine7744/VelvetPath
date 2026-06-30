import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatService, PeriodStats } from '../../services/stat.service';

type Period = 'day' | 'week' | 'month' | 'year';

interface PopularTasks {
  mostUsed: { taskId: string; taskName: string; count: number }[];
  leastUsed: { taskId: string; taskName: string; count: number }[];
}

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [CommonModule],
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

      <!-- Popular Tasks -->
      <div class="popular-tasks-card">
        <div class="popular-header">
          <div class="popular-col-label">MOST COMPLETED THIS {{ activePeriod().toUpperCase() }}</div>
          <div class="popular-col-label right">LEAST COMPLETED</div>
        </div>
        <div class="popular-body">
          <div class="popular-col">
            @if (popularTasks()?.mostUsed?.length) {
              @for (item of popularTasks()!.mostUsed; track item.taskId) {
                <div class="popular-row">
                  <span class="popular-name">{{ item.taskName }}</span>
                  <span class="popular-count">{{ item.count }}×</span>
                </div>
              }
            } @else {
              <div class="popular-empty">—</div>
            }
          </div>
          <div class="popular-divider"></div>
          <div class="popular-col right">
            @if (popularTasks()?.leastUsed?.length) {
              @for (item of popularTasks()!.leastUsed; track item.taskId) {
                <div class="popular-row">
                  <span class="popular-name">{{ item.taskName }}</span>
                  <span class="popular-count">{{ item.count }}×</span>
                </div>
              }
            } @else {
              <div class="popular-empty">—</div>
            }
          </div>
        </div>
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
    /* Popular Tasks */
    .popular-tasks-card {
      background: var(--color-card);
      border: 1px solid var(--color-border);
      padding: 1.5rem;
    }
    .popular-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
    }
    .popular-col-label {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: var(--color-text-dim);
      text-transform: uppercase;
    }
    .popular-col-label.right {
      text-align: right;
    }
    .popular-body {
      display: flex;
      gap: 0;
    }
    .popular-col {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .popular-col.right {
      text-align: right;
    }
    .popular-divider {
      width: 1px;
      background: color-mix(in srgb, var(--color-primary) 20%, transparent);
      margin: 0 1.5rem;
    }
    .popular-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .popular-col.right .popular-row {
      flex-direction: row-reverse;
    }
    .popular-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      color: var(--color-text);
      text-transform: uppercase;
    }
    .popular-count {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 0.9rem;
      color: var(--color-primary);
      text-shadow: 0 0 10px var(--color-glow);
      min-width: 32px;
    }
    .popular-col.right .popular-count {
      text-align: left;
    }
    .popular-empty {
      font-family: var(--font-display);
      font-size: 0.8rem;
      color: var(--color-text-dim);
      opacity: 0.4;
    }
  `]
})
export class StatsPageComponent implements OnInit {
  private statService = inject(StatService);
  stats = signal<any[]>([]);
  periodStats = signal<PeriodStats | null>(null);
  popularTasks = signal<PopularTasks | null>(null);
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
    this.loadPopularTasks(period);
  }

  private loadPeriodStats(period: Period) {
    this.statService.getStatistics(period).subscribe(stats => this.periodStats.set(stats));
  }

  private loadPopularTasks(period: Period) {
    this.statService.getPopularTasks(period).subscribe({
      next: result => this.popularTasks.set(result),
      error: err => console.error('Failed to load popular tasks:', err)
    });
  }
}
