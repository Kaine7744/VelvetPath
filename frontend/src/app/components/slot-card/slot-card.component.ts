import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Slot, Task } from '../../models';
import { TaskDropdownComponent } from '../task-dropdown/task-dropdown.component';

@Component({
  selector: 'app-slot-card',
  standalone: true,
  imports: [CommonModule, TaskDropdownComponent],
  template: `
    <div class="slot-card" [class.free]="slot().status === 'free'" [class.set]="slot().status === 'set' && !slot().completed" [class.completed]="slot().completed">
      <div class="slot-header">
        <span class="slot-name">{{ slotName() }}</span>
        @if (slot().status === 'set' && slot().task) {
          <span class="stat-badge" [attr.data-stat]="slot().task!.statName?.toLowerCase()">
            {{ slot().task!.statName }}
          </span>
        }
      </div>

      <div class="slot-body">
        <div class="slot-content" (click)="openDropdown()">
          @if (slot().status === 'free') {
            <span class="free-text">— Free —</span>
          } @else if (slot().task) {
            <span class="task-name" [class.strike]="slot().completed">{{ slot().task!.name }}</span>
          }
        </div>

        @if (slot().status === 'set' && !slot().completed) {
          <button class="check-btn" (click)="onCheck($event)" title="Mark as done">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>
        }
        @if (slot().completed) {
          <div class="completed-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        }
      </div>

      @if (growthAnimation()) {
        <div class="growth-popup" [class.visible]="growthAnimation()">
          +{{ growthAmount() }} {{ growthStat() }}
        </div>
      }
    </div>

    @if (dropdownOpen()) {
      <app-task-dropdown
        [tasks]="tasks()"
        [slot]="slot()"
        (taskSelected)="onTaskSelected($event)"
        (closed)="closeDropdown()"
      />
    }
  `,
  styles: [`
    .slot-card {
      padding: 1rem 1.25rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid transparent;
      position: relative;
      overflow: hidden;
    }
    .slot-card.free {
      background: rgba(255,255,255,0.05);
      border-color: rgba(255,255,255,0.1);
    }
    .slot-card.free:hover {
      background: rgba(255,255,255,0.08);
    }
    .slot-card.set {
      background: rgba(233,30,99,0.15);
      border-color: rgba(233,30,99,0.3);
    }
    .slot-card.set:hover {
      background: rgba(233,30,99,0.2);
    }
    .slot-card.completed {
      background: rgba(0,230,118,0.1);
      border-color: rgba(0,230,118,0.3);
    }
    .slot-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .slot-name {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255,255,255,0.5);
      font-weight: 600;
    }
    .stat-badge {
      font-size: 0.65rem;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .stat-badge[data-stat="academics"] { background: #1565c0; color: #fff; }
    .stat-badge[data-stat="proficiency"] { background: #2e7d32; color: #fff; }
    .stat-badge[data-stat="kindness"] { background: #c2185b; color: #fff; }
    .stat-badge[data-stat="guts"] { background: #e65100; color: #fff; }
    .stat-badge[data-stat="courage"] { background: #f9a825; color: #212121; }
    .slot-body {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .slot-content {
      flex: 1;
    }
    .slot-content:hover .task-name {
      text-decoration: underline;
    }
    .slot-content {
      font-size: 1.1rem;
      font-weight: 500;
    }
    .free-text {
      color: rgba(255,255,255,0.3);
    }
    .task-name {
      color: #fff;
      cursor: pointer;
    }
    .task-name.strike {
      text-decoration: line-through;
      color: rgba(255,255,255,0.5);
    }
    .check-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid rgba(0,230,118,0.5);
      background: transparent;
      color: rgba(0,230,118,0.7);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .check-btn:hover {
      background: rgba(0,230,118,0.2);
      border-color: #00e676;
      color: #00e676;
      box-shadow: 0 0 15px rgba(0,230,118,0.4);
    }
    .check-btn svg {
      width: 16px;
      height: 16px;
    }
    .completed-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(0,230,118,0.2);
      border: 2px solid #00e676;
      color: #00e676;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .completed-icon svg {
      width: 16px;
      height: 16px;
    }
    .growth-popup {
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-50%);
      color: #00e676;
      font-weight: 700;
      font-size: 1rem;
      pointer-events: none;
      opacity: 0;
      animation: none;
    }
    .growth-popup.visible {
      animation: floatUp 2s ease-out forwards;
    }
    @keyframes floatUp {
      0% { opacity: 1; transform: translateY(-50%); }
      70% { opacity: 1; transform: translateY(-120%); }
      100% { opacity: 0; transform: translateY(-150%); }
    }
  `]
})
export class SlotCardComponent {
  slot = input.required<Slot>();
  slotName = input.required<string>();
  tasks = input.required<Task[]>();
  taskSelected = output<string | null>();
  completed = output<{ slot: string; statGain: number; statName: string }>();

  dropdownOpen = signal(false);
  growthAnimation = signal(false);
  growthAmount = signal(0);
  growthStat = signal('');

  openDropdown() {
    if (this.slot().status === 'free') {
      this.dropdownOpen.set(true);
    }
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }

  onTaskSelected(taskId: string | null) {
    this.taskSelected.emit(taskId);
    this.closeDropdown();
  }

  onCheck(event: MouseEvent) {
    event.stopPropagation();
    const slot = this.slot();
    if (slot.status === 'set' && slot.task && !slot.completed) {
      this.growthAmount.set(slot.task.statGain);
      this.growthStat.set(slot.task.statName || '');
      this.growthAnimation.set(true);
      this.completed.emit({ slot: this.slotName(), statGain: slot.task.statGain, statName: slot.task.statName || '' });
      setTimeout(() => this.growthAnimation.set(false), 2000);
    }
  }
}
