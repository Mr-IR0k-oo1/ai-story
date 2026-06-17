export interface Player {
  name: string;
  profession: string;
  level: number;
}

export interface Location {
  name: string;
  description: string;
}

export interface MemoryEntry {
  day: number;
  text: string;
}

export interface Achievement {
  id: string;
  title: string;
  unlockedAt: number;
}

export interface GameStats {
  eventsSeen: number;
  itemsCollected: number;
  locationsVisited: string[];
  twistsUsed: number;
}

export interface DailyEvent {
  date: string;
  title: string;
  description: string;
  choices: string[];
  chosenIndex: number | null;
  consequence: string | null;
  resolved: boolean;
}

export interface WorldState {
  player: Player;
  location: Location;
  inventory: string[];
  memories: MemoryEntry[];
  story: string[];
  stats: GameStats;
  achievements: Achievement[];
  dailyEvent: DailyEvent | null;
}
