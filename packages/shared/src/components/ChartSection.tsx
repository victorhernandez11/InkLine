import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import type { Session, Project, ChartDataPoint } from '../types';
import { dateRange, shortDate, fmt, todayStr, addDays } from '../utils';
import { COLUMN_WIDTH, Y_AXIS_WIDTH, TOKENS } from '../constants';

type TimeRange = '1w' | '1m' | '1y' | '3y' | '5y' | 'all';

const TIME_RANGES: { key: TimeRange; label: string; days: number }[] = [
  { key: '1w', label: '1W', days: 7 },
  { key: '1m', label: '1M', days: 30 },
  { key: '1y', label: '1Y', days: 365 },
  { key: '3y', label: '3Y', days: 365 * 3 },
  { key: '5y', label: '5Y', days: 365 * 5 },
  { key: 'all', label: 'All', days: 0 },
];

interface ChartSectionProps {
  sessions: Session[];
  projects: Project[];
  selectedProjects: string[];
  hideEmpty: boolean;
  onHideEmptyChange: (v: boolean) => void;
}

function buildChartData(
  sessions: Session[],
  projects: Project[],
  hideEmpty: boolean
): ChartDataPoint[] {
  if (sessions.length === 0) return [];

  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  const minDate = sorted[0].date;
  const maxDate = sorted[sorted.length - 1].date;
  const allDates = dateRange(minDate, maxDate);

  const byDate = new Map<string, Session[]>();
  sessions.forEach(s => {
    const arr = byDate.get(s.date) || [];
    arr.push(s);
    byDate.set(s.date, arr);
  });

  const projectNames = projects.map(p => p.name);

  const data: ChartDataPoint[] = [];
  for (const date of allDates) {
    const daySessions = byDate.get(date) || [];
    const total = daySessions.reduce((sum, s) => sum + s.wordCount, 0);

    if (hideEmpty && total === 0) continue;

    const point: ChartDataPoint = { date, total, notes: [] };
    projectNames.forEach(name => {
      point[name] = 0;
    });
    daySessions.forEach(s => {
      point[s.project] = ((point[s.project] as number) || 0) + s.wordCount;
      if (s.note) point.notes.push(s.note);
    });
    data.push(point);
  }
  return data;
}

function computeNiceMax(rawMax: number): number {
  if (rawMax <= 0) return 100;
  const padded = rawMax * 1.15;
  const magnitude = Math.pow(10, Math.floor(Math.log10(padded)));
  const fraction = padded / magnitude;
  let nice;
  if (fraction <= 1) nice = 1;
  else if (fraction <= 2) nice = 2;
  else if (fraction <= 2.5) nice = 2.5;
  else if (fraction <= 5) nice = 5;
  else if (fraction <= 7.5) nice = 7.5;
  else nice = 10;
  return nice * magnitude;
}

function CustomTooltip({ active, payload, label, chartData, projects }: any) {
  if (!active || !payload?.length) return null;

  const dataPoint = chartData?.find((d: ChartDataPoint) => d.date === label);
  if (!dataPoint) return null;

  const total = dataPoint.total as number;
  const notes = dataPoint.notes as string[];

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-date">{shortDate(label)}</div>
      <div className="chart-tooltip-total">{fmt(total)} words</div>
      <div className="chart-tooltip-breakdown">
        {projects.map((p: Project) => {
          const val = dataPoint[p.name] as number;
          if (!val) return null;
          return (
            <div key={p.name} className="chart-tooltip-item">
              <span className="chart-tooltip-dot" style={{ backgroundColor: p.color }} />
              <span>{p.name}: {fmt(val)}</span>
            </div>
          );
        })}
      </div>
      {notes.length > 0 && (
        <div className="chart-tooltip-notes">
          {notes.map((n: string, i: number) => (
            <div key={i} className="chart-tooltip-note">"{n}"</div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChartSection({
  sessions,
  projects,
  selectedProjects,
  hideEmpty,
  onHideEmptyChange,
}: ChartSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleProjects = useMemo(() => {
    if (selectedProjects.length === 0) return projects;
    return projects.filter(p => selectedProjects.includes(p.name));
  }, [projects, selectedProjects]);

  // Filter sessions by time range
  const timeFilteredSessions = useMemo(() => {
    if (timeRange === 'all') return sessions;
    const today = todayStr();
    const rangeDef = TIME_RANGES.find(r => r.key === timeRange);
    if (!rangeDef || rangeDef.days === 0) return sessions;
    const cutoff = addDays(today, -rangeDef.days);
    return sessions.filter(s => s.date >= cutoff);
  }, [sessions, timeRange]);

  const chartData = useMemo(
    () => buildChartData(timeFilteredSessions, visibleProjects, hideEmpty),
    [timeFilteredSessions, visibleProjects, hideEmpty]
  );

  // Compute Y-axis domain with 15% padding
  const rawMax = useMemo(
    () => Math.max(...chartData.map(d => d.total as number), 0),
    [chartData]
  );
  const yMax = useMemo(() => computeNiceMax(rawMax), [rawMax]);
  const yTicks = useMemo(
    () => [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax].map(Math.round),
    [yMax]
  );

  const chartWidth = chartData.length * COLUMN_WIDTH;
  const totalWidth = chartWidth + Y_AXIS_WIDTH;
  const chartHeight = 260;
  const plotTop = 5;
  const plotBottom = 5;
  const plotHeight = chartHeight - plotTop - plotBottom;
  const dateHeaderHeight = 40;

  // Scroll to end on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [chartData.length]);

  const verticalCoords = useMemo(() => {
    const coords: number[] = [];
    for (let i = 0; i <= chartData.length; i++) {
      coords.push(i * COLUMN_WIDTH);
    }
    return coords;
  }, [chartData.length]);

  if (sessions.length === 0) {
    return (
      <section className="chart-section">
        <div className="chart-header">
          <div className="chart-time-filters">
            {TIME_RANGES.map(r => (
              <button
                key={r.key}
                className={`chart-time-pill ${timeRange === r.key ? 'chart-time-pill-active' : ''}`}
                onClick={() => setTimeRange(r.key)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <label className="chart-hide-empty">
            <input
              type="checkbox"
              checked={!hideEmpty}
              onChange={e => onHideEmptyChange(!e.target.checked)}
            />
            Show Empty Days
          </label>
        </div>
        <div className="chart-empty">No data to display</div>
      </section>
    );
  }

  return (
    <section className="chart-section">
      <div className="chart-header">
        <div className="chart-time-filters">
          {TIME_RANGES.map(r => (
            <button
              key={r.key}
              className={`chart-time-pill ${timeRange === r.key ? 'chart-time-pill-active' : ''}`}
              onClick={() => setTimeRange(r.key)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <label className="chart-hide-empty">
          <input
            type="checkbox"
            checked={!hideEmpty}
            onChange={e => onHideEmptyChange(!e.target.checked)}
          />
          Show Empty Days
        </label>
      </div>

      <div className="chart-scroll-wrapper">
        {/* Sticky Y-axis — fixed outside the scroll container */}
        <div
          className="chart-yaxis-fixed"
          style={{
            width: Y_AXIS_WIDTH,
            height: chartHeight,
            marginTop: dateHeaderHeight,
          }}
        >
          {yTicks.map(t => (
            <span
              key={t}
              className="chart-yaxis-tick"
              style={{ top: plotTop + plotHeight * (1 - t / yMax) }}
            >
              {fmt(t)}
            </span>
          ))}
        </div>

        <div className="chart-scroll" ref={scrollRef}>
          <div style={{ width: chartWidth, minWidth: chartWidth }}>
            {/* Date headers — inside scrollable area so they scroll with bars */}
            <div className="chart-date-headers">
              {chartData.map((d) => (
                <div key={d.date} className="chart-date-col" style={{ width: COLUMN_WIDTH }}>
                  <div className="chart-date-label">{shortDate(d.date)}</div>
                  <div className="chart-date-count">
                    {(d.total as number) > 0 ? fmt(d.total as number) : '\u00B7'}
                  </div>
                </div>
              ))}
            </div>

            {/* Bar Chart */}
            <BarChart
              width={chartWidth}
              height={chartHeight}
              data={chartData}
              margin={{ top: plotTop, right: 0, bottom: plotBottom, left: 0 }}
              onMouseMove={(state: any) => {
                if (state && state.activeTooltipIndex !== undefined) {
                  setActiveIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ddd8cd"
                horizontal={true}
                vertical={true}
                verticalCoordinatesGenerator={() => verticalCoords.map(c => c)}
              />
              <XAxis dataKey="date" hide={true} />
              <YAxis
                width={0}
                domain={[0, yMax]}
                tick={false}
                axisLine={false}
                tickLine={false}
                hide={true}
              />
              <Tooltip
                content={<CustomTooltip chartData={chartData} projects={visibleProjects} />}
                cursor={false}
              />
              {visibleProjects.map(p => (
                <Bar key={p.name} dataKey={p.name} stackId="stack" maxBarSize={40} isAnimationActive={false}>
                  {chartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={p.color}
                      fillOpacity={activeIndex === null || activeIndex === i ? 1 : 0.3}
                    />
                  ))}
                </Bar>
              ))}
            </BarChart>
          </div>
        </div>
      </div>
    </section>
  );
}
