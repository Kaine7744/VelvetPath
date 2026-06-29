import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private http = inject(HttpClient);

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>('/api/tasks');
  }

  createTask(body: { name: string; statId?: string | null; statGain?: number }): Observable<Task> {
    return this.http.post<Task>('/api/tasks', body);
  }

  updateTask(id: string, body: { name?: string; statId?: string | null; statGain?: number }): Observable<void> {
    return this.http.put<void>(`/api/tasks/${id}`, body);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`/api/tasks/${id}`);
  }
}
