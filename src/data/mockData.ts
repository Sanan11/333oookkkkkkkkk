import { ThemeMode, CharacterInfo, WidgetConfig } from '../types';

export const CHARACTERS: CharacterInfo[] = [
  {
    id: 'ethan',
    name: 'Ethan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    status: '在线 · 伦敦',
    age: 28,
    height: '185cm',
    constellation: '处女座',
    location: '英国 · 伦敦',
    bio: '「在看海的日落了，真好看。」下沉式生活美学，静谧而深邃。',
    quote: '「希望人世间晚，只便为了让你航行，你也可以就是自己以侍。」',
    unreadCount: 2,
    recentMoments: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'chenglin',
    name: '程凛',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    status: '刚刚空闲',
    age: 27,
    height: '187cm',
    constellation: '天蝎座',
    location: '上海 / 伦敦',
    bio: '极简公文、崇明私邸日程。冷静克制下的偏爱。',
    quote: '「伦敦的雨总是来得突然，但也很适合发呆。」',
    unreadCount: 1,
    recentMoments: [
      'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'linyu',
    name: '林予',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    status: '在家休息',
    age: 25,
    height: '181cm',
    constellation: '巨蟹座',
    location: '北京 / 巴黎',
    bio: '温和细腻的艺术家，喜欢烘焙与猫咪。',
    quote: '「我到家了，刚吃完饭。工作结束，去吃好吃的！」',
    unreadCount: 0,
    recentMoments: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80'
    ]
  },
  {
    id: 'gavin',
    name: 'Gavin',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    status: '离线',
    age: 29,
    height: '184cm',
    constellation: '金牛座',
    location: '东京 / 纽约',
    bio: '建筑设计师，策展人。',
    quote: '「下次一起去看展吧。下周的拍摄日程我发你了。」',
    unreadCount: 0,
    recentMoments: []
  }
];

export const THEME_CONFIGS: Record<ThemeMode, {
  name: string;
  subTitle: string;
  paletteLabel: string;
  bgGradient: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  subTextColor: string;
  accentColor: string;
  iconBg: string;
  dockBg: string;
  wallpaperUrl: string;
  widgets: WidgetConfig;
}> = {
  'dark-luxury': {
    name: '暗夜高级黑 · 伦敦夜雨',
    subTitle: 'Dark Velvet & London Rain (图1参考)',
    paletteLabel: '炭黑 · 琥珀微金 · 大本钟夜幕',
    bgGradient: 'from-neutral-950 via-[#121216] to-[#0c0d10]',
    cardBg: 'bg-[#1a1b22]/75 backdrop-blur-xl',
    cardBorder: 'border-white/10',
    textColor: 'text-neutral-100',
    subTextColor: 'text-neutral-400',
    accentColor: '#e5b882',
    iconBg: 'bg-neutral-800/80 border-white/10 text-neutral-200',
    dockBg: 'bg-black/60 backdrop-blur-2xl border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]',
    wallpaperUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    widgets: {
      weatherCity: '伦敦 London',
      weatherTemp: '18°',
      weatherCondition: '多云 Cloudy',
      weatherHighLow: 'H:22° L:14°',
      quoteContent: '「希望人世间晚，只便为了让你航行，你也可以就是自己以侍。」',
      quoteAuthor: '— Ethan',
      musicTitle: 'If I Could Be Him',
      musicArtist: 'Ethan · Midnight Album',
      anniversaryDays: 328,
      anniversaryText: '与 Ethan 共同生活的第 328 天',
    }
  },
  'nordic-light': {
    name: '北欧暖阳 · 米白手账',
    subTitle: 'Nordic Cream & Golden Sunlight (图2参考)',
    paletteLabel: '燕麦奶白 · 暖调杏仁 · 纯净线描',
    bgGradient: 'from-[#fbf9f5] via-[#f5f0e6] to-[#ece5d8]',
    cardBg: 'bg-white/80 backdrop-blur-xl',
    cardBorder: 'border-amber-900/10 shadow-[0_4px_20px_rgba(100,70,40,0.06)]',
    textColor: 'text-neutral-800',
    subTextColor: 'text-neutral-500',
    accentColor: '#c28b5e',
    iconBg: 'bg-white/90 border-amber-900/10 text-neutral-700 shadow-xs',
    dockBg: 'bg-white/70 backdrop-blur-2xl border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)]',
    wallpaperUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    widgets: {
      weatherCity: 'London',
      weatherTemp: '22°',
      weatherCondition: '多云 / 微风',
      weatherHighLow: 'H:24° L:16°',
      quoteContent: '9月20日 黄金色外 timing take, 每一寸光都刚好停留在你眼底。',
      quoteAuthor: '— 备忘录手记',
      musicTitle: 'Midnight in London',
      musicArtist: 'Ethan · 正在轻声哼唱',
      anniversaryDays: 120,
      anniversaryText: '今天是你和 Ethan 认识的纪念日',
    }
  },
  'ocean-breeze': {
    name: 'IG冷淡风 · 旧金山晴海',
    subTitle: 'IG Minimal Ocean & Clean Air (图3参考)',
    paletteLabel: '清透海水蓝 · 极简圆角 · 纯净留白',
    bgGradient: 'from-[#eaf3f7] via-[#dcebf2] to-[#cbdfeb]',
    cardBg: 'bg-white/70 backdrop-blur-xl',
    cardBorder: 'border-white/80 shadow-[0_8px_24px_rgba(20,50,90,0.05)]',
    textColor: 'text-slate-800',
    subTextColor: 'text-slate-500',
    accentColor: '#3b82f6',
    iconBg: 'bg-white/90 border-white/90 text-slate-700 shadow-xs',
    dockBg: 'bg-white/60 backdrop-blur-2xl border-white/60 shadow-[0_10px_30px_rgba(20,50,80,0.07)]',
    wallpaperUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    widgets: {
      weatherCity: 'San Francisco',
      weatherTemp: '22°',
      weatherCondition: '晴 Sunny',
      weatherHighLow: '晴 18°/24°',
      quoteContent: '「世界很大，你会遇见很多人，也会遇见更好的自己。」',
      quoteAuthor: '— Morning Note',
      musicTitle: 'Imaginary Love',
      musicArtist: 'kaneko ayano',
      anniversaryDays: 30,
      anniversaryText: '今天是你和 Ethan 认识 30 天',
    }
  }
};

export const CHAT_HISTORY_ETHAN = [
  {
    id: 'msg-1',
    sender: 'character',
    time: '21:42',
    text: '在看你发的照片了，真好看。',
    isVoice: false,
  },
  {
    id: 'msg-2',
    sender: 'user',
    time: '21:43',
    text: '你看喜欢就好。',
    isVoice: false,
  },
  {
    id: 'msg-img',
    sender: 'user',
    time: '21:43',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'msg-3',
    sender: 'character',
    time: '21:44',
    text: '下次带你去。',
  },
  {
    id: 'msg-voice',
    sender: 'character',
    time: '21:45',
    isVoice: true,
    voiceDuration: '0:12',
    voiceTranscript: '“刚走到楼下，风有点凉。晚上睡觉记得关好窗户，明天见。”',
    cotThinking: '（听到她发来的语音，指尖在大衣口袋里轻轻握了握。原以为只是普通的出差，但看着伦敦夜雨里她发来的风景，突然就想立刻飞回她身边。）'
  },
  {
    id: 'msg-4',
    sender: 'character',
    time: '21:46',
    text: '晚安，明天见。',
  }
];

export const MOMENTS_FEED = [
  {
    id: 'feed-1',
    author: '程凛',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    time: '2小时前',
    content: '伦敦的雨总是来得突然，但也很适合发呆。',
    images: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=500&q=80'
    ],
    likes: 236,
    comments: 42,
  },
  {
    id: 'feed-2',
    author: '林予',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    time: '4小时前',
    content: '工作结束，去吃好吃的！烘焙坊新出炉的羊角面包香气一直飘到街角。',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=300&q=80'
    ],
    likes: 189,
    comments: 28,
  }
];

export const GALLERY_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=300&q=80', tag: '伦敦' },
  { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80', tag: '猫咪' },
  { url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=300&q=80', tag: '咖啡厅' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80', tag: '海边' },
  { url: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=300&q=80', tag: '书店' },
  { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80', tag: '日落' },
];
