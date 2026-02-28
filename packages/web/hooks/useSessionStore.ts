'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Session } from '@shared/types';
import { createClient } from '@/lib/supabase/client';

interface DbSession {
  id: string;
  project_id: string;
  date: string;
  word_count: number;
  note: string;
  projects: { name: string };
}

export function useSessionStore() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Load sessions
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sessions')
      .select('id, project_id, date, word_count, note, projects(name)')
      .order('date', { ascending: false });

    if (!error && data) {
      setSessions(
        (data as unknown as DbSession[]).map(row => ({
          id: row.id,
          date: row.date,
          project: row.projects.name,
          wordCount: row.word_count,
          note: row.note || '',
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const addSession = useCallback(
    async (session: Omit<Session, 'id'>) => {
      // Look up project_id by name
      const { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('name', session.project)
        .single();

      if (!project) return null;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          project_id: project.id,
          date: session.date,
          word_count: session.wordCount,
          note: session.note,
        })
        .select()
        .single();

      if (!error && data) {
        const newSession: Session = {
          id: data.id,
          date: data.date,
          project: session.project,
          wordCount: data.word_count,
          note: data.note || '',
        };
        setSessions(prev => [newSession, ...prev]);
        return newSession;
      }
      return null;
    },
    []
  );

  const updateSession = useCallback(async (id: string, updates: Partial<Session>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.wordCount !== undefined) dbUpdates.word_count = updates.wordCount;
    if (updates.note !== undefined) dbUpdates.note = updates.note;

    const { error } = await supabase.from('sessions').update(dbUpdates).eq('id', id);

    if (!error) {
      setSessions(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
    }
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    const { error } = await supabase.from('sessions').delete().eq('id', id);
    if (!error) {
      setSessions(prev => prev.filter(s => s.id !== id));
    }
  }, []);

  const deleteMultiple = useCallback(async (ids: string[]) => {
    const { error } = await supabase.from('sessions').delete().in('id', ids);
    if (!error) {
      const idSet = new Set(ids);
      setSessions(prev => prev.filter(s => !idSet.has(s.id)));
    }
  }, []);

  const initSessions = useCallback(() => {}, []);

  return { sessions, loading, addSession, updateSession, deleteSession, deleteMultiple, initSessions };
}
