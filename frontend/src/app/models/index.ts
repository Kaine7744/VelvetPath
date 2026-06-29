export interface Slot {
  status: 'free' | 'set';
  taskId: string | null;
  completed: boolean;
  task?: {
    id: string;
    name: string;
    statName: string | null;
    statGain: number;
  } | null;
}

export interface Day {
  date: string;
  slots: {
    morning: Slot;
    afternoon: Slot;
    evening: Slot;
  };
  statGrowths?: StatGrowth[];
}

export interface StatGrowth {
  slot: string;
  statId: string;
  statName: string;
  gain: number;
}

export interface Task {
  id: string;
  name: string;
  statId: string | null;
  statGain: number;
  statName: string | null;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  currentValue: number;
}

export interface Template {
  id: string;
  taskId: string;
  slot: 'morning' | 'afternoon' | 'evening';
  daysOfWeek: number[];
  enabled: boolean;
  taskName?: string;
}

export interface SlotsPayload {
  morning?: Partial<Slot>;
  afternoon?: Partial<Slot>;
  evening?: Partial<Slot>;
}
