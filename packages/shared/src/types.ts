export interface Session {
  id: string;
  date: string; // YYYY-MM-DD
  project: string;
  wordCount: number;
  note: string;
}

export interface Project {
  name: string;
  color: string;
}

export interface Analytics {
  totalWords: number;
  writingDays: number;
  dailyAverage: number;
  currentStreak: number;
  longestStreak: number;
  bestDay: { date: string; words: number } | null;
  thisWeek: { words: number; diff: number; direction: 'up' | 'down' | null };
}

export interface ChartDataPoint {
  date: string;
  total: number;
  notes: string[];
  [key: string]: number | string | string[] | null;
}
