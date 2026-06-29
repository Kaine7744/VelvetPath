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
        <div class="calling-card-label">▶ SELECT YOUR TARGET</div>
        <div class="task-list">
          @for (task of tasks(); track task.id) {
            <button class="task-item" (click)="selectTask(task.id)">
              <span class="task-item-name">{{ task.name }}</span>
              @if (task.statName) {
                <span class="task-item-badge">{{ task.statName }} +{{ task.statGain }}</span>
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
      background: rgba(0,0,0,0.75);
    }
    .dropdown-panel {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-bg);
      border: 2px solid var(--color-primary);
      border-left-width: 6px;
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
      box-shadow: 6px 6px 0 var(--color-primary);
      min-width: 340px;
      max-width: 90vw;
      overflow: hidden;
      padding: 0;
    }
    .calling-card-label {
      font-family: var(--font-display);
      font-size: 0.65rem;
      letter-spacing: 0.3em;
      color: var(--color-primary);
      text-transform: uppercase;
      padding: 12px 20px;
      background: color-mix(in srgb, var(--color-primary) 10%, transparent);
      border-bottom: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
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
      padding: 14px 20px;
      background: none;
      border: none;
      border-bottom: 1px solid color-mix(in srgb, var(--color-text) 5%, transparent);
      cursor: pointer;
      transition: background 0.05s;
    }
    .task-item:hover {
      background: var(--color-primary);
    }
    .task-item-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.1rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--color-text);
      transition: color 0.05s;
    }
    .task-item:hover .task-item-name {
      color: #fff;
    }
    .task-item-badge {
      font-family: var(--font-display);
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-accent);
      background: color-mix(in srgb, var(--color-accent) 15%, transparent);
      padding: 3px 10px;
      transition: background 0.05s, color 0.05s;
    }
    .task-item:hover .task-item-badge {
      background: color-mix(in srgb, var(--color-accent) 25%, transparent);
      color: var(--color-accent);
    }
    .remove-btn {
      width: 100%;
      padding: 14px 20px;
      background: color-mix(in srgb, var(--color-text) 3%, transparent);
      border: none;
      border-top: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
      cursor: pointer;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      color: var(--color-text-dim);
      transition: background 0.05s, color 0.05s;
    }
    .remove-btn:hover {
      background: var(--color-accent);
      color: #fff;
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
