import { Routes } from '@angular/router';
import { DayViewComponent } from './pages/day-view/day-view.component';
import { SkillsPageComponent } from './pages/skills-page/skills-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

export const routes: Routes = [
  { path: '', component: DayViewComponent },
  { path: 'skills', component: SkillsPageComponent },
  { path: 'settings', component: SettingsPageComponent },
];
