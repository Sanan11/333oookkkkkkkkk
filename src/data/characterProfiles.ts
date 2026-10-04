import type { CharacterProfile } from '../types';

const BASE_LOREBOOK = '《东京雨夜日常·核心世界书》';

export const CHARACTER_PROFILES: Record<string, CharacterProfile> = {
  '顾言': {
    nickname: '顾言',
    birthday: '11月22日 (天蝎座)',
    relationship: '暗恋未满 · 彼此在意的挚友',
    canAutoChangeRelation: true,
    callMe: '小笨蛋',
    selectedLorebook: BASE_LOREBOOK,
    bio: '深水静流，只对特定的人有温度。常年在旧书屋与暗房出没。',
  },
  '小夏': {
    nickname: '小夏',
    birthday: '9月14日 (处女座)',
    relationship: '熟悉的朋友 · 正在靠近',
    canAutoChangeRelation: true,
    callMe: '小懒猫',
    selectedLorebook: '《大学校园夏日青涩回忆录》',
    bio: '喜欢散步、晚风和没有安排的下午，讲话总带一点轻快的笑意。',
  },
  Haruka: {
    nickname: 'Haruka',
    birthday: '3月7日 (双鱼座)',
    relationship: '东京旧识 · 默契搭档',
    canAutoChangeRelation: true,
    callMe: 'Haruka',
    selectedLorebook: BASE_LOREBOOK,
    bio: '住在东京的摄影爱好者，习惯把有趣的小事拍下来再慢慢分享。',
  },
  '林安': {
    nickname: '林安',
    birthday: '6月18日 (双子座)',
    relationship: '可靠朋友 · 长期联系人',
    canAutoChangeRelation: true,
    callMe: '林安',
    selectedLorebook: '《跨国远程生活与时差条目》',
    bio: '做事利落、消息回复很快，总是知道什么时候该安静陪着你。',
  },
  '佐藤葵': {
    nickname: '佐藤葵',
    birthday: '1月26日 (水瓶座)',
    relationship: '旧识 · 偶尔联系',
    canAutoChangeRelation: true,
    callMe: '葵',
    selectedLorebook: BASE_LOREBOOK,
    bio: '安静而有分寸，喜欢夜间散步与小型展览。',
  },
  Emma: {
    nickname: 'Emma',
    birthday: '8月3日 (狮子座)',
    relationship: '海外朋友 · 热情熟人',
    canAutoChangeRelation: true,
    callMe: 'Emma',
    selectedLorebook: '《跨国远程生活与时差条目》',
    bio: '总能把平淡的一天变成值得记录的小冒险。',
  },
  Aki: {
    nickname: 'Aki',
    birthday: '4月11日 (白羊座)',
    relationship: '发小 · 默契满分',
    canAutoChangeRelation: true,
    callMe: 'Aki',
    selectedLorebook: '《大学校园夏日青涩回忆录》',
    bio: '说话直接，行动派，通常是第一个提出“出去玩吧”的人。',
  },
};

function getImportedProfile(name: string, characterId?: string): CharacterProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('phone:characters');
    if (!raw) return null;
    const characters = JSON.parse(raw) as Array<{
      id?: string;
      name?: string;
      description?: string;
    }>;
    const character = characters.find(item => characterId ? item.id === characterId : item.name === name);
    if (!character) return null;
    return {
      nickname: character.name || name || '角色',
      birthday: '未设置',
      relationship: '刚导入 · 等待建立关系',
      canAutoChangeRelation: true,
      callMe: character.name || name || '角色',
      selectedLorebook: '',
      bio: character.description || '已从角色卡导入。',
    };
  } catch {
    return null;
  }
}

export function getCharacterProfile(name: string, characterId?: string): CharacterProfile {
  return getImportedProfile(name, characterId) ?? CHARACTER_PROFILES[name] ?? {
    nickname: name || '角色',
    birthday: '未设置',
    relationship: '刚认识',
    canAutoChangeRelation: true,
    callMe: name || '你',
    selectedLorebook: '',
  };
}
