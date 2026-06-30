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
  statShrinkages?: StatShrinkage[];
}

export interface StatGrowth {
  slot: string;
  statId: string;
  statName: string;
  gain: number;
  oldTier?: number;
  newTier?: number;
}

export interface StatShrinkage {
  slot: string;
  statId: string;
  statName: string;
  gain: number;
  oldTier?: number;
  newTier?: number;
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
  icon?: string;
}

// Stat is an alias for Skill (the backend calls them skills, the frontend calls them stats)
export type Stat = Skill;

export interface Template {
  id: string;
  taskId: string;
  slot: 'morning' | 'afternoon' | 'evening';
  daysOfWeek: number[];
  enabled: boolean;
  taskName?: string;
  endDate?: string | null;
}

export interface SlotsPayload {
  morning?: Partial<Slot>;
  afternoon?: Partial<Slot>;
  evening?: Partial<Slot>;
}

export interface AppSettings {
  theme: string;
  morningEnabled: boolean;
  eveningEnabled: boolean;
  morningDays: number[];
  eveningDays: number[];
}

export function parseAppSettings(raw: Record<string, string>): AppSettings {
  return {
    theme: raw['theme'] ?? 'p5',
    morningEnabled: raw['morningEnabled'] !== 'false',
    eveningEnabled: raw['eveningEnabled'] !== 'false',
    morningDays: parseDaysArray(raw['morningDays']),
    eveningDays: parseDaysArray(raw['eveningDays']),
  };
}

function parseDaysArray(value: string | undefined): number[] {
  if (!value) return [1, 2, 3, 4, 5]; // Mon–Fri default
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [1, 2, 3, 4, 5];
  } catch {
    return [1, 2, 3, 4, 5];
  }
}
