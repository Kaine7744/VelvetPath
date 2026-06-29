import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Day, SlotsPayload } from '../models';

@Injectable({ providedIn: 'root' })
export class DayService {
  private http = inject(HttpClient);

  getDay(date: string): Observable<Day> {
    return this.http.get<Day>(`/api/days/${date}`);
  }

  updateDay(date: string, slots: SlotsPayload): Observable<Day> {
    return this.http.put<Day>(`/api/days/${date}`, { slots });
  }
}
