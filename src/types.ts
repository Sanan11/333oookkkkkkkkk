export type ThemeMode = 'dark-luxury' | 'nordic-light' | 'ocean-breeze';

export type ScreenType = 
  | 'lock'
  | 'home'
  | 'inbox'
  | 'chat'
  | 'character-profile'
  | 'moments'
  | 'gallery'
  | 'music'
  | 'notes'
  | 'calendar'
  | 'world-book'
  | 'threads'
  | 'spy-phone'
  | 'settings'
  | 'offline-story';

export interface CharacterInfo {
  id: string;
  name: string;
  avatar: string;
  heroImage: string;
  status: string;
  age: number;
  height: string;
  constellation: string;
  location: string;
  bio: string;
  quote: string;
  recentMoments: string[];
  unreadCount?: number;
}

export interface CharacterProfile {
  nickname: string;
  birthday: string;
  relationship: string;
  canAutoChangeRelation: boolean;
  callMe: string;
  selectedLorebook: string;
  bio?: string;
}

export interface WorldBookEntry {
  id: string;
  name: string;
  keywords: string[];
  content: string;
  enabled: boolean;
  priority: number;
  weight: number;
  insertion: 'before' | 'after' | 'depth';
  depth: number;
}

export interface WorldBook {
  id: string;
  name: string;
  description: string;
  entries: WorldBookEntry[];
  enabled: boolean;
  updatedAt: string;
}

export interface OfflineEvent {
  id: string;
  characterId: string;
  characterName: string;
  title: string;
  location: string;
  time: string;
  theme: string;
  letter: string;
  status: 'draft' | 'pending' | 'accepted' | 'declined' | 'in-progress' | 'completed';
  createdAt: string;
}

export interface WidgetConfig {
  weatherCity: string;
  weatherTemp: string;
  weatherCondition: string;
  weatherHighLow: string;
  quoteContent: string;
  quoteAuthor: string;
  musicTitle: string;
  musicArtist: string;
  anniversaryDays: number;
  anniversaryText: string;
}
