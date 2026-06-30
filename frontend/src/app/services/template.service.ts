import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../models';

export interface RecurringTask {
  slot: 'morning' | 'afternoon' | 'evening';
  taskId: string;
  taskName: string | null;
}

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private http = inject(HttpClient);

  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>('/api/templates');
  }

  getTemplatesForDate(date: string): Observable<RecurringTask[]> {
    return this.http.get<RecurringTask[]>(`/api/templates/for-day/${date}`);
  }

  createTemplate(body: { taskId: string; slot: 'morning' | 'afternoon' | 'evening'; daysOfWeek: number[]; enabled?: boolean; endDate?: string | null }): Observable<Template> {
    return this.http.post<Template>('/api/templates', body);
  }

  updateTemplate(id: string, body: { enabled?: boolean; daysOfWeek?: number[]; slot?: 'morning' | 'afternoon' | 'evening'; taskId?: string; endDate?: string | null }): Observable<void> {
    return this.http.put<void>(`/api/templates/${id}`, body);
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`/api/templates/${id}`);
  }
}
