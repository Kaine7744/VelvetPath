import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService, ThemeId } from '../../services/theme.service';
import { SkillService } from '../../services/skill.service';
import { TaskService } from '../../services/task.service';
import { Skill, Task } from '../../models';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page">
      <div class="page-title skew-heading">
        <div class="skew-heading-inner">SETTINGS</div>
      </div>

      <!-- Appearance section -->
      <div class="settings-section">
        <div class="section-label">— APPEARANCE —</div>
        <div class="theme-cards">
          @for (config of themeService.getAllConfigs(); track config.id) {
            <div
              class="theme-card"
              [class.active]="themeService.currentTheme() === config.id"
              [attr.data-theme-preview]="config.id"
              [style.--preview-primary]="config.cssVars['--color-primary']"
              [style.--preview-glow]="config.cssVars['--color-glow']"
              [style.--preview-card]="config.cssVars['--color-card']"
              [style.--preview-border]="config.cssVars['--color-border']"
              [style.--preview-text]="config.cssVars['--color-text']"
              (click)="selectTheme(config.id)"
            >
              <div class="theme-header">
                <span class="theme-stars">★</span>
                <span class="theme-name">{{ config.name }}</span>
                <span class="theme-stars">★</span>
              </div>
              <div class="mini-preview">
                <div class="mini-card" [style.--mini-accent]="config.cssVars['--color-primary']">
                  <div class="mini-label">MORNING</div>
                  <div class="mini-content">Study</div>
                  <div class="mini-stat">ACADEMICS +2</div>
                </div>
              </div>
              @if (themeService.currentTheme() === config.id) {
                <div class="active-badge">● ACTIVE</div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Tasks section — P5 menu style -->
      <div class="settings-section">
        <div class="section-label">— MANAGE TASKS —</div>

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
                    (change)="editTaskSkill.set($any($event.target).value)"
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
                  (change)="newTaskSkillId.set($any($event.target).value)"
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
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      padding: 20px;
      max-width: 600px;
    }
    .page-title {
      font-family: 'Impact', sans-serif;
      font-weight: 900;
      font-size: 3rem;
      color: #e8001a;
      letter-spacing: 0.15em;
      text-shadow: 0 0 30px rgba(232,0,26,0.5);
      margin-bottom: 24px;
      transform: skewX(-8deg);
      display: inline-block;
    }
    .settings-section {
      margin-bottom: 24px;
    }
    .section-label {
      font-family: 'Impact', sans-serif;
      font-weight: 700;
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: rgba(240,240,240,0.4);
      margin-bottom: 12px;
    }
    .theme-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      max-width: 520px;
    }
    .theme-card {
      background: #111;
      border: 2px solid #2a2a2a;
      padding: 16px;
      cursor: pointer;
      transition: border-color 0.05s, box-shadow 0.05s;
      position: relative;
    }
    .theme-card:hover {
      border-color: var(--preview-primary, #e8001a);
      box-shadow: 3px 3px 0 var(--preview-primary, #e8001a);
    }
    .theme-card.active {
      border-color: var(--preview-primary, #e8001a);
      border-left-width: 4px;
      box-shadow: 4px 4px 0 var(--preview-primary, #e8001a);
    }
    .theme-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-bottom: 12px;
    }
    .theme-stars {
      font-size: 0.8rem;
      color: var(--preview-primary, #e8001a);
    }
    .theme-name {
      font-family: 'Impact', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.1em;
      color: var(--preview-text, #f0f0f0);
    }
    .mini-preview {
      display: flex;
      justify-content: center;
    }
    .mini-card {
      width: 130px;
      background: var(--preview-card, #111);
      border: 2px solid var(--preview-border, #2a2a2a);
      padding: 8px 12px;
      position: relative;
      overflow: hidden;
    }
    .mini-card::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: var(--mini-accent, #e8001a);
    }
    .mini-label {
      font-family: 'Impact', sans-serif;
      font-size: 0.45rem;
      letter-spacing: 0.15em;
      color: rgba(240,240,240,0.4);
      margin-bottom: 4px;
    }
    .mini-content {
      font-family: 'Impact', sans-serif;
      font-weight: 800;
      font-size: 0.9rem;
      color: var(--preview-text, #f0f0f0);
      margin-bottom: 4px;
    }
    .mini-stat {
      font-size: 0.45rem;
      letter-spacing: 0.1em;
      color: var(--mini-accent, #e8001a);
      font-weight: 700;
    }
    .active-badge {
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--preview-primary, #e8001a);
      color: #fff;
      font-family: 'Impact', sans-serif;
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      padding: 2px 10px;
      white-space: nowrap;
    }

    /* Tasks P5 menu */
    .tasks-menu {
      overflow: hidden;
      background: #111;
      border-left: 6px solid #e8001a;
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
    }
    .menu-header {
      font-family: 'Impact', sans-serif;
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      color: rgba(240,240,240,0.4);
      padding: 10px 20px;
      border-bottom: 1px solid rgba(232,0,26,0.3);
    }
    .task-menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      cursor: pointer;
      transition: background 0.05s;
    }
    .task-menu-item:hover,
    .task-menu-item.editing {
      background: #e8001a;
    }
    .task-menu-item.add-item {
      color: rgba(240,240,240,0.4);
      font-family: 'Impact', sans-serif;
      font-size: 0.8rem;
      letter-spacing: 0.15em;
    }
    .task-menu-item.add-item:hover {
      background: #e8001a;
      color: #fff;
    }
    .task-menu-name {
      font-family: 'Impact', sans-serif;
      font-size: 0.95rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(240,240,240,0.7);
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
      font-family: 'Impact', sans-serif;
      font-size: 0.55rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #fff;
      background: #e8001a;
      padding: 3px 8px;
    }
    .task-menu-gain {
      font-family: 'Impact', sans-serif;
      font-size: 0.9rem;
      color: #76ff03;
      font-weight: 900;
    }
    .task-edit-inline {
      padding: 14px 20px;
      background: rgba(0,0,0,0.3);
      border-bottom: 1px solid rgba(255,255,255,0.05);
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
  `]
})
export class SettingsPageComponent implements OnInit {
  themeService = inject(ThemeService);
  private skillService = inject(SkillService);
  private taskService = inject(TaskService);
  private router = inject(Router);

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

  selectTheme(id: ThemeId) {
    this.themeService.setTheme(id);
    this.router.navigate(['/']);
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
      },
      error: err => console.error('Failed to create task:', err)
    });
  }
}
