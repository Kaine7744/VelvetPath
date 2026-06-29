import { Component, OnChanges, OnDestroy, ElementRef, ViewChild, AfterViewInit, input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, RadialLinearScale, ChartDataset, RadarController, PointElement, LineElement } from 'chart.js';
import { Skill } from '../../models';

Chart.register(RadialLinearScale, RadarController, PointElement, LineElement);

@Component({
  selector: 'app-spider-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-wrapper">
      <canvas #chartCanvas></canvas>
      @if (maxTier() > 1) {
        <div class="tier-badge">
          <span class="tier-star">★</span>
          <span class="tier-num">×{{ maxTier() }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .chart-wrapper {
      position: relative;
      width: 100%;
      max-width: 360px;
      margin: 0 auto;
    }
    canvas {
      width: 100% !important;
      aspect-ratio: 1 !important;
    }
    .tier-badge {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-bg);
      border: 2px solid var(--color-primary);
      border-radius: 50%;
      width: 64px;
      height: 64px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px var(--color-glow);
      pointer-events: none;
    }
    .tier-star {
      font-size: 1.2rem;
      color: var(--color-primary);
    }
    .tier-num {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 1.4rem;
      color: var(--color-text);
      line-height: 1;
    }
  `]
})
export class SpiderChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  skills = input<Skill[]>([]);

  private chart: Chart | null = null;
  private initialized = false;

  ngAfterViewInit() {
    this.initialized = true;
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['skills'] && this.initialized) {
      if (this.chart) {
        this.updateChart();
      } else {
        this.createChart();
      }
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  maxTier(): number {
    const values = this.skills().map(s => s.currentValue);
    if (!values.length) return 1;
    const max = Math.max(...values);
    return Math.max(1, Math.floor(max / 100) + 1);
  }

  private getThemeVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || 'sans-serif';
  }

  private getThemePrimary(): string {
    return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#e8001a';
  }

  private getSkillValue(skill: Skill): number {
    return Math.min(100, skill.currentValue % 100 || (skill.currentValue > 0 ? 100 : 0));
  }

  private createChart() {
    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const skills = this.skills();
    const labels = this.getOrderedLabels();
    const data = this.getOrderedData(skills);

    const themePrimary = this.getThemePrimary();
    const gradient = ctx.createRadialGradient(150, 150, 0, 150, 150, 150);
    gradient.addColorStop(0, themePrimary + '80');
    gradient.addColorStop(1, themePrimary + '0d');

    const dataset: ChartDataset<'radar'> = {
      data,
      backgroundColor: gradient,
      borderColor: themePrimary,
      borderWidth: 2,
      pointBackgroundColor: this.getOrderedColors(),
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 8,
    };

    this.chart = new Chart(ctx, {
      type: 'radar',
      data: { labels, datasets: [dataset] },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0,
            max: 100,
            beginAtZero: true,
            angleLines: { color: 'rgba(255,255,255,0.08)' },
            grid: { color: 'rgba(255,255,255,0.08)' },
            pointLabels: {
              color: 'rgba(255,255,255,0.9)',
              font: { family: this.getThemeVar('--font-body'), size: 11, weight: 700 },
            },
            ticks: { display: false },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,15,20,0.95)',
            titleFont: { family: this.getThemeVar('--font-display'), size: 13, weight: 700 },
            bodyFont: { family: this.getThemeVar('--font-body'), size: 12 },
            borderColor: this.getThemePrimary(),
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (ctx) => {
                const skill = skills[ctx.dataIndex];
                const tier = Math.floor(skill.currentValue / 100) + 1;
                return ` ${skill.currentValue} / ${tier * 100}`;
              },
            },
          },
        },
        animation: { duration: 800, easing: 'easeOutQuart' },
      },
    });
  }

  private updateChart() {
    if (!this.chart) return;
    const skills = this.skills();
    this.chart.data.labels = this.getOrderedLabels();
    this.chart.data.datasets[0].data = this.getOrderedData(skills);
    (this.chart.data.datasets[0] as ChartDataset<'radar'>).pointBackgroundColor = this.getOrderedColors();
    this.chart.update();
  }

  private getOrderedLabels(): string[] {
    const order = ['guts', 'courage', 'academics', 'kindness', 'proficiency'];
    const names: Record<string, string> = {
      guts: 'GUTS', courage: 'COURAGE', academics: 'ACADEMICS',
      kindness: 'KINDNESS', proficiency: 'PROFICIENCY',
    };
    return order.map(id => names[id]);
  }

  private getOrderedData(skills: Skill[]): number[] {
    const order = ['guts', 'courage', 'academics', 'kindness', 'proficiency'];
    const map = Object.fromEntries(skills.map(s => [s.id, s]));
    return order.map(id => map[id] ? this.getSkillValue(map[id]) : 0);
  }

  private getOrderedColors(): string[] {
    const order = ['guts', 'courage', 'academics', 'kindness', 'proficiency'];
    const colors: Record<string, string> = {
      guts: '#e65100', courage: '#f9a825', academics: '#1565c0',
      kindness: '#c2185b', proficiency: '#2e7d32',
    };
    return order.map(id => colors[id]);
  }
}
