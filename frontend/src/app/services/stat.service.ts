import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Stat } from '../models';

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

  emitTierUp(event: TierUpEvent) {
    this.tierUpSubject.next(event);
  }
}
