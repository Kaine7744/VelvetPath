import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Skill } from '../models';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private http = inject(HttpClient);

  /** Shared skills signal — updated by refresh() and consumed by all skill-displaying components */
  skills = signal<Skill[]>([]);

  refresh(): void {
    this.getSkills().subscribe(skills => this.skills.set(skills));
  }

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>('/api/skills');
  }

  createSkill(body: { name: string; description?: string; icon?: string }): Observable<Skill> {
    return this.http.post<Skill>('/api/skills', body).pipe(tap(() => this.refresh()));
  }

  updateSkill(id: string, body: { name?: string; description?: string; icon?: string }): Observable<void> {
    return this.http.put<void>(`/api/skills/${id}`, body).pipe(tap(() => this.refresh()));
  }

  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`/api/skills/${id}`).pipe(tap(() => this.refresh()));
  }
}
