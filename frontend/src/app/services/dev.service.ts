import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResetDbResponse { success: boolean; message: string; }
export interface DeleteNonDefaultResponse { success: boolean; deletedCount: number; }

@Injectable({ providedIn: 'root' })
export class DevService {
  private http = inject(HttpClient);

  resetDatabase(): Observable<ResetDbResponse> {
    return this.http.post<ResetDbResponse>('/api/dev/reset-db', {});
  }

  deleteNonDefaultTasks(): Observable<DeleteNonDefaultResponse> {
    return this.http.delete<DeleteNonDefaultResponse>('/api/dev/tasks/non-default');
  }
}
