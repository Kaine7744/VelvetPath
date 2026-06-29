import { Component, OnInit, OnChanges, ElementRef, ViewChild, AfterViewInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, RadialLinearScale, ChartDataset } from 'chart.js';
import { Stat } from '../../models';

Chart.register(RadialLinearScale);

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
      max-width: 400px;
      margin: 0 auto;
    }
    canvas {
      width: 100% !important;
      height: auto !important;
    }
    .tier-badge {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-card);
      border: 2px solid var(--color-primary);
      border-radius: 50%;
      width: 64px;
      height: 64px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 30px var(--color-glow);
      pointer-events: none;
    }
    .tier-star {
      font-size: 1.2rem;
      color: var(--color-primary);
    }
    .tier-num {
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 1.4rem;
      color: #fff;
      line-height: 1;
    }
  `]
})
export class SpiderChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  stats = input<Stat[]>([]);

  private chart: Chart | null = null;

  ngAfterViewInit() {
    this.createChart();
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  maxTier(): number {
    const values = this.stats().map(s => s.currentValue);
    if (values.length === 0) return 1;
    const max = Math.max(...values);
    return Math.max(1, Math.floor(max / 100) + 1);
  }

  private getStatValue(stat: Stat): number {
    return stat.currentValue % 100;
  }

  private createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const stats = this.stats();
    const labels = this.getOrderedLabels();
    const data = this.getOrderedData(stats);
    const colors = this.getOrderedColors();

    const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
    gradient.addColorStop(0, 'rgba(233,30,99,0.4)');
    gradient.addColorStop(1, 'rgba(233,30,99,0.05)');

    const dataset: ChartDataset<'radar'> = {
      label: 'Stats',
      data,
      backgroundColor: gradient,
      borderColor: '#e91e63',
      borderWidth: 2,
      pointBackgroundColor: colors,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    };

    this.chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [dataset],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0,
            max: 100,
            beginAtZero: true,
            angleLines: {
              color: 'rgba(255,255,255,0.1)',
            },
            grid: {
              color: 'rgba(255,255,255,0.1)',
            },
            pointLabels: {
              color: 'rgba(255,255,255,0.8)',
              font: {
                family: "'Montserrat', sans-serif",
                size: 12,
                weight: 600,
              },
            },
            ticks: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(30,30,30,0.95)',
            titleFont: {
              family: "'Montserrat', sans-serif",
              size: 14,
              weight: 700,
            },
            bodyFont: {
              family: "'Noto Sans', sans-serif",
              size: 12,
            },
            borderColor: '#e91e63',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (ctx) => {
                const stat = stats[ctx.dataIndex];
                const tier = Math.floor(stat.currentValue / 100) + 1;
                return ` ${stat.currentValue} / ${tier * 100}`;
              },
            },
          },
        },
        animation: {
          duration: 800,
          easing: 'easeOutQuart',
        },
      },
    });
  }

  private updateChart() {
    if (!this.chart) return;
    const stats = this.stats();
    this.chart.data.labels = this.getOrderedLabels();
    this.chart.data.datasets[0].data = this.getOrderedData(stats);
    this.chart.update();
  }

  private getOrderedLabels(): string[] {
    const order = ['guts', 'courage', 'academics', 'kindness', 'proficiency'];
    const names: Record<string, string> = {
      guts: 'GUTS',
      courage: 'COURAGE',
      academics: 'ACADEMICS',
      kindness: 'KINDNESS',
      proficiency: 'PROFICIENCY',
    };
    return order.map(id => names[id]);
  }

  private getOrderedData(stats: Stat[]): number[] {
    const order = ['guts', 'courage', 'academics', 'kindness', 'proficiency'];
    const map = Object.fromEntries(stats.map(s => [s.id, s]));
    return order.map(id => map[id] ? this.getStatValue(map[id]) : 0);
  }

  private getOrderedColors(): string[] {
    const order = ['guts', 'courage', 'academics', 'kindness', 'proficiency'];
    const colors: Record<string, string> = {
      guts: '#e65100',
      courage: '#f9a825',
      academics: '#1565c0',
      kindness: '#c2185b',
      proficiency: '#2e7d32',
    };
    return order.map(id => colors[id]);
  }
}
