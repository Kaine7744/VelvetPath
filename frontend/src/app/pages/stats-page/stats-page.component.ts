import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatService } from '../../services/stat.service';
import { Stat } from '../../models';

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="stats-page">
      <header class="stats-header">
        <a class="back-link" routerLink="/">← Day Planner</a>
        <h1>Stats</h1>
      </header>

      <div class="stats-grid">
        @for (stat of stats(); track stat.id) {
          <div class="stat-card" [attr.data-stat]="stat.id">
            <div class="stat-icon">{{ getStatIcon(stat.id) }}</div>
            <div class="stat-info">
              <div class="stat-name">{{ stat.name }}</div>
              <div class="stat-description">{{ stat.description }}</div>
            </div>
            <div class="stat-value">
              <span class="value-number">{{ stat.currentValue }}</span>
              <div class="stat-bar">
                <div class="stat-bar-fill" [style.width.%]="getBarWidth(stat.currentValue)"></div>
              </div>
              <span class="stat-max">/ 100</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .stats-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    .stats-header {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .back-link {
      color: rgba(255,255,255,0.5);
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.15s;
    }
    .back-link:hover {
      color: #e91e63;
    }
    .stats-header h1 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #fff;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1rem;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    .stat-card:hover {
      border-color: var(--stat-color, rgba(233,30,99,0.5));
      box-shadow: 0 0 20px var(--stat-glow, rgba(233,30,99,0.2));
    }
    .stat-icon {
      font-size: 2rem;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.05);
      border-radius: 8px;
      flex-shrink: 0;
    }
    .stat-info {
      flex: 1;
    }
    .stat-name {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-description {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.5);
      margin-top: 0.2rem;
    }
    .stat-value {
      text-align: right;
      min-width: 100px;
    }
    .value-number {
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
    }
    .stat-bar {
      height: 6px;
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
      margin: 0.5rem 0;
      overflow: hidden;
    }
    .stat-bar-fill {
      height: 100%;
      background: var(--stat-color, #e91e63);
      border-radius: 3px;
      transition: width 0.5s ease-out;
      box-shadow: 0 0 10px var(--stat-glow, rgba(233,30,99,0.5));
    }
    .stat-max {
      font-size: 0.75rem;
      color: rgba(255,255,255,0.3);
    }
    /* Stat-specific colors */
    .stat-card[data-stat="academics"] { --stat-color: #1565c0; --stat-glow: rgba(21,101,192,0.5); }
    .stat-card[data-stat="proficiency"] { --stat-color: #2e7d32; --stat-glow: rgba(46,125,50,0.5); }
    .stat-card[data-stat="kindness"] { --stat-color: #c2185b; --stat-glow: rgba(194,24,91,0.5); }
    .stat-card[data-stat="guts"] { --stat-color: #e65100; --stat-glow: rgba(230,81,0,0.5); }
    .stat-card[data-stat="courage"] { --stat-color: #f9a825; --stat-glow: rgba(249,168,37,0.5); }
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

  getBarWidth(value: number): number {
    return Math.min(100, Math.max(0, value));
  }
}
