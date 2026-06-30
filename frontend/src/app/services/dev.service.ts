import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResetDbResponse { success: boolean; message: string; }
export interface DeleteNonDefaultResponse { success: boolean; deletedCount: number; }
export interface DeleteAllResponse { success: boolean; deletedCount: number; }
export interface ResetSkillsResponse { success: boolean; message: string; }
export interface ModifyPointsResponse { statId: string; oldValue: number; newValue: number; oldTier: number; newTier: number; }

@Injectable({ providedIn: 'root' })
export class DevService {
  private http = inject(HttpClient);

  resetDatabase(): Observable<ResetDbResponse> {
    return this.http.post<ResetDbResponse>('/api/dev/reset-db', {});
  }

  deleteNonDefaultTasks(): Observable<DeleteNonDefaultResponse> {
    return this.http.delete<DeleteNonDefaultResponse>('/api/dev/tasks/non-default');
  }

  deleteAllTasks(): Observable<DeleteAllResponse> {
    return this.http.delete<DeleteAllResponse>('/api/dev/tasks');
  }

  resetAllSkills(): Observable<ResetSkillsResponse> {
    return this.http.delete<ResetSkillsResponse>('/api/dev/skills');
  }

  modifySkillPoints(statId: string, delta: number): Observable<ModifyPointsResponse> {
    return this.http.put<ModifyPointsResponse>(`/api/dev/skills/${statId}/points`, { delta });
  }
}
