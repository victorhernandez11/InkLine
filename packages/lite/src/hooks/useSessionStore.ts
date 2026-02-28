import { useState, useCallback, useEffect } from 'react';
import type { Session } from '@shared/types';
import { generateId, sanitize, isValidDate, isValidWordCount, safeParseJSON } from '@shared/utils';

const STORAGE_KEY = 'inkline_sessions';

function loadSessions(): Session[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = safeParseJSON<Session[]>(raw, []);
  // Validate each session on load
  return parsed.filter(
    s =>
      s &&
      typeof s.id === 'string' &&
      typeof s.date === 'string' &&
      typeof s.project === 'string' &&
      typeof s.wordCount === 'number' &&
      s.wordCount > 0
  );
}

function saveSessions(sessions: Session[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function useSessionStore() {
  const [sessions, setSessions] = useState<Session[]>(loadSessions);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const addSession = useCallback((session: Omit<Session, 'id'>): Session | null => {
    const project = sanitize(session.project);
    const note = sanitize(session.note || '');
    if (!project || !isValidDate(session.date) || !isValidWordCount(session.wordCount)) {
      return null;
    }
    const newSession: Session = {
      id: generateId(),
      date: session.date,
      project,
      wordCount: session.wordCount,
      note,
    };
    setSessions(prev => [...prev, newSession]);
    return newSession;
  }, []);

  const updateSession = useCallback((id: string, updates: Partial<Session>) => {
    setSessions(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        const patched = { ...s };
        if (updates.date !== undefined && isValidDate(updates.date)) patched.date = updates.date;
        if (updates.project !== undefined) patched.project = sanitize(updates.project) || s.project;
        if (updates.wordCount !== undefined && isValidWordCount(updates.wordCount)) patched.wordCount = updates.wordCount;
        if (updates.note !== undefined) patched.note = sanitize(updates.note);
        return patched;
      })
    );
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  }, []);

  const deleteMultiple = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setSessions(prev => prev.filter(s => !idSet.has(s.id)));
  }, []);

  const initSessions = useCallback((initialSessions: Session[]) => {
    setSessions(initialSessions);
  }, []);

  return { sessions, addSession, updateSession, deleteSession, deleteMultiple, initSessions };
}
