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
      background: #0a0a0a;
      border: 2px solid #e8001a;
      border-left-width: 6px;
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
      box-shadow: 6px 6px 0 #e8001a;
      min-width: 340px;
      max-width: 90vw;
      overflow: hidden;
      padding: 0;
    }
    .calling-card-label {
      font-family: 'Impact', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.3em;
      color: #e8001a;
      text-transform: uppercase;
      padding: 12px 20px;
      background: rgba(232,0,26,0.1);
      border-bottom: 1px solid rgba(232,0,26,0.3);
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
      border-bottom: 1px solid rgba(255,255,255,0.05);
      cursor: pointer;
      transition: background 0.05s;
    }
    .task-item:hover {
      background: #e8001a;
    }
    .task-item-name {
      font-family: 'Impact', sans-serif;
      font-weight: 700;
      font-size: 1.1rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: rgba(240,240,240,0.7);
      transition: color 0.05s;
    }
    .task-item:hover .task-item-name {
      color: #fff;
    }
    .task-item-badge {
      font-family: 'Impact', sans-serif;
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #ffd700;
      background: rgba(255,215,0,0.15);
      padding: 3px 10px;
      transition: background 0.05s, color 0.05s;
    }
    .task-item:hover .task-item-badge {
      background: rgba(255,215,0,0.25);
      color: #ffd700;
    }
    .remove-btn {
      width: 100%;
      padding: 14px 20px;
      background: rgba(255,255,255,0.03);
      border: none;
      border-top: 1px solid rgba(232,0,26,0.2);
      cursor: pointer;
      font-family: 'Impact', sans-serif;
      font-weight: 700;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      color: rgba(240,240,240,0.4);
      transition: background 0.05s, color 0.05s;
    }
    .remove-btn:hover {
      background: #8b0011;
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
