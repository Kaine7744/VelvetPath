import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DayService } from '../../services/day.service';
import { TaskService } from '../../services/task.service';
import { TemplateService, RecurringTask } from '../../services/template.service';
import { SettingsService } from '../../services/settings.service';
import { SkillService } from '../../services/skill.service';
import { Day, SlotsPayload, parseAppSettings } from '../../models';
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
      </div>

      <div class="day-nav">
        <button class="nav-btn" (click)="previousDay()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="date-display">
          <span class="day-range">{{ getCenterDateLabel() }}</span>
        </div>
        <button class="nav-btn" (click)="nextDay()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
        <button class="today-btn" (click)="goToToday()">TODAY</button>
      </div>

      <div class="days-scroll-container">
        <div class="days-grid">
          @for (day of daysData(); track day.date; let i = $index) {
            <div class="day-column">
              <div class="day-header" [class.today]="isToday(day.date)">
                <div class="day-meta">
                  <span class="day-label">{{ day.date | date:'EEE' }}</span>
                  <span class="day-num">{{ day.date | date:'d' }}</span>
                  @if (recurringPerDay()[day.date].length) {
                    <div class="day-recurring-pills">
                      @for (r of recurringPerDay()[day.date]; track r.taskId + r.slot) {
                        <span class="recurring-pill" [title]="r.taskName + ' (' + r.slot + ')'">{{ r.taskName }}</span>
                      }
                    </div>
                  }
                </div>
              </div>
              <div class="slots-wrapper skew-outer">
                <div class="slots-inner">
                  @if (isMorningEnabled(day.date)) {
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
                  @if (isEveningEnabled(day.date)) {
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
    .days-scroll-container {
      /* wheel events captured, no overflow scrollbar */
    }
    .days-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(220px, 1fr));
      gap: 1.5rem;
      border: var(--card-border-width) var(--card-border-style) var(--color-primary);
      padding: 1rem;
      background: var(--color-surface);
    }
    .day-column {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 0;
      /* opaque background masks slot-card shadow/backdrop-filter bleed */
      background: var(--color-surface);
    }
    .day-header {
      padding: 0 0.5rem;
    }
    .day-meta {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      flex-wrap: wrap;
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

    /* Recurring pills — in the day-meta row next to the date */
    .day-recurring-pills {
      display: flex;
      gap: 4px;
      align-items: center;
      margin-left: 4px;
      flex-wrap: wrap;
    }
    .recurring-pill {
      display: inline-flex;
      align-items: center;
      padding: 1px 5px;
      border-radius: 10px;
      background: var(--color-primary);
      color: var(--color-bg);
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.3px;
      opacity: 0.85;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80px;
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
  `]
})
export class DayViewComponent implements OnInit {
  private dayService = inject(DayService);
  private taskService = inject(TaskService);
  private templateService = inject(TemplateService);
  private settingsService = inject(SettingsService);
  private skillService = inject(SkillService);

  centerDate = signal(new Date());
  daysData = signal<Day[]>([]);
  tasks = signal<any[]>([]);
  recurringPerDay = signal<Record<string, RecurringTask[]>>({});
  morningDays = signal<number[]>([1, 2, 3, 4, 5]);
  eveningDays = signal<number[]>([1, 2, 3, 4, 5]);

  private scrollAccumulator = 0;
  private readonly DAY_THRESHOLD = 30; // px before day changes — easier single-scroll
  private readonly VELOCITY_CAP = 15;  // max px per wheel event
  private readonly DAMPING = 0.6;       // slows fast swipes

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => this.tasks.set(tasks));
    this.settingsService.getSettings().subscribe({
      next: raw => {
        const settings = parseAppSettings(raw);
        this.morningDays.set(settings.morningDays);
        this.eveningDays.set(settings.eveningDays);
      }
    });
    this.loadDays();
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault();

    const rawDelta = event.deltaX; // horizontal scroll only — vertical wheel scrolls the page
    if (Math.abs(rawDelta) < 3) return;

    // Apply velocity cap and damping to prevent fast swipes from skipping days
    const delta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), this.VELOCITY_CAP) * this.DAMPING;
    this.scrollAccumulator += delta;

    if (Math.abs(this.scrollAccumulator) >= this.DAY_THRESHOLD) {
      const direction = this.scrollAccumulator > 0 ? 1 : -1;
      this.scrollAccumulator = 0;

      if (direction > 0) {
        this.centerDate.set(this.offsetDate(this.centerDate(), 1));
      } else {
        this.centerDate.set(this.offsetDate(this.centerDate(), -1));
      }

      this.loadDays();
      this.triggerHaptic();
    }
  }

  private triggerHaptic() {
    // Android: Vibration API (iOS ignores this)
    try {
      (navigator as any).vibrate?.([10]);
    } catch {}

    // iOS: play silent audio buffer — user gesture triggers haptic engine
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start();
    } catch {}

    // macOS Safari: no web API for haptics without a native app wrapper
    // (Electron, Safari Extension, or native macOS app would be required)
  }

  private loadDays() {
    const center = this.centerDate();
    const start = this.offsetDate(center, -1);
    const end = this.offsetDate(center, 1);
    this.dayService.getDays(this.toDateString(start), this.toDateString(end))
      .subscribe(days => {
        this.daysData.set(days);
        this.loadRecurringForDays(days.map(d => d.date));
      });
  }

  private loadRecurringForDays(dates: string[]) {
    const requests = dates.map(d => this.templateService.getTemplatesForDate(d));
    // Load all recurring in parallel, build map by date
    Promise.all(requests.map((req, i) =>
      new Promise<void>((resolve) => {
        req.subscribe({
          next: (r: RecurringTask[]) => {
            this.recurringPerDay.update(map => ({ ...map, [dates[i]]: r }));
            resolve();
          },
          error: () => {
            this.recurringPerDay.update(map => ({ ...map, [dates[i]]: [] }));
            resolve();
          }
        });
      })
    )).then();
  }

  private offsetDate(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  previousDay() {
    this.centerDate.set(this.offsetDate(this.centerDate(), -1));
    this.loadDays();
    this.triggerHaptic();
  }

  nextDay() {
    this.centerDate.set(this.offsetDate(this.centerDate(), 1));
    this.loadDays();
    this.triggerHaptic();
  }

  goToToday() {
    this.centerDate.set(new Date());
    this.loadDays();
    this.triggerHaptic();
  }

  isToday(dateStr: string): boolean {
    return dateStr === this.toDateString(new Date());
  }

  private getWeekday(dateStr: string): number {
    return new Date(dateStr).getDay(); // 0=Sun ... 6=Sat
  }

  isMorningEnabled(dateStr: string): boolean {
    return this.morningDays().includes(this.getWeekday(dateStr));
  }

  isEveningEnabled(dateStr: string): boolean {
    return this.eveningDays().includes(this.getWeekday(dateStr));
  }

  getCenterDateLabel(): string {
    const day = this.daysData()[1];
    if (!day) return '';
    const d = new Date(day.date);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
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
    this.dayService.updateDay(date, payload).subscribe(() => {
      this.loadDays();
      this.skillService.refresh();
    });
  }

  onSlotUncompleted(date: string, slotName: 'morning' | 'afternoon' | 'evening', event: { slot: string; statGain: number; statName: string }) {
    const payload: SlotsPayload = {
      [slotName]: { completed: false }
    };
    this.dayService.updateDay(date, payload).subscribe(() => {
      this.loadDays();
      this.skillService.refresh();
    });
  }

  private toDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
