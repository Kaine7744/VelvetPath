import { Component, input, output, signal, ElementRef, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Slot, Task } from '../../models';

@Component({
  selector: 'app-task-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown-overlay" (click)="onOverlayClick($event)">
      <div class="dropdown-panel">
        <div class="dropdown-header">Select Task</div>
        <div class="task-list">
          @for (task of tasks(); track task.id) {
            <button class="task-item" (click)="selectTask(task.id)">
              <span class="task-name">{{ task.name }}</span>
              @if (task.statName) {
                <span class="task-stat">{{ task.statName }}</span>
              }
            </button>
          }
        </div>
        @if (slot().status === 'set') {
          <button class="remove-btn" (click)="selectTask(null)">
            Remove / Free Slot
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
    }
    .dropdown-panel {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #1e1e1e;
      border: 1px solid rgba(233,30,99,0.3);
      border-radius: 12px;
      min-width: 280px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      overflow: hidden;
    }
    .dropdown-header {
      padding: 0.75rem 1rem;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255,255,255,0.4);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      font-weight: 600;
    }
    .task-list {
      max-height: 240px;
      overflow-y: auto;
    }
    .task-item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 0.95rem;
      text-align: left;
      transition: background 0.1s;
    }
    .task-item:hover {
      background: rgba(233,30,99,0.2);
    }
    .task-stat {
      font-size: 0.7rem;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
    }
    .remove-btn {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(255,255,255,0.05);
      border: none;
      border-top: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.4);
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.1s;
    }
    .remove-btn:hover {
      background: rgba(255,100,100,0.1);
      color: rgba(255,200,200,0.8);
    }
  `]
})
export class TaskDropdownComponent implements OnInit, OnDestroy {
  tasks = input.required<Task[]>();
  slot = input.required<Slot>();
  taskSelected = output<string | null>();
  closed = output<void>();

  private el = inject(ElementRef);

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
