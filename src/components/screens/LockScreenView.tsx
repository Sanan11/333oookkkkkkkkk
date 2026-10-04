import { Lock, MessageCircle, ChevronUp } from 'lucide-react';
import { ThemeMode } from '../../types';

interface LockScreenViewProps {
  themeMode: ThemeMode;
  onUnlock: () => void;
  onOpenEthanChat: () => void;
}

export function LockScreenView({ themeMode, onUnlock, onOpenEthanChat }: LockScreenViewProps) {
  const isDark = themeMode === 'dark-luxury';

  return (
    <div className="h-full flex flex-col justify-between p-6 select-none relative overflow-hidden text-white">
      {/* Background wallpaper with subtle dimming */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(180deg, rgba(10,12,18,0.4) 0%, rgba(10,12,18,0.85) 100%), url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80')`
            : `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 100%), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80')`
        }}
      />

      {/* Top Clock Section */}
      <div className="relative z-10 pt-8 text-center space-y-1">
        <Lock className="w-4 h-4 mx-auto mb-1 opacity-80" />
        <div className="text-5xl font-mono font-light tracking-tight">
          21:47
        </div>
        <div className="text-xs font-medium tracking-widest text-neutral-200">
          9月20日 周六
        </div>
      </div>

      {/* Middle: Notification Banner (Ethan's message) */}
      <div className="relative z-10 space-y-3">
        <div
          onClick={onOpenEthanChat}
          className="p-3.5 rounded-3xl bg-neutral-900/80 border border-white/20 backdrop-blur-2xl shadow-2xl cursor-pointer hover:scale-[1.02] active:scale-98 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Ethan"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white tracking-wide">Ethan</span>
                <span className="text-[10px] text-neutral-400 font-mono">现在</span>
              </div>
              <p className="text-xs text-neutral-200 truncate mt-0.5 font-sans">
                在看你发来的照片了，真好看。
              </p>
            </div>
          </div>
          <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-amber-300">
            <span>点击立即回复</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>

      {/* Bottom: Swipe / Tap to unlock */}
      <div 
        onClick={onUnlock}
        className="relative z-10 text-center cursor-pointer pb-2 hover:opacity-80 transition-opacity"
      >
        <ChevronUp className="w-5 h-5 mx-auto animate-bounce opacity-80" />
        <span className="text-xs tracking-wider text-neutral-200 font-mono">
          点击进入主屏幕
        </span>
      </div>
    </div>
  );
}
