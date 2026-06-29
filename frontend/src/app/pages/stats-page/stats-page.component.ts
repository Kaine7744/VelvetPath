import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatService } from '../../services/stat.service';
import { Stat } from '../../models';
import { SpiderChartComponent } from '../../components/spider-chart/spider-chart.component';

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [CommonModule, SpiderChartComponent],
  template: `
    <div class="stats-page">
      <div class="page-title">STATS</div>

      <div class="chart-container">
        <app-spider-chart [stats]="stats()" />
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
    }
    .page-title {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 2.5rem;
      color: var(--color-primary);
      letter-spacing: 0.15em;
      text-shadow: 0 0 40px var(--color-glow);
      margin-bottom: 2rem;
    }
    .chart-container {
      background: var(--color-card);
      border: 1px solid var(--color-border);
      padding: 2.5rem;
      margin-bottom: 2rem;
      position: relative;
    }
    .chart-container::before {
      content: '';
      position: absolute;
      inset: -1px;
      border: 1px solid var(--color-primary);
      opacity: 0.25;
      pointer-events: none;
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
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      color: #fff;
      text-transform: uppercase;
      margin-bottom: 0.4rem;
    }
    .stat-bar-track {
      height: 6px;
      background: rgba(255,255,255,0.08);
      overflow: hidden;
    }
    .stat-bar-fill {
      height: 100%;
      transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
      box-shadow: 0 0 8px currentColor;
    }
    .stat-tier {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 1.2rem;
      color: var(--color-primary);
      text-shadow: 0 0 20px var(--color-glow);
      width: 48px;
      text-align: center;
      flex-shrink: 0;
    }
    .stat-value {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 1.5rem;
      color: #fff;
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

  ngOnInit() {
    this.statService.getStats().subscribe(stats => this.stats.set(stats));
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
    const inner = value % 100;
    return inner === 0 && value > 0 ? 100 : inner;
  }
}
