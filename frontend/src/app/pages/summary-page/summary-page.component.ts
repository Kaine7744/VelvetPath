import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DayService } from '../../services/day.service';
import { TemplateService, RecurringTask } from '../../services/template.service';
import { TaskService } from '../../services/task.service';
import { Day, Task } from '../../models';

@Component({
  selector: 'app-summary-page',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="summary-page">
      <div class="page-header">
        <div class="calling-card header-card">
          <div class="calling-card-label">▶ TODAY</div>
          <div class="skew-heading">
            <div class="skew-heading-inner">SUMMARY</div>
          </div>
          <div class="today-date">{{ todayStr | date:'EEEE, MMMM d, y' }}</div>
        </div>
        <div class="drip-divider"></div>
      </div>

      <!-- Completion bar -->
      <div class="completion-bar-card p5-panel">
        <div class="completion-header">
          <span class="completion-label">TODAY'S PROGRESS</span>
          <span class="completion-count">{{ completedCount() }}/{{ totalSlots() }}</span>
        </div>
        <div class="completion-track">
          <div class="completion-fill" [style.width.%]="completionPercent()"></div>
        </div>
        <div class="completion-pct">{{ completionPercent() | number:'1.0-0' }}% COMPLETE</div>
      </div>

      <!-- Slots -->
      <div class="slots-grid">
        @for (slot of slots(); track slot.name) {
          <div class="slot-card p5-panel" [class.completed]="slot.completed" [class.empty]="slot.status === 'free'">
            <div class="slot-name">{{ slot.name }}</div>
            @if (slot.status === 'set') {
              <div class="slot-task">{{ slot.taskName }}</div>
              @if (slot.completed) {
                <div class="slot-completed-badge">✓ DONE</div>
                @if (slot.statGain) {
                  <div class="slot-stat-gain">+{{ slot.statGain }} {{ slot.statName }}</div>
                }
              } @else {
                <div class="slot-pending-badge">PENDING</div>
              }
            } @else {
              <div class="slot-task slot-free">— FREE —</div>
            }
          </div>
        }
      </div>

      <!-- Recurring tasks filling today -->
      @if (recurringTasks().length > 0) {
        <div class="recurring-section p5-panel">
          <div class="section-label">— RECURRING THIS WEEK —</div>
          <div class="recurring-list">
            @for (r of recurringTasks(); track r.taskId + r.slot) {
              <div class="recurring-row">
                <span class="recurring-slot">{{ r.slot.toUpperCase() }}</span>
                <span class="recurring-name">{{ r.taskName || '—' }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .summary-page {
      padding: 2rem;
      max-width: 600px;
    }
    .page-header {
      margin-bottom: 2rem;
    }
    .header-card {
      margin-bottom: 0.5rem;
    }
    .calling-card-label {
      font-family: 'Impact', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.3em;
      color: var(--color-primary);
      margin-bottom: 4px;
    }
    .skew-heading {
      transform: skewX(-3deg);
      display: inline-block;
    }
    .skew-heading-inner {
      transform: skewX(3deg);
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 3rem;
      color: var(--color-primary);
      letter-spacing: 0.1em;
      text-shadow: 0 0 30px var(--color-glow);
    }
    .today-date {
      font-family: var(--font-display);
      font-size: 0.9rem;
      letter-spacing: 0.1em;
      color: var(--color-text-dim);
      margin-top: 8px;
    }

    /* Completion bar */
    .completion-bar-card {
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    .completion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .completion-label {
      font-family: var(--font-display);
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: var(--color-text-dim);
    }
    .completion-count {
      font-family: var(--font-display);
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--color-primary);
    }
    .completion-track {
      height: 8px;
      background: color-mix(in srgb, var(--color-primary) 20%, transparent);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .completion-fill {
      height: 100%;
      background: var(--color-primary);
      transition: width 0.3s ease;
    }
    .completion-pct {
      font-family: var(--font-display);
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      color: var(--color-primary);
      text-align: right;
    }

    /* Slots */
    .slots-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .slot-card {
      padding: 1.25rem;
      text-align: center;
    }
    .slot-card.completed {
      border-left: 4px solid var(--color-success);
    }
    .slot-card.empty {
      opacity: 0.6;
    }
    .slot-name {
      font-family: var(--font-display);
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: var(--color-primary);
      margin-bottom: 10px;
    }
    .slot-task {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--color-text);
    }
    .slot-free {
      color: var(--color-text-dim);
      font-size: 0.8rem;
    }
    .slot-completed-badge {
      font-family: var(--font-display);
      font-size: 0.55rem;
      letter-spacing: 0.15em;
      color: var(--color-success);
      margin-top: 8px;
    }
    .slot-pending-badge {
      font-family: var(--font-display);
      font-size: 0.55rem;
      letter-spacing: 0.15em;
      color: var(--color-warning);
      margin-top: 8px;
    }
    .slot-stat-gain {
      font-family: var(--font-display);
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--color-primary);
      margin-top: 4px;
    }

    /* Recurring section */
    .recurring-section {
      padding: 1rem 1.25rem;
    }
    .section-label {
      font-family: var(--font-display);
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: var(--color-text-dim);
      margin-bottom: 12px;
    }
    .recurring-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .recurring-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .recurring-slot {
      font-family: var(--font-display);
      font-size: 0.55rem;
      letter-spacing: 0.1em;
      color: var(--color-primary);
      min-width: 70px;
    }
    .recurring-name {
      font-family: var(--font-display);
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--color-text);
    }
  `]
})
export class SummaryPageComponent implements OnInit {
  private dayService = inject(DayService);
  private templateService = inject(TemplateService);
  private taskService = inject(TaskService);

  todayStr = new Date().toISOString().split('T')[0];

  slots = signal<{ name: string; status: string; taskName: string | null; completed: boolean; statGain: number | null; statName: string | null }[]>([]);
  recurringTasks = signal<RecurringTask[]>([]);
  tasks = signal<Task[]>([]);

  completedCount = signal(0);
  totalSlots = signal(3);
  completionPercent = signal(0);

  ngOnInit() {
    this.loadTasks();
    this.loadToday();
    this.loadRecurring();
  }

  private loadTasks() {
    this.taskService.getTasks().subscribe({
      next: t => this.tasks.set(t),
      error: err => console.error('Failed to load tasks:', err)
    });
  }

  private loadToday() {
    this.dayService.getDay(this.todayStr).subscribe({
      next: day => {
        const taskMap: Record<string, string> = {};
        this.tasks().forEach(t => { taskMap[t.id] = t.name; });

        const slotDefs = [
          { name: 'MORNING', slot: day.slots.morning, statId: this.getStatId(day.slots.morning.taskId) },
          { name: 'AFTERNOON', slot: day.slots.afternoon, statId: this.getStatId(day.slots.afternoon.taskId) },
          { name: 'EVENING', slot: day.slots.evening, statId: this.getStatId(day.slots.evening.taskId) },
        ];

        const mapped = slotDefs.map(s => ({
          name: s.name,
          status: s.slot.status,
          taskName: s.slot.taskId ? (taskMap[s.slot.taskId] || s.slot.taskId) : null,
          completed: s.slot.completed,
          statGain: s.slot.completed ? this.getStatGain(s.slot.taskId) : null,
          statName: s.statId ? null : null
        }));

        this.slots.set(mapped);

        const completed = mapped.filter(s => s.completed).length;
        const total = mapped.filter(s => s.status === 'set').length;
        this.completedCount.set(completed);
        this.totalSlots.set(total || 3);
        this.completionPercent.set(total ? Math.round((completed / total) * 100) : 0);
      },
      error: err => console.error('Failed to load day:', err)
    });
  }

  private loadRecurring() {
    this.templateService.getTemplatesForDate(this.todayStr).subscribe({
      next: r => this.recurringTasks.set(r),
      error: err => console.error('Failed to load recurring tasks:', err)
    });
  }

  private getStatId(taskId: string | null): string | null {
    if (!taskId) return null;
    const task = this.tasks().find(t => t.id === taskId);
    return task?.statId || null;
  }

  private getStatGain(taskId: string | null): number {
    if (!taskId) return 0;
    const task = this.tasks().find(t => t.id === taskId);
    return task?.statGain || 0;
  }
}
