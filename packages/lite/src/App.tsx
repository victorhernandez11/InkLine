import React, { useState, useMemo, useEffect } from 'react';
import type { Session, Project } from '@shared/types';
import { MAX_PROJECTS_LITE } from '@shared/constants';
import { useAnalytics } from '@shared/hooks/useAnalytics';
import { Sidebar } from '@shared/components/Sidebar';
import { StatsRow } from '@shared/components/StatsRow';
import { ChartSection } from '@shared/components/ChartSection';
import { SessionLog } from '@shared/components/SessionLog';
import { SessionModal } from '@shared/components/SessionModal';
import { useSessionStore } from './hooks/useSessionStore';
import { useProjectStore } from './hooks/useProjectStore';
import { createSeedProjects, createSeedSessions } from './seed';
import './App.css';

const SEEDED_KEY = 'inkline_seeded';
const SEED_VERSION = '3'; // Bump to force re-seed

/**
 * Lighten a hex color for better dark-mode contrast.
 * Mixes the color toward white by the given amount (0-1).
 */
function lightenColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}

export default function App() {
  const { sessions, addSession, updateSession, deleteSession, deleteMultiple, initSessions } =
    useSessionStore();
  const { projects, addProject, deleteProject, canAddProject, reconcile, initProjects } = useProjectStore();

  // Seed data on first load or when seed version bumps
  useEffect(() => {
    if (localStorage.getItem(SEEDED_KEY) !== SEED_VERSION) {
      const seedProjects = createSeedProjects();
      const seedSessions = createSeedSessions();
      initProjects(seedProjects);
      initSessions(seedSessions);
      localStorage.setItem(SEEDED_KEY, SEED_VERSION);
    }
  }, []);

  // Dark mode toggle
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('inkline_theme') === 'dark';
  });
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('inkline_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Compute display projects — lighten colors in dark mode for better contrast
  const displayProjects: Project[] = useMemo(() => {
    if (!darkMode) return projects;
    return projects.map(p => ({
      ...p,
      color: lightenColor(p.color, 0.25),
    }));
  }, [projects, darkMode]);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [hideEmpty, setHideEmpty] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    if (selectedProjects.length === 0) return sessions;
    return sessions.filter(s => selectedProjects.includes(s.project));
  }, [sessions, selectedProjects]);

  // Analytics from filtered sessions, with empty days awareness
  const analytics = useAnalytics(filteredSessions, !hideEmpty);

  // Project filter handlers
  const handleToggleProject = (name: string) => {
    setSelectedProjects(prev => {
      let next: string[];
      if (prev.includes(name)) {
        next = prev.filter(p => p !== name);
      } else {
        next = [...prev, name];
      }
      // If every project is now selected, reset to "All" (empty = all)
      if (next.length >= projects.length) {
        return [];
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedProjects([]);
  };

  // Project creation
  const handleCreateProject = (name: string) => {
    addProject(name);
  };

  // Project deletion — also remove all sessions for this project
  const handleDeleteProject = (name: string) => {
    const idsToDelete = sessions.filter(s => s.project === name).map(s => s.id);
    if (idsToDelete.length > 0) {
      deleteMultiple(idsToDelete);
    }
    deleteProject(name);
    setSelectedProjects(prev => prev.filter(p => p !== name));
  };

  // Session save (add or edit)
  const handleSaveSession = (data: {
    date: string;
    project: string;
    wordCount: number;
    note: string;
  }) => {
    // Auto-create project if needed
    const existingProject = projects.find(
      p => p.name.toLowerCase() === data.project.toLowerCase()
    );
    if (!existingProject) {
      const created = addProject(data.project);
      if (!created) return; // limit reached
    }

    if (editingSession) {
      updateSession(editingSession.id, {
        date: data.date,
        project: data.project,
        wordCount: data.wordCount,
        note: data.note,
      });
    } else {
      addSession({
        date: data.date,
        project: data.project,
        wordCount: data.wordCount,
        note: data.note,
      });
    }
    setModalOpen(false);
    setEditingSession(null);
  };

  const handleDeleteFromModal = (id: string) => {
    deleteSession(id);
    setModalOpen(false);
    setEditingSession(null);
  };

  const handleOpenAdd = () => {
    setEditingSession(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (session: Session) => {
    setEditingSession(session);
    setModalOpen(true);
  };

  const existingProjectNames = projects.map(p => p.name);

  const [infoOpen, setInfoOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);
  const [bugText, setBugText] = useState('');
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleReportBug = () => setBugOpen(true);
  const handleGiveFeedback = () => setFeedbackOpen(true);

  return (
    <div className="app">
      <header className="main-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 className="main-title">InkLine</h1>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--orange, #d4621a)', background: 'rgba(212,98,26,0.1)', border: '1px solid rgba(212,98,26,0.25)', padding: '2px 8px', borderRadius: 4 }}>Free</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <span className="btn-plus">+</span> New Session
          </button>
        </div>
      </header>

      {infoOpen && (
        <div onClick={() => setInfoOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: darkMode ? 'linear-gradient(160deg, #1a0e07 0%, #120a04 100%)' : '#fff',
            borderRadius: 18,
            maxWidth: 740,
            width: '100%',
            boxShadow: darkMode ? '0 24px 80px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.18)',
            border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'flex',
            maxHeight: '90vh',
            position: 'relative',
          }}>
            {/* Close button — top right of entire modal */}
            <button onClick={() => setInfoOpen(false)} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: darkMode ? 'rgba(245,242,237,0.35)' : '#bbb', lineHeight: 1, padding: '4px 8px', zIndex: 2, borderRadius: 6 }}>×</button>
            {/* Left — storage info */}
            <div style={{ flex: 1, padding: '32px 28px', overflowY: 'auto' }}>
              <div style={{ marginBottom: 18 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: darkMode ? '#f5f2ed' : '#2e2118', fontFamily: 'var(--font-heading)' }}>Your data is safe here</h2>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.75, color: darkMode ? 'rgba(245,242,237,0.65)' : '#555', marginBottom: 16 }}>
                <strong style={{ color: darkMode ? '#f5f2ed' : '#2e2118' }}>Your data persists when you close this tab.</strong> It will be right here next time you open it.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: '🔒', text: 'Completely private. No server, no account needed.' },
                  { icon: '📶', text: 'Works offline, any time.' },
                  { icon: '⚠️', text: 'Clearing browser data or switching browsers will clear it.' },
                  { icon: '💻', text: 'Only accessible from this browser on this device.' },
                ].map(item => (
                  <li key={item.icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: darkMode ? 'rgba(245,242,237,0.6)' : '#555', lineHeight: 1.55 }}>
                    <span style={{ flexShrink: 0, fontSize: 14 }}>{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div style={{ width: 1, background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', flexShrink: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: darkMode ? '#1a0e07' : '#fff', padding: '6px 0', fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: darkMode ? 'rgba(245,242,237,0.25)' : '#ccc', writingMode: 'vertical-rl' as const }}>Want more?</div>
            </div>

            {/* Right — upgrade */}
            <div style={{ flex: 1, padding: '36px 28px 32px', background: darkMode ? 'rgba(212,98,26,0.06)' : 'rgba(212,98,26,0.03)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: darkMode ? '#f5f2ed' : '#2e2118', marginBottom: 6, marginTop: 0, fontFamily: 'var(--font-heading)' }}>Upgrade to Cloud</h3>
              <p style={{ fontSize: 13, color: darkMode ? 'rgba(245,242,237,0.45)' : '#888', marginBottom: 20, lineHeight: 1.55 }}>$4.99/mo. Cancel any time.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '🔄', text: 'Sync across all your devices and browsers' },
                  { icon: '☁️', text: 'Automatic cloud backup. Never lose a word.' },
                  { icon: '📁', text: 'Unlimited projects (free is capped at 5)' },
                  { icon: '🌍', text: 'Access from anywhere, even a new computer' },
                ].map(item => (
                  <li key={item.icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: darkMode ? 'rgba(245,242,237,0.65)' : '#555', lineHeight: 1.55 }}>
                    <span style={{ flexShrink: 0, fontSize: 14 }}>{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <a href="/login" style={{ display: 'block', textAlign: 'center', padding: '12px 0', background: '#d4621a', color: 'white', borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: 'none', marginTop: 24, boxShadow: '0 4px 16px rgba(212,98,26,0.35)' }}>
                Sign Up for $4.99/mo →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bug Report / Feedback Modal */}
      {(bugOpen || feedbackOpen) && (
        <div onClick={() => { setBugOpen(false); setFeedbackOpen(false); setBugText(''); setFeedbackText(''); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: darkMode ? 'linear-gradient(160deg, #1a0e07 0%, #120a04 100%)' : '#fff',
            borderRadius: 18,
            maxWidth: 480,
            width: '100%',
            padding: '32px',
            boxShadow: darkMode ? '0 24px 80px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.18)',
            border: darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
            position: 'relative',
          }}>
            <button onClick={() => { setBugOpen(false); setFeedbackOpen(false); setBugText(''); setFeedbackText(''); }} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: darkMode ? 'rgba(245,242,237,0.35)' : '#bbb', lineHeight: 1, padding: '4px 8px', borderRadius: 6 }}>×</button>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 18px', fontFamily: 'var(--font-heading)', color: darkMode ? '#f5f2ed' : '#2e2118' }}>
              {bugOpen ? 'Report a Bug' : 'Share Feedback'}
            </h2>
            <textarea
              placeholder={bugOpen ? 'Describe what you encountered...' : "What's on your mind? Feature requests, compliments, anything goes:"}
              value={bugOpen ? bugText : feedbackText}
              onChange={e => bugOpen ? setBugText(e.target.value) : setFeedbackText(e.target.value)}
              autoFocus
              style={{
                display: 'block', width: '100%',
                padding: '12px 16px',
                borderRadius: 10,
                border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                color: darkMode ? '#f5f2ed' : '#2e2118',
                fontSize: 14,
                lineHeight: 1.65,
                resize: 'vertical' as const,
                minHeight: 110,
                outline: 'none',
                fontFamily: 'var(--font-body)',
                marginBottom: 20,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => { setBugOpen(false); setFeedbackOpen(false); setBugText(''); setFeedbackText(''); }}
                style={{ padding: '9px 20px', borderRadius: 9, border: darkMode ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)', background: 'none', color: darkMode ? 'rgba(245,242,237,0.55)' : '#888', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' }}
              >Cancel</button>
              <button
                onClick={() => {
                  const text = (bugOpen ? bugText : feedbackText).trim();
                  if (!text) return;
                  if (bugOpen) {
                    const reports = JSON.parse(localStorage.getItem('inkline_bugs') || '[]');
                    reports.push({ description: text, timestamp: new Date().toISOString(), userAgent: navigator.userAgent });
                    localStorage.setItem('inkline_bugs', JSON.stringify(reports));
                    setBugText(''); setBugOpen(false);
                  } else {
                    const items = JSON.parse(localStorage.getItem('inkline_feedback') || '[]');
                    items.push({ message: text, timestamp: new Date().toISOString() });
                    localStorage.setItem('inkline_feedback', JSON.stringify(items));
                    setFeedbackText(''); setFeedbackOpen(false);
                  }
                }}
                style={{ padding: '9px 20px', borderRadius: 9, border: 'none', background: '#d4621a', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)', boxShadow: '0 4px 12px rgba(212,98,26,0.3)' }}
              >Send</button>
            </div>
          </div>
        </div>
      )}

      <Sidebar
        projects={displayProjects}
        sessions={sessions}
        selectedProjects={selectedProjects}
        onToggleProject={handleToggleProject}
        onSelectAll={handleSelectAll}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(v => !v)}
        canAddProject={canAddProject}
        maxProjects={MAX_PROJECTS_LITE}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(d => !d)}
        onMoreInfo={() => setInfoOpen(true)}
        onReportBug={handleReportBug}
        onGiveFeedback={handleGiveFeedback}
      />

      <main className={`main ${sidebarOpen ? '' : 'main-expanded'}`}>
        <StatsRow analytics={analytics} />

        <ChartSection
          sessions={filteredSessions}
          projects={displayProjects}
          selectedProjects={selectedProjects}
          hideEmpty={hideEmpty}
          onHideEmptyChange={setHideEmpty}
        />

        <SessionLog
          sessions={filteredSessions}
          projects={displayProjects}
          selectedProjects={selectedProjects}
          onToggleProject={handleToggleProject}
          onEditSession={handleOpenEdit}
          onDeleteSession={deleteSession}
          onDeleteMultiple={deleteMultiple}
          onUpdateSession={updateSession}
          onAddSession={handleOpenAdd}
        />
      </main>

      <SessionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSession(null);
        }}
        onSave={handleSaveSession}
        onDelete={handleDeleteFromModal}
        session={editingSession}
        projects={displayProjects}
        canAddProject={canAddProject}
        existingProjectNames={existingProjectNames}
      />
    </div>
  );
}
