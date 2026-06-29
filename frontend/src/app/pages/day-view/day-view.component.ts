import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DayService } from '../../services/day.service';
import { TaskService } from '../../services/task.service';
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
          <span class="day-name">{{ currentDate() | date:'EEEE' }}</span>
          <span class="day-full">{{ currentDate() | date:'MMMM d, y' }}</span>
        </div>
        <button class="nav-btn" (click)="nextDay()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
        <button class="today-btn" (click)="goToToday()">TODAY</button>
      </div>

      <div class="slots-wrapper skew-outer">
        <div class="slots-inner">
          <app-slot-card
            [slot]="dayData()?.slots?.morning || emptySlot()"
            slotName="Morning"
            [tasks]="tasks()"
            (taskSelected)="onSlotTaskSelected('morning', $event)"
            (completed)="onSlotCompleted('morning', $event)"
          />
          <app-slot-card
            [slot]="dayData()?.slots?.afternoon || emptySlot()"
            slotName="Afternoon"
            [tasks]="tasks()"
            (taskSelected)="onSlotTaskSelected('afternoon', $event)"
            (completed)="onSlotCompleted('afternoon', $event)"
          />
          <app-slot-card
            [slot]="dayData()?.slots?.evening || emptySlot()"
            slotName="Evening"
            [tasks]="tasks()"
            (taskSelected)="onSlotTaskSelected('evening', $event)"
            (completed)="onSlotCompleted('evening', $event)"
          />
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
      font-size: 3rem;
      color: var(--color-primary);
      letter-spacing: 0.15em;
      text-shadow: 0 0 30px var(--color-glow);
      transform: skewX(8deg);
      display: inline-block;
      margin: 0;
    }
    .drip-divider {
      height: 16px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 16'%3E%3Cpath d='M0 0 L20 0 L25 12 L30 4 L35 14 L40 6 L45 10 L50 0 L200 0' fill='%23e8001a'/%3E%3C/svg%3E");
      background-repeat: repeat-x;
      background-size: 50px 16px;
    }
    :root[data-theme="p4"] .drip-divider {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 16'%3E%3Cpath d='M0 0 L20 0 L25 12 L30 4 L35 14 L40 6 L45 10 L50 0 L200 0' fill='%23f7d000'/%3E%3C/svg%3E");
    }
    :root[data-theme="p3"] .drip-divider {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 16'%3E%3Cpath d='M0 0 L20 0 L25 12 L30 4 L35 14 L40 6 L45 10 L50 0 L200 0' fill='%2300b4c8'/%3E%3C/svg%3E");
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
    .day-name {
      display: block;
      font-size: 0.7rem;
      font-family: var(--font-display);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: var(--color-primary);
      margin-bottom: 0.25rem;
    }
    .day-full {
      display: block;
      font-size: 1.5rem;
      font-family: var(--font-display);
      font-weight: 900;
      color: var(--color-text);
      letter-spacing: 0.05em;
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
    .slots-wrapper {
      transform: skewX(-8deg);
    }
    .slots-inner {
      transform: skewX(8deg);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `]
})
export class DayViewComponent implements OnInit {
  private dayService = inject(DayService);
  private taskService = inject(TaskService);

  currentDate = signal(new Date());
  dayData = signal<Day | null>(null);
  tasks = signal<Task[]>([]);

  emptySlot = () => ({ status: 'free' as const, taskId: null, completed: false, task: null });

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => this.tasks.set(tasks));
    this.loadDay();
  }

  private loadDay() {
    const dateStr = this.toDateString(this.currentDate());
    this.dayService.getDay(dateStr).subscribe(day => this.dayData.set(day));
  }

  previousDay() {
    const d = new Date(this.currentDate());
    d.setDate(d.getDate() - 1);
    this.currentDate.set(d);
    this.loadDay();
  }

  nextDay() {
    const d = new Date(this.currentDate());
    d.setDate(d.getDate() + 1);
    this.currentDate.set(d);
    this.loadDay();
  }

  goToToday() {
    this.currentDate.set(new Date());
    this.loadDay();
  }

  onSlotTaskSelected(slotName: 'morning' | 'afternoon' | 'evening', taskId: string | null) {
    const dateStr = this.toDateString(this.currentDate());
    const payload: SlotsPayload = {
      [slotName]: taskId === null
        ? { status: 'free' }
        : { status: 'set', taskId }
    };
    this.dayService.updateDay(dateStr, payload).subscribe(day => this.dayData.set(day));
  }

  onSlotCompleted(slotName: 'morning' | 'afternoon' | 'evening', event: { slot: string; statGain: number; statName: string }) {
    const dateStr = this.toDateString(this.currentDate());
    const payload: SlotsPayload = {
      [slotName]: { completed: true }
    };
    this.dayService.updateDay(dateStr, payload).subscribe(day => this.dayData.set(day));
  }

  private toDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
