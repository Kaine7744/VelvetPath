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

  private getThemeVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || 'sans-serif';
  }

  private getThemePrimary(): string {
    return getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#e8001a';
  }

  private getSkillValue(skill: Skill): number {
    return skill.currentValue % 100;
  }

  private createChart() {
    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const skills = this.skills();
    const labels = this.getOrderedLabels();
    const data = this.getOrderedData();

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

    const self = this;
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
                const label = self.chart?.data.labels?.[ctx.dataIndex] ?? '';
                const skill = self.skills()[ctx.dataIndex];
                const tier = Math.floor(skill.currentValue / 100) + 1;
                return ` ${label}: ${skill.currentValue} / ${tier * 100}`;
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
    this.chart.data.datasets[0].data = this.getOrderedData();
    (this.chart.data.datasets[0] as ChartDataset<'radar'>).pointBackgroundColor = this.getOrderedColors();
    this.chart.update();
  }

  private getOrderedLabels(): string[] {
    const superscripts: Record<number, string> = { 1: '²', 2: '³', 3: '⁴', 4: '⁵', 5: '⁶' };
    return this.skills().map(s => {
      const tier = Math.floor(s.currentValue / 100) + 1;
      const sup = superscripts[tier] ?? String(tier);
      return s.name.toUpperCase() + sup;
    });
  }

  private getOrderedData(): number[] {
    return this.skills().map(s => this.getSkillValue(s));
  }

  private getOrderedColors(): string[] {
    const palette = ['#e8001a', '#ffd700', '#3949ab', '#76ff03', '#00b4c8', '#ff6f00', '#8e24aa', '#00897b'];
    return this.skills().map((_, i) => palette[i % palette.length]);
  }
}
