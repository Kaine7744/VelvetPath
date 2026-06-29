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
}
