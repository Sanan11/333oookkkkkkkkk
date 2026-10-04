import { ArrowLeft, Film, Grid } from 'lucide-react';
import { ScreenType } from '../../types';

interface GalleryScreenViewProps {
  themeMode?: any;
  onNavigate: (screen: ScreenType) => void;
}

export function GalleryScreenView({ onNavigate }: GalleryScreenViewProps) {
  const filmPhotos = [
    { src: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=300&q=80', frame: 'FRAME 01', title: 'LONDON RAIN', date: '21:06' },
    { src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80', frame: 'FRAME 02', title: 'SLEEPING CAT', date: '14:20' },
    { src: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=300&q=80', frame: 'FRAME 03', title: 'CORNER CAFE', date: '16:45' },
    { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80', frame: 'FRAME 04', title: 'LA BEACH', date: '18:30' },
    { src: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=300&q=80', frame: 'FRAME 05', title: 'OLD BOOKSHOP', date: '11:15' },
    { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80', frame: 'FRAME 06', title: 'CROISSANT', date: '09:00' },
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
              CONTACT SHEET · ROLL 024
            </div>
            <h2 className="font-serif font-bold text-base tracking-tight text-[#242323]">
              底片相册 · 胶片印相
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#8b7560]">
          <Film className="w-3.5 h-3.5" />
          <span>35MM NEGATIVES</span>
        </div>
      </div>

      {/* Contact Sheet Grid */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 no-scrollbar text-xs">
        {filmPhotos.map((photo, i) => (
          <div 
            key={i}
            className="p-2 pb-3 rounded-2xl bg-[#eee9df] border border-[rgba(40,36,31,.12)] shadow-sm hover:scale-[1.02] active:scale-98 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center text-[7px] text-[#8b8782] font-mono mb-1">
              <span>{photo.frame}</span>
              <span>{photo.date}</span>
            </div>

            <div className="aspect-[4/5] rounded-xl overflow-hidden filter contrast-[0.92] saturate-[0.7] relative">
              <img
                src={photo.src}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="mt-2 flex justify-between items-center text-[8px] font-mono">
              <span className="font-semibold text-[#36332f]">{photo.title}</span>
              <span className="text-[#8b8782]">ARCHIVE</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 text-center text-[9px] text-[#8b8782] font-mono border-t border-[rgba(40,36,31,.1)]">
        ILFORD HP5 PLUS 400 · HAND DEVELOPED ARCHIVE
      </div>
    </div>
  );
}
