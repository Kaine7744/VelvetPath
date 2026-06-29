import { Component, input, output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Slot, Task } from '../../models';

@Component({
  selector: 'app-task-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown-overlay" (click)="onOverlayClick($event)">
      <div class="dropdown-panel">
        <div class="dropdown-header">SELECT TASK</div>
        <div class="task-list">
          @for (task of tasks(); track task.id) {
            <button class="task-item" (click)="selectTask(task.id)">
              <span class="task-name">{{ task.name }}</span>
              @if (task.statName) {
                <span class="task-stat">{{ task.statName }} +{{ task.statGain }}</span>
              }
            </button>
          }
        </div>
        @if (slot().status === 'set') {
          <button class="remove-btn" (click)="selectTask(null)">
            — FREE SLOT —
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .dropdown-overlay {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(0,0,0,0.6);
    }
    .dropdown-panel {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-card);
      border: 1px solid var(--color-primary);
      box-shadow: 0 0 60px var(--color-glow), 0 20px 60px rgba(0,0,0,0.5);
      min-width: 300px;
      max-width: 90vw;
      overflow: hidden;
    }
    .dropdown-header {
      padding: 0.75rem 1.25rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: var(--color-primary);
      border-bottom: 1px solid var(--color-border);
      background: rgba(0,0,0,0.3);
    }
    .task-list {
      max-height: 280px;
      overflow-y: auto;
    }
    .task-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 1rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      text-align: left;
      transition: all 0.1s ease;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .task-item:hover {
      background: rgba(233,30,99,0.2);
      color: var(--color-primary);
    }
    .task-stat {
      font-size: 0.7rem;
      color: rgba(255,255,255,0.4);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: 700;
    }
    .remove-btn {
      width: 100%;
      padding: 1rem 1.25rem;
      background: rgba(255,255,255,0.03);
      border: none;
      border-top: 1px solid var(--color-border);
      color: rgba(255,255,255,0.3);
      cursor: pointer;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      transition: all 0.1s ease;
    }
    .remove-btn:hover {
      background: rgba(255,80,80,0.1);
      color: rgba(255,150,150,0.8);
    }
  `]
})
export class TaskDropdownComponent implements OnInit, OnDestroy {
  tasks = input.required<Task[]>();
  slot = input.required<Slot>();
  taskSelected = output<string | null>();
  closed = output<void>();

  ngOnInit() {
    document.addEventListener('keydown', this.onKeyDown);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.closed.emit();
  };

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('dropdown-overlay')) {
      this.closed.emit();
    }
  }

  selectTask(taskId: string | null) {
    this.taskSelected.emit(taskId);
  }
}
