import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../models';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private http = inject(HttpClient);

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>('/api/skills');
  }

  createSkill(body: { name: string; description?: string; icon?: string }): Observable<Skill> {
    return this.http.post<Skill>('/api/skills', body);
  }

  updateSkill(id: string, body: { name?: string; description?: string; icon?: string }): Observable<void> {
    return this.http.put<void>(`/api/skills/${id}`, body);
  }

  deleteSkill(id: string): Observable<void> {
    return this.http.delete<void>(`/api/skills/${id}`);
  }
}
