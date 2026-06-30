import { Component, OnInit, inject, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DayService } from '../../services/day.service';
import { TaskService } from '../../services/task.service';
import { TemplateService, RecurringTask } from '../../services/template.service';
import { SettingsService } from '../../services/settings.service';
import { Day, SlotsPayload } from '../../models';
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

      <div class="days-scroll-container" #scrollContainer (scroll)="onScroll()">
        <div class="days-grid">
          @for (day of daysData(); track day.date; let i = $index) {
            <div class="day-column">
              <div class="day-header" [class.today]="isToday(day.date)">
                <div class="day-meta">
                  <span class="day-label">{{ day.date | date:'EEE' }}</span>
                  <span class="day-num">{{ day.date | date:'d' }}</span>
                </div>
                @if (i === 1 && recurringForCenter()?.length) {
                  <div class="day-recurring-pills">
                    @for (r of recurringForCenter(); track r.taskId + r.slot) {
                      <div class="day-recurring-pill">
                        <span class="pill-slot">{{ r.slot.charAt(0).toUpperCase() }}</span>
                        <span class="pill-name">{{ r.taskName || '—' }}</span>
                      </div>
                    }
                  </div>
                }
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
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 8px;
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
    }
    .day-header {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 0 0.5rem;
    }
    .day-meta {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
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

    /* Recurring pills — inside center day-header only (index 1) */
    .day-recurring-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .day-recurring-pill {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border: 1px solid color-mix(in srgb, var(--color-primary) 35%, transparent);
      border-left: 2px solid var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 8%, transparent);
    }
    .pill-slot {
      font-family: var(--font-display);
      font-size: 0.55rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--color-primary);
    }
    .pill-name {
      font-family: var(--font-display);
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
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
  `]
})
export class DayViewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  private dayService = inject(DayService);
  private taskService = inject(TaskService);
  private templateService = inject(TemplateService);
  private settingsService = inject(SettingsService);

  centerDate = signal(new Date());
  daysData = signal<Day[]>([]);
  tasks = signal<any[]>([]);
  recurringForCenter = signal<RecurringTask[]>([]);
  morningEnabled = signal(true);
  eveningEnabled = signal(true);

  private lastScrollLeft = 0;
  private isScrolling = false;
  private columnWidth = 236; // px — minmax(220px, 1fr) + gap approximation

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

  ngAfterViewInit() {}

  ngOnDestroy() {}

  onScroll() {
    if (this.isScrolling) return;
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;

    const delta = el.scrollLeft - this.lastScrollLeft;

    // Ignore tiny scrolls (browser momentum noise)
    if (Math.abs(delta) < 20) return;

    this.isScrolling = true;

    if (delta > 0) {
      // Scrolling right → next day
      this.centerDate.set(this.offsetDate(this.centerDate(), 1));
    } else {
      // Scrolling left → previous day
      this.centerDate.set(this.offsetDate(this.centerDate(), -1));
    }

    this.loadDays(() => {
      // After reload, restore scroll position so center column stays in view
      if (el) {
        el.scrollLeft = this.columnWidth;
      }
      this.lastScrollLeft = el ? el.scrollLeft : this.columnWidth;
      this.isScrolling = false;
    });
  }

  private loadDays(onDone?: () => void) {
    const center = this.centerDate();
    const start = this.offsetDate(center, -1);
    const end = this.offsetDate(center, 1);
    this.dayService.getDays(this.toDateString(start), this.toDateString(end))
      .subscribe(days => {
        this.daysData.set(days);
        this.loadRecurringForDay(this.toDateString(center));
        onDone?.();
      });
  }

  private loadRecurringForDay(dateStr: string) {
    this.templateService.getTemplatesForDate(dateStr).subscribe({
      next: r => this.recurringForCenter.set(r),
      error: () => this.recurringForCenter.set([])
    });
  }

  private offsetDate(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  previousDay() {
    this.centerDate.set(this.offsetDate(this.centerDate(), -1));
    this.loadDays(() => {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        el.scrollLeft = this.columnWidth;
        this.lastScrollLeft = el.scrollLeft;
      }
    });
  }

  nextDay() {
    this.centerDate.set(this.offsetDate(this.centerDate(), 1));
    this.loadDays(() => {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        el.scrollLeft = this.columnWidth;
        this.lastScrollLeft = el.scrollLeft;
      }
    });
  }

  goToToday() {
    this.centerDate.set(new Date());
    this.loadDays(() => {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        el.scrollLeft = this.columnWidth;
        this.lastScrollLeft = el.scrollLeft;
      }
    });
  }

  isToday(dateStr: string): boolean {
    return dateStr === this.toDateString(new Date());
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
