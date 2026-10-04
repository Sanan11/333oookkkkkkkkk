import type { ProjectManifest } from '../types';

const STORAGE_KEY = 'phone:project-manifest';

export const DEFAULT_PROJECT_MANIFEST: ProjectManifest = {
  id: 'sane333-project',
  name: 'Sane333',
  subtitle: 'Private Virtual Phone',
  description: '一个属于自己的角色、聊天、世界书与线下剧情项目。',
  genre: '现代乙女 / 日常 / 沉浸式角色互动',
  language: '中文',
  tone: '自然、细腻、克制、有生活感；保留角色自己的性格，不替用户行动。',
  globalPrompt: '',
  activeCharacterId: null,
  activeWorldBookId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function getProjectManifest(): ProjectManifest {
  if (typeof window === 'undefined') return DEFAULT_PROJECT_MANIFEST;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROJECT_MANIFEST;
    const parsed = JSON.parse(raw) as Partial<ProjectManifest>;
    return {
      ...DEFAULT_PROJECT_MANIFEST,
      ...parsed,
      id: parsed.id || DEFAULT_PROJECT_MANIFEST.id,
      updatedAt: parsed.updatedAt || DEFAULT_PROJECT_MANIFEST.updatedAt,
    };
  } catch {
    return DEFAULT_PROJECT_MANIFEST;
  }
}

export function saveProjectManifest(patch: Partial<ProjectManifest>): ProjectManifest {
  const current = getProjectManifest();
  const next: ProjectManifest = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the phone usable even when local storage is unavailable.
    }
  }

  return next;
}
