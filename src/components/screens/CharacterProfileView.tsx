import { ArrowLeft, Heart, MessageSquare, Paperclip, Shield, Stamp } from 'lucide-react';
import { ScreenType } from '../../types';

interface CharacterProfileViewProps {
  themeMode?: any;
  onNavigate: (screen: ScreenType) => void;
}

export function CharacterProfileView({ onNavigate }: CharacterProfileViewProps) {
  return (
    <div 
      className="relative w-full h-full flex flex-col justify-between select-none overflow-y-auto no-scrollbar"
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
              CONFIDENTIAL DOSSIER · VOL.01
            </div>
            <h2 className="font-serif font-bold text-base tracking-tight text-[#242323]">
              人物档案 · Ethan
            </h2>
          </div>
        </div>

        <div className="text-[8px] px-2 py-0.5 rounded bg-[#9b625b] text-white font-mono tracking-widest uppercase">
          CLASSIFIED
        </div>
      </div>

      {/* Main Dossier Content */}
      <div className="relative z-10 p-5 space-y-4">
        
        {/* Pinned Polaroid Identity Card with Brass Clip */}
        <div className="relative p-3 pb-5 rounded-2xl bg-[#eee9df] border border-[rgba(40,36,31,.14)] shadow-[0_8px_25px_rgba(45,37,30,.12)] rotate-[1.5deg]">
          
          {/* Faux Paperclip */}
          <div className="absolute -top-3 left-6 w-3 h-8 border-2 border-[#8b7560] rounded-full shadow-xs pointer-events-none" />

          {/* Stamp */}
          <div className="absolute right-4 top-4 border-2 border-[#9b625b]/60 text-[#9b625b] text-[8px] font-mono tracking-widest px-2 py-0.5 rounded -rotate-[12deg] uppercase">
            VERIFIED · ARCHIVE
          </div>

          <div className="flex gap-3.5 items-center">
            <div className="w-20 h-24 rounded-xl overflow-hidden bg-neutral-800 shrink-0 filter contrast-[0.92] saturate-[0.7] border border-black/10">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                alt="Ethan portrait"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <div className="font-serif font-bold text-lg leading-tight text-[#242323]">
                Ethan.
              </div>
              <div className="text-[10px] text-[#8b8782] font-mono">
                SANE333 COMPANION #01
              </div>
              <div className="text-[11px] font-mono text-[#55504a] pt-1">
                28 岁 · 185 cm · 处女座
              </div>
              <div className="text-[10px] text-[#718073] font-mono font-medium">
                ● 现居：英国 · 伦敦
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[rgba(40,36,31,.1)] flex justify-between text-[7px] text-[#8b8782] font-mono">
            <span>FILE ID: ETH-2026-LON</span>
            <span>PHOTO CAPTURED: 21:06</span>
          </div>
        </div>

        {/* Character Quote Memo */}
        <div className="p-4 rounded-2xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)] relative">
          <div className="text-[8px] tracking-[1.5px] font-mono text-[#8b8782] mb-1">
            CHARACTER ESSENCE & NOTE
          </div>
          <p className="font-serif-sc text-xs leading-relaxed text-[#443f3a] italic">
            “希望人世间晚，只便为了让你航行，你也可以就是自己以侍。”
          </p>
          <div className="mt-2 text-right font-handwriting text-xs text-[#8b7560]">
            — Ethan
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => onNavigate('chat')}
            className="py-2.5 rounded-xl bg-[#292724] text-white text-xs font-serif tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            进入密谈
          </button>
          <button
            onClick={() => onNavigate('moments')}
            className="py-2.5 rounded-xl bg-[#ebe7df] border border-[rgba(40,36,31,.15)] text-[#242323] text-xs font-serif tracking-wider flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Heart className="w-3.5 h-3.5 text-[#9b625b]" />
            专属日常
          </button>
        </div>

        {/* Moments Film Reel */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#8b8782]">
            <span>MOMENTS FILM REEL</span>
            <span>ROLL 024</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=300&q=80',
            ].map((src, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-[#eee9df] p-1 border border-[rgba(40,36,31,.12)] shadow-xs">
                <img
                  src={src}
                  alt="reel photo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-lg filter contrast-[0.92] saturate-[0.7]"
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="p-3 text-center text-[9px] text-[#8b8782] font-mono border-t border-[rgba(40,36,31,.1)]">
        SANE333 PRIVATE ARCHIVES · ALL RIGHTS RESERVED
      </div>
    </div>
  );
}
