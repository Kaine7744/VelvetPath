import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService, ThemeId } from '../../services/theme.service';
import { SettingsService } from '../../services/settings.service';
import { isDevMode } from '@angular/core';
import { parseAppSettings } from '../../models';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <div class="settings-page">
      <div class="page-title skew-heading">
        <div class="skew-heading-inner">SETTINGS</div>
      </div>

      <!-- Sub-nav -->
      <div class="settings-sub-nav">
        <button
          class="sub-nav-item"
          [class.active]="activeTab() === 'appearance'"
          (click)="activeTab.set('appearance')"
        >Appearance</button>
        <button
          class="sub-nav-item"
          [class.active]="activeTab() === 'general'"
          (click)="activeTab.set('general')"
        >General</button>
        @if (devMode()) {
          <a class="sub-nav-item" routerLink="/settings/dev" routerLinkActive="active">Dev</a>
        }
      </div>

      <!-- Appearance section -->
      @if (activeTab() === 'appearance') {
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
      }

      <!-- General section -->
      @if (activeTab() === 'general') {
        <div class="settings-section">
          <div class="section-label">— SLOT VISIBILITY —</div>

          <!-- Morning slot weekday toggles -->
          <div class="weekday-slot-row">
            <div class="toggle-info">
              <div class="toggle-name">Morning Slot</div>
              <div class="toggle-desc">Active on these days</div>
            </div>
            <div class="weekday-toggles">
              @for (day of weekdayDefs; track day.value) {
                <button
                  class="weekday-btn"
                  [class.on]="isMorningDay(day.value)"
                  (click)="toggleMorningDay(day.value)"
                  [title]="day.label"
                >{{ day.short }}</button>
              }
            </div>
          </div>

          <!-- Evening slot weekday toggles -->
          <div class="weekday-slot-row">
            <div class="toggle-info">
              <div class="toggle-name">Evening Slot</div>
              <div class="toggle-desc">Active on these days</div>
            </div>
            <div class="weekday-toggles">
              @for (day of weekdayDefs; track day.value) {
                <button
                  class="weekday-btn"
                  [class.on]="isEveningDay(day.value)"
                  (click)="toggleEveningDay(day.value)"
                  [title]="day.label"
                >{{ day.short }}</button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .settings-page {
      padding: 20px;
      max-width: 600px;
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: var(--font-display);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--color-text-dim);
      text-decoration: none;
      margin-bottom: 20px;
      transition: color 0.1s;
    }
    .back-link:hover {
      color: var(--color-primary);
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
    .settings-sub-nav {
      display: flex;
      gap: 0;
      margin-bottom: 24px;
      border-left: 4px solid var(--color-primary);
    }
    .sub-nav-item {
      padding: 10px 20px;
      font-family: var(--font-display);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--color-text-dim);
      border: 2px solid var(--color-border);
      border-left: none;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.05s, color 0.05s;
      background: transparent;
    }
    .sub-nav-item:hover,
    .sub-nav-item.active {
      background: var(--color-primary);
      color: #fff;
      border-color: var(--color-primary);
    }
    .settings-section {
      margin-bottom: 24px;
    }
    .section-label {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.65rem;
      letter-spacing: 0.25em;
      color: var(--color-text-dim);
      margin-bottom: 12px;
    }
    .theme-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      max-width: 520px;
    }
    .theme-card {
      background: var(--color-surface);
      border: 2px solid var(--color-border);
      padding: 16px;
      cursor: pointer;
      transition: border-color 0.05s, box-shadow 0.05s;
      position: relative;
    }
    .theme-card:hover {
      border-color: var(--preview-primary, var(--color-primary));
      box-shadow: 3px 3px 0 var(--preview-primary, var(--color-primary));
    }
    .theme-card.active {
      border-color: var(--preview-primary, var(--color-primary));
      border-left-width: 4px;
      box-shadow: 4px 4px 0 var(--preview-primary, var(--color-primary));
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
      color: var(--preview-primary, var(--color-primary));
    }
    .theme-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.1em;
      color: var(--preview-text, var(--color-text));
    }
    .mini-preview {
      display: flex;
      justify-content: center;
    }
    .mini-card {
      width: 130px;
      background: var(--preview-card, var(--color-card));
      border: 2px solid var(--preview-border, var(--color-border));
      padding: 8px 12px;
      position: relative;
      overflow: hidden;
    }
    .mini-card::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: var(--mini-accent, var(--color-primary));
    }
    .mini-label {
      font-family: var(--font-display);
      font-size: 0.45rem;
      letter-spacing: 0.15em;
      color: var(--color-text-dim);
      margin-bottom: 4px;
    }
    .mini-content {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 0.9rem;
      color: var(--preview-text, var(--color-text));
      margin-bottom: 4px;
    }
    .mini-stat {
      font-size: 0.45rem;
      letter-spacing: 0.1em;
      color: var(--mini-accent, var(--color-primary));
      font-weight: 700;
    }
    .active-badge {
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--preview-primary, var(--color-primary));
      color: #fff;
      font-family: var(--font-display);
      font-size: 0.5rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      padding: 2px 10px;
      white-space: nowrap;
    }

    /* Toggle rows */
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid var(--color-border);
    }
    .toggle-row:last-child {
      border-bottom: none;
    }
    .toggle-info {
      flex: 1;
    }
    .toggle-name {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.1em;
      color: var(--color-text);
      margin-bottom: 4px;
    }
    .toggle-desc {
      font-size: 0.75rem;
      color: var(--color-text-dim);
    }
    .toggle-btn {
      min-width: 60px;
      padding: 8px 16px;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 0.7rem;
      letter-spacing: 0.15em;
      border: 2px solid var(--color-border);
      background: transparent;
      color: var(--color-text-dim);
      cursor: pointer;
      transition: all 0.1s;
    }
    .toggle-btn.on {
      border-color: var(--color-success);
      color: var(--color-success);
      background: rgba(118, 255, 3, 0.1);
    }
    .toggle-btn:hover:not(.on) {
      border-color: var(--color-text-dim);
      color: var(--color-text);
    }

    /* Weekday toggles */
    .weekday-slot-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid var(--color-border);
    }
    .weekday-slot-row:last-child {
      border-bottom: none;
    }
    .weekday-toggles {
      display: flex;
      gap: 4px;
    }
    .weekday-btn {
      width: 32px;
      height: 32px;
      border: 2px solid var(--color-border);
      background: transparent;
      color: var(--color-text-dim);
      font-family: var(--font-display);
      font-size: 0.65rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.1s;
    }
    .weekday-btn.on {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #fff;
    }
    .weekday-btn:hover:not(.on) {
      border-color: var(--color-text-dim);
      color: var(--color-text);
    }
  `]
})
export class SettingsPageComponent implements OnInit {
  themeService = inject(ThemeService);
  private settingsService = inject(SettingsService);
  private router = inject(Router);

  devMode = signal(isDevMode());
  activeTab = signal<'appearance' | 'general' | 'dev'>('appearance');
  morningDays = signal<number[]>([1, 2, 3, 4, 5]);
  eveningDays = signal<number[]>([1, 2, 3, 4, 5]);

  readonly weekdayDefs = [
    { short: 'S', label: 'Sunday',    value: 0 },
    { short: 'M', label: 'Monday',    value: 1 },
    { short: 'T', label: 'Tuesday',   value: 2 },
    { short: 'W', label: 'Wednesday',value: 3 },
    { short: 'T', label: 'Thursday', value: 4 },
    { short: 'F', label: 'Friday',   value: 5 },
    { short: 'S', label: 'Saturday', value: 6 },
  ];

  ngOnInit() {
    // Respect ?tab= query param when navigating from settings-dev
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (tab === 'general') this.activeTab.set('general');

    this.settingsService.getSettings().subscribe({
      next: raw => {
        const settings = parseAppSettings(raw);
        this.morningDays.set(settings.morningDays);
        this.eveningDays.set(settings.eveningDays);
      }
    });
  }

  selectTheme(id: ThemeId) {
    this.themeService.setTheme(id);
    this.router.navigate(['/settings']);
  }

  isMorningDay(day: number): boolean {
    return this.morningDays().includes(day);
  }

  isEveningDay(day: number): boolean {
    return this.eveningDays().includes(day);
  }

  toggleMorningDay(day: number) {
    const current = this.morningDays();
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day].sort((a, b) => a - b);
    this.morningDays.set(updated);
    this.settingsService.updateSetting('morningDays', JSON.stringify(updated)).subscribe({
      error: err => {
        console.error('Failed to update morningDays:', err);
        this.morningDays.set(current);
      }
    });
  }

  toggleEveningDay(day: number) {
    const current = this.eveningDays();
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day].sort((a, b) => a - b);
    this.eveningDays.set(updated);
    this.settingsService.updateSetting('eveningDays', JSON.stringify(updated)).subscribe({
      error: err => {
        console.error('Failed to update eveningDays:', err);
        this.eveningDays.set(current);
      }
    });
  }
}
