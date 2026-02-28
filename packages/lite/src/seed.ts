import type { Session, Project } from '@shared/types';
import { PROJECT_COLORS } from '@shared/constants';
import { generateId, daysAgo } from '@shared/utils';

export function createSeedProjects(): Project[] {
  return [
    { name: 'The Novel', color: PROJECT_COLORS[0] },
    { name: 'Blog Posts', color: PROJECT_COLORS[1] },
    { name: 'Short Stories', color: PROJECT_COLORS[2] },
  ];
}

export function createSeedSessions(): Session[] {
  const defs: { dayOffset: number; project: string; words: number; note?: string }[] = [
    // Recent week
    { dayOffset: 1, project: 'The Novel', words: 1350, note: 'Wrapped up chapter 12' },
    { dayOffset: 1, project: 'Blog Posts', words: 620 },
    { dayOffset: 2, project: 'The Novel', words: 980 },
    { dayOffset: 3, project: 'Short Stories', words: 2400, note: 'Finished draft of The Lantern' },
    { dayOffset: 4, project: 'The Novel', words: 750 },
    { dayOffset: 5, project: 'Blog Posts', words: 1100, note: 'Productivity tips article' },
    { dayOffset: 6, project: 'The Novel', words: 1600 },
    // Previous week
    { dayOffset: 8, project: 'The Novel', words: 2200, note: 'Chapter 11 complete' },
    { dayOffset: 9, project: 'Blog Posts', words: 850 },
    { dayOffset: 9, project: 'Short Stories', words: 400 },
    { dayOffset: 10, project: 'The Novel', words: 1400 },
    { dayOffset: 12, project: 'Short Stories', words: 1800, note: 'The Clockmaker rough draft' },
    { dayOffset: 13, project: 'The Novel', words: 900 },
    { dayOffset: 14, project: 'Blog Posts', words: 1350, note: 'Book review post' },
    // 3 weeks ago
    { dayOffset: 16, project: 'The Novel', words: 3100, note: 'Breakthrough on plot twist' },
    { dayOffset: 17, project: 'Blog Posts', words: 500 },
    { dayOffset: 18, project: 'Short Stories', words: 1200 },
    { dayOffset: 19, project: 'The Novel', words: 670 },
    { dayOffset: 21, project: 'The Novel', words: 1500 },
    { dayOffset: 21, project: 'Blog Posts', words: 2100, note: 'Long-form craft essay' },
    // 4 weeks ago
    { dayOffset: 23, project: 'Short Stories', words: 950 },
    { dayOffset: 25, project: 'The Novel', words: 1800 },
    { dayOffset: 26, project: 'Blog Posts', words: 300 },
    { dayOffset: 28, project: 'The Novel', words: 2500, note: 'Chapter 9 rewrite' },
    // 5-6 weeks ago
    { dayOffset: 30, project: 'Short Stories', words: 1600, note: 'Flash fiction collection' },
    { dayOffset: 32, project: 'The Novel', words: 700 },
    { dayOffset: 34, project: 'Blog Posts', words: 1900, note: 'Writing tools roundup' },
    { dayOffset: 36, project: 'The Novel', words: 1100 },
    { dayOffset: 38, project: 'Short Stories', words: 2800, note: 'Entered contest submission' },
    { dayOffset: 40, project: 'The Novel', words: 450 },
    { dayOffset: 42, project: 'Blog Posts', words: 750 },
    // 7-8 weeks ago
    { dayOffset: 44, project: 'The Novel', words: 1300 },
    { dayOffset: 46, project: 'Short Stories', words: 600 },
    { dayOffset: 48, project: 'The Novel', words: 2000, note: 'Act two opener' },
    { dayOffset: 50, project: 'Blog Posts', words: 1450 },
    { dayOffset: 53, project: 'The Novel', words: 850 },
    { dayOffset: 56, project: 'Short Stories', words: 1100 },
    { dayOffset: 58, project: 'The Novel', words: 1700 },
  ];

  return defs.map(d => ({
    id: generateId(),
    date: daysAgo(d.dayOffset),
    project: d.project,
    wordCount: d.words,
    note: d.note || '',
  }));
}
