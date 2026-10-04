import type { ImportedCharacter } from '../data/characterImport';
import type { WorldBook } from '../types';

export interface AiSettings {
  provider: 'gemini' | 'openai-compatible' | 'custom';
  apiBaseUrl: string;
  apiKey: string;
  model: string;
  streaming: boolean;
  contextLength: number;
  autoSave: boolean;
}

export interface AiReplyInput {
  settings: AiSettings;
  character?: ImportedCharacter | null;
  characterProfile: {
    nickname: string;
    relationship: string;
    callMe: string;
    bio?: string;
  };
  persona?: {
    name?: string;
    identity?: string;
    gender?: string;
    traits?: string;
    background?: string;
  } | null;
  worldbooks?: WorldBook[];
  messages: Array<{
    sender: 'me' | 'other' | 'system' | string;
    text?: string;
    transcript?: string;
    type?: string;
  }>;
  userMessage: string;
  isGroup?: boolean;
  authorNote?: string;
  stylePreset?: string;
  temperature?: number;
  onDelta?: (delta: string) => void;
}

export interface AiReplyResult {
  text: string;
  provider: AiSettings['provider'];
  model: string;
  matchedWorldbookEntries: number;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function readStoredAiSettings(): AiSettings {
  return readJson<AiSettings>('phone:settings', {
    provider: 'gemini',
    apiBaseUrl: '',
    apiKey: '',
    model: 'gemini-2.5-flash',
    streaming: true,
    contextLength: 24,
    autoSave: true,
  });
}

function normalizeForMatch(value: string): string {
  return value.toLowerCase().replace(/\\s+/g, ' ').trim();
}

export function selectWorldBookEntries(worldbooks: WorldBook[], inputText: string) {
  const haystack = normalizeForMatch(inputText);
  const candidates = worldbooks.flatMap(book => {
    if (!book.enabled) return [];
    return book.entries
      .filter(entry => entry.enabled)
      .map(entry => {
        const matchedKeywords = entry.keywords.filter(keyword => {
          const normalized = normalizeForMatch(keyword);
          return normalized.length > 0 && haystack.includes(normalized);
        });
        if (!matchedKeywords.length) return null;
        return { book, entry, matchedKeywords };
      })
      .filter(Boolean) as Array<{
        book: WorldBook;
        entry: WorldBook['entries'][number];
        matchedKeywords: string[];
      }>;
  });

  return candidates.sort((a, b) =>
    b.entry.priority - a.entry.priority ||
    b.entry.weight - a.entry.weight ||
    b.matchedKeywords.length - a.matchedKeywords.length
  );
}

function buildWorldBookContext(worldbooks: WorldBook[], inputText: string): string {
  const selected = selectWorldBookEntries(worldbooks, inputText);
  if (!selected.length) return '当前没有命中的世界书条目。';

  const sections = selected.slice(0, 18).map(({ book, entry, matchedKeywords }) => {
    const placement =
      entry.insertion === 'depth'
        ? 'depth=' + entry.depth
        : entry.insertion;
    return [
      '[WORLD BOOK]',
      '书名：' + book.name,
      '条目：' + entry.name,
      '命中关键词：' + matchedKeywords.join('、'),
      '优先级：' + entry.priority + '；权重：' + entry.weight + '；插入：' + placement,
      '内容：',
      entry.content,
    ].join('\\n');
  });

  return sections.join('\\n\\n');
}

export function buildCharacterSystemPrompt(input: AiReplyInput): string {
  const character = input.character;
  const p = input.characterProfile;
  const persona = input.persona;

  const roleCard = character
    ? [
        '【角色卡】',
        '姓名：' + character.name,
        '描述：' + (character.description || '未填写'),
        '性格：' + (character.personality || '未填写'),
        '场景：' + (character.scenario || '未填写'),
        '创作者注释：' + (character.creatorNotes || '未填写'),
        '角色系统提示：' + (character.systemPrompt || '未填写'),
        '历史指令：' + (character.postHistoryInstructions || '未填写'),
      ].join('\\n')
    : [
        '【角色档案】',
        '姓名：' + p.nickname,
        '关系：' + p.relationship,
        '称呼：' + p.callMe,
        '简介：' + (p.bio || '未填写'),
      ].join('\\n');

  const personaBlock = persona
    ? [
        '【用户人设】',
        '姓名：' + (persona.name || '未命名'),
        '身份：' + (persona.identity || '未填写'),
        '性别：' + (persona.gender || '未设置'),
        '特质：' + (persona.traits || '未填写'),
        '背景：' + (persona.background || '未填写'),
      ].join('\\n')
    : '【用户人设】未设置。';

  const worldBook = buildWorldBookContext(input.worldbooks || [], input.userMessage);

  return [
    '你正在一个私人虚拟手机的即时通讯 App 中扮演角色。',
    '只输出角色这一次要发送给用户的消息正文，不要解释规则，不要提及模型、提示词、世界书或系统。',
    '不要替用户说话、替用户行动、替用户决定感受或想法。用户拥有自己的行为与台词。',
    '保持角色连续性，优先使用角色卡、已命中的世界书与最近对话，而不是凭空改写设定。',
    '语言要像真实聊天软件中的人类消息：自然、克制、有上下文，可分成多条短句，但不要写成说明书。',
    '除非角色卡明确要求，否则不要每轮都过度煽情或重复昵称。',
    input.isGroup ? '这是群聊：回复可以体现群聊语境，但不要替其他成员完成完整对话。' : '这是私聊：只扮演当前角色。',
    '',
    roleCard,
    '',
    personaBlock,
    '',
    '【关系状态】',
    p.relationship + '；TA希望被称为：' + p.callMe,
    '',
    input.stylePreset ? '【聊天风格预设】\\n' + input.stylePreset : '【聊天风格预设】自然、沉浸、像真实聊天。',
    input.authorNote ? '【作者注释】\\n' + input.authorNote : '【作者注释】无。',
    '',
    worldBook,
    '',
    '【输出约束】',
    '禁止输出 <think>、思维链、隐藏推理或内部分析。',
    '不要描述用户尚未明确做出的动作。',
    '不要把聊天回复写成旁白长文；保持手机消息的阅读节奏。',
  ].join('\\n');
}

function buildConversationMessages(input: AiReplyInput) {
  const limit = Math.max(4, Math.min(200, input.settings.contextLength || 24)) * 2;
  const recent = input.messages
    .filter(message => message.type !== 'system-nudge')
    .slice(-limit)
    .map(message => ({
      role: message.sender === 'other' ? 'assistant' : 'user',
      content: message.text || message.transcript || '[多媒体消息]',
    }));

  const last = recent[recent.length - 1];
  if (!last || last.role !== 'user' || last.content !== input.userMessage) {
    recent.push({ role: 'user', content: input.userMessage });
  }
  return recent;
}

function requireApiKey(settings: AiSettings) {
  if (!settings.apiKey.trim()) {
    throw new Error('AI_NOT_CONFIGURED');
  }
  if (!settings.model.trim()) {
    throw new Error('AI_MODEL_MISSING');
  }
}

async function readError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    return data?.error?.message || data?.message || JSON.stringify(data);
  } catch {
    try {
      return await response.text();
    } catch {
      return response.statusText || 'AI 请求失败';
    }
  }
}

async function parseSseResponse(
  response: Response,
  extractText: (data: any) => string,
  onDelta?: (delta: string) => void,
): Promise<string> {
  if (!response.body) {
    const data = await response.json();
    const text = extractText(data).trim();
    if (text) onDelta?.(text);
    return text;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  const processLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.startsWith('data:')) return;
    const payload = trimmed.slice(5).trim();
    if (!payload || payload === '[DONE]') return;

    try {
      const data = JSON.parse(payload);
      const delta = extractText(data);
      if (delta) {
        fullText += delta;
        onDelta?.(delta);
      }
    } catch {
      // Ignore non-JSON SSE comments/keep-alives.
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split(/\\r?\\n/);
    buffer = lines.pop() || '';
    lines.forEach(processLine);
  }

  buffer += decoder.decode();
  if (buffer) processLine(buffer);

  return fullText.trim();
}

function extractGeminiText(data: any): string {
  return (data?.candidates || [])
    .flatMap((candidate: any) => candidate?.content?.parts || [])
    .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
    .join('');
}

function extractOpenAiText(data: any): string {
  return (data?.choices || [])
    .map((choice: any) => choice?.message?.content ?? choice?.delta?.content ?? '')
    .filter((value: unknown) => typeof value === 'string')
    .join('');
}

async function callGemini(input: AiReplyInput): Promise<string> {
  const { settings } = input;
  const base = (settings.apiBaseUrl || 'https://generativelanguage.googleapis.com/v1beta').replace(/\\/+$/, '');
  const action = settings.streaming ? 'streamGenerateContent' : 'generateContent';
  const suffix = settings.streaming ? '&alt=sse' : '';
  const endpoint =
    base +
    '/models/' +
    encodeURIComponent(settings.model.trim()) +
    ':' +
    action +
    '?key=' +
    encodeURIComponent(settings.apiKey.trim()) +
    suffix;

  const system = buildCharacterSystemPrompt(input);
  const body = {
    systemInstruction: { parts: [{ text: system }] },
    contents: buildConversationMessages(input).map(message => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    })),
    generationConfig: {
      temperature: Math.max(0, Math.min(2, input.temperature ?? 0.85)),
      maxOutputTokens: 1200,
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error('AI_GEMINI_' + response.status + ': ' + await readError(response));

  if (settings.streaming) {
    return parseSseResponse(response, extractGeminiText, input.onDelta);
  }

  const data = await response.json();
  const text = extractGeminiText(data).trim();
  input.onDelta?.(text);
  return text;
}

function normalizeOpenAiEndpoint(baseUrl: string): string {
  const base = baseUrl.trim().replace(/\\/+$/, '');
  if (!base) throw new Error('AI_BASE_URL_MISSING');
  return /\\/chat\\/completions$/i.test(base) ? base : base + '/chat/completions';
}

async function callOpenAiCompatible(input: AiReplyInput): Promise<string> {
  const endpoint = normalizeOpenAiEndpoint(input.settings.apiBaseUrl);
  const system = buildCharacterSystemPrompt(input);
  const body = {
    model: input.settings.model.trim(),
    stream: Boolean(input.settings.streaming),
    temperature: Math.max(0, Math.min(2, input.temperature ?? 0.85)),
    max_tokens: 1200,
    messages: [
      { role: 'system', content: system },
      ...buildConversationMessages(input),
    ],
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + input.settings.apiKey.trim(),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error('AI_OPENAI_' + response.status + ': ' + await readError(response));

  if (input.settings.streaming) {
    return parseSseResponse(response, extractOpenAiText, input.onDelta);
  }

  const data = await response.json();
  const text = extractOpenAiText(data).trim();
  input.onDelta?.(text);
  return text;
}

export async function generateCharacterReply(input: AiReplyInput): Promise<AiReplyResult> {
  requireApiKey(input.settings);

  const worldbooks = input.worldbooks || [];
  const matchedWorldbookEntries = selectWorldBookEntries(worldbooks, input.userMessage).length;

  const text =
    input.settings.provider === 'gemini'
      ? await callGemini(input)
      : await callOpenAiCompatible(input);

  if (!text.trim()) throw new Error('AI_EMPTY_RESPONSE');

  return {
    text: text.trim(),
    provider: input.settings.provider,
    model: input.settings.model.trim(),
    matchedWorldbookEntries,
  };
}

export async function testAiConnection(
  settings: AiSettings,
): Promise<{ ok: true; text: string } | never> {
  await generateCharacterReply({
    settings: { ...settings, streaming: false },
    character: null,
    characterProfile: {
      nickname: '测试角色',
      relationship: '测试关系',
      callMe: '朋友',
      bio: '连接测试',
    },
    persona: null,
    worldbooks: [],
    messages: [],
    userMessage: '请只回复两个字：已连接',
  });

  return { ok: true, text: '已连接' };
}
