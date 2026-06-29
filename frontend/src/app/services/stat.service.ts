import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stat } from '../models';

@Injectable({ providedIn: 'root' })
export class StatService {
  private http = inject(HttpClient);

  getStats(): Observable<Stat[]> {
    return this.http.get<Stat[]>('/api/stats');
  }
}
