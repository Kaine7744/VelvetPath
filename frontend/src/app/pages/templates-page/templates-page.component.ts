import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateService } from '../../services/template.service';
import { TaskService } from '../../services/task.service';
import { Template, Task } from '../../models';

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const SLOT_LABELS: Record<string, string> = {
  morning: 'MORNING',
  afternoon: 'AFTERNOON',
  evening: 'EVENING'
};

@Component({
  selector: 'app-templates-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="recurring-page">
      <div class="page-header">
        <div class="calling-card header-card">
          <div class="calling-card-label">▶ CONFIGURE — RECURRING TASKS</div>
          <div class="skew-heading">
            <div class="skew-heading-inner">RECURRING TASKS</div>
          </div>
        </div>
        <div class="drip-divider"></div>
      </div>

      <!-- Recurring tasks menu -->
      <div class="recurring-menu p5-panel">
        <div class="menu-header">— RECURRING TASKS —</div>

        @for (template of templates(); track template.id) {
          <div class="recurring-item"
               [class.editing]="editingId() === template.id">
            @if (editingId() !== template.id) {
              <div class="recurring-row" (click)="startEdit(template)">
                <div class="recurring-info">
                  <span class="recurring-task">{{ template.taskName || '—' }}</span>
                  <div class="recurring-meta">
                    <span class="recurring-slot">{{ SLOT_LABELS[template.slot] }}</span>
                    <div class="recurring-days">
                      @for (d of template.daysOfWeek; track d) {
                        <span class="day-pill" [class.active]="true">{{ DAY_SHORT[d] }}</span>
                      }
                    </div>
                  </div>
                </div>
                <div class="recurring-actions">
                  <label class="toggle-switch" (click)="$event.stopPropagation()">
                    <input type="checkbox" [checked]="template.enabled"
                      (change)="toggleEnabled(template, $any($event.target).checked)" />
                    <span class="toggle-slider"></span>
                  </label>
                  <button class="p5-btn p5-btn-small" (click)="startEdit(template); $event.stopPropagation()">EDIT</button>
                  <button class="p5-btn p5-btn-danger p5-btn-small" (click)="deleteTemplate(template.id); $event.stopPropagation()">DEL</button>
                </div>
              </div>
            }

            @if (editingId() === template.id) {
              <div class="recurring-edit-inline">
                <div class="edit-row">
                  <label class="edit-label">TASK</label>
                  <select class="p5-input edit-select"
                    [value]="editTaskId()"
                    (change)="editTaskId.set($any($event.target).value)">
                    @for (task of tasks(); track task.id) {
                      <option [value]="task.id">{{ task.name }}</option>
                    }
                  </select>
                </div>
                <div class="edit-row">
                  <label class="edit-label">SLOT</label>
                  <div class="slot-radios">
                    @for (slot of SLOTS; track slot) {
                      <label class="slot-radio-label" [class.active]="editSlot() === slot">
                        <input type="radio" [value]="slot" [checked]="editSlot() === slot"
                          (change)="editSlot.set(slot)" class="sr-only" />
                        {{ SLOT_LABELS[slot] }}
                      </label>
                    }
                  </div>
                </div>
                <div class="edit-row">
                  <label class="edit-label">DAYS</label>
                  <div class="day-toggles">
                    @for (d of [1,2,3,4,5,6,0]; track d) {
                      <button type="button"
                        class="day-toggle-btn"
                        [class.active]="editDays().includes(d)"
                        (click)="toggleEditDay(d)">
                        {{ DAY_SHORT[d] }}
                      </button>
                    }
                  </div>
                </div>
                <div class="edit-actions">
                  <button class="p5-btn p5-btn-confirm" (click)="saveEdit()">CONFIRM</button>
                  <button class="p5-btn p5-btn-cancel" (click)="cancelEdit()">ESCAPE</button>
                </div>
              </div>
            }
          </div>
        }

        <!-- Add new recurring task -->
        @if (addingRecurring()) {
          <div class="recurring-edit-inline adding">
            <div class="edit-row">
              <label class="edit-label">TASK</label>
              <select class="p5-input edit-select"
                [value]="newTaskId()"
                (change)="newTaskId.set($any($event.target).value)">
                <option value="">SELECT TASK</option>
                @for (task of tasks(); track task.id) {
                  <option [value]="task.id">{{ task.name }}</option>
                }
              </select>
            </div>
            <div class="edit-row">
              <label class="edit-label">SLOT</label>
              <div class="slot-radios">
                @for (slot of SLOTS; track slot) {
                  <label class="slot-radio-label" [class.active]="newSlot() === slot">
                    <input type="radio" [value]="slot" [checked]="newSlot() === slot"
                      (change)="newSlot.set(slot)" class="sr-only" />
                    {{ SLOT_LABELS[slot] }}
                  </label>
                }
              </div>
            </div>
            <div class="edit-row">
              <label class="edit-label">DAYS</label>
              <div class="day-toggles">
                @for (d of [1,2,3,4,5,6,0]; track d) {
                  <button type="button"
                    class="day-toggle-btn"
                    [class.active]="newDays().includes(d)"
                    (click)="toggleNewDay(d)">
                    {{ DAY_SHORT[d] }}
                  </button>
                }
              </div>
            </div>
            <div class="edit-actions">
              <button class="p5-btn p5-btn-confirm" (click)="addTemplate()">CREATE</button>
              <button class="p5-btn p5-btn-cancel" (click)="addingRecurring.set(false)">ESCAPE</button>
            </div>
          </div>
        } @else {
          <div class="recurring-item add-item" (click)="addingRecurring.set(true)">
            <span class="recurring-task">+ NEW RECURRING TASK</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .recurring-page {
      padding: 2rem;
      max-width: 700px;
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
      text-transform: uppercase;
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

    /* Recurring menu */
    .recurring-menu {
      overflow: hidden;
      background: var(--color-card);
      border-left: 6px solid var(--color-primary);
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
    }
    .menu-header {
      font-family: var(--font-display);
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: var(--color-text-dim);
      padding: 10px 20px;
      border-bottom: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
    }
    .recurring-item {
      border-bottom: 1px solid color-mix(in srgb, var(--color-text) 5%, transparent);
    }
    .recurring-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      cursor: pointer;
      transition: background 0.05s;
    }
    .recurring-row:hover {
      background: color-mix(in srgb, var(--color-primary) 15%, transparent);
    }
    .recurring-item.editing {
      background: rgba(0,0,0,0.2);
    }
    .recurring-info {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .recurring-task {
      font-family: var(--font-display);
      font-size: 0.95rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text);
    }
    .recurring-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .recurring-slot {
      font-family: var(--font-display);
      font-size: 0.55rem;
      letter-spacing: 0.15em;
      color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 15%, transparent);
      padding: 2px 8px;
    }
    .recurring-days {
      display: flex;
      gap: 4px;
    }
    .day-pill {
      font-family: var(--font-display);
      font-size: 0.5rem;
      letter-spacing: 0.1em;
      padding: 2px 5px;
      background: color-mix(in srgb, var(--color-primary) 25%, transparent);
      color: var(--color-text-dim);
    }
    .day-pill.active {
      background: var(--color-primary);
      color: #fff;
    }
    .recurring-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .add-item {
      padding: 12px 20px;
      cursor: pointer;
      color: var(--color-text-dim);
    }
    .add-item:hover {
      background: var(--color-primary);
      color: #fff;
    }
    .add-item .recurring-task {
      color: var(--color-text-dim);
      font-size: 0.8rem;
    }
    .add-item:hover .recurring-task {
      color: #fff;
    }

    /* Edit form */
    .recurring-edit-inline {
      padding: 14px 20px;
      background: rgba(0,0,0,0.25);
    }
    .recurring-edit-inline.adding {
      border-top: 2px solid var(--color-primary);
    }
    .edit-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    .edit-label {
      font-family: var(--font-display);
      font-size: 0.55rem;
      letter-spacing: 0.15em;
      color: var(--color-text-dim);
      min-width: 40px;
    }
    .edit-select {
      flex: 1;
    }
    .slot-radios {
      display: flex;
      gap: 6px;
    }
    .slot-radio-label {
      font-family: var(--font-display);
      font-size: 0.55rem;
      letter-spacing: 0.1em;
      padding: 4px 10px;
      border: 1px solid color-mix(in srgb, var(--color-primary) 40%, transparent);
      color: var(--color-text-dim);
      cursor: pointer;
      transition: all 0.1s;
    }
    .slot-radio-label.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #fff;
    }
    .day-toggles {
      display: flex;
      gap: 4px;
    }
    .day-toggle-btn {
      font-family: var(--font-display);
      font-size: 0.55rem;
      letter-spacing: 0.1em;
      padding: 4px 8px;
      border: 1px solid color-mix(in srgb, var(--color-primary) 40%, transparent);
      background: transparent;
      color: var(--color-text-dim);
      cursor: pointer;
      transition: all 0.1s;
    }
    .day-toggle-btn.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #fff;
    }
    .edit-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    /* Toggle switch */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 36px;
      height: 20px;
    }
    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .toggle-slider {
      position: absolute;
      cursor: pointer;
      inset: 0;
      background: color-mix(in srgb, var(--color-text) 20%, transparent);
      transition: 0.2s;
      border-radius: 20px;
    }
    .toggle-slider::before {
      position: absolute;
      content: '';
      height: 14px;
      width: 14px;
      left: 3px;
      bottom: 3px;
      background: #fff;
      transition: 0.2s;
      border-radius: 50%;
    }
    .toggle-switch input:checked + .toggle-slider {
      background: var(--color-success);
    }
    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(16px);
    }

    /* Buttons */
    .p5-btn {
      font-family: var(--font-display);
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      padding: 6px 14px;
      border: 1px solid var(--color-primary);
      background: transparent;
      color: var(--color-primary);
      cursor: pointer;
      transition: all 0.1s;
    }
    .p5-btn:hover {
      background: var(--color-primary);
      color: #fff;
    }
    .p5-btn-small {
      padding: 4px 10px;
      font-size: 0.55rem;
    }
    .p5-btn-confirm {
      border-color: var(--color-success);
      color: var(--color-success);
    }
    .p5-btn-confirm:hover {
      background: var(--color-success);
      color: #000;
    }
    .p5-btn-cancel {
      border-color: var(--color-text-dim);
      color: var(--color-text-dim);
    }
    .p5-btn-cancel:hover {
      background: color-mix(in srgb, var(--color-text-dim) 20%, transparent);
      color: var(--color-text);
    }
    .p5-btn-danger {
      border-color: #e53935;
      color: #e53935;
    }
    .p5-btn-danger:hover {
      background: rgba(229,57,53,0.2);
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    }
  `]
})
export class TemplatesPageComponent implements OnInit {
  private templateService = inject(TemplateService);
  private taskService = inject(TaskService);

  templates = signal<Template[]>([]);
  tasks = signal<Task[]>([]);

  editingId = signal<string | null>(null);
  editTaskId = signal('');
  editSlot = signal<'morning' | 'afternoon' | 'evening'>('morning');
  editDays = signal<number[]>([]);

  addingRecurring = signal(false);
  newTaskId = signal('');
  newSlot = signal<'morning' | 'afternoon' | 'evening'>('morning');
  newDays = signal<number[]>([]);

  readonly DAY_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];
  readonly SLOT_LABELS = SLOT_LABELS;
  readonly DAY_LABELS = DAY_LABELS;
  readonly SLOTS: ('morning' | 'afternoon' | 'evening')[] = ['morning', 'afternoon', 'evening'];

  ngOnInit() {
    this.loadTemplates();
    this.loadTasks();
  }

  loadTemplates() {
    this.templateService.getTemplates().subscribe({
      next: t => this.templates.set(t),
      error: err => console.error('Failed to load templates:', err)
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: t => this.tasks.set(t),
      error: err => console.error('Failed to load tasks:', err)
    });
  }

  toggleEnabled(template: Template, enabled: boolean) {
    this.templateService.updateTemplate(template.id, { enabled }).subscribe({
      next: () => this.loadTemplates(),
      error: err => console.error('Failed to toggle template:', err)
    });
  }

  startEdit(t: Template) {
    this.editingId.set(t.id);
    this.editTaskId.set(t.taskId);
    this.editSlot.set(t.slot);
    this.editDays.set([...t.daysOfWeek]);
    this.addingRecurring.set(false);
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editTaskId.set('');
    this.editSlot.set('morning');
    this.editDays.set([]);
  }

  saveEdit() {
    const id = this.editingId();
    if (!id) return;
    if (!this.editTaskId()) return;
    if (!this.editDays().length) { alert('Select at least one day'); return; }
    this.templateService.updateTemplate(id, {
      taskId: this.editTaskId(),
      slot: this.editSlot(),
      daysOfWeek: this.editDays()
    }).subscribe({
      next: () => { this.loadTemplates(); this.cancelEdit(); },
      error: err => console.error('Failed to update template:', err)
    });
  }

  deleteTemplate(id: string) {
    if (!confirm('Delete this template?')) return;
    this.templateService.deleteTemplate(id).subscribe({
      next: () => { this.loadTemplates(); this.cancelEdit(); },
      error: err => console.error('Failed to delete template:', err)
    });
  }

  toggleEditDay(day: number) {
    const current = this.editDays();
    if (current.includes(day)) {
      this.editDays.set(current.filter(d => d !== day));
    } else {
      this.editDays.set([...current, day].sort((a, b) => a - b));
    }
  }

  addTemplate() {
    if (!this.newTaskId()) { alert('Select a task'); return; }
    if (!this.newDays().length) { alert('Select at least one day'); return; }
    this.templateService.createTemplate({
      taskId: this.newTaskId(),
      slot: this.newSlot(),
      daysOfWeek: this.newDays()
    }).subscribe({
      next: () => {
        this.loadTemplates();
        this.newTaskId.set('');
        this.newSlot.set('morning');
        this.newDays.set([]);
        this.addingRecurring.set(false);
      },
      error: err => console.error('Failed to create template:', err)
    });
  }

  toggleNewDay(day: number) {
    const current = this.newDays();
    if (current.includes(day)) {
      this.newDays.set(current.filter(d => d !== day));
    } else {
      this.newDays.set([...current, day].sort((a, b) => a - b));
    }
  }
}
