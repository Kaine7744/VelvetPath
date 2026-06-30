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

export interface TierDownEvent {
  statId: string;
  statName: string;
  oldTier: number;
  newTier: number;
  loss: number;
}

export interface StatGrowthResult {
  dates: string[];
  stats: {
    [statId: string]: {
      name: string;
      values: number[];
    };
  };
}

@Injectable({ providedIn: 'root' })
export class StatService {
  private http = inject(HttpClient);
  private tierUpSubject = new Subject<TierUpEvent>();
  private tierDownSubject = new Subject<TierDownEvent>();

  tierUp$ = this.tierUpSubject.asObservable();
  tierDown$ = this.tierDownSubject.asObservable();

  getStats(): Observable<Stat[]> {
    return this.http.get<Stat[]>('/api/stats');
  }

  getStatistics(period: string): Observable<PeriodStats> {
    return this.http.get<PeriodStats>(`/api/statistics/${period}`);
  }

  getPopularTasks(period: string, limit = 3): Observable<{ mostUsed: { taskId: string; taskName: string; count: number }[]; leastUsed: { taskId: string; taskName: string; count: number }[] }> {
    return this.http.get<{ mostUsed: { taskId: string; taskName: string; count: number }[]; leastUsed: { taskId: string; taskName: string; count: number }[] }>(`/api/statistics/popular-tasks?period=${period}&limit=${limit}`);
  }

  getStatGrowth(period: string): Observable<StatGrowthResult> {
    return this.http.get<StatGrowthResult>(`/api/statistics/growth/${period}`);
  }

  emitTierUp(event: TierUpEvent) {
    this.tierUpSubject.next(event);
  }

  emitTierDown(event: TierDownEvent) {
    this.tierDownSubject.next(event);
  }
}
