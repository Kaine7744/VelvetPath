import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private http = inject(HttpClient);

  getSettings(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>('/api/settings');
  }

  updateSetting(key: string, value: string): Observable<void> {
    return this.http.put<void>('/api/settings', { key, value });
  }
}
