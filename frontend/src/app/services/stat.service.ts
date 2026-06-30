import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Stat } from '../models';

export interface PeriodStats {
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  totalSlots: number;
  completedSlots: number;
  completionRate: number;
  bySlot: {
    morning: { total: number; completed: number; rate: number };
    afternoon: { total: number; completed: number; rate: number };
    evening: { total: number; completed: number; rate: number };
  };
  streakDays: number;
  todayGains: { statId: string; statName: string; gain: number }[];
}

export interface TierUpEvent {
  statId: string;
  statName: string;
  oldTier: number;
  newTier: number;
  gain: number;
}

@Injectable({ providedIn: 'root' })
export class StatService {
  private http = inject(HttpClient);
  private tierUpSubject = new Subject<TierUpEvent>();

  tierUp$ = this.tierUpSubject.asObservable();

  getStats(): Observable<Stat[]> {
    return this.http.get<Stat[]>('/api/stats');
  }

  getStatistics(period: string): Observable<PeriodStats> {
    return this.http.get<PeriodStats>(`/api/statistics/${period}`);
  }

  emitTierUp(event: TierUpEvent) {
    this.tierUpSubject.next(event);
  }
}
