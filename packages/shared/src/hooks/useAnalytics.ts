import { useMemo } from 'react';
import type { Session, Analytics } from '../types';
import { todayStr, addDays, diffDays } from '../utils/dates';
import { calculateCurrentStreak, calculateLongestStreak } from '../utils/streaks';

export function useAnalytics(sessions: Session[], includeEmptyDays: boolean = false): Analytics {
  return useMemo(() => {
    if (sessions.length === 0) {
      return {
        totalWords: 0,
        writingDays: 0,
        dailyAverage: 0,
        currentStreak: 0,
        longestStreak: 0,
        bestDay: null,
        thisWeek: { words: 0, diff: 0, direction: null },
      };
    }

    const totalWords = sessions.reduce((sum, s) => sum + s.wordCount, 0);

    const dateSet = new Set(sessions.map(s => s.date));
    const writingDays = dateSet.size;

    // Compute daily average: when includeEmptyDays is true, divide by total
    // calendar days in the range (first session to last session). Otherwise,
    // divide only by the number of days that had writing.
    let dailyAverage: number;
    if (includeEmptyDays && writingDays > 0) {
      const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
      const firstDate = sorted[0].date;
      const lastDate = sorted[sorted.length - 1].date;
      const totalDaysInRange = diffDays(lastDate, firstDate) + 1;
      dailyAverage = Math.round(totalWords / totalDaysInRange);
    } else {
      dailyAverage = writingDays > 0 ? Math.round(totalWords / writingDays) : 0;
    }

    const writingDates = sessions.map(s => s.date);
    const currentStreak = calculateCurrentStreak(writingDates);
    const longestStreak = calculateLongestStreak(writingDates);

    // Best day
    const dayTotals = new Map<string, number>();
    sessions.forEach(s => {
      dayTotals.set(s.date, (dayTotals.get(s.date) || 0) + s.wordCount);
    });

    let bestDay: { date: string; words: number } | null = null;
    dayTotals.forEach((words, date) => {
      if (!bestDay || words > bestDay.words) {
        bestDay = { date, words };
      }
    });

    // This week vs last week
    const today = todayStr();
    const todayDate = new Date(today + 'T00:00:00');
    const dayOfWeek = todayDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const thisWeekStart = addDays(today, mondayOffset);
    const lastWeekStart = addDays(thisWeekStart, -7);

    let thisWeekWords = 0;
    let lastWeekWords = 0;

    sessions.forEach(s => {
      if (s.date >= thisWeekStart && s.date <= today) {
        thisWeekWords += s.wordCount;
      } else if (s.date >= lastWeekStart && s.date < thisWeekStart) {
        lastWeekWords += s.wordCount;
      }
    });

    const weekDiff = thisWeekWords - lastWeekWords;

    return {
      totalWords,
      writingDays,
      dailyAverage,
      currentStreak,
      longestStreak,
      bestDay,
      thisWeek: {
        words: thisWeekWords,
        diff: Math.abs(weekDiff),
        direction: weekDiff > 0 ? 'up' as const : weekDiff < 0 ? 'down' as const : null,
      },
    };
  }, [sessions, includeEmptyDays]);
}
