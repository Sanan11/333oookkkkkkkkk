import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Brain, Clock3, Heart, Plus, Trash2, BookOpen, Sparkles, Link2, Tag } from 'lucide-react';
import type { ScreenType } from '../../types';
import type { ImportedCharacter } from '../../data/characterImport';
import { addCharacterMemoryItem, deleteCharacterMemoryItem, getCharacterMemory, saveCharacterMemory, type CharacterMemory } from '../../store/characterMemory';

const ACTIVE_MEMORY_KEY = 'phone:memory-active-character';

export function MemoryScreenView({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const [characters] = useState<ImportedCharacter[]>(() => {
    try { const raw = window.localStorage.getItem('phone:characters'); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });
  const [activeId, setActiveId] = useState<string | null>(() => {
    try { return window.localStorage.getItem(ACTIVE_MEMORY_KEY); } catch { return null; }
  });
  const selected = characters.find(c => c.id === activeId) || characters[0] || null;
  const [memory, setMemory] = useState<CharacterMemory>(() => selected ? getCharacterMemory(selected.id, selected.name) : { characterId:'', characterName:'', summary:'', items:[], updatedAt:new Date().toISOString() });

  useEffect(() => {
    if (!selected) return;
    setMemory(getCharacterMemory(selected.id, selected.name));
    try { window.localStorage.setItem(ACTIVE_MEMORY_KEY, selected.id); } catch {}
  }, [selected?.id, selected?.name]);

  useEffect(() => {
    const refresh = () => { if (selected) setMemory(getCharacterMemory(selected.id, selected.name)); };
    window.addEventListener('sane333:memory-changed', refresh);
    window.addEventListener('sane333:world-event', refresh);
    return () => { window.removeEventListener('sane333:memory-changed', refresh); window.removeEventListener('sane333:world-event', refresh); };
  }, [selected?.id, selected?.name]);

  const [filter, setFilter] = useState<'all' | 'fact' | 'diary' | 'relationship' | 'preference' | 'event'>('all');
  const items = useMemo(() => [...memory.items]
    .filter(item => filter === 'all' || (item.kind || 'fact') === filter)
    .sort((a,b) => b.importance - a.importance || b.updatedAt.localeCompare(a.updatedAt)), [memory.items, filter]);

  const kindMeta = {
    fact: { label:'事实', icon:Tag },
    diary: { label:'日记', icon:BookOpen },
    relationship: { label:'关系', icon:Heart },
    preference: { label:'偏好', icon:Sparkles },
    event: { label:'事件', icon:Link2 },
  } as const;

  const notifyMemory = (next: CharacterMemory) => {
    setMemory(next);
    window.dispatchEvent(new CustomEvent('sane333:memory-changed', { detail: { characterId: next.characterId } }));
  };

  const addMemory = () => {
    if (!selected) return;
    const content = window.prompt('写下一件你希望这个角色长期记住的事：');
    if (!content?.trim()) return;
    notifyMemory(addCharacterMemoryItem(selected.id, selected.name, content, { source:'manual', importance:70 }));
  };

  const removeMemory = (id: string) => {
    if (!selected) return;
    const next = deleteCharacterMemoryItem(selected.id, id);
    if (next) notifyMemory(next);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{background:'var(--paper)',color:'var(--ink)'}}>
      <div className="absolute inset-0 opacity-15 bg-paper-noise pointer-events-none" />
      <header className="relative z-10 px-5 pt-12 pb-3.5 border-b border-[rgba(40,36,31,.12)] bg-[rgba(247,244,238,.88)] backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => onNavigate('home')} className="w-8 h-8 rounded-full bg-white/50 border border-white/70 grid place-items-center text-[#292724]"><ArrowLeft className="w-4 h-4"/></button>
          <div><div className="text-[8px] font-mono tracking-[2px] text-[#817a72]">PRIVATE MEMORY · LOCAL</div><h2 className="font-serif font-bold text-base">记忆</h2></div>
        </div>
        <button onClick={addMemory} disabled={!selected} className="w-8 h-8 rounded-full bg-[#292724] text-white grid place-items-center disabled:opacity-30"><Plus className="w-4 h-4"/></button>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {characters.length === 0 ? (
          <div className="h-full flex items-center justify-center"><div className="w-full rounded-2xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)] p-6 text-center">
            <Brain className="w-7 h-7 mx-auto text-[#8b7560]" strokeWidth={1.4}/><h3 className="mt-3 font-serif text-lg">还没有角色记忆</h3>
            <p className="mt-2 text-[10px] leading-relaxed text-[#777069]">导入角色并发生对话后，这里会保存你们共同经历过的事情。</p>
          </div></div>
        ) : <>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {characters.map(c => {
              const count=getCharacterMemory(c.id,c.name).items.length, active=selected?.id===c.id;
              return <button key={c.id} onClick={()=>setActiveId(c.id)} className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-full border text-[10px] ${active?'bg-[#292724] text-white border-[#292724]':'bg-white/55 text-[#655f59] border-[rgba(40,36,31,.12)]'}`}>
                <span className="w-5 h-5 rounded-full overflow-hidden bg-[#d8d0c6] grid place-items-center font-serif">{c.avatar?<img src={c.avatar} alt="" className="w-full h-full object-cover"/>:(c.name?.slice(0,1)||'?')}</span>
                {c.name||'未命名'} · {count}
              </button>;
            })}
          </div>

          {selected && <>
            <section className="rounded-2xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)] p-4">
              <div className="flex items-center gap-2 text-[8px] font-mono tracking-[1.5px] text-[#8b8782]"><Heart className="w-3.5 h-3.5"/> {selected.name||'角色'} · LONG-TERM MEMORY</div>
              <textarea value={memory.summary} onChange={e=>notifyMemory(saveCharacterMemory({...memory,summary:e.target.value,characterId:selected.id,characterName:selected.name}))} placeholder="关系摘要、共同经历、重要约定、不能忘记的事实……" className="mt-3 w-full min-h-[92px] rounded-xl bg-white/65 border border-[rgba(40,36,31,.1)] p-3 outline-none resize-y text-[11px] leading-relaxed font-serif-sc"/>
              <div className="mt-2 text-[8px] text-[#8b8782] font-mono">UPDATED · {new Date(memory.updatedAt).toLocaleString()}</div>
            </section>
            <section className="rounded-2xl bg-white/55 border border-[rgba(40,36,31,.1)] p-4">
              <div className="flex items-center justify-between mb-3"><div><div className="text-[8px] font-mono tracking-[1.5px] text-[#8b8782]">MEMORY ENTRIES</div><div className="mt-1 font-serif text-sm">{items.length} 条长期记忆</div></div><button onClick={addMemory} className="px-2.5 py-1.5 rounded-full bg-[#292724] text-white text-[9px]">＋ 记一件事</button></div>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2">
                {([['all','全部'],['fact','事实'],['diary','日记'],['relationship','关系'],['preference','偏好'],['event','事件']] as const).map(([key,label]) =>
                  <button key={key} onClick={() => setFilter(key)} className={`shrink-0 px-2.5 py-1 rounded-full text-[8px] border ${filter===key?'bg-[#292724] text-white border-[#292724]':'bg-white/55 text-[#777069] border-[rgba(40,36,31,.1)]'}`}>{label}</button>
                )}
              </div>
              {items.length===0 ? <div className="py-8 text-center text-[10px] text-[#8b8782] font-serif-sc">还没有单独记录的记忆。</div> :
                <div className="space-y-2">{items.map(item=><article key={item.id} className="rounded-xl bg-[#f7f4ee] border border-[rgba(40,36,31,.08)] p-3"><div className="flex gap-3"><div className="mt-0.5 text-[#8b7560]"><Clock3 className="w-3.5 h-3.5"/></div><div className="flex-1 min-w-0"><p className="text-[10.5px] leading-relaxed text-[#443f3a] whitespace-pre-wrap font-serif-sc">{item.content}</p><div className="mt-2 flex items-center gap-2 text-[7px] font-mono text-[#9a938b]">
  <span>{item.source.toUpperCase()}</span><span>·</span><span>{(item.kind || 'fact').toUpperCase()}</span><span>·</span><span>IMPORTANCE {item.importance}</span>
</div></div><button onClick={()=>removeMemory(item.id)} className="self-start text-[#a46b64]" title="删除记忆"><Trash2 className="w-3.5 h-3.5"/></button></div></article>)}</div>}
            </section>
          </>}
        </>}
      </div>
    </div>
  );
}
