import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DayService } from '../../services/day.service';
import { TaskService } from '../../services/task.service';
import { TemplateService, RecurringTask } from '../../services/template.service';
import { SettingsService } from '../../services/settings.service';
import { Day, Task, SlotsPayload } from '../../models';
import { SlotCardComponent } from '../../components/slot-card/slot-card.component';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [CommonModule, DatePipe, SlotCardComponent],
  template: `
    <div class="day-view">
      <div class="page-header">
        <div class="title-wrap skew-outer">
          <h1 class="page-title">DAY PLANNER</h1>
        </div>
        <div class="drip-divider"></div>
      </div>

      <div class="day-nav">
        <button class="nav-btn" (click)="previousDay()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="date-display">
          <span class="day-range">{{ getDateRangeLabel() }}</span>
        </div>
        <button class="nav-btn" (click)="nextDay()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
        <button class="today-btn" (click)="goToToday()">TODAY</button>
      </div>

      <!-- Recurring Tasks for visible days -->
      @if (recurringForCenter().length > 0) {
        <div class="recurring-section">
          <div class="recurring-label">— RECURRING —</div>
          <div class="recurring-pills">
            @for (r of recurringForCenter(); track r.taskId + r.slot) {
              <div class="recurring-pill">
                <span class="recurring-pill-slot">{{ r.slot.toUpperCase() }}</span>
                <span class="recurring-pill-name">{{ r.taskName || '—' }}</span>
              </div>
            }
          </div>
        </div>
      }

      <div class="days-grid">
        @for (day of daysData(); track day.date) {
          <div class="day-column">
            <div class="day-header" [class.today]="isToday(day.date)">
              <span class="day-label">{{ day.date | date:'EEE' }}</span>
              <span class="day-num">{{ day.date | date:'d' }}</span>
            </div>
            <div class="slots-wrapper skew-outer">
              <div class="slots-inner">
                @if (morningEnabled()) {
                  <app-slot-card
                    [slot]="day.slots.morning"
                    slotName="Morning"
                    [tasks]="tasks()"
                    (taskSelected)="onSlotTaskSelected(day.date, 'morning', $event)"
                    (completed)="onSlotCompleted(day.date, 'morning', $event)"
                    (uncompleted)="onSlotUncompleted(day.date, 'morning', $event)"
                  />
                }
                <app-slot-card
                  [slot]="day.slots.afternoon"
                  slotName="Afternoon"
                  [tasks]="tasks()"
                  (taskSelected)="onSlotTaskSelected(day.date, 'afternoon', $event)"
                  (completed)="onSlotCompleted(day.date, 'afternoon', $event)"
                  (uncompleted)="onSlotUncompleted(day.date, 'afternoon', $event)"
                />
                @if (eveningEnabled()) {
                  <app-slot-card
                    [slot]="day.slots.evening"
                    slotName="Evening"
                    [tasks]="tasks()"
                    (taskSelected)="onSlotTaskSelected(day.date, 'evening', $event)"
                    (completed)="onSlotCompleted(day.date, 'evening', $event)"
                    (uncompleted)="onSlotUncompleted(day.date, 'evening', $event)"
                  />
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .day-view {
      min-height: 100vh;
      padding: 2rem;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .title-wrap {
      margin-bottom: 0.5rem;
    }
    .page-title {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: calc(3rem * var(--font-display-scale, 1));
      color: var(--color-primary);
      letter-spacing: 0.15em;
      text-shadow: 0 0 30px var(--color-glow);
      transform: skewX(8deg);
      display: inline-block;
      margin: 0;
    }
    .day-nav {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .nav-btn {
      width: 44px;
      height: 44px;
      background: var(--color-surface);
      border: 2px solid var(--color-border);
      color: var(--color-text);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.05s, color 0.05s, box-shadow 0.05s;
      flex-shrink: 0;
    }
    .nav-btn svg {
      width: 18px;
      height: 18px;
    }
    .nav-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      box-shadow: 3px 3px 0 var(--color-primary);
    }
    .date-display {
      flex: 1;
      text-align: center;
    }
    .day-range {
      display: block;
      font-size: calc(1.2rem * var(--font-display-scale, 1));
      font-family: var(--font-display);
      font-weight: 900;
      color: var(--color-text);
      letter-spacing: 0.08em;
    }
    .today-btn {
      padding: 10px 20px;
      background: transparent;
      border: 2px solid var(--color-border);
      color: var(--color-text);
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      cursor: pointer;
      transition: border-color 0.05s, color 0.05s, box-shadow 0.05s;
      flex-shrink: 0;
    }
    .today-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
      box-shadow: 3px 3px 0 var(--color-primary);
    }
    .days-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      border: var(--card-border-width) var(--card-border-style) var(--color-primary);
      padding: 1rem;
      background: var(--color-surface);
    }
    .day-column {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .day-header {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      padding: 0 0.5rem;
    }
    .day-header.today .day-label,
    .day-header.today .day-num {
      color: var(--color-primary);
    }
    .day-label {
      font-family: var(--font-display);
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--color-text-dim);
    }
    .day-num {
      font-family: var(--font-display);
      font-size: calc(1.2rem * var(--font-display-scale, 1));
      font-weight: 900;
      color: var(--color-text);
    }
    .slots-wrapper {
      transform: skewX(-8deg);
      overflow: visible;
    }
    .slots-inner {
      transform: skewX(8deg);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    /* Recurring section */
    .recurring-section {
      margin-bottom: 1.5rem;
      padding: 12px 16px;
      border: 1px dashed color-mix(in srgb, var(--color-primary) 40%, transparent);
      background: color-mix(in srgb, var(--color-card) 60%, transparent);
    }
    .recurring-label {
      font-family: var(--font-display);
      font-size: 0.55rem;
      letter-spacing: 0.2em;
      color: var(--color-text-dim);
      margin-bottom: 10px;
    }
    .recurring-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .recurring-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border: 1px solid color-mix(in srgb, var(--color-primary) 35%, transparent);
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
    }
    .recurring-pill-slot {
      font-family: var(--font-display);
      font-size: 0.5rem;
      letter-spacing: 0.1em;
      color: var(--color-primary);
    }
    .recurring-pill-name {
      font-family: var(--font-display);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text);
    }
  `]
})
export class DayViewComponent implements OnInit {
  private dayService = inject(DayService);
  private taskService = inject(TaskService);
  private templateService = inject(TemplateService);
  private settingsService = inject(SettingsService);

  centerDate = signal(new Date());
  daysData = signal<Day[]>([]);
  tasks = signal<Task[]>([]);
  recurringForCenter = signal<RecurringTask[]>([]);
  morningEnabled = signal(true);
  eveningEnabled = signal(true);

  private readonly WINDOW_SIZE = 3;

  constructor() {
    // Reload recurring tasks whenever the center date changes
    effect(() => {
      const date = this.centerDate();
      const dateStr = this.toDateString(date);
      this.templateService.getTemplatesForDate(dateStr).subscribe({
        next: r => this.recurringForCenter.set(r),
        error: err => console.error('Failed to load recurring tasks:', err)
      });
    });
  }

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => this.tasks.set(tasks));
    this.settingsService.getSettings().subscribe({
      next: settings => {
        this.morningEnabled.set(settings['morningEnabled'] !== 'false');
        this.eveningEnabled.set(settings['eveningEnabled'] !== 'false');
      }
    });
    this.loadDays();
  }

  private loadDays() {
    const center = this.centerDate();
    const start = this.offsetDate(center, -1);
    const end = this.offsetDate(center, 1);
    this.dayService.getDays(this.toDateString(start), this.toDateString(end))
      .subscribe(days => this.daysData.set(days));
  }

  private offsetDate(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  previousDay() {
    this.centerDate.set(this.offsetDate(this.centerDate(), -1));
    this.loadDays();
  }

  nextDay() {
    this.centerDate.set(this.offsetDate(this.centerDate(), 1));
    this.loadDays();
  }

  goToToday() {
    this.centerDate.set(new Date());
    this.loadDays();
  }

  isToday(dateStr: string): boolean {
    return dateStr === this.toDateString(new Date());
  }

  getDateRangeLabel(): string {
    const days = this.daysData();
    if (days.length === 0) return '';
    const first = days[0].date;
    const last = days[days.length - 1].date;
    if (first === last) {
      // Single day — show full date
      const d = new Date(first);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    // Range — show "Jun 29 – Jul 1" style
    const firstDate = new Date(first);
    const lastDate = new Date(last);
    const firstStr = firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const lastStr = lastDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (firstDate.getFullYear() === lastDate.getFullYear()) {
      return `${firstStr} – ${lastStr}`;
    }
    return `${firstDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – ${lastStr}`;
  }

  onSlotTaskSelected(date: string, slotName: 'morning' | 'afternoon' | 'evening', taskId: string | null) {
    const payload: SlotsPayload = {
      [slotName]: taskId === null
        ? { status: 'free' }
        : { status: 'set', taskId }
    };
    this.dayService.updateDay(date, payload).subscribe(() => this.loadDays());
  }

  onSlotCompleted(date: string, slotName: 'morning' | 'afternoon' | 'evening', event: { slot: string; statGain: number; statName: string }) {
    const payload: SlotsPayload = {
      [slotName]: { completed: true }
    };
    this.dayService.updateDay(date, payload).subscribe(() => this.loadDays());
  }

  onSlotUncompleted(date: string, slotName: 'morning' | 'afternoon' | 'evening', event: { slot: string; statGain: number; statName: string }) {
    const payload: SlotsPayload = {
      [slotName]: { completed: false }
    };
    this.dayService.updateDay(date, payload).subscribe(() => this.loadDays());
  }

  private toDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
