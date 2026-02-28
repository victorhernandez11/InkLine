import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { Session, Project } from '../types';
import { shortDate, fmt } from '../utils';
import { SESSIONS_PER_PAGE } from '../constants';

interface SessionLogProps {
  sessions: Session[];
  projects: Project[];
  selectedProjects: string[];
  onToggleProject: (name: string) => void;
  onEditSession: (session: Session) => void;
  onDeleteSession: (id: string) => void;
  onDeleteMultiple: (ids: string[]) => void;
  onUpdateSession: (id: string, updates: Partial<Session>) => void;
  onAddSession: () => void;
}

function InlineNumberEdit({
  value,
  onSave,
}: {
  value: number;
  onSave: (v: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (!editing) {
    return (
      <span className="inline-editable inline-editable-number" onClick={() => { setEditing(true); setText(String(value)); }}>
        {fmt(value)}
      </span>
    );
  }

  return (
    <input
      ref={inputRef}
      type="number"
      className="inline-input inline-input-number"
      value={text}
      onChange={e => setText(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          const n = parseInt(text, 10);
          if (!isNaN(n) && n > 0) {
            onSave(n);
          }
          setEditing(false);
        }
        if (e.key === 'Escape') {
          setEditing(false);
          setText(String(value));
        }
      }}
      onBlur={() => {
        setEditing(false);
        setText(String(value));
      }}
      min={1}
    />
  );
}

function InlineTextEdit({
  value,
  onSave,
  placeholder,
}: {
  value: string;
  onSave: (v: string) => void;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  if (!editing) {
    return (
      <span
        className={`inline-editable ${!value ? 'inline-editable-empty' : ''}`}
        onClick={() => { setEditing(true); setText(value); }}
      >
        {value || placeholder || 'Add note...'}
      </span>
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      className="inline-input"
      value={text}
      onChange={e => setText(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onSave(text.trim());
          setEditing(false);
        }
        if (e.key === 'Escape') {
          setEditing(false);
          setText(value);
        }
      }}
      onBlur={() => {
        setEditing(false);
        setText(value);
      }}
      placeholder={placeholder}
    />
  );
}

export function SessionLog({
  sessions,
  projects,
  selectedProjects,
  onToggleProject,
  onEditSession,
  onDeleteSession,
  onDeleteMultiple,
  onUpdateSession,
  onAddSession,
}: SessionLogProps) {
  const [page, setPage] = useState(0);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [deletePopoverId, setDeletePopoverId] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const colorMap = useMemo(() => {
    const m = new Map<string, string>();
    projects.forEach(p => m.set(p.name, p.color));
    return m;
  }, [projects]);

  const sorted = useMemo(
    () => [...sessions].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)),
    [sessions]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / SESSIONS_PER_PAGE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageItems = sorted.slice(currentPage * SESSIONS_PER_PAGE, (currentPage + 1) * SESSIONS_PER_PAGE);

  // Reset page when filter changes
  useEffect(() => {
    setPage(0);
    setChecked(new Set());
  }, [selectedProjects.join(','), sessions.length]);

  const allPageChecked = pageItems.length > 0 && pageItems.every(s => checked.has(s.id));

  const toggleCheck = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allPageChecked) {
      setChecked(prev => {
        const next = new Set(prev);
        pageItems.forEach(s => next.delete(s.id));
        return next;
      });
    } else {
      setChecked(prev => {
        const next = new Set(prev);
        pageItems.forEach(s => next.add(s.id));
        return next;
      });
    }
  };

  const handleBulkDelete = () => {
    onDeleteMultiple(Array.from(checked));
    setChecked(new Set());
    setBulkDeleteOpen(false);
  };

  // Determine if a specific project filter is active (for brighter badges)
  const isFiltering = selectedProjects.length > 0;

  return (
    <section className="session-log">
      <div className="log-header">
        <h2 className="log-title">Writing History</h2>
        <div className="log-header-actions">
          {checked.size > 0 && (
            <button className="btn btn-danger-sm" onClick={() => setBulkDeleteOpen(true)}>
              Delete {checked.size} selected
            </button>
          )}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="log-empty">No sessions recorded yet. Click "New Session" to start tracking.</div>
      ) : (
        <>
          <div className="log-table">
            <div className="log-table-head">
              <div className="log-col log-col-check" />
              <div className="log-col log-col-date">Date</div>
              <div className="log-col log-col-project">Project</div>
              <div className="log-col log-col-words">Words</div>
              <div className="log-col log-col-note">Note</div>
              <div className="log-col log-col-actions"></div>
            </div>

            {pageItems.map(s => {
              const color = colorMap.get(s.project) || '#999';
              const isProjectFiltered = isFiltering && selectedProjects.includes(s.project);
              // When filtered: solid project color bg with white text. Otherwise: light tint bg with project color text.
              const pillStyle = isProjectFiltered
                ? { backgroundColor: color, color: '#fff' }
                : { backgroundColor: color + '18', color: color };
              return (
                <div key={s.id} className="log-row">
                  <div className="log-col log-col-check">
                    <input
                      type="checkbox"
                      checked={checked.has(s.id)}
                      onChange={() => toggleCheck(s.id)}
                    />
                  </div>
                  <div className="log-col log-col-date">{shortDate(s.date)}</div>
                  <div className="log-col log-col-project">
                    <button
                      className={`project-pill ${isProjectFiltered ? 'project-pill-active' : ''}`}
                      style={pillStyle}
                      onClick={() => onToggleProject(s.project)}
                    >
                      <span
                        className="project-pill-dot"
                        style={{ backgroundColor: isProjectFiltered ? '#fff' : color }}
                      />
                      {s.project}
                    </button>
                  </div>
                  <div className="log-col log-col-words">
                    <InlineNumberEdit
                      value={s.wordCount}
                      onSave={v => onUpdateSession(s.id, { wordCount: v })}
                    />
                  </div>
                  <div className="log-col log-col-note">
                    <InlineTextEdit
                      value={s.note}
                      onSave={v => onUpdateSession(s.id, { note: v })}
                      placeholder="Add note..."
                    />
                  </div>
                  <div className="log-col log-col-actions">
                    <button
                      className="log-action-btn log-edit-btn"
                      onClick={() => onEditSession(s)}
                      title="Edit session"
                    >
                      Edit
                    </button>
                    <div className="log-delete-wrap">
                      <button
                        className="log-action-btn log-delete-btn"
                        onClick={() => setDeletePopoverId(deletePopoverId === s.id ? null : s.id)}
                        title="Delete session"
                      >
                        Delete
                      </button>
                      {deletePopoverId === s.id && (
                        <div className="log-delete-popover">
                          <div className="log-delete-popover-text">Delete this session?</div>
                          <div className="log-delete-popover-actions">
                            <button className="btn btn-secondary btn-sm" onClick={() => setDeletePopoverId(null)}>Cancel</button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                onDeleteSession(s.id);
                                setDeletePopoverId(null);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="log-pagination">
            <span className="log-page-info">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage === 0}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </button>
            <button
              className="btn btn-secondary btn-sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Bulk delete confirmation modal */}
      {bulkDeleteOpen && (
        <div className="modal-backdrop" onClick={() => setBulkDeleteOpen(false)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Delete {checked.size} session{checked.size !== 1 ? 's' : ''}?</h3>
            <p className="modal-delete-warn">
              You are about to delete {checked.size} session{checked.size !== 1 ? 's' : ''}. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setBulkDeleteOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleBulkDelete}>
                Yes, delete all {checked.size}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
