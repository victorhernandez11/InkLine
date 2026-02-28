import { todayStr, diffDays } from './dates';

export function calculateCurrentStreak(writingDates: string[]): number {
  if (writingDates.length === 0) return 0;

  const sorted = [...new Set(writingDates)].sort().reverse();
  const today = todayStr();

  const mostRecent = sorted[0];
  const daysSince = diffDays(today, mostRecent);

  if (daysSince > 1) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = diffDays(sorted[i - 1], sorted[i]);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function calculateLongestStreak(writingDates: string[]): number {
  if (writingDates.length === 0) return 0;

  const sorted = [...new Set(writingDates)].sort();

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const diff = diffDays(sorted[i], sorted[i - 1]);
    if (diff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}
