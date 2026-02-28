'use client';

import { useState, useCallback, useEffect } from 'react';
import type { Project, Session } from '@shared/types';
import { PROJECT_COLORS } from '@shared/constants';
import { createClient } from '@/lib/supabase/client';

export function useProjectStore() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Load projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, color, position')
      .order('position', { ascending: true });

    if (!error && data) {
      setProjects(data.map(row => ({ name: row.name, color: row.color })));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = useCallback(
    async (name: string): Promise<Project | null> => {
      const trimmed = name.trim();
      if (!trimmed) return null;

      // Check if already exists
      const existing = projects.find(p => p.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) return existing;

      // Assign next color
      const colorIndex = projects.length % PROJECT_COLORS.length;
      const color = PROJECT_COLORS[colorIndex];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: trimmed,
          color,
          position: projects.length,
        })
        .select()
        .single();

      if (!error && data) {
        const newProject: Project = { name: data.name, color: data.color };
        setProjects(prev => [...prev, newProject]);
        return newProject;
      }
      return null;
    },
    [projects]
  );

  // No project limit in web version
  const canAddProject = true;

  const reconcile = useCallback((_sessions: Session[]) => {
    // Not needed for Supabase version — projects are stored in DB
  }, []);

  const initProjects = useCallback(() => {}, []);

  return { projects, loading, addProject, canAddProject, reconcile, initProjects };
}
