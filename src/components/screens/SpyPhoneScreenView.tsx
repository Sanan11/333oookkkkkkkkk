import { useState } from 'react';
import { ArrowLeft, Search, Lock, ShieldAlert, MessageSquare, Image as ImageIcon, FileText } from 'lucide-react';
import { ScreenType } from '../../types';

interface SpyPhoneScreenViewProps {
  onNavigate: (screen: ScreenType) => void;
}

export function SpyPhoneScreenView({ onNavigate }: SpyPhoneScreenViewProps) {
  const [activeTab, setActiveTab] = useState<'chats' | 'photos' | 'drafts'>('chats');

  return (
    <div 
      className="relative w-full h-full flex flex-col justify-between select-none overflow-hidden"
      style={{ background: 'var(--screen, #ffffff)', color: 'var(--ink, #242323)' }}
    >
      {/* Background paper texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-paper-noise pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 px-5 pt-12 pb-3.5 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('home')}
            className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 backdrop-blur-md grid place-items-center text-xs hover:bg-neutral-200 active:scale-95 transition-all text-[#1a1a1a]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-sm font-bold tracking-tight text-[#1a1a1a]">
                查手机
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 font-mono border border-rose-200">
                UNLOCKED
              </span>
            </div>
            <div className="text-[9px] text-[#8e8b86] font-mono tracking-wider mt-0.5">
              ETHAN'S PHONE BACKSTAGE · 窥探模式
            </div>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full bg-[#9b625b] text-white grid place-items-center text-xs shadow-xs">
          <Lock className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Segmented Sub-navigation: 聊天软件 / 私密相册 / 私人草稿 */}
      <div className="relative z-10 px-4 pt-3 flex gap-2 border-b border-neutral-100 pb-2">
        <button
          onClick={() => setActiveTab('chats')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'chats'
              ? 'bg-[#1a1a1a] text-white shadow-xs'
              : 'bg-neutral-100/80 text-[#8e8b86] hover:text-[#1a1a1a]'
          }`}
        >
          工作群与聊天
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'photos'
              ? 'bg-[#1a1a1a] text-white shadow-xs'
              : 'bg-neutral-100/80 text-[#8e8b86] hover:text-[#1a1a1a]'
          }`}
        >
          秘密相册
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'drafts'
              ? 'bg-[#1a1a1a] text-white shadow-xs'
              : 'bg-neutral-100/80 text-[#8e8b86] hover:text-[#1a1a1a]'
          }`}
        >
          私密朋友圈
        </button>
      </div>

      {/* Tab 1: Chats (Work chat with Lin Gong) */}
      {activeTab === 'chats' && (
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar text-xs">
          
          {/* Card: Lin Gong chat */}
          <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-neutral-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-700 text-white grid place-items-center font-bold text-xs">
                  林
                </div>
                <div>
                  <div className="font-bold text-xs text-[#1a1a1a]">林工 (技术总监)</div>
                  <div className="text-[9px] text-[#8e8b86] font-mono">19:40 · 刚刚发来</div>
                </div>
              </div>
              <span className="text-[8px] bg-neutral-200/70 text-neutral-600 px-2 py-0.5 rounded font-mono">
                WORK
              </span>
            </div>

            <div className="space-y-2 text-xs font-sans">
              <div className="flex items-start gap-2">
                <span className="text-[10px] text-[#8e8b86] shrink-0 font-mono">19:35</span>
                <p className="bg-white p-2.5 rounded-xl border border-neutral-200/60 text-[#333]">
                  林工：线上出紧急bug了… 沈时川你特么有病吧，差点一口泡面喷方向盘上！
                </p>
              </div>
              
              <div className="flex items-start gap-2 justify-end">
                <p className="bg-[#1a1a1a] text-white p-2.5 rounded-xl text-right">
                  Ethan：在修了。少废话，半小时内发补丁。
                </p>
                <span className="text-[10px] text-[#8e8b86] shrink-0 font-mono">19:38</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-[10px] text-[#8e8b86] shrink-0 font-mono">19:39</span>
                <p className="bg-white p-2.5 rounded-xl border border-neutral-200/60 text-[#333]">
                  林工：你小子今晚不是说要去接某人吗？手速这么拼命？平时也没见你这么积极发版本。
                </p>
              </div>

              <div className="flex items-start gap-2 justify-end">
                <p className="bg-[#1a1a1a] text-white p-2.5 rounded-xl text-right">
                  Ethan：所以才让你少废话。
                </p>
                <span className="text-[10px] text-[#8e8b86] shrink-0 font-mono">19:40</span>
              </div>
            </div>
          </div>

          {/* Card: Project group */}
          <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#1a1a1a]">海外拍摄组 (14人)</span>
              <span className="text-[9px] text-[#8e8b86] font-mono">16:20</span>
            </div>
            <p className="text-[11px] text-[#666] truncate font-sans">
              执行助理：沈总，下周伦敦大本钟夜景的取景许可已经审批通过了…
            </p>
          </div>

        </div>
      )}

      {/* Tab 2: Photos (Private Hidden Album) */}
      {activeTab === 'photos' && (
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar text-xs">
          <div className="text-[10px] font-mono text-[#8e8b86] mb-1">
            SECRET ALBUM · ONLY FOR ETHAN
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2 pb-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5 shadow-xs">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=300&q=80"
                  alt="secret photo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter contrast-90"
                />
              </div>
              <div className="text-[10px] font-mono text-[#1a1a1a] font-semibold">
                桌角咖啡 · 雨天
              </div>
              <p className="text-[9px] text-[#8e8b86] line-clamp-1 font-serif-sc">
                “她当时坐在对面发呆，没发现我拍了。”
              </p>
            </div>

            <div className="p-2 pb-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-1.5 shadow-xs">
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80"
                  alt="secret photo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter contrast-90"
                />
              </div>
              <div className="text-[10px] font-mono text-[#1a1a1a] font-semibold">
                睡着的小猫
              </div>
              <p className="text-[9px] text-[#8e8b86] line-clamp-1 font-serif-sc">
                “说好一起看电影，结果她抱着猫先睡了。”
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Drafts (Locked Moments) */}
      {activeTab === 'drafts' && (
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar text-xs">
          <div className="p-4 rounded-2xl bg-[#fbf9f5] border border-neutral-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[9px] text-[#8e8b86] font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#9b625b]" />
                仅自己可见 · 昨夜 23:45
              </span>
              <span>伦敦 · 独栋公寓</span>
            </div>

            <p className="font-serif-sc text-xs leading-relaxed text-[#3a3734]">
              “有时候觉得世界太吵，但只要她在旁边睡着，连红绿灯倒计时的声音都变得温和。不用说太多话，就很好。”
            </p>

            <div className="rounded-xl overflow-hidden border border-neutral-200/60 max-w-[200px]">
              <img
                src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80"
                alt="rainy road"
                referrerPolicy="no-referrer"
                className="w-full h-24 object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 text-center text-[9px] text-[#8e8b86] font-mono border-t border-neutral-200/80">
        DEVICE MONITOR LOG · SANE333 INSPECTION MODE
      </div>
    </div>
  );
}
