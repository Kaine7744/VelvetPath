import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkillService } from '../../services/skill.service';
import { Skill } from '../../models';
import { SpiderChartComponent } from '../../components/spider-chart/spider-chart.component';

@Component({
  selector: 'app-skills-page',
  standalone: true,
  imports: [CommonModule, SpiderChartComponent],
  template: `
    <div class="skills-page">
      <!-- Page header — calling card style -->
      <div class="calling-card header-card">
        <div class="calling-card-label">▶ ARCANE — SKILLS</div>
        <div class="skew-heading">
          <div class="skew-heading-inner">SKILLS</div>
        </div>
      </div>

      <!-- Radar chart -->
      <div class="p5-panel hard-shadow chart-panel">
        <app-spider-chart [skills]="skills()" />
      </div>

      <!-- Skills list — P5 vertical menu -->
      <div class="skills-menu p5-panel">
        <div class="menu-header">— SKILLS —</div>

        @for (skill of skills(); track skill.id) {
          <div class="skill-menu-item"
               [class.active]="editingId() === skill.id"
               (click)="startEdit(skill)">
            <span class="skill-menu-name">{{ skill.name }}</span>
            <span class="skill-menu-value">{{ skill.currentValue }}</span>
          </div>
        }

        <!-- Add new skill -->
        @if (addingNew()) {
          <div class="skill-add-inline">
            <input
              class="p5-input"
              placeholder="SKILL NAME"
              [value]="newSkillName()"
              (input)="newSkillName.set($any($event.target).value)"
            />
            <input
              class="p5-input"
              placeholder="DESCRIPTION"
              [value]="newSkillDesc()"
              (input)="newSkillDesc.set($any($event.target).value)"
            />
            <div class="skill-add-actions">
              <button class="p5-btn p5-btn-confirm" (click)="addSkill()">CONFIRM</button>
              <button class="p5-btn p5-btn-cancel" (click)="addingNew.set(false); newSkillName.set(''); newSkillDesc.set('')">ESCAPE</button>
            </div>
          </div>
        } @else {
          <div class="skill-menu-item add-item" (click)="addingNew.set(true)">
            <span class="skill-menu-name">+ NEW SKILL</span>
          </div>
        }
      </div>

      <!-- Edit panel -->
      @if (editingId()) {
        <div class="calling-card edit-panel">
          <div class="calling-card-label">▶ EDIT — {{ editingSkillName() }}</div>
          <div class="edit-form">
            <input
              class="p5-input"
              placeholder="SKILL NAME"
              [value]="editName()"
              (input)="editName.set($any($event.target).value)"
            />
            <input
              class="p5-input"
              placeholder="DESCRIPTION"
              [value]="editDesc()"
              (input)="editDesc.set($any($event.target).value)"
            />
            <div class="edit-actions">
              <button class="p5-btn p5-btn-confirm" (click)="saveSkill()">CONFIRM</button>
              <button class="p5-btn p5-btn-cancel" (click)="cancelEdit()">ESCAPE</button>
              @if (!editingSkillDefault()) {
                <button class="p5-btn p5-btn-danger" (click)="deleteSkill()">DELETE</button>
              }
            </div>
          </div>
        </div>
      }

      @if (createdFeedback()) {
        <div class="feedback-flash">+ SKILL ADDED</div>
      }
    </div>
  `,
  styles: [`
    .skills-page {
      padding: 20px;
      max-width: 520px;
    }
    .header-card {
      margin-bottom: 16px;
    }
    .chart-panel {
      margin-bottom: 16px;
      background: var(--color-card);
      border-left: 6px solid var(--color-primary);
      clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
      box-shadow: var(--card-shadow);
      padding: 20px;
    }
    .skills-menu {
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
      padding: 12px 20px;
      border-bottom: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
    }
    .skill-menu-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      border-bottom: 1px solid color-mix(in srgb, var(--color-text) 5%, transparent);
      cursor: pointer;
      transition: background 0.05s;
    }
    .skill-menu-item:hover,
    .skill-menu-item.active {
      background: var(--color-primary);
    }
    .skill-menu-item.add-item {
      color: var(--color-text-dim);
      font-family: var(--font-display);
      font-size: 0.8rem;
      letter-spacing: 0.15em;
    }
    .skill-menu-item.add-item:hover {
      background: var(--color-primary);
      color: #fff;
    }
    .skill-menu-name {
      font-family: var(--font-display);
      font-size: 1rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--color-text);
    }
    .skill-menu-item:hover .skill-menu-name,
    .skill-menu-item.active .skill-menu-name {
      color: #fff;
    }
    .skill-menu-value {
      font-family: var(--font-display);
      font-size: 1.2rem;
      color: var(--color-primary);
      font-weight: 900;
    }
    .skill-menu-item:hover .skill-menu-value,
    .skill-menu-item.active .skill-menu-value {
      color: #fff;
    }
    .skill-add-inline {
      padding: 16px 20px;
      background: rgba(0,0,0,0.3);
    }
    .skill-add-inline .p5-input {
      margin-bottom: 8px;
    }
    .skill-add-actions {
      display: flex;
      gap: 8px;
      margin-top: 4px;
    }
    .edit-panel {
      margin-top: 16px;
    }
    .edit-form {
      transform: skewX(3deg);
    }
    .edit-form .p5-input {
      margin-bottom: 8px;
    }
    .edit-actions {
      display: flex;
      gap: 8px;
      margin-top: 4px;
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
export class SkillsPageComponent implements OnInit {
  private skillService = inject(SkillService);
  skills = signal<Skill[]>([]);

  editingId = signal<string | null>(null);
  editingSkillName = signal('');
  editingSkillDefault = signal(false);
  editName = signal('');
  editDesc = signal('');

  addingNew = signal(false);
  newSkillName = signal('');
  newSkillDesc = signal('');
  createdFeedback = signal(false);

  ngOnInit() {
    this.loadSkills();
  }

  loadSkills() {
    this.skillService.getSkills().subscribe({
      next: skills => this.skills.set(skills),
      error: err => console.error('Failed to load skills:', err)
    });
  }

  startEdit(skill: Skill) {
    this.editingId.set(skill.id);
    this.editingSkillName.set(skill.name);
    this.editingSkillDefault.set(!!skill.isDefault);
    this.editName.set(skill.name);
    this.editDesc.set(skill.description);
    this.addingNew.set(false);
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editName.set('');
    this.editDesc.set('');
  }

  saveSkill() {
    const id = this.editingId();
    if (!id) return;
    const name = this.editName().trim();
    const description = this.editDesc().trim();
    if (!name) return;
    this.skillService.updateSkill(id, { name, description }).subscribe({
      next: () => { this.loadSkills(); this.cancelEdit(); },
      error: err => console.error('Failed to save skill:', err)
    });
  }

  deleteSkill() {
    const id = this.editingId();
    if (!id) return;
    if (!confirm('Delete this skill?')) return;
    this.skillService.deleteSkill(id).subscribe({
      next: () => { this.loadSkills(); this.cancelEdit(); },
      error: err => console.error('Failed to delete skill:', err)
    });
  }

  addSkill() {
    const name = this.newSkillName().trim();
    const description = this.newSkillDesc().trim();
    if (!name) return;
    this.skillService.createSkill({ name, description }).subscribe({
      next: () => {
        this.loadSkills();
        this.newSkillName.set('');
        this.newSkillDesc.set('');
        this.addingNew.set(false);
        this.createdFeedback.set(true);
        setTimeout(() => this.createdFeedback.set(false), 2000);
      },
      error: err => console.error('Failed to create skill:', err)
    });
  }
}
