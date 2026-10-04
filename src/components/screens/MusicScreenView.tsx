import { useState } from 'react';
import { usePersistentState } from '../../store/usePersistentState';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Heart, Disc, Volume2 } from 'lucide-react';
import { ScreenType } from '../../types';

interface MusicScreenViewProps {
  themeMode?: any;
  onNavigate: (screen: ScreenType) => void;
}

export function MusicScreenView({ onNavigate }: MusicScreenViewProps) {
  const [isPlaying, setIsPlaying] = usePersistentState('phone:music-playing', true);
  const [liked, setLiked] = usePersistentState('phone:music-liked', true);

  return (
    <div 
      className="relative w-full h-full flex flex-col justify-between p-6 select-none overflow-hidden"
      style={{ background: 'var(--paper)', color: 'var(--ink)' }}
    >
      {/* Paper Noise */}
      <div className="absolute inset-0 opacity-15 bg-paper-noise pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 pt-8 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')}
          className="w-8 h-8 rounded-full bg-white/40 border border-white/60 backdrop-blur-md grid place-items-center text-xs hover:bg-white/70 active:scale-95 transition-all text-[#242323]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-[9px] font-mono tracking-widest text-[#8b8782] uppercase">
          ANALOG CASSETTE · SANE333
        </span>
        <button 
          onClick={() => setLiked(!liked)}
          className={`p-1.5 rounded-full ${liked ? 'text-[#9b625b]' : 'text-[#8b8782]'}`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Vinyl / Cover Centerpiece */}
      <div className="relative z-10 my-auto text-center space-y-4">
        {/* Rotating Analog Vinyl */}
        <div className="relative w-52 h-52 mx-auto flex items-center justify-center">
          <div 
            className={`w-full h-full rounded-full bg-[#242323] border-4 border-[#38332f] shadow-[0_15px_40px_rgba(30,25,20,.25)] flex items-center justify-center relative overflow-hidden ${
              isPlaying ? 'animate-[spin_12s_linear_infinite]' : ''
            }`}
          >
            {/* Grooves */}
            <div className="absolute inset-3 rounded-full border border-white/5" />
            <div className="absolute inset-7 rounded-full border border-white/5" />
            <div className="absolute inset-12 rounded-full border border-white/5" />
            
            {/* Center label */}
            <div 
              className="w-20 h-20 rounded-full border-2 border-[#b6a38d]/60 grid place-items-center text-white font-serif text-2xl shadow-inner"
              style={{ background: 'linear-gradient(145deg, #8b7560, #443c35)' }}
            >
              ♪
            </div>
          </div>
        </div>

        <div>
          <div className="text-[8px] font-mono text-[#8b8782] tracking-[2px] uppercase">
            NOW PLAYING · ROLL 024
          </div>
          <h3 className="font-serif font-bold text-base text-[#242323] tracking-tight mt-1">
            Nothing's Gonna Hurt You Baby
          </h3>
          <p className="text-xs text-[#8b7560] font-mono mt-0.5">
            Cigarettes After Sex
          </p>
        </div>
      </div>

      {/* Cassette Controls & Progress */}
      <div className="relative z-10 space-y-4 pb-4">
        <div className="space-y-1.5">
          <div className="w-full h-1 bg-[#d5cec3] rounded-full overflow-hidden">
            <div className="w-2/5 h-full bg-[#36332f] rounded-full" />
          </div>
          <div className="flex justify-between text-[9px] text-[#8b8782] font-mono">
            <span>01:46</span>
            <span>04:46</span>
          </div>
        </div>

        <div className="flex items-center justify-around">
          <button className="text-[#8b8782] hover:text-[#242323]">
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 rounded-full bg-[#292724] text-white grid place-items-center shadow-md active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button className="text-[#8b8782] hover:text-[#242323]">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
