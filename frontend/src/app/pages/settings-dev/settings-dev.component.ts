import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DevService } from '../../services/dev.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models';

@Component({
  selector: 'app-settings-dev',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-dev-page">
      <div class="page-title skew-heading">
        <div class="skew-heading-inner">DEV TOOLS</div>
      </div>

      <!-- Clear Database card -->
      <div class="dev-card p5-panel">
        <div class="dev-card-label">⚠ DANGER ZONE</div>
        <div class="dev-card-title">Clear Database</div>
        <div class="dev-card-desc">
          Wipes all days, templates, and resets all skill values to 0.
          Re-seeds the 5 default tasks and work template.
        </div>
        <div class="confirm-input-row">
          <input
            class="p5-input"
            placeholder="Type DELETE to confirm"
            [value]="resetConfirmInput()"
            (input)="resetConfirmInput.set($any($event.target).value)"
          />
        </div>
        <button
          class="p5-btn p5-btn-danger"
          [disabled]="resetConfirmInput() !== 'DELETE'"
          (click)="onResetDb()"
        >
          CLEAR DATABASE
        </button>
      </div>

      <!-- Remove Non-Default Tasks card -->
      <div class="dev-card p5-panel">
        <div class="dev-card-label">⚠ DANGER ZONE</div>
        <div class="dev-card-title">Remove Non-Default Tasks</div>
        <div class="dev-card-desc">
          Deletes all tasks except the 5 built-ins (Work, Study, Gym, Social, Hobbies).
          @if (nonDefaultCount() > 0) {
            <span class="count-badge">Currently {{ nonDefaultCount() }} non-default task(s) exist.</span>
          } @else {
            <span class="count-badge all-clear">All tasks are default — nothing to delete.</span>
          }
        </div>
        @if (nonDefaultCount() > 0) {
          <label class="checkbox-row">
            <input
              type="checkbox"
              [checked]="deleteCheckbox()"
              (change)="deleteCheckbox.set($any($event.target).checked)"
            />
            <span>I understand this will delete {{ nonDefaultCount() }} task(s)</span>
          </label>
          <button
            class="p5-btn p5-btn-danger"
            [disabled]="!deleteCheckbox()"
            (click)="onDeleteNonDefault()"
          >
            DELETE TASKS
          </button>
        }
      </div>

      @if (feedback()) {
        <div class="feedback-flash">{{ feedback() }}</div>
      }
    </div>
  `,
  styles: [`
    .settings-dev-page {
      padding: 20px;
      max-width: 600px;
    }
    .page-title {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 3rem;
      color: var(--color-primary);
      letter-spacing: 0.15em;
      text-shadow: 0 0 30px var(--color-glow);
      margin-bottom: 24px;
      transform: skewX(-8deg);
      display: inline-block;
    }
    .dev-card {
      margin-bottom: 24px;
      padding: 20px;
    }
    .dev-card-label {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: #e53935;
      margin-bottom: 8px;
    }
    .dev-card-title {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 1.2rem;
      letter-spacing: 0.1em;
      color: var(--color-primary);
      margin-bottom: 8px;
    }
    .dev-card-desc {
      font-size: 0.85rem;
      color: var(--color-text-dim);
      margin-bottom: 16px;
      line-height: 1.5;
    }
    .count-badge {
      display: inline-block;
      margin-top: 4px;
      font-weight: 700;
      color: var(--color-primary);
    }
    .count-badge.all-clear {
      color: var(--color-success);
    }
    .confirm-input-row {
      margin-bottom: 12px;
    }
    .p5-input {
      width: 100%;
      max-width: 280px;
      background: var(--color-surface);
      border: 2px solid var(--color-border);
      color: var(--color-text);
      font-family: var(--font-display);
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      padding: 8px 12px;
      outline: none;
      transition: border-color 0.1s;
      box-sizing: border-box;
    }
    .p5-input:focus {
      border-color: var(--color-primary);
    }
    .p5-input::placeholder {
      color: var(--color-text-dim);
    }
    .p5-btn {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      padding: 10px 20px;
      border: 2px solid var(--color-border);
      background: transparent;
      color: var(--color-text);
      cursor: pointer;
      transition: background 0.1s, border-color 0.1s, box-shadow 0.1s;
    }
    .p5-btn:hover:not(:disabled) {
      border-color: var(--color-primary);
      box-shadow: 3px 3px 0 var(--color-primary);
    }
    .p5-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .p5-btn-danger {
      border-color: #e53935;
      color: #e53935;
    }
    .p5-btn-danger:hover:not(:disabled) {
      background: rgba(229,57,53,0.15);
      border-color: #e53935;
      box-shadow: 3px 3px 0 #e53935;
    }
    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      margin-bottom: 12px;
      font-size: 0.85rem;
      color: var(--color-text-dim);
    }
    .checkbox-row input[type="checkbox"] {
      accent-color: var(--color-primary);
      width: 16px;
      height: 16px;
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
      animation: feedback-pop 2.5s ease-out forwards;
    }
    @keyframes feedback-pop {
      0% { opacity: 0; transform: translateY(10px); }
      15% { opacity: 1; transform: translateY(0); }
      80% { opacity: 1; }
      100% { opacity: 0; }
    }
  `]
})
export class SettingsDevComponent implements OnInit {
  private devService = inject(DevService);
  private taskService = inject(TaskService);

  resetConfirmInput = signal('');
  deleteCheckbox = signal(false);
  nonDefaultCount = signal(0);
  feedback = signal('');

  private readonly BUILT_IN_TASK_IDS = ['work', 'study', 'gym', 'social', 'hobbies'];
  private feedbackTimeout: any;

  ngOnInit() {
    this.loadNonDefaultCount();
  }

  loadNonDefaultCount() {
    this.taskService.getTasks().subscribe({
      next: tasks => {
        const count = tasks.filter(t => !this.BUILT_IN_TASK_IDS.includes(t.id)).length;
        this.nonDefaultCount.set(count);
      },
      error: err => console.error('Failed to load tasks:', err)
    });
  }

  onResetDb() {
    if (this.resetConfirmInput() !== 'DELETE') return;
    this.devService.resetDatabase().subscribe({
      next: res => {
        this.showFeedback(res.message);
        this.resetConfirmInput.set('');
      },
      error: err => {
        console.error('Failed to reset database:', err);
        this.showFeedback('Error: ' + err.message);
      }
    });
  }

  onDeleteNonDefault() {
    if (!this.deleteCheckbox()) return;
    this.devService.deleteNonDefaultTasks().subscribe({
      next: res => {
        this.showFeedback(`Deleted ${res.deletedCount} task(s)`);
        this.deleteCheckbox.set(false);
        this.nonDefaultCount.set(0);
      },
      error: err => {
        console.error('Failed to delete non-default tasks:', err);
        this.showFeedback('Error: ' + err.message);
      }
    });
  }

  private showFeedback(msg: string) {
    if (this.feedbackTimeout) clearTimeout(this.feedbackTimeout);
    this.feedback.set(msg);
    this.feedbackTimeout = setTimeout(() => this.feedback.set(''), 2500);
  }
}
