import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Slot, Task } from '../../models';
import { TaskDropdownComponent } from '../task-dropdown/task-dropdown.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-slot-card',
  standalone: true,
  imports: [CommonModule, TaskDropdownComponent],
  template: `
    <div class="skew-outer">
      <div class="slot-card"
           [class.free]="slot().status === 'free'"
           [class.set]="slot().status === 'set' && !slot().completed"
           [class.completed]="slot().completed"
           [class]="themeService.getCurrentConfig().animationClass"
           [class.card-slam]="themeService.getCurrentConfig().id === 'p5'"
           (click)="openDropdown()">

        <div class="slot-label" [style.transform]="'rotate(' + themeService.getCurrentConfig().cssVars['--text-angle'] + ')'">
          {{ slotName() }}
        </div>

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
            <div class="done-badge" [class.p5-confirm-pulse]="themeService.getCurrentConfig().id === 'p5'">
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
    :host {
      display: block;
    }
    .skew-outer {
      transform: skewX(-8deg);
      overflow: visible;
    }
    .slot-card {
      background: #111111;
      border: 1px solid #2a2a2a;
      border-left: 6px solid #e8001a;
      padding: 1.25rem 1.5rem;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border-radius: 0;
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
      box-shadow: 4px 4px 0 #e8001a;
      transition: box-shadow 0.05s, border-color 0.05s;
    }
    .slot-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 6px;
      background: #e8001a;
    }
    .slot-card.free {
      opacity: 0.5;
    }
    .slot-card.set {
      border-color: rgba(232,0,26,0.3);
      border-left-color: #e8001a;
    }
    .slot-card.set::before {
      background: #e8001a;
    }
    .slot-card.completed {
      opacity: 0.75;
    }
    .slot-card.completed::before {
      background: #76ff03;
    }
    .slot-card:hover {
      box-shadow: 6px 6px 0 #e8001a;
    }
    .slot-label {
      font-family: 'Impact', sans-serif;
      font-weight: 700;
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: rgba(240,240,240,0.4);
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      display: block;
      transition: color 0.05s;
    }
    .slot-card:hover .slot-label {
      color: #e8001a;
    }
    .slot-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .slot-content {
      flex: 1;
      min-width: 0;
    }
    .free-text {
      font-family: 'Impact', sans-serif;
      font-weight: 600;
      font-size: 0.8rem;
      letter-spacing: 0.15em;
      color: rgba(240,240,240,0.3);
    }
    .task-name {
      font-family: 'Impact', sans-serif;
      font-weight: 900;
      font-size: 1.5rem;
      color: #f0f0f0;
      letter-spacing: 0.02em;
      transition: all 0.05s ease;
      display: block;
    }
    .task-name.done {
      text-decoration: line-through;
      color: rgba(240,240,240,0.3);
    }
    .check-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid rgba(118,255,3,0.4);
      background: transparent;
      color: rgba(118,255,3,0.7);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.05s ease;
      flex-shrink: 0;
    }
    .check-btn svg {
      width: 18px;
      height: 18px;
    }
    .check-btn:hover {
      background: rgba(118,255,3,0.15);
      border-color: #76ff03;
      color: #76ff03;
      box-shadow: 0 0 20px rgba(118,255,3,0.4);
    }
    .done-badge {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(118,255,3,0.15);
      border: 2px solid #76ff03;
      color: #76ff03;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px rgba(118,255,3,0.3);
      flex-shrink: 0;
    }
    .done-badge.p5-confirm-pulse {
      animation: p5-confirm-pulse 2s ease-in-out infinite;
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
      font-family: 'Impact', sans-serif;
      font-weight: 700;
      font-size: 0.55rem;
      letter-spacing: 0.12em;
      padding: 3px 10px;
      text-transform: uppercase;
    }
    .stat-badge[data-stat="academics"] { background: rgba(21,101,192,0.85); color: #fff; }
    .stat-badge[data-stat="proficiency"] { background: rgba(46,125,50,0.85); color: #fff; }
    .stat-badge[data-stat="kindness"] { background: rgba(194,24,91,0.85); color: #fff; }
    .stat-badge[data-stat="guts"] { background: rgba(230,81,0,0.85); color: #fff; }
    .stat-badge[data-stat="courage"] { background: rgba(249,168,37,0.9); color: #212121; }
    .growth-popup {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-family: 'Impact', sans-serif;
      font-weight: 900;
      font-size: 1rem;
      color: #76ff03;
      text-shadow: 0 0 15px rgba(118,255,3,0.8);
      pointer-events: none;
      animation: floatUp 2s ease-out forwards;
    }
    @keyframes floatUp {
      0% { opacity: 1; transform: translateY(0); }
      70% { opacity: 1; transform: translateY(-30px); }
      100% { opacity: 0; transform: translateY(-50px); }
    }
    @keyframes p5-confirm-pulse {
      0%, 100% { box-shadow: 0 0 15px #76ff03; }
      50% { box-shadow: 0 0 30px #76ff03, 0 0 50px rgba(118,255,3,0.4); }
    }
  `]
})
export class SlotCardComponent {
  slot = input.required<Slot>();
  slotName = input.required<string>();
  tasks = input.required<Task[]>();
  taskSelected = output<string | null>();
  completed = output<{ slot: string; statGain: number; statName: string }>();

  themeService = inject(ThemeService);

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
