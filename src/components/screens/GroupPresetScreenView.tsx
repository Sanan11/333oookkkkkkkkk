import { useMemo, useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, Sparkles } from 'lucide-react';
import type { ScreenType } from '../../types';
import { usePersistentState } from '../../store/usePersistentState';
import { deleteGroupPreset, getGroupPresets, type GroupChatPreset, upsertGroupPreset } from '../../store/groupPresets';

export function GroupPresetScreenView({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const [presets, setPresets] = usePersistentState<GroupChatPreset[]>('line:group-presets', getGroupPresets());
  const [kind, setKind] = useState<'online' | 'offline'>('online');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const filtered = useMemo(() => presets.filter(item => item.kind === kind), [presets, kind]);
  const selected = presets.find(item => item.id === selectedId) || filtered[0] || null;
  const notify = (value: string) => { setNotice(value); window.setTimeout(() => setNotice(''), 2000); };

  const selectPreset = (id: string) => setSelectedId(id);
  const updateSelected = (patch: Partial<GroupChatPreset>) => {
    if (!selected) return;
    const next = { ...selected, ...patch, updatedAt: new Date().toISOString() };
    setPresets(prev => prev.map(item => item.id === next.id ? next : item));
    upsertGroupPreset(next);
  };

  const createPreset = () => {
    const now = new Date().toISOString();
    const preset: GroupChatPreset = {
      id: 'group-preset-' + Date.now().toString(36),
      name: kind === 'online' ? '新的线上群聊预设' : '新的线下群聊预设',
      kind,
      description: '',
      systemPrompt: '',
      maxResponders: 2,
      mentionPriority: true,
      createdAt: now,
      updatedAt: now,
    };
    upsertGroupPreset(preset);
    setPresets(prev => [preset, ...prev]);
    setSelectedId(preset.id);
  };

  const removeSelected = () => {
    if (!selected) return;
    const builtIn = ['online-natural','online-active','online-drama','offline-gathering','offline-party','offline-conflict'].includes(selected.id);
    if (builtIn) { notify('默认预设不能删除，可以直接修改后另存为自定义预设。'); return; }
    deleteGroupPreset(selected.id);
    setPresets(prev => prev.filter(item => item.id !== selected.id));
    setSelectedId(null);
    notify('预设已删除');
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-white text-[#343538]">
      <div className="px-5 pt-12 pb-3.5 border-b border-[#ece9e5] bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="w-8 h-8 rounded-full border border-[#e6e3df] grid place-items-center text-[#555] hover:bg-[#faf8f5]"><ArrowLeft className="w-4 h-4" /></button>
          <div><div className="text-[8px] font-mono tracking-[2px] text-[#9b958f]">CHAT PRESETS · LINE</div><h2 className="font-serif font-bold text-base text-[#242323]">群聊预设</h2></div>
        </div>
        <button onClick={createPreset} className="w-8 h-8 rounded-full border border-[#e6e3df] grid place-items-center text-[#8e606b] hover:bg-[#faf4f5]" title="新建预设"><Plus className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar space-y-3">
        <div className="grid grid-cols-2 p-1 bg-[#f4f2ef] rounded-[12px] border border-[#ebe7e1]">
          <button onClick={() => { setKind('online'); setSelectedId(null); }} className={kind === 'online' ? 'py-2 rounded-[9px] bg-white text-[#8f626e] shadow-xs text-[10px] font-semibold' : 'py-2 rounded-[9px] text-[#8d8882] text-[10px]'}>线上群聊</button>
          <button onClick={() => { setKind('offline'); setSelectedId(null); }} className={kind === 'offline' ? 'py-2 rounded-[9px] bg-white text-[#8f626e] shadow-xs text-[10px] font-semibold' : 'py-2 rounded-[9px] text-[#8d8882] text-[10px]'}>线下群聊 / 剧情</button>
        </div>
        <div className="text-[8.5px] text-[#99928c] leading-relaxed">线上预设控制群消息节奏、谁会接话、@ 优先级；线下预设控制多人场景里的行动、对话和剧情推进。</div>
        <div className="space-y-2">
          {filtered.map(item => <button key={item.id} onClick={() => selectPreset(item.id)} className={selected?.id === item.id ? 'w-full text-left p-3 rounded-[15px] border border-[#d7b7be] bg-[#fcf6f7]' : 'w-full text-left p-3 rounded-[15px] border border-[#ece8e2] bg-white hover:bg-[#faf8f5]'}>
            <div className="flex items-start justify-between gap-2"><div><div className="text-[11px] font-semibold text-[#302e2c]">{item.name}</div><div className="text-[9px] text-[#8f8983] mt-1 leading-relaxed">{item.description || '自定义群聊行为预设'}</div></div><span className="text-[8px] font-mono text-[#9b7a70]">{item.maxResponders} RESP</span></div>
          </button>)}
        </div>
        {selected && <section className="p-3.5 rounded-[17px] border border-[#e8e4df] bg-white space-y-2.5 shadow-[0_6px_18px_rgba(50,40,30,.04)]">
          <div className="flex items-center justify-between"><div className="flex items-center gap-1.5 text-[10px] font-semibold"><Sparkles className="w-3 h-3 text-[#9a6c78]" />编辑预设</div><button onClick={removeSelected} className="text-[#b36b68]"><Trash2 className="w-3.5 h-3.5" /></button></div>
          <input value={selected.name} onChange={e => updateSelected({ name:e.target.value })} className="w-full p-2 bg-[#f8f7f5] rounded-[9px] text-[11px] outline-none font-semibold" />
          <textarea value={selected.description} onChange={e => updateSelected({ description:e.target.value })} placeholder="这个预设什么时候使用？" className="w-full h-14 p-2 bg-[#f8f7f5] rounded-[9px] text-[10px] outline-none resize-none" />
          <textarea value={selected.systemPrompt} onChange={e => updateSelected({ systemPrompt:e.target.value })} placeholder="群聊行为规则 / AI 提示词……" className="w-full h-28 p-2 bg-[#f8f7f5] rounded-[9px] text-[10px] outline-none resize-none leading-relaxed" />
          <div className="flex items-center justify-between text-[9px] text-[#777]"><span>每轮最多回应人数</span><select value={selected.maxResponders} onChange={e => updateSelected({ maxResponders:Number(e.target.value) })} className="bg-[#f8f7f5] rounded-lg px-2 py-1 outline-none"><option value={1}>1 人</option><option value={2}>2 人</option><option value={3}>3 人</option><option value={4}>4 人</option></select></div>
          <div className="flex items-center justify-between text-[9px] text-[#777]"><span>@ 指定成员优先响应</span><button onClick={() => updateSelected({ mentionPriority: !selected.mentionPriority })} className="font-mono text-[#956a74]">{selected.mentionPriority ? 'ON' : 'OFF'}</button></div>
          <div className="pt-1 text-[8px] text-[#aaa] flex items-center gap-1"><Save className="w-3 h-3" />修改会自动保存到本机预设库。</div>
        </section>}
      </div>
      {notice && <div className="absolute left-1/2 -translate-x-1/2 bottom-6 bg-[#292724] text-white px-3 py-2 rounded-full text-[9px] z-30">{notice}</div>}
    </div>
  );
}