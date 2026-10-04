import { useState } from 'react';
import { Camera, Heart, MessageCircle, Share2, MoreHorizontal, Music } from 'lucide-react';

export function LineTimelineView() {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-white text-[#111111] select-none text-xs font-sans">
      
      {/* 1. Header on Pure White */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-[#F0F0F2] sticky top-0 bg-white z-10">
        <h1 className="font-bold text-xl text-[#111111] tracking-tight">
          朋友圈
        </h1>

        <button className="p-1 text-[#555555] hover:text-black transition-colors">
          <Camera className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>

      {/* 2. Feed Posts on Pure White */}
      <div className="divide-y divide-[#F0F0F2] pb-10">
        
        {/* Post 1: Sane333 London Sunset */}
        <div className="p-5 space-y-3">
          {/* Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-2xs border border-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Sane333"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#111111]">Sane333</div>
                <div className="text-[10px] text-[#8E8E93]">2小时前</div>
              </div>
            </div>

            <button className="p-1 text-[#8E8E93] hover:text-black">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Photo */}
          <div className="rounded-2xl overflow-hidden shadow-2xs border border-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80"
              alt="london twilight"
              referrerPolicy="no-referrer"
              className="w-full h-48 object-cover brightness-95"
            />
          </div>

          {/* Caption */}
          <div className="text-xs leading-relaxed text-[#111111]">
            今天的天空好美。<br />
            <span className="text-[11px] text-[#8E8E93]">London, UK</span>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4 text-[#555555]">
              <button 
                onClick={() => toggleLike('p1')}
                className={`flex items-center gap-1 transition-colors ${likedPosts['p1'] ? 'text-rose-500' : 'hover:text-black'}`}
              >
                <Heart className={`w-4 h-4 ${likedPosts['p1'] ? 'fill-current' : 'stroke-[1.8]'}`} />
              </button>
              <button className="flex items-center gap-1 hover:text-black">
                <MessageCircle className="w-4 h-4 stroke-[1.8]" />
              </button>
            </div>

            <button className="text-[#8E8E93] hover:text-black">
              <Share2 className="w-4 h-4 stroke-[1.8]" />
            </button>
          </div>

          {/* Likes List */}
          <div className="pt-1 text-[11px] text-[#666666] flex items-center gap-1.5">
            <Heart className="w-3 h-3 fill-[#E0533C] text-[#E0533C]" />
            <span>Lily、Momo、等3人觉得很赞</span>
          </div>

          {/* Comments Box */}
          <div className="p-3 rounded-xl bg-[#F6F6F8] space-y-1 text-[11.5px] leading-relaxed">
            <div>
              <span className="font-semibold text-[#111111]">Lily: </span>
              <span className="text-[#444444]">这张好好看！</span>
            </div>
            <div>
              <span className="font-semibold text-[#111111]">Sane333 回复 Lily: </span>
              <span className="text-[#444444]">是呢~在去图书馆的路上拍的</span>
            </div>
          </div>

        </div>

        {/* Post 2: Momo Rainy Window */}
        <div className="p-5 space-y-3">
          {/* Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-2xs border border-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80"
                  alt="Momo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-xs text-[#111111]">Momo</div>
                <div className="text-[10px] text-[#8E8E93]">5小时前</div>
              </div>
            </div>

            <button className="p-1 text-[#8E8E93] hover:text-black">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Photo */}
          <div className="rounded-2xl overflow-hidden shadow-2xs border border-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=700&q=80"
              alt="rainy window"
              referrerPolicy="no-referrer"
              className="w-full h-48 object-cover brightness-95"
            />
          </div>

          {/* Caption */}
          <div className="text-xs text-[#111111]">
            下雨天，适合听歌 🎧
          </div>

          {/* Music Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F2F6] text-[10.5px] text-[#444444]">
            <Music className="w-3 h-3 text-[#111111]" />
            <span>The 1975 - About You</span>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4 text-[#555555]">
              <button 
                onClick={() => toggleLike('p2')}
                className={`flex items-center gap-1 transition-colors ${likedPosts['p2'] ? 'text-rose-500' : 'hover:text-black'}`}
              >
                <Heart className={`w-4 h-4 ${likedPosts['p2'] ? 'fill-current' : 'stroke-[1.8]'}`} />
              </button>
              <button className="flex items-center gap-1 hover:text-black">
                <MessageCircle className="w-4 h-4 stroke-[1.8]" />
              </button>
            </div>

            <button className="text-[#8E8E93] hover:text-black">
              <Share2 className="w-4 h-4 stroke-[1.8]" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
