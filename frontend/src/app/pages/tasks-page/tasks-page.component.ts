import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { SkillService } from '../../services/skill.service';
import { Task, Skill } from '../../models';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tasks-page">
      <div class="page-header">
        <div class="calling-card header-card">
          <div class="calling-card-label">▶ CONFIGURE — TASKS</div>
          <div class="skew-heading">
            <div class="skew-heading-inner">TASKS</div>
          </div>
        </div>
      </div>

      <!-- Tasks menu -->
      <div class="tasks-menu p5-panel">
        <div class="menu-header">— TASK LIST —</div>

        @for (task of allTasks(); track task.id) {
          <div class="task-menu-item"
               [class.editing]="editingTaskId() === task.id"
               (click)="startEditTask(task)">
            <span class="task-menu-name">{{ task.name }}</span>
            <div class="task-menu-right">
              <span class="task-skill-badge">{{ task.statName || '—' }}</span>
              <span class="task-menu-gain">+{{ task.statGain }}</span>
            </div>
          </div>

          @if (editingTaskId() === task.id) {
            <div class="task-edit-inline">
              <input
                class="p5-input task-name-input"
                placeholder="TASK NAME"
                [value]="editTaskName()"
                (input)="editTaskName.set($any($event.target).value)"
              />
              <div class="task-edit-row">
                <select
                  class="p5-input task-select"
                  [value]="editTaskSkill()"
                  (change)="onEditSkillChange($any($event.target).value)"
                >
                  <option value="">NO SKILL</option>
                  @for (skill of skills(); track skill.id) {
                    <option [value]="skill.id">{{ skill.name }}</option>
                  }
                </select>
                <input
                  class="p5-input task-gain-input"
                  type="number"
                  min="1"
                  placeholder="GAIN"
                  [disabled]="!editTaskSkill()"
                  [value]="editTaskGain()"
                  (input)="editTaskGain.set(+$any($event.target).value)"
                />
              </div>
              <div class="task-edit-actions">
                <button class="p5-btn p5-btn-confirm" (click)="saveTask()">CONFIRM</button>
                <button class="p5-btn p5-btn-cancel" (click)="cancelEditTask()">ESCAPE</button>
                @if (!isBuiltIn(task.id)) {
                  <button class="p5-btn p5-btn-danger" (click)="deleteTask(task.id)">DELETE</button>
                }
              </div>
            </div>
          }
        }

        <!-- Add new task -->
        @if (addingTask()) {
          <div class="task-edit-inline">
            <input
              class="p5-input task-name-input"
              placeholder="NEW TASK NAME"
              [value]="newTaskName()"
              (input)="newTaskName.set($any($event.target).value)"
            />
            <div class="task-edit-row">
              <select
                class="p5-input task-select"
                [value]="newTaskSkillId()"
                (change)="onNewTaskSkillChange($any($event.target).value)"
              >
                <option value="">NO SKILL</option>
                @for (skill of skills(); track skill.id) {
                  <option [value]="skill.id">{{ skill.name }}</option>
                }
              </select>
              <input
                class="p5-input task-gain-input"
                type="number"
                min="1"
                placeholder="GAIN"
                [disabled]="!newTaskSkillId()"
                [value]="newTaskGain()"
                (input)="newTaskGain.set(+$any($event.target).value)"
              />
            </div>
            <div class="task-edit-actions">
              <button class="p5-btn p5-btn-confirm" (click)="addTask()">CONFIRM</button>
              <button class="p5-btn p5-btn-cancel" (click)="addingTask.set(false); newTaskName.set('');">ESCAPE</button>
            </div>
          </div>
        } @else {
          <div class="task-menu-item add-item" (click)="addingTask.set(true)">
            <span class="task-menu-name">+ NEW TASK</span>
          </div>
        }
      </div>

      @if (taskFeedback()) {
        <div class="feedback-flash">+ TASK ADDED</div>
      }
    </div>
  `,
  styles: [`
    .tasks-page {
      padding: 2rem;
      max-width: 600px;
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

    /* Tasks menu */
    .tasks-menu {
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
    .task-menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid color-mix(in srgb, var(--color-text) 5%, transparent);
      cursor: pointer;
      transition: background 0.05s;
    }
    .task-menu-item:hover,
    .task-menu-item.editing {
      background: var(--color-primary);
    }
    .task-menu-item.add-item {
      color: var(--color-text-dim);
      font-family: var(--font-display);
      font-size: 0.8rem;
      letter-spacing: 0.15em;
    }
    .task-menu-item.add-item:hover {
      background: var(--color-primary);
      color: #fff;
    }
    .task-menu-name {
      font-family: var(--font-display);
      font-size: 0.95rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text);
    }
    .task-menu-item:hover .task-menu-name,
    .task-menu-item.editing .task-menu-name {
      color: #fff;
    }
    .task-menu-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .task-skill-badge {
      font-family: var(--font-display);
      font-size: 0.55rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #fff;
      background: var(--color-primary);
      padding: 3px 8px;
    }
    .task-menu-gain {
      font-family: var(--font-display);
      font-size: 0.9rem;
      color: var(--color-success);
      font-weight: 900;
    }
    .task-edit-inline {
      padding: 14px 20px;
      background: rgba(0,0,0,0.3);
      border-bottom: 1px solid color-mix(in srgb, var(--color-text) 5%, transparent);
    }
    .task-name-input {
      margin-bottom: 8px;
    }
    .task-edit-row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    .task-select {
      flex: 2;
    }
    .task-gain-input {
      flex: 1;
      text-align: center;
    }
    .task-edit-actions {
      display: flex;
      gap: 8px;
    }
    .p5-btn-danger {
      background: transparent;
      border: 1px solid #e53935;
      color: #e53935;
    }
    .p5-btn-danger:hover {
      background: rgba(229,57,53,0.2);
    }
    .feedback-flash {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--color-success);
      color: #000;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.1em;
      padding: 10px 20px;
      z-index: 100;
      animation: feedback-pop 2s ease-out forwards;
    }
    @keyframes feedback-pop {
      0% { opacity: 0; transform: translateY(10px); }
      15% { opacity: 1; transform: translateY(0); }
      80% { opacity: 1; }
      100% { opacity: 0; }
    }
  `]
})
export class TasksPageComponent implements OnInit {
  private taskService = inject(TaskService);
  private skillService = inject(SkillService);

  skills = signal<Skill[]>([]);
  allTasks = signal<Task[]>([]);

  editingTaskId = signal<string | null>(null);
  editTaskName = signal('');
  editTaskSkill = signal('');
  editTaskGain = signal(1);

  addingTask = signal(false);
  newTaskName = signal('');
  newTaskSkillId = signal('');
  newTaskGain = signal(1);
  taskFeedback = signal(false);

  private readonly BUILT_IN_TASK_IDS = ['work', 'study', 'gym', 'social', 'hobbies'];

  ngOnInit() {
    this.loadSkills();
    this.loadTasks();
  }

  loadSkills() {
    this.skillService.getSkills().subscribe({
      next: s => this.skills.set(s),
      error: err => console.error('Failed to load skills:', err)
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: t => this.allTasks.set(t),
      error: err => console.error('Failed to load tasks:', err)
    });
  }

  isBuiltIn(taskId: string): boolean {
    return this.BUILT_IN_TASK_IDS.includes(taskId);
  }

  startEditTask(task: Task) {
    this.editingTaskId.set(task.id);
    this.editTaskName.set(task.name);
    this.editTaskSkill.set(task.statId || '');
    this.editTaskGain.set(task.statGain);
    this.addingTask.set(false);
  }

  onEditSkillChange(skillId: string) {
    this.editTaskSkill.set(skillId);
    if (!skillId) this.editTaskGain.set(1);
  }

  onNewTaskSkillChange(skillId: string) {
    this.newTaskSkillId.set(skillId);
    if (!skillId) this.newTaskGain.set(1);
  }

  cancelEditTask() {
    this.editingTaskId.set(null);
    this.editTaskName.set('');
    this.editTaskSkill.set('');
    this.editTaskGain.set(1);
  }

  saveTask() {
    const id = this.editingTaskId();
    if (!id) return;
    const name = this.editTaskName().trim();
    const statId = this.editTaskSkill() || null;
    const statGain = this.editTaskGain();
    if (!name) return;
    this.taskService.updateTask(id, { name, statId, statGain }).subscribe({
      next: () => { this.loadTasks(); this.cancelEditTask(); },
      error: err => console.error('Failed to update task:', err)
    });
  }

  deleteTask(id: string) {
    if (!confirm('Delete this task?')) return;
    this.taskService.deleteTask(id).subscribe({
      next: () => { this.loadTasks(); this.cancelEditTask(); },
      error: err => console.error('Failed to delete task:', err)
    });
  }

  addTask() {
    const name = this.newTaskName().trim();
    const statId = this.newTaskSkillId() || null;
    const statGain = this.newTaskGain();
    if (!name) return;
    this.taskService.createTask({ name, statId, statGain }).subscribe({
      next: () => {
        this.loadTasks();
        this.newTaskName.set('');
        this.newTaskSkillId.set('');
        this.newTaskGain.set(1);
        this.addingTask.set(false);
        this.taskFeedback.set(true);
        setTimeout(() => this.taskFeedback.set(false), 2000);
      },
      error: err => console.error('Failed to create task:', err)
    });
  }
}
