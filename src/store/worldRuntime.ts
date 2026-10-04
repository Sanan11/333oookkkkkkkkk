import type { ImportedCharacter } from '../data/characterImport';
import type { OfflineEvent } from '../types';

const STORAGE_KEY = 'phone:world-runtime-v1';
const MAX_EVENTS = 80;

export type WorldEventType =
  | 'character.message'
  | 'offline.invite'
  | 'offline.accepted'
  | 'offline.started'
  | 'offline.message'
  | 'offline.completed'
  | 'relationship.changed';

export interface CharacterRuntimeState {
  characterId: string;
  name: string;
  location: string;
  activity: string;
  mood: string;
  lastSeenAt: string;
  lastInteractionAt: string | null;
  unread: number;
}

export interface WorldRuntimeState {
  version: 1;
  updatedAt: string;
  currentScene: string | null;
  characters: Record<string, CharacterRuntimeState>;
  events: Array<{
    id: string;
    type: WorldEventType;
    characterId?: string;
    characterName?: string;
    payload?: Record<string, unknown>;
    createdAt: string;
  }>;
}

function readState(): WorldRuntimeState {
  if (typeof window === 'undefined') return {
    version: 1,
    updatedAt: new Date().toISOString(),
    currentScene: null,
    characters: {},
    events: [],
  };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as WorldRuntimeState;
  } catch {
    // Recover with a clean runtime.
  }
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    currentScene: null,
    characters: {},
    events: [],
  };
}

function writeState(state: WorldRuntimeState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Runtime state is best-effort; existing app data remains authoritative.
  }
}

function ensureCharacter(state: WorldRuntimeState, character: ImportedCharacter | { id: string; name: string }) {
  const existing = state.characters[character.id];
  if (existing) return existing;
  state.characters[character.id] = {
    characterId: character.id,
    name: character.name,
    location: '未知',
    activity: '空闲',
    mood: '平静',
    lastSeenAt: new Date().toISOString(),
    lastInteractionAt: null,
    unread: 0,
  };
  return state.characters[character.id];
}

export function syncWorldCharacters(characters: ImportedCharacter[]) {
  const state = readState();
  characters.forEach(character => ensureCharacter(state, character));
  state.updatedAt = new Date().toISOString();
  writeState(state);
  return state;
}

export function getWorldRuntime(): WorldRuntimeState {
  return readState();
}

export function getWorldUnreadCount(): number {
  return Object.values(readState().characters).reduce((sum, character) => sum + character.unread, 0);
}

export function markCharacterRead(characterId: string) {
  if (typeof window === 'undefined') return;
  const state = readState();
  const character = state.characters[characterId];
  if (!character) return;
  character.unread = 0;
  state.updatedAt = new Date().toISOString();
  writeState(state);
  window.dispatchEvent(new CustomEvent('sane333:world-state-changed', { detail: state }));
}

export function emitWorldEvent(
  type: WorldEventType,
  payload: {
    characterId?: string;
    characterName?: string;
    data?: Record<string, unknown>;
  } = {},
) {
  if (typeof window === 'undefined') return;
  const state = readState();
  const now = new Date().toISOString();
  const id = 'world-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);

  if (payload.characterId) {
    const character = ensureCharacter(state, {
      id: payload.characterId,
      name: payload.characterName || payload.characterId,
    });
    character.lastSeenAt = now;
    if (type !== 'relationship.changed') character.lastInteractionAt = now;

    if (type === 'character.message') character.unread += 1;
    if (type === 'offline.started') {
      character.activity = '正在与你见面';
      character.unread = Math.max(0, character.unread - 1);
    }
    if (type === 'offline.completed') character.activity = '刚结束一次见面';
  }

  state.events = [
    ...state.events,
    {
      id,
      type,
      characterId: payload.characterId,
      characterName: payload.characterName,
      payload: payload.data,
      createdAt: now,
    },
  ].slice(-MAX_EVENTS);
  state.updatedAt = now;
  writeState(state);

  window.dispatchEvent(new CustomEvent('sane333:world-event', {
    detail: { id, type, characterId: payload.characterId, characterName: payload.characterName, data: payload.data },
  }));

  return id;
}

export function setCharacterRuntime(
  characterId: string,
  patch: Partial<Omit<CharacterRuntimeState, 'characterId' | 'name'>>,
  name?: string,
) {
  if (typeof window === 'undefined') return;
  const state = readState();
  const character = ensureCharacter(state, { id: characterId, name: name || characterId });
  Object.assign(character, patch);
  state.updatedAt = new Date().toISOString();
  writeState(state);
  window.dispatchEvent(new CustomEvent('sane333:world-state-changed', { detail: state }));
}

export function setCurrentScene(sceneId: string | null) {
  if (typeof window === 'undefined') return;
  const state = readState();
  state.currentScene = sceneId;
  state.updatedAt = new Date().toISOString();
  writeState(state);
  window.dispatchEvent(new CustomEvent('sane333:world-state-changed', { detail: state }));
}

export function syncOfflineEventToWorld(event: OfflineEvent) {
  if (event.status === 'draft' || event.status === 'declined') return null;

  const type: WorldEventType =
    event.status === 'pending' ? 'offline.invite'
      : event.status === 'accepted' ? 'offline.accepted'
      : event.status === 'in-progress' ? 'offline.started'
      : 'offline.completed';

  return emitWorldEvent(type, {
    characterId: event.characterId,
    characterName: event.characterName,
    data: {
      offlineEventId: event.id,
      title: event.title,
      location: event.location,
      time: event.time,
      theme: event.theme,
      status: event.status,
    },
  });
}
