import { readPersistentState } from './usePersistentState';

export interface LineGroupMember {
  id: string;
  name: string;
  characterId?: string | null;
  role: 'owner' | 'admin' | 'member';
  nickname?: string;
  muted?: boolean;
}

export interface LineGroup {
  id: string;
  name: string;
  avatar?: string;
  ownerId: string;
  members: LineGroupMember[];
  announcement: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'line:groups';

export function getLineGroups(): LineGroup[] {
  return readPersistentState<LineGroup[]>(STORAGE_KEY, []);
}

export function getLineGroupByName(name: string): LineGroup | null {
  return getLineGroups().find(group => group.name === name) || null;
}

export function upsertLineGroup(group: LineGroup): void {
  if (typeof window === 'undefined') return;
  try {
    const groups = getLineGroups();
    const next = groups.some(item => item.id === group.id)
      ? groups.map(item => item.id === group.id ? group : item)
      : [group, ...groups];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage failure must not break LINE.
  }
}

export function createLineGroup(input: {
  name: string;
  ownerId: string;
  ownerName: string;
  memberNames: string[];
  characterIds?: Record<string, string>;
  announcement?: string;
}): LineGroup {
  const now = new Date().toISOString();
  const uniqueNames = Array.from(new Set([input.ownerName, ...input.memberNames].map(name => name.trim()).filter(Boolean)));
  const group: LineGroup = {
    id: 'group-' + Date.now().toString(36),
    name: input.name.trim(),
    ownerId: input.ownerId,
    members: uniqueNames.map((name, index) => ({
      id: input.characterIds?.[name] || 'member-' + name,
      name,
      characterId: input.characterIds?.[name] || null,
      role: name === input.ownerName ? 'owner' : index === 1 ? 'admin' : 'member',
      nickname: name,
      muted: false,
    })),
    announcement: input.announcement || '',
    description: '',
    createdAt: now,
    updatedAt: now,
  };
  upsertLineGroup(group);
  return group;
}
