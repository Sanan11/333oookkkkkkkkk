export type ChatProvider = 'gemini' | 'openai-compatible' | 'custom';

export interface AppSettings {
  provider: ChatProvider;
  apiBaseUrl: string;
  apiKey: string;
  model: string;
  streaming: boolean;
  contextLength: number;
  maxOutputTokens: number;
  autoSave: boolean;
  autoMemoryEnabled: boolean;
  autoMemoryEveryMessages: number;
  temperature: number;

  voiceEnabled: boolean;
  voiceProvider: 'browser' | 'openai-compatible' | 'custom';
  voiceBaseUrl: string;
  voiceApiKey: string;
  voiceModel: string;
  voiceName: string;
  voiceFormat: 'mp3' | 'wav' | 'ogg';
  autoSpeakAiReplies: boolean;

  sttEnabled: boolean;
  sttProvider: 'browser' | 'openai-compatible' | 'custom';
  sttBaseUrl: string;
  sttApiKey: string;
  sttModel: string;
  sttLanguage: string;

  imageEnabled: boolean;
  imageProvider: 'openai-compatible' | 'custom';
  imageBaseUrl: string;
  imageApiKey: string;
  imageModel: string;
  imageSize: string;

  backgroundEnabled: boolean;
  notificationEnabled: boolean;
  proactiveMessagesEnabled: boolean;
  keepAliveMinutes: number;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  provider: 'gemini',
  apiBaseUrl: '',
  apiKey: '',
  model: 'gemini-2.5-flash',
  streaming: true,
  contextLength: 24,
  maxOutputTokens: 1200,
  autoSave: true,
  autoMemoryEnabled: true,
  autoMemoryEveryMessages: 20,
  temperature: 0.85,

  voiceEnabled: false,
  voiceProvider: 'browser',
  voiceBaseUrl: '',
  voiceApiKey: '',
  voiceModel: 'gpt-4o-mini-tts',
  voiceName: 'alloy',
  voiceFormat: 'mp3',
  autoSpeakAiReplies: false,

  sttEnabled: false,
  sttProvider: 'openai-compatible',
  sttBaseUrl: '',
  sttApiKey: '',
  sttModel: 'gpt-4o-mini-transcribe',
  sttLanguage: 'zh',

  imageEnabled: false,
  imageProvider: 'openai-compatible',
  imageBaseUrl: '',
  imageApiKey: '',
  imageModel: 'gpt-image-1',
  imageSize: '1024x1024',

  backgroundEnabled: true,
  notificationEnabled: false,
  proactiveMessagesEnabled: true,
  keepAliveMinutes: 5,
};

const STORAGE_KEY = 'phone:settings';

export function readAppSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_APP_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return { ...DEFAULT_APP_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export function saveAppSettings(patch: Partial<AppSettings>): AppSettings {
  const next = { ...readAppSettings(), ...patch };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the app usable if storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent('sane333:settings-changed'));
  }
  return next;
}
