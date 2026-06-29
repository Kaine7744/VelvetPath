import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DayService } from '../../services/day.service';
import { TaskService } from '../../services/task.service';
import { Day, Task, SlotsPayload } from '../../models';
import { SlotCardComponent } from '../../components/slot-card/slot-card.component';

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [CommonModule, DatePipe, SlotCardComponent, RouterLink],
  template: `
    <div class="day-view">
      <header class="day-header">
        <button class="nav-btn" (click)="previousDay()">←</button>
        <div class="date-display">
          <span class="day-name">{{ currentDate() | date:'EEEE' }}</span>
          <span class="day-full">{{ currentDate() | date:'MMMM d, y' }}</span>
        </div>
        <button class="nav-btn" (click)="nextDay()">→</button>
        <div class="header-actions">
          <button class="today-btn" (click)="goToToday()">Today</button>
          <a class="stats-link" routerLink="/stats">Stats</a>
        </div>
      </header>

      <div class="slots-container">
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
  `,
  styles: [`
    .day-view {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    .day-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .nav-btn {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
      width: 44px;
      height: 44px;
      border-radius: 8px;
      font-size: 1.2rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    .nav-btn:hover {
      background: rgba(233,30,99,0.3);
      border-color: rgba(233,30,99,0.5);
    }
    .date-display {
      flex: 1;
      text-align: center;
    }
    .day-name {
      display: block;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255,255,255,0.5);
      margin-bottom: 0.25rem;
    }
    .day-full {
      display: block;
      font-size: 1.3rem;
      font-weight: 600;
      color: #fff;
    }
    .header-actions {
      display: flex;
      gap: 0.5rem;
    }
    .today-btn {
      background: rgba(233,30,99,0.2);
      border: 1px solid rgba(233,30,99,0.4);
      color: #e91e63;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }
    .today-btn:hover {
      background: rgba(233,30,99,0.35);
    }
    .stats-link {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.7);
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s;
    }
    .stats-link:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }
    .slots-container {
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
