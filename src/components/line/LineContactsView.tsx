import { useState } from 'react';
import { Search, Star, UserPlus, Users, ChevronRight, ShieldCheck } from 'lucide-react';

interface LineContactsViewProps {
  onSelectChat: (contactName: string) => void;
}

export function LineContactsView({ onSelectChat }: LineContactsViewProps) {
  const [search, setSearch] = useState('');

  const starred = [
    { name: 'Ethan', status: '把今天留给自己。剩下的事情，明天再说。', location: '英国 · 伦敦', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { name: '程凛', status: '崇明私邸施工阶段提前完成。', location: '中国 · 上海', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
    { name: '林予', status: '刚出炉的焦糖海盐可颂！', location: '法国 · 巴黎', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
  ];

  const workContacts = [
    { name: '林工 (技术总监)', status: '线上发版本中，无事勿扰', location: '杭州研发中心', initial: '林' },
    { name: '执行助理 · 艾米', status: '下周外景审批已盖章', location: '伦敦外景办', initial: '艾' },
    { name: 'Gavin (特邀策展人)', status: '东京当代艺术馆下周开展', location: '日本 · 东京', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      
      {/* Search */}
      <div className="px-4 py-2.5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/5 text-current opacity-80 border border-black/5">
          <Search className="w-3.5 h-3.5 opacity-50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索通讯录好友、群组..."
            className="w-full text-xs bg-transparent border-0 outline-none placeholder:opacity-50 font-serif-sc"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 no-scrollbar pb-6 text-xs">
        
        {/* User Self Card */}
        <div className="p-3 rounded-2xl bg-black/[0.03] border border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-full relative overflow-hidden shadow-xs"
              style={{ background: 'linear-gradient(145deg,#b6a38d,#695e55)' }}
            >
              <div className="absolute w-[16px] h-[18px] rounded-full bg-[#e1d2c0] left-[12px] top-[7px]" />
            </div>
            <div>
              <div className="font-serif font-bold text-sm">Sane333</div>
              <div className="text-[10px] opacity-60 font-mono">ID: @sane_private · 状态在线</div>
            </div>
          </div>
          <span className="text-[9px] font-mono opacity-50 px-2 py-0.5 rounded bg-black/5">ME</span>
        </div>

        {/* Section 1: Starred Contacts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono opacity-60 px-1 uppercase tracking-wider">
            <span className="flex items-center gap-1 text-[#8b7560]">
              <Star className="w-3 h-3 fill-current" />
              特别关心 · 密友 ({starred.length})
            </span>
          </div>

          <div className="space-y-1">
            {starred.map((user, i) => (
              <div
                key={i}
                onClick={() => onSelectChat(user.name)}
                className="p-2.5 rounded-2xl hover:bg-black/5 cursor-pointer flex items-center justify-between active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl overflow-hidden border border-black/10 shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-serif font-bold text-xs truncate">{user.name}</div>
                    <div className="text-[10.5px] opacity-60 truncate font-serif-sc">{user.status}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-30 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Work & Colleagues */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono opacity-60 px-1 uppercase tracking-wider">
            <span>工作协作与顾问 ({workContacts.length})</span>
          </div>

          <div className="space-y-1">
            {workContacts.map((user, i) => (
              <div
                key={i}
                onClick={() => onSelectChat(user.name)}
                className="p-2.5 rounded-2xl hover:bg-black/5 cursor-pointer flex items-center justify-between active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {user.avatar ? (
                    <div className="w-10 h-10 rounded-2xl overflow-hidden border border-black/10 shrink-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-white font-bold text-xs grid place-items-center shrink-0">
                      {user.initial}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-serif font-bold text-xs truncate">{user.name}</div>
                    <div className="text-[10.5px] opacity-60 truncate font-serif-sc">{user.status}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-30 shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Security badge */}
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[10px] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>LINE 端到端加密协议（Letter Sealing）已对全部好友生效</span>
        </div>

      </div>

    </div>
  );
}
