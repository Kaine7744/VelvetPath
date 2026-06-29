import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatService } from '../../services/stat.service';
import { Stat } from '../../models';
import { SpiderChartComponent } from '../../components/spider-chart/spider-chart.component';

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [CommonModule, RouterLink, SpiderChartComponent],
  template: `
    <div class="stats-page">
      <header class="page-header">
        <h1>STATS</h1>
      </header>

      <div class="stats-content">
        <div class="chart-section">
          <app-spider-chart [stats]="stats()" />
        </div>

        <div class="stats-list">
          @for (stat of stats(); track stat.id) {
            <div class="stat-row" [attr.data-stat]="stat.id">
              <div class="stat-icon-sm">{{ getStatIcon(stat.id) }}</div>
              <div class="stat-name">{{ stat.name }}</div>
              <div class="stat-bar-wrapper">
                <div class="stat-bar-bg">
                  <div class="stat-bar-fill" [style.width.%]="getInnerValue(stat.currentValue)" [style.background]="getStatColor(stat.id)"></div>
                </div>
              </div>
              <div class="stat-tier">★×{{ getTier(stat.currentValue) }}</div>
              <div class="stat-value">{{ stat.currentValue }}</div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-page {
      min-height: 100vh;
      padding: 2rem;
      background: var(--color-bg);
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .page-header h1 {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 2rem;
      color: var(--color-primary);
      letter-spacing: 0.1em;
      text-shadow: 0 0 30px var(--color-glow);
    }
    .stats-content {
      max-width: 900px;
      margin: 0 auto;
    }
    .chart-section {
      margin-bottom: 3rem;
      padding: 2rem;
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      position: relative;
    }
    .chart-section::before {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 4px;
      border: 1px solid var(--color-primary);
      opacity: 0.3;
      pointer-events: none;
    }
    .stats-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .stat-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    .stat-row:hover {
      border-color: var(--stat-color);
      box-shadow: 0 0 15px var(--stat-glow);
    }
    .stat-icon-sm {
      font-size: 1.5rem;
      width: 32px;
      text-align: center;
    }
    .stat-name {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      color: #fff;
      width: 120px;
      text-transform: uppercase;
    }
    .stat-bar-wrapper {
      flex: 1;
    }
    .stat-bar-bg {
      height: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      overflow: hidden;
    }
    .stat-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease-out;
      box-shadow: 0 0 10px currentColor;
    }
    .stat-tier {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 1.1rem;
      color: var(--color-primary);
      text-shadow: 0 0 15px var(--color-glow);
      width: 40px;
      text-align: center;
    }
    .stat-value {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 1.4rem;
      color: #fff;
      width: 50px;
      text-align: right;
    }
    /* Stat colors */
    .stat-row[data-stat="academics"] { --stat-color: #1565c0; --stat-glow: rgba(21,101,192,0.4); }
    .stat-row[data-stat="proficiency"] { --stat-color: #2e7d32; --stat-glow: rgba(46,125,50,0.4); }
    .stat-row[data-stat="kindness"] { --stat-color: #c2185b; --stat-glow: rgba(194,24,91,0.4); }
    .stat-row[data-stat="guts"] { --stat-color: #e65100; --stat-glow: rgba(230,81,0,0.4); }
    .stat-row[data-stat="courage"] { --stat-color: #f9a825; --stat-glow: rgba(249,168,37,0.4); }
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
      academics: '📚',
      proficiency: '🔧',
      kindness: '💗',
      guts: '⚔️',
      courage: '💪',
    };
    return icons[statId] || '⭐';
  }

  getStatColor(statId: string): string {
    const colors: Record<string, string> = {
      academics: '#1565c0',
      proficiency: '#2e7d32',
      kindness: '#c2185b',
      guts: '#e65100',
      courage: '#f9a825',
    };
    return colors[statId] || '#e91e63';
  }

  getTier(value: number): number {
    return Math.floor(value / 100) + 1;
  }

  getInnerValue(value: number): number {
    return value % 100;
  }
}
