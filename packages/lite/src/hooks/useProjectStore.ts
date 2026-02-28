import { useState, useCallback, useEffect } from 'react';
import type { Project, Session } from '@shared/types';
import { PROJECT_COLORS, MAX_PROJECTS_LITE } from '@shared/constants';
import { sanitize, isValidProjectName, safeParseJSON } from '@shared/utils';

const STORAGE_KEY = 'inkline_projects';

function loadProjects(): Project[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  const parsed = safeParseJSON<Project[]>(raw, []);
  // Deduplicate by name (case-insensitive) on every load
  const seen = new Set<string>();
  return parsed.filter(p => {
    if (!p || typeof p.name !== 'string' || !p.name.trim()) return false;
    const key = p.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function useProjectStore() {
  const [projects, setProjects] = useState<Project[]>(loadProjects);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const addProject = useCallback((name: string): Project | null => {
    const trimmed = sanitize(name);
    if (!trimmed || !isValidProjectName(trimmed)) return null;

    let result: Project | null = null;

    setProjects(prev => {
      // Check for existing project (case-insensitive)
      const existing = prev.find(p => p.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) {
        result = existing;
        return prev;
      }
      if (prev.length >= MAX_PROJECTS_LITE) return prev;

      // Pick the first color not already used by an existing project
      const usedColors = new Set(prev.map(p => p.color));
      const color = PROJECT_COLORS.find(c => !usedColors.has(c))
        || PROJECT_COLORS[prev.length % PROJECT_COLORS.length];

      const newProject: Project = { name: trimmed, color };
      result = newProject;
      return [...prev, newProject];
    });

    return result;
  }, []);

  const deleteProject = useCallback((name: string) => {
    setProjects(prev => prev.filter(p => p.name !== name));
  }, []);

  const canAddProject = projects.length < MAX_PROJECTS_LITE;

  const reconcile = useCallback((sessions: Session[]) => {
    setProjects(prev => {
      const existing = new Set(prev.map(p => p.name.toLowerCase()));
      const missing: Project[] = [];
      let nextIndex = prev.length;
      sessions.forEach(s => {
        const key = s.project.toLowerCase();
        if (!existing.has(key) && nextIndex < PROJECT_COLORS.length) {
          missing.push({ name: s.project, color: PROJECT_COLORS[nextIndex] });
          existing.add(key);
          nextIndex++;
        }
      });
      return missing.length > 0 ? [...prev, ...missing] : prev;
    });
  }, []);

  const initProjects = useCallback((initialProjects: Project[]) => {
    // Deduplicate on init
    const seen = new Set<string>();
    const deduped = initialProjects.filter(p => {
      const key = p.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setProjects(deduped);
  }, []);

  return { projects, addProject, deleteProject, canAddProject, reconcile, initProjects };
}
