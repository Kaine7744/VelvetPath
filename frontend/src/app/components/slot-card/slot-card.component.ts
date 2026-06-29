import { Component, input, output, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Slot, Task } from '../../models';
import { TaskDropdownComponent } from '../task-dropdown/task-dropdown.component';

@Component({
  selector: 'app-slot-card',
  standalone: true,
  imports: [CommonModule, TaskDropdownComponent],
  template: `
    <div class="slot-card" [class.free]="slot().status === 'free'" [class.set]="slot().status === 'set'" (click)="openDropdown()">
      <div class="slot-header">
        <span class="slot-name">{{ slotName() }}</span>
        @if (slot().status === 'set' && slot().task) {
          <span class="stat-badge" [attr.data-stat]="slot().task!.statName?.toLowerCase()">
            {{ slot().task!.statName }}
          </span>
        }
      </div>
      <div class="slot-content">
        @if (slot().status === 'free') {
          <span class="free-text">— Free —</span>
        } @else if (slot().task) {
          <span class="task-name">{{ slot().task!.name }}</span>
        }
      </div>
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
    .slot-content {
      font-size: 1.1rem;
      font-weight: 500;
    }
    .free-text {
      color: rgba(255,255,255,0.3);
    }
    .task-name {
      color: #fff;
    }
  `]
})
export class SlotCardComponent {
  slot = input.required<Slot>();
  slotName = input.required<string>();
  tasks = input.required<Task[]>();
  taskSelected = output<string | null>();

  dropdownOpen = signal(false);

  openDropdown() {
    this.dropdownOpen.set(true);
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }

  onTaskSelected(taskId: string | null) {
    this.taskSelected.emit(taskId);
    this.closeDropdown();
  }
}
