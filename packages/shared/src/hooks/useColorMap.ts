import { useMemo } from 'react';
import type { Project } from '../types';

export function useColorMap(projects: Project[]): Map<string, string> {
  return useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach(p => {
      map.set(p.name, p.color);
    });
    return map;
  }, [projects]);
}
