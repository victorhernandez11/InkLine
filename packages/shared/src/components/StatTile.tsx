import React from 'react';

interface StatTileProps {
  label: string;
  value: string | number;
  subLabel?: string;
  arrow?: 'up' | 'down' | null;
  diffText?: string;
}

export function StatTile({ label, value, subLabel, arrow, diffText }: StatTileProps) {
  return (
    <div className="stat-tile">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {subLabel && <div className="stat-sub">{subLabel}</div>}
      {(arrow || diffText) && (
        <div className={`stat-diff ${arrow === 'up' ? 'stat-diff-up' : arrow === 'down' ? 'stat-diff-down' : ''}`}>
          {arrow === 'up' && <span className="stat-arrow">&#9650;</span>}
          {arrow === 'down' && <span className="stat-arrow">&#9660;</span>}
          {diffText && <span>{diffText}</span>}
        </div>
      )}
    </div>
  );
}
