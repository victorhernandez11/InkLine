'use client';

import { useState, useMemo } from 'react';
import type { Session } from '@shared/types';
import { useAnalytics } from '@shared/hooks/useAnalytics';
import { Sidebar } from '@shared/components/Sidebar';
import { StatsRow } from '@shared/components/StatsRow';
import { ChartSection } from '@shared/components/ChartSection';
import { SessionLog } from '@shared/components/SessionLog';
import { SessionModal } from '@shared/components/SessionModal';
import { useSessionStore } from '@/hooks/useSessionStore';
import { useProjectStore } from '@/hooks/useProjectStore';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Import shared CSS (same styles as lite version)
// In production, these would be converted to Tailwind classes
import '../../lite/src/App.css';

export default function DashboardPage() {
  const { sessions, addSession, updateSession, deleteSession, deleteMultiple } = useSessionStore();
  const { projects, addProject, canAddProject } = useProjectStore();
  const supabase = createClient();
  const router = useRouter();

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar');
  const [hideEmpty, setHideEmpty] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  // Filter sessions
  const filteredSessions = useMemo(() => {
    if (selectedProjects.length === 0) return sessions;
    return sessions.filter(s => selectedProjects.includes(s.project));
  }, [sessions, selectedProjects]);

  const analytics = useAnalytics(filteredSessions);

  const handleToggleProject = (name: string) => {
    setSelectedProjects(prev =>
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const handleSaveSession = async (data: {
    date: string;
    project: string;
    wordCount: number;
    note: string;
  }) => {
    const existingProject = projects.find(
      p => p.name.toLowerCase() === data.project.toLowerCase()
    );
    if (!existingProject) {
      const created = await addProject(data.project);
      if (!created) return;
    }

    if (editingSession) {
      await updateSession(editingSession.id, {
        date: data.date,
        project: data.project,
        wordCount: data.wordCount,
        note: data.note,
      });
    } else {
      await addSession({
        date: data.date,
        project: data.project,
        wordCount: data.wordCount,
        note: data.note,
      });
    }
    setModalOpen(false);
    setEditingSession(null);
  };

  const handleDeleteFromModal = async (id: string) => {
    await deleteSession(id);
    setModalOpen(false);
    setEditingSession(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="app">
      <Sidebar
        projects={projects}
        sessions={sessions}
        selectedProjects={selectedProjects}
        onToggleProject={handleToggleProject}
        onSelectAll={() => setSelectedProjects([])}
        onCreateProject={(name) => addProject(name)}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(v => !v)}
        canAddProject={canAddProject}
      />

      <main className={`main ${sidebarOpen ? '' : 'main-expanded'}`}>
        <header className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="main-title">InkLine</h1>
            <p className="main-subtitle">Daily Writing Tracker</p>
          </div>
          <button
            onClick={handleSignOut}
            className="btn btn-secondary"
            style={{ fontSize: 12 }}
          >
            Sign Out
          </button>
        </header>

        <StatsRow analytics={analytics} />

        <ChartSection
          sessions={filteredSessions}
          projects={projects}
          selectedProjects={selectedProjects}
          chartMode={chartMode}
          onChartModeChange={setChartMode}
          hideEmpty={hideEmpty}
          onHideEmptyChange={setHideEmpty}
        />

        <SessionLog
          sessions={filteredSessions}
          projects={projects}
          selectedProjects={selectedProjects}
          onToggleProject={handleToggleProject}
          onEditSession={(s) => { setEditingSession(s); setModalOpen(true); }}
          onDeleteSession={deleteSession}
          onDeleteMultiple={deleteMultiple}
          onUpdateSession={updateSession}
          onAddSession={() => { setEditingSession(null); setModalOpen(true); }}
        />
      </main>

      <SessionModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingSession(null); }}
        onSave={handleSaveSession}
        onDelete={handleDeleteFromModal}
        session={editingSession}
        projects={projects}
        canAddProject={canAddProject}
        existingProjectNames={projects.map(p => p.name)}
      />
    </div>
  );
}
