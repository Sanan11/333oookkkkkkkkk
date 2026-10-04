import { Check, Plus, Sparkles, User, X } from 'lucide-react';

export interface Persona {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  themeColor: string;
}

export const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'p1',
    name: 'Sane333',
    title: '独立摄影师 · 真实身份',
    bio: '把今天留给自己。剩下的事情，明天再说。',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    themeColor: '#8b7560',
  },
  {
    id: 'p2',
    name: '白月光',
    title: '校园初恋 · 昔日故人',
    bio: '“那年夏天的香樟树下，我们都没说再见。”',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    themeColor: '#9b625b',
  },
  {
    id: 'p3',
    name: '沈时川的特邀顾问',
    title: '工作严谨 · 艺术总监',
    bio: '“合同已签，下周外景审批严格把关。”',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    themeColor: '#51473f',
  },
  {
    id: 'p4',
    name: '匿名小猫',
    title: '亲密撒娇 · 私密限定',
    bio: '喵呜。只想赖在副驾驶睡觉。',
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80',
    themeColor: '#718073',
  }
];

interface LinePersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePersona: Persona;
  onSelectPersona: (p: Persona) => void;
}

export function LinePersonaModal({
  isOpen,
  onClose,
  activePersona,
  onSelectPersona,
}: LinePersonaModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-[390px] rounded-t-[32px] bg-white border-t border-neutral-200 p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300"
        style={{ background: 'var(--screen, #ffffff)', color: 'var(--ink, #1a1a1a)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-neutral-300 mx-auto" />

        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <div className="text-[10px] font-mono tracking-wider opacity-50 uppercase">
              PERSONA MASK SWITCHER
            </div>
            <h3 className="font-serif font-bold text-base text-[#1a1a1a]">
              身份面具切换 (多重马甲)
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 grid place-items-center text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] opacity-60 font-serif-sc leading-relaxed">
          切换面具后，你以不同的人设和口吻与 Ethan、程凛、林予沟通，角色对你的称呼与回复态度也会随之改变。
        </p>

        {/* Persona Cards List */}
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar">
          {DEFAULT_PERSONAS.map((p) => {
            const isSelected = p.id === activePersona.id;

            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPersona(p);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-[#1a1a1a] bg-black/[0.03] shadow-xs'
                    : 'border-black/5 hover:border-black/20 hover:bg-black/[0.01]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-black/10 shrink-0 relative">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-[8px]">
                        ✓
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-xs text-[#1a1a1a]">
                        {p.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono text-white" style={{ background: p.themeColor }}>
                        {p.title.split(' · ')[0]}
                      </span>
                    </div>
                    <div className="text-[10px] opacity-60 font-serif-sc mt-0.5 line-clamp-1">
                      {p.bio}
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <span className="text-xs font-mono font-bold text-[#8b7560] px-2 py-1 rounded bg-[#8b7560]/10">
                    生效中
                  </span>
                ) : (
                  <span className="text-[11px] opacity-40 font-mono hover:opacity-100">
                    佩戴
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Create Persona Placeholder */}
        <button className="w-full py-2.5 rounded-2xl border border-dashed border-neutral-300 text-xs text-neutral-500 font-mono hover:border-neutral-500 hover:text-neutral-800 transition-colors flex items-center justify-center gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>定制新面具 (捏新身份马甲)</span>
        </button>

      </div>
    </div>
  );
}
