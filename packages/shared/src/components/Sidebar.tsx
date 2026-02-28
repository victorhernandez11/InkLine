import React, { useState } from 'react';
import type { Project, Session } from '../types';
import { fmt } from '../utils';

interface SidebarProps {
  projects: Project[];
  sessions: Session[];
  selectedProjects: string[];
  onToggleProject: (name: string) => void;
  onSelectAll: () => void;
  onCreateProject: (name: string) => void;
  onDeleteProject?: (name: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  canAddProject: boolean;
  maxProjects?: number;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onReportBug?: () => void;
  onMoreInfo?: () => void;
  onGiveFeedback?: () => void;
}

export function Sidebar({
  projects,
  sessions,
  selectedProjects,
  onToggleProject,
  onSelectAll,
  onCreateProject,
  onDeleteProject,
  isOpen,
  onToggle,
  canAddProject,
  maxProjects,
  darkMode,
  onToggleDarkMode,
  onReportBug,
  onMoreInfo,
  onGiveFeedback,
}: SidebarProps) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [confirmDeleteProject, setConfirmDeleteProject] = useState<string | null>(null);

  const allActive = selectedProjects.length === 0;

  const sessionCountMap = new Map<string, number>();
  sessions.forEach(s => {
    sessionCountMap.set(s.project, (sessionCountMap.get(s.project) || 0) + 1);
  });

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      onCreateProject(trimmed);
      setNewName('');
      setCreating(false);
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteProject && onDeleteProject) {
      onDeleteProject(confirmDeleteProject);
      setConfirmDeleteProject(null);
    }
  };

  return (
    <>
      <button
        className={`sidebar-toggle ${isOpen ? 'sidebar-toggle-open' : ''}`}
        onClick={onToggle}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <span className="sidebar-toggle-icon">{isOpen ? '\u2039' : '\u203A'}</span>
      </button>

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Projects</h2>
        </div>

        <div className="sidebar-new-section">
          {creating ? (
            <div className="sidebar-create-row">
              <input
                className="sidebar-new-input"
                type="text"
                placeholder="Project name..."
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') {
                    setCreating(false);
                    setNewName('');
                  }
                }}
                autoFocus
              />
              <div className="sidebar-new-actions">
                <button className="sidebar-new-save" onClick={handleCreate}>Add</button>
                <button className="sidebar-new-cancel" onClick={() => { setCreating(false); setNewName(''); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button
              className="sidebar-new-btn"
              disabled={!canAddProject}
              onClick={() => setCreating(true)}
              title={
                !canAddProject
                  ? `Free tier limit: ${maxProjects || 3} projects max. Upgrade to InkLine Pro for unlimited projects.`
                  : 'Create a new project'
              }
            >
              + New Project
            </button>
          )}
        </div>

        <div className="sidebar-separator" />

        <div className="sidebar-content">
          <button
            className={`sidebar-item sidebar-all ${allActive ? 'sidebar-item-active' : ''}`}
            onClick={onSelectAll}
          >
            <span className="sidebar-dot sidebar-dot-all" />
            <span className="sidebar-item-name">All Projects</span>
            <span className="sidebar-item-count">{sessions.length}</span>
          </button>

          <div className="sidebar-projects">
            {projects.map(p => {
              const isSelected = selectedProjects.includes(p.name);
              const count = sessionCountMap.get(p.name) || 0;
              const selectedStyle = isSelected
                ? { backgroundColor: p.color + '18', fontWeight: 600 }
                : undefined;
              return (
                <button
                  key={p.name}
                  className={`sidebar-item ${isSelected ? 'sidebar-item-selected' : ''}`}
                  style={selectedStyle}
                  onClick={() => onToggleProject(p.name)}
                >
                  <span className="sidebar-dot" style={{ backgroundColor: p.color }} />
                  <span className="sidebar-item-name">{p.name}</span>
                  <span className="sidebar-item-count">{count}</span>
                  {onDeleteProject && (
                    <span
                      className="sidebar-item-delete"
                      onClick={e => {
                        e.stopPropagation();
                        setConfirmDeleteProject(p.name);
                      }}
                      title={`Delete ${p.name}`}
                    >
                      &times;
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sidebar-footer">
          {onToggleDarkMode && (
            <button
              className="sidebar-footer-btn"
              onClick={onToggleDarkMode}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {darkMode ? (
                  <>
                    <circle cx="8" cy="8" r="3.5" />
                    <path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" />
                  </>
                ) : (
                  <path d="M13.5 10.2A6 6 0 015.8 2.5a6 6 0 107.7 7.7z" />
                )}
              </svg>
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          )}

          {onMoreInfo && (
            <button
              className="sidebar-footer-btn"
              onClick={onMoreInfo}
              title="More info about the free version"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="6.5" />
                <path d="M8 7v5M8 5v-.5" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>More Info</span>
            </button>
          )}

          {onReportBug && (
            <button
              className="sidebar-footer-btn"
              onClick={onReportBug}
              title="Report a bug"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 2v12M3 2h8l-2 3 2 3H3" />
              </svg>
              <span>Report Bug</span>
            </button>
          )}

          {onGiveFeedback && (
            <button
              className="sidebar-footer-btn"
              onClick={onGiveFeedback}
              title="Share feedback"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 10.5a1.5 1.5 0 01-1.5 1.5H4L1 15V2.5A1.5 1.5 0 012.5 1h10A1.5 1.5 0 0114 2.5v8z" />
              </svg>
              <span>Give Feedback</span>
            </button>
          )}
        </div>
      </aside>

      {/* Project delete confirmation dialog */}
      {confirmDeleteProject && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteProject(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Delete "{confirmDeleteProject}"?</h3>
            <div className="modal-delete-summary">
              <div><strong>Project:</strong> {confirmDeleteProject}</div>
              <div><strong>Sessions:</strong> {fmt(sessionCountMap.get(confirmDeleteProject) || 0)} writing sessions</div>
            </div>
            <p className="modal-delete-warn">
              This will permanently delete the project and all {sessionCountMap.get(confirmDeleteProject) || 0} associated sessions. This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setConfirmDeleteProject(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleConfirmDelete}>
                Yes, delete it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
