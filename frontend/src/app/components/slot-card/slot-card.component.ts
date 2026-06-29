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
            <button class="remove-btn" (click)="onRemove($event)" title="Remove task">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          }
          @if (slot().completed) {
            <div class="done-badge" [class.p5-confirm-pulse]="themeService.getCurrentConfig().id === 'p5'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <button class="unfinish-btn" (click)="onUnfinish($event)" title="Undo completion">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
              </svg>
            </button>
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
      overflow: hidden;
    }
    .slot-card {
      background: var(--color-card);
      border: 1px solid var(--color-border);
      border-left: 6px solid var(--color-primary);
      padding: 1.25rem 1.5rem;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      border-radius: 0;
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
      box-shadow: var(--card-shadow);
      transition: box-shadow 0.05s, border-color 0.05s;
    }
    .slot-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 10px;
      bottom: 0;
      width: 6px;
      background: var(--color-primary);
    }
    .slot-card.free {
      opacity: 0.5;
    }
    .slot-card.set {
      border-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
      border-left-color: var(--color-primary);
    }
    .slot-card.set::before {
      background: var(--color-primary);
    }
    .slot-card.completed {
      opacity: 0.75;
    }
    .slot-card.completed::before {
      background: var(--color-success);
    }
    .slot-card:hover {
      box-shadow: 6px 6px 0 var(--color-primary);
    }
    .slot-label {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: var(--color-text-dim);
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      display: block;
      transition: color 0.05s;
    }
    .slot-card:hover .slot-label {
      color: var(--color-primary);
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
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 0.8rem;
      letter-spacing: 0.15em;
      color: var(--color-text-dim);
    }
    .task-name {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 1.5rem;
      color: var(--color-text);
      letter-spacing: 0.02em;
      transition: all 0.05s ease;
      display: block;
    }
    .task-name.done {
      text-decoration: line-through;
      color: var(--color-text-dim);
    }
    .check-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid color-mix(in srgb, var(--color-success) 40%, transparent);
      background: transparent;
      color: color-mix(in srgb, var(--color-success) 70%, transparent);
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
      background: color-mix(in srgb, var(--color-success) 15%, transparent);
      border-color: var(--color-success);
      color: var(--color-success);
      box-shadow: 0 0 20px color-mix(in srgb, var(--color-success) 40%, transparent);
    }
    .remove-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid color-mix(in srgb, var(--color-danger) 40%, transparent);
      background: transparent;
      color: color-mix(in srgb, var(--color-danger) 70%, transparent);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .remove-btn svg {
      width: 14px;
      height: 14px;
    }
    .remove-btn:hover {
      background: color-mix(in srgb, var(--color-danger) 15%, transparent);
      border-color: var(--color-danger);
      color: var(--color-danger);
      box-shadow: 0 0 15px color-mix(in srgb, var(--color-danger) 40%, transparent);
    }
    .done-badge {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: color-mix(in srgb, var(--color-success) 15%, transparent);
      border: 2px solid var(--color-success);
      color: var(--color-success);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px color-mix(in srgb, var(--color-success) 30%, transparent);
      flex-shrink: 0;
    }
    .done-badge.p5-confirm-pulse {
      animation: p5-confirm-pulse 2s ease-in-out infinite;
    }
    .done-badge svg {
      width: 18px;
      height: 18px;
    }
    .unfinish-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid color-mix(in srgb, var(--color-warning) 40%, transparent);
      background: transparent;
      color: color-mix(in srgb, var(--color-warning) 70%, transparent);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }
    .unfinish-btn svg {
      width: 14px;
      height: 14px;
    }
    .unfinish-btn:hover {
      background: color-mix(in srgb, var(--color-warning) 15%, transparent);
      border-color: var(--color-warning);
      color: var(--color-warning);
      box-shadow: 0 0 15px color-mix(in srgb, var(--color-warning) 40%, transparent);
    }
    .slot-meta {
      margin-top: 0.75rem;
    }
    .stat-badge {
      display: inline-block;
      font-family: var(--font-display);
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
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 1rem;
      color: var(--color-success);
      text-shadow: 0 0 15px var(--color-glow);
      pointer-events: none;
      animation: floatUp 2s ease-out forwards;
    }
    @keyframes floatUp {
      0% { opacity: 1; transform: translateY(0); }
      70% { opacity: 1; transform: translateY(-30px); }
      100% { opacity: 0; transform: translateY(-50px); }
    }
    @keyframes p5-confirm-pulse {
      0%, 100% { box-shadow: 0 0 15px var(--color-success); }
      50% { box-shadow: 0 0 30px var(--color-success), 0 0 50px color-mix(in srgb, var(--color-success) 40%, transparent); }
    }
  `]
})
export class SlotCardComponent {
  slot = input.required<Slot>();
  slotName = input.required<string>();
  tasks = input.required<Task[]>();
  taskSelected = output<string | null>();
  completed = output<{ slot: string; statGain: number; statName: string }>();
  uncompleted = output<{ slot: string; statGain: number; statName: string }>();

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

  onRemove(e: MouseEvent) {
    e.stopPropagation();
    this.taskSelected.emit(null);
  }

  onUnfinish(e: MouseEvent) {
    e.stopPropagation();
    const slot = this.slot();
    if (slot.status === 'set' && slot.task && slot.completed) {
      this.uncompleted.emit({ slot: this.slotName(), statGain: slot.task.statGain, statName: slot.task.statName || '' });
    }
  }
}
