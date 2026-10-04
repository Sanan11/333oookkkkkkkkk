export interface SeedMessage {
  id: number;
  sender: 'me' | 'other' | 'system';
  text?: string;
  time: string;
  variants?: string[];
  variantIndex?: number;
  thinking?: string;
  showThinking?: boolean;
  type?: string;
  duration?: string;
  transcript?: string;
  [key: string]: unknown;
}

const makeConversation = (
  name: string,
  firstLine: string,
  secondLine: string,
  thinking: string,
): SeedMessage[] => [
  {
    id: 1,
    sender: 'other',
    variants: [firstLine, secondLine],
    variantIndex: 0,
    thinking,
    showThinking: false,
    text: firstLine,
    time: '20:31',
  },
  {
    id: 2,
    sender: 'me',
    text: '嗯，刚刚才闲下来。',
    time: '20:32',
  },
  {
    id: 3,
    sender: 'other',
    variants: [
      '那就先休息一会儿。\n不急着做别的。',
      '听起来你今天很累。先别急着处理剩下的事情。'
    ],
    variantIndex: 0,
    thinking,
    showThinking: false,
    text: '那就先休息一会儿。\n不急着做别的。',
    time: '20:33',
  },
  {
    id: 4,
    sender: 'other',
    type: 'ai-card',
    category: 'image',
    title: '文字图片',
    descTitle: '图片描述',
    desc: `${name} 刚才看到的街景：雨后的街灯、便利店和一把靠在门边的伞。`,
    time: '20:34',
  },
  {
    id: 5,
    sender: 'other',
    type: 'voice',
    duration: '0:08',
    transcript: `“其实我也没做什么，只是刚好想和你说句话。”`,
    time: '20:35',
  },
];

const SEEDS: Record<string, SeedMessage[]> = {
  '顾言': makeConversation(
    '顾言',
    '你今天好像一直在忙。',
    '刚看你朋友圈还没回消息，今天是不是特别累？',
    '【情境感知】她平时这个点早就在跟我分享下班日常了，今天却整整晚了两个小时。\n【潜意识情绪】有些心疼，但又怕贸然问太多显得过分越界。\n【回复策略】先给她安全感，不催促，不给压力。',
  ),
  '小夏': makeConversation(
    '小夏',
    '今天的风很舒服。你有没有出去走走？',
    '我刚从街角回来，突然觉得今天很适合慢慢聊。',
    '【情境感知】她最近像是在赶很多事情。\n【潜意识情绪】想把她从忙碌里轻轻拉出来。\n【回复策略】分享一点轻松的小事，让她不用急着回答。',
  ),
  Haruka: makeConversation(
    'Haruka',
    '明天的安排你看到了吗？我把咖啡店也标好了。',
    '如果你不忙，我们可以顺便去附近拍一卷。',
    '【情境感知】她对明天的安排没有明确拒绝。\n【潜意识情绪】其实期待见面，但不想让邀约显得有压力。\n【回复策略】给出具体又轻松的计划。',
  ),
  '林安': makeConversation(
    '林安',
    '我看到你刚刚发的东西了。',
    '不用急着解释，我只是想确认你还好吗？',
    '【情境感知】她的表达不像平常那么轻松。\n【潜意识情绪】担心她把事情一个人扛着。\n【回复策略】先确认状态，而不是追问细节。',
  ),
  '佐藤葵': makeConversation(
    '佐藤葵',
    '下次再慢慢聊吧。今天先早点休息。',
    '我刚刚路过你喜欢的那家小店，突然想起你。',
    '【情境感知】她最近需要一点安静空间。\n【潜意识情绪】想联系她，但也尊重她的节奏。\n【回复策略】留下轻巧的关心，不制造负担。',
  ),
  Emma: makeConversation(
    'Emma',
    '明天见，别忘了带伞。',
    '伦敦天气又开始变了。你要是出门记得看一眼预报。',
    '【情境感知】天气变化让原本的计划需要留一点余地。\n【潜意识情绪】想确保她不会因为赶时间淋雨。\n【回复策略】实用地提醒一句，再把决定权留给她。',
  ),
  Aki: makeConversation(
    'Aki',
    '周末一起吃饭吗？我已经在看菜单了。',
    '别装忙，给你留位置。',
    '【情境感知】她一看到轻松的邀约就比较容易答应。\n【潜意识情绪】单纯想见她，不需要太多理由。\n【回复策略】直接一点，保持熟人之间的自然感。',
  ),
};

export function getInitialChatMessages(contactName: string): SeedMessage[] {
  return SEEDS[contactName] ?? makeConversation(
    contactName || '角色',
    '今天过得怎么样？',
    '有空的时候再和我说说吧。',
    '【情境感知】正在观察她今天的状态。\n【潜意识情绪】希望她知道有人愿意听。\n【回复策略】保持温和，给她足够的空间。',
  );
}
