import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Slot, Task } from '../../models';
import { TaskDropdownComponent } from '../task-dropdown/task-dropdown.component';

@Component({
  selector: 'app-slot-card',
  standalone: true,
  imports: [CommonModule, TaskDropdownComponent],
  template: `
    <div class="slot-card"
         [class.free]="slot().status === 'free'"
         [class.set]="slot().status === 'set' && !slot().completed"
         [class.completed]="slot().completed"
         (click)="openDropdown()">

      <div class="slot-label">{{ slotName() }}</div>

      <div class="slot-main">
        <div class="slot-content">
          @if (slot().status === 'free') {
            <span class="free-text">— FREE —</span>
          } @else if (slot().task) {
            <span class="task-name" [class.done]="slot().completed">{{ slot().task!.name }}</span>
          }
        </div>

        @if (slot().status === 'set' && !slot().completed) {
          <button class="check-btn" (click)="onCheck($event)" title="Mark as done">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </button>
        }
        @if (slot().completed) {
          <div class="done-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        }
      </div>

      @if (slot().status === 'set' && slot().task) {
        <div class="slot-meta">
          <span class="stat-badge" [attr.data-stat]="slot().task!.statName?.toLowerCase()">
            {{ slot().task!.statName }} +{{ slot().task!.statGain }}
          </span>
        </div>
      }

      @if (growthAnimation()) {
        <div class="growth-popup">
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
      background: var(--color-card);
      border: 1px solid var(--color-border);
      padding: 1.25rem 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .slot-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: var(--color-border);
      transition: all 0.2s ease;
    }
    .slot-card:hover::before {
      background: var(--color-primary);
      box-shadow: 0 0 15px var(--color-glow);
    }
    .slot-card.free {
      opacity: 0.6;
    }
    .slot-card.free:hover {
      opacity: 0.8;
      border-color: rgba(255,255,255,0.2);
    }
    .slot-card.set {
      border-color: rgba(233,30,99,0.3);
    }
    .slot-card.set::before {
      background: var(--color-primary);
    }
    .slot-card.completed {
      border-color: rgba(0,230,118,0.3);
      opacity: 0.85;
    }
    .slot-card.completed::before {
      background: var(--color-success);
    }
    .slot-label {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      color: rgba(255,255,255,0.4);
      margin-bottom: 0.75rem;
      text-transform: uppercase;
    }
    .slot-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .slot-content {
      flex: 1;
    }
    .free-text {
      font-family: 'Montserrat', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      color: rgba(255,255,255,0.25);
    }
    .task-name {
      font-family: 'Montserrat', sans-serif;
      font-weight: 800;
      font-size: 1.4rem;
      color: #fff;
      letter-spacing: 0.02em;
      transition: all 0.2s ease;
    }
    .task-name.done {
      text-decoration: line-through;
      color: rgba(255,255,255,0.4);
    }
    .check-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid rgba(0,230,118,0.4);
      background: transparent;
      color: rgba(0,230,118,0.6);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .check-btn svg {
      width: 18px;
      height: 18px;
    }
    .check-btn:hover {
      background: rgba(0,230,118,0.15);
      border-color: var(--color-success);
      color: var(--color-success);
      box-shadow: 0 0 20px rgba(0,230,118,0.4);
    }
    .done-badge {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(0,230,118,0.15);
      border: 2px solid var(--color-success);
      color: var(--color-success);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(0,230,118,0.3);
    }
    .done-badge svg {
      width: 18px;
      height: 18px;
    }
    .slot-meta {
      margin-top: 0.75rem;
    }
    .stat-badge {
      display: inline-block;
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 0.6rem;
      letter-spacing: 0.1em;
      padding: 3px 10px;
      border-radius: 2px;
      text-transform: uppercase;
    }
    .stat-badge[data-stat="academics"] { background: rgba(21,101,192,0.8); color: #fff; }
    .stat-badge[data-stat="proficiency"] { background: rgba(46,125,50,0.8); color: #fff; }
    .stat-badge[data-stat="kindness"] { background: rgba(194,24,91,0.8); color: #fff; }
    .stat-badge[data-stat="guts"] { background: rgba(230,81,0,0.8); color: #fff; }
    .stat-badge[data-stat="courage"] { background: rgba(249,168,37,0.9); color: #212121; }
    .growth-popup {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-family: 'Montserrat', sans-serif;
      font-weight: 900;
      font-size: 1rem;
      color: var(--color-success);
      text-shadow: 0 0 15px rgba(0,230,118,0.8);
      pointer-events: none;
      animation: floatUp 2s ease-out forwards;
    }
    @keyframes floatUp {
      0% { opacity: 1; transform: translateY(0); }
      70% { opacity: 1; transform: translateY(-30px); }
      100% { opacity: 0; transform: translateY(-50px); }
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

  onCheck(e: MouseEvent) {
    e.stopPropagation();
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
