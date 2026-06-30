import { Routes } from '@angular/router';
import { DayViewComponent } from './pages/day-view/day-view.component';
import { SkillsPageComponent } from './pages/skills-page/skills-page.component';
import { StatsPageComponent } from './pages/stats-page/stats-page.component';
import { TasksPageComponent } from './pages/tasks-page/tasks-page.component';
import { TemplatesPageComponent } from './pages/templates-page/templates-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { SettingsDevComponent } from './pages/settings-dev/settings-dev.component';

export const routes: Routes = [
  { path: '', component: DayViewComponent },
  { path: 'skills', component: SkillsPageComponent },
  { path: 'stats', component: StatsPageComponent },
  { path: 'tasks', component: TasksPageComponent },
  { path: 'templates', component: TemplatesPageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'settings/dev', component: SettingsDevComponent },
];
