export interface TogetherMusicSession {
  id: string;
  conversationId: string;
  title: string;
  artist: string;
  url: string;
  startedBy: 'me' | 'character';
  status: 'invited' | 'listening' | 'paused';
  createdAt: string;
  updatedAt: string;
}

export function createTogetherMusicSession(input: Omit<TogetherMusicSession, 'id' | 'createdAt' | 'updatedAt'>): TogetherMusicSession {
  const now = new Date().toISOString();
  return {
    ...input,
    id: 'together-music-' + Date.now().toString(36),
    createdAt: now,
    updatedAt: now,
  };
}
