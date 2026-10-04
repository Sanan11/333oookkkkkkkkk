import { useMemo, useState } from 'react';
import { ArrowLeft, CalendarClock, Check, ChevronRight, MapPin, Play, Plus, RotateCcw, Sparkles, X } from 'lucide-react';
import { ScreenType, OfflineEvent } from '../../types';
import { getOfflineEvents, updateOfflineEvent, upsertOfflineEvent } from '../../store/offlineEvents';
import { usePersistentState } from '../../store/usePersistentState';

const statusLabel: Record<OfflineEvent['status'], string> = {
  draft: '草稿',
  pending: '待确认',
  accepted: '已赴约',
  declined: '已暂缓',
  'in-progress': '剧情进行中',
  completed: '已完成',
};

export function OfflineStoryScreenView({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const [events, setEvents] = usePersistentState<OfflineEvent[]>('phone:offline-events-cache', getOfflineEvents());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sceneText, setSceneText] = useState('');
  
  const sync = () => setEvents(getOfflineEvents());
  
  const selected = events.find(event => event.id === selectedId) || null;
  const active = useMemo(() =>
    events.filter(event => ['pending', 'accepted', 'in-progress'].includes(event.status)),
    [events],
  );

  const startScene = (event: OfflineEvent) => {
    const updated = updateOfflineEvent(event.id, { status: 'in-progress' });
    if (updated) {
      setEvents(getOfflineEvents());
      setSelectedId(event.id);
      setSceneText(
        `时间：${event.time}\n地点：${event.location}\n\n${event.characterName} 已经提前到了。\n空气里还留着刚下过雨的潮气。你推开门时，对方抬起眼，像是已经等了很久。\n\n这里就是正式线下剧情的入口。下一步会把角色卡、记忆、关系和 World Book 送进场景生成器。`,
      );
    }
  };

  const completeScene = () => {
    if (!selected) return;
    const updated = updateOfflineEvent(selected.id, { status: 'completed' });
    if (updated) {
      setEvents(getOfflineEvents());
      setSceneText('');
    }
  };

  const createDraft = () => {
    const event: OfflineEvent = {
      id: `offline-${Date.now()}`,
      characterId: 'unassigned',
      characterName: '未指定角色',
      title: '新的线下剧情',
      location: '待设置地点',
      time: '待设置时间',
      theme: '未定主题',
      letter: '把想说的话写在这里。',
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    upsertOfflineEvent(event);
    sync();
    setSelectedId(event.id);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <div className="absolute inset-0 opacity-15 bg-paper-noise pointer-events-none" />

      <header className="relative z-10 px-5 pt-12 pb-3.5 border-b border-[rgba(40,36,31,.12)] bg-[rgba(247,244,238,.85)] backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="w-8 h-8 rounded-full bg-white/40 border border-white/60 grid place-items-center text-xs text-[#242323]">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[8px] font-mono tracking-[2px] text-[#817a72] uppercase">OFFLINE STORY · PRIVATE SCENE</div>
            <h2 className="font-serif font-bold text-base tracking-tight text-[#242323]">线下剧情 · Story</h2>
          </div>
        </div>
        <button onClick={createDraft} className="w-8 h-8 rounded-full bg-[#292724] text-white grid place-items-center">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </header>

      {selected && sceneText ? (
        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-5">
          <button onClick={() => setSelectedId(null)} className="text-[10px] text-[#8b7560] mb-3">← 返回邀约</button>
          <div className="p-4 rounded-2xl bg-[#eee9df] border border-[rgba(40,36,31,.14)] shadow-[0_8px_25px_rgba(45,37,30,.08)]">
            <div className="text-[8px] font-mono tracking-[1.5px] text-[#8b8782]">SCENE PRELUDE</div>
            <h3 className="mt-2 font-serif font-bold text-xl text-[#242323]">{selected.title}</h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded-full bg-white/60 text-[9px] text-[#6f6861]"><MapPin className="w-3 h-3 inline mr-1" />{selected.location}</span>
              <span className="px-2 py-1 rounded-full bg-white/60 text-[9px] text-[#6f6861]"><CalendarClock className="w-3 h-3 inline mr-1" />{selected.time}</span>
            </div>
            <pre className="mt-4 whitespace-pre-wrap font-serif-sc text-xs leading-[1.9] text-[#4b4540]">{sceneText}</pre>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={completeScene} className="py-2.5 rounded-xl bg-[#292724] text-white text-xs flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" />结束本幕
              </button>
              <button onClick={() => onNavigate('chat')} className="py-2.5 rounded-xl bg-white/65 border border-[rgba(40,36,31,.12)] text-[#4d4843] text-xs">
                回到聊天
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
          <div className="p-4 rounded-2xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)]">
            <div className="text-[8px] tracking-[1.5px] font-mono text-[#8b8782]">STORY ENGINE</div>
            <div className="mt-2 font-serif font-bold text-lg text-[#242323]">不是一张邀约卡，而是一条真正的剧情线。</div>
            <p className="mt-2 text-[10.5px] leading-relaxed text-[#6b645d]">
              LINE 负责让角色提出邀请；这里负责把“接受邀约”变成日期、场景、事件和最终剧情结果。现在先把入口和存档打通，AI 场景生成会接在下一层。
            </p>
            <button onClick={() => onNavigate('chat')} className="mt-3 text-[10px] text-[#8b7560]">回 LINE 查看聊天邀约 →</button>
          </div>

          {active.map(event => (
            <button
              key={event.id}
              onClick={() => event.status === 'accepted' ? startScene(event) : setSelectedId(event.id)}
              className="w-full text-left p-4 rounded-2xl bg-[#eee9df] border border-[rgba(40,36,31,.13)] shadow-xs hover:bg-[#e8e2d9] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono tracking-[1.5px] text-[#8b8782]">{statusLabel[event.status]}</span>
                <ChevronRight className="w-4 h-4 text-[#8b7560]" />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#9b625b]" />
                <div>
                  <div className="font-serif font-bold text-sm text-[#242323]">{event.title}</div>
                  <div className="mt-1 text-[10px] text-[#746d66]">{event.characterName} · {event.location}</div>
                </div>
              </div>
            </button>
          ))}

          {events.filter(event => !active.includes(event)).map(event => (
            <div key={event.id} className="p-4 rounded-2xl bg-white/50 border border-[rgba(40,36,31,.1)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-serif font-bold text-sm text-[#242323]">{event.title}</div>
                  <div className="mt-1 text-[9px] text-[#8b8782]">{event.characterName} · {statusLabel[event.status]}</div>
                </div>
                <button
                  onClick={() => {
                    const updated = updateOfflineEvent(event.id, { status: 'accepted' });
                    if (updated) setEvents(getOfflineEvents());
                  }}
                  className="px-2.5 py-1.5 rounded-full bg-[#292724] text-white text-[9px]"
                >
                  重新赴约
                </button>
              </div>
            </div>
          ))}

          {!events.length && (
            <div className="h-[320px] rounded-2xl border border-dashed border-[rgba(40,36,31,.18)] bg-white/30 grid place-items-center text-center p-6 text-[#8b8782]">
              <div>
                <div className="text-3xl mb-2">✦</div>
                <div className="font-serif text-sm">这里会出现角色真正发来的线下邀约。</div>
                <div className="mt-1 text-[9px]">现在还没有剧情存档。</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="relative z-10 p-3 text-center text-[9px] text-[#8b8782] font-mono border-t border-[rgba(40,36,31,.1)]">
        OFFLINE STORY ARCHIVE · SANE333
      </div>
    </div>
  );
}
