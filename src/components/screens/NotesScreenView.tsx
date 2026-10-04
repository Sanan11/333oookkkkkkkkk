import { ArrowLeft, Plus, Feather, Paperclip } from 'lucide-react';
import { ScreenType } from '../../types';

interface NotesScreenViewProps {
  themeMode?: any;
  onNavigate: (screen: ScreenType) => void;
}

export function NotesScreenView({ onNavigate }: NotesScreenViewProps) {
  const notes = [
    { title: '灵感碎片 · 雨夜', date: 'OCT 02', excerpt: '“雨天，伦敦，二手书店，羊角面包的香味……把今天留给自己。”', tag: '随手记' },
    { title: '私密便签 · 此刻', date: 'SEP 28', excerpt: '“有些话只适合写在纸条上丢进风里，被他轻轻接住。”', tag: '心灵' },
    { title: '待办与采购', date: 'SEP 20', excerpt: '胶卷2卷（Ilford HP5）、羊奶咖啡豆、给猫咪梳毛。', tag: '日常' },
  ];

  return (
    <div 
      className="relative w-full h-full flex flex-col justify-between select-none overflow-hidden"
      style={{ background: 'var(--paper)', color: 'var(--ink)' }}
    >
      {/* Paper Noise */}
      <div className="absolute inset-0 opacity-15 bg-paper-noise pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 px-5 pt-12 pb-3.5 border-b border-[rgba(40,36,31,.12)] bg-[rgba(247,244,238,.85)] backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('home')}
            className="w-8 h-8 rounded-full bg-white/40 border border-white/60 backdrop-blur-md grid place-items-center text-xs hover:bg-white/70 active:scale-95 transition-all text-[#242323]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[8px] font-mono tracking-[2px] text-[#817a72] uppercase">
              KRAFT NOTEBOOK · PRIVATE
            </div>
            <h2 className="font-serif font-bold text-base tracking-tight text-[#242323]">
              备忘录 · 手写手记
            </h2>
          </div>
        </div>

        <button className="w-7 h-7 rounded-full bg-[#36332f] text-white grid place-items-center text-xs">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dotted Grid Notes List */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar text-xs">
        {notes.map((note, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)] shadow-[0_4px_16px_rgba(45,37,30,.05)] space-y-2 relative"
          >
            {/* Tag & Date */}
            <div className="flex items-center justify-between text-[8px] font-mono text-[#8b8782]">
              <span className="px-2 py-0.5 rounded-full bg-white/60 text-[#8b7560]">
                {note.tag}
              </span>
              <span>{note.date} · 21:06</span>
            </div>

            <div className="font-serif font-bold text-sm text-[#242323]">
              {note.title}
            </div>

            <p className="font-serif-sc text-xs leading-relaxed text-[#55504a] italic">
              {note.excerpt}
            </p>

            <div className="pt-1 text-right font-handwriting text-[10px] text-[#8b7560]">
              keep this memo.
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 text-center text-[9px] text-[#8b8782] font-mono border-t border-[rgba(40,36,31,.1)]">
        SANE333 HANDWRITTEN ARCHIVE · 2026
      </div>
    </div>
  );
}
