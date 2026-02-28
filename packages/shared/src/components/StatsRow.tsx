import React from 'react';
import type { Analytics } from '../types';
import { fmt, shortDate } from '../utils';
import { StatTile } from './StatTile';

interface StatsRowProps {
  analytics: Analytics;
}

function streakNudge(n: number): string {
  if (n === 0) return 'Start today!';
  if (n === 1) return "You've started!";
  if (n < 7)  return 'Building momentum!';
  if (n < 14) return 'One week strong!';
  if (n < 30) return 'Keep it up!';
  return 'Incredible streak!';
}

export function StatsRow({ analytics }: StatsRowProps) {
  const { totalWords, writingDays, dailyAverage, currentStreak, longestStreak, bestDay, thisWeek } = analytics;

  return (
    <div className="stats-row">
      <StatTile label="Total Words" value={fmt(totalWords)} />
      <StatTile label="Writing Days" value={fmt(writingDays)} />
      <StatTile label="Daily Average" value={fmt(dailyAverage)} />
      <StatTile label="Current Streak" value={`${currentStreak} day${currentStreak !== 1 ? 's' : ''}`} subLabel={streakNudge(currentStreak)} />
      <StatTile label="Longest Streak" value={`${longestStreak} day${longestStreak !== 1 ? 's' : ''}`} />
      <StatTile
        label="Best Day"
        value={bestDay ? fmt(bestDay.words) : '---'}
        subLabel={bestDay ? shortDate(bestDay.date) : ''}
      />
      <StatTile
        label="This Week"
        value={fmt(thisWeek.words)}
        arrow={thisWeek.direction}
        diffText={thisWeek.diff > 0 ? `${fmt(thisWeek.diff)} vs last week` : ''}
      />
    </div>
  );
}
