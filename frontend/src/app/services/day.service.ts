import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Day, SlotsPayload, StatGrowth } from '../models';
import { StatService } from './stat.service';

@Injectable({ providedIn: 'root' })
export class DayService {
  private http = inject(HttpClient);
  private statService = inject(StatService);

  getDay(date: string): Observable<Day> {
    return this.http.get<Day>(`/api/days/${date}`);
  }

  getDays(start: string, end: string): Observable<Day[]> {
    return this.http.get<Day[]>(`/api/days/range/${start}/${end}`);
  }

  updateDay(date: string, slots: SlotsPayload): Observable<Day> {
    return new Observable(observer => {
      this.http.put<Day>(`/api/days/${date}`, { slots }).subscribe({
        next: day => {
          if (day.statGrowths) {
            for (const growth of day.statGrowths) {
              if (growth.oldTier !== undefined && growth.newTier !== undefined && growth.oldTier !== growth.newTier) {
                this.statService.emitTierUp({
                  statId: growth.statId,
                  statName: growth.statName,
                  oldTier: growth.oldTier,
                  newTier: growth.newTier,
                  gain: growth.gain,
                });
              }
            }
          }
          observer.next(day);
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }
}
