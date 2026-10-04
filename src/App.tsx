import { useState } from 'react';
import { 
  Smartphone, Sparkles, Layers, BookOpen, Compass, Music, 
  Share2, Heart, ExternalLink, Moon, Palette, CheckCircle2 
} from 'lucide-react';
import { THEME_CONFIGS } from './data/mockData';
import { ThemeMode, ScreenType } from './types';
import { PhoneSimulator } from './components/PhoneSimulator';
import { StyleAnalysisPanel } from './components/StyleAnalysisPanel';

export default function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark-luxury');
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [viewMode, setViewMode] = useState<'split' | 'phone-only' | 'analysis-only'>('split');

  const activeThemeConfig = THEME_CONFIGS[themeMode];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Header Contract */}
      <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Zone */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white font-serif-sc">
                  Sane333 · Private Virtual Phone
                </h1>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  北欧简约 · IG风 · 模块化插件
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden md:block">
                角色、聊天、世界书、记忆与线下剧情的个人虚拟手机
              </p>
            </div>
          </div>

          {/* Theme Quick Switcher (3 reference themes) */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-2xl">
            {(['dark-luxury', 'nordic-light', 'ocean-breeze'] as ThemeMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setThemeMode(mode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  themeMode === mode
                    ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {THEME_CONFIGS[mode].name}
              </button>
            ))}
          </div>

          {/* View Mode Controls */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'split' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
              title="双栏：左侧手机体验，右侧分析报告"
            >
              双栏透视
            </button>
            <button
              onClick={() => setViewMode('phone-only')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'phone-only' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
              title="专注体验小手机"
            >
              纯享手机
            </button>
            <button
              onClick={() => setViewMode('analysis-only')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewMode === 'analysis-only' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
              title="阅读深度解构报告"
            >
              设计剖析
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        
        {/* Mobile theme bar */}
        <div className="lg:hidden mb-4 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['dark-luxury', 'nordic-light', 'ocean-breeze'] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setThemeMode(mode)}
              className={`px-3 py-1.5 rounded-full text-xs shrink-0 border transition-all ${
                themeMode === mode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800'
              }`}
            >
              {THEME_CONFIGS[mode].name}
            </button>
          ))}
        </div>

        {/* View Mode Switching Grid */}
        <div className={`grid gap-8 items-start ${
          viewMode === 'split'
            ? 'grid-cols-1 lg:grid-cols-12'
            : viewMode === 'phone-only'
            ? 'grid-cols-1 max-w-lg mx-auto'
            : 'grid-cols-1 max-w-3xl mx-auto'
        }`}>
          
          {/* Left Column: Phone Simulator */}
          {viewMode !== 'analysis-only' && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-5 xl:col-span-5' : 'w-full'} flex flex-col items-center sticky top-20`}>
              
              <div className="w-full text-center mb-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400/80">
                  ✦ {activeThemeConfig.subTitle}
                </span>
                <p className="text-xs text-neutral-400 mt-0.5 truncate">
                  调色盘：{activeThemeConfig.paletteLabel}
                </p>
              </div>

              {/* Real Interactive Phone Simulator */}
              <PhoneSimulator
                themeMode={themeMode}
                currentScreen={currentScreen}
                setCurrentScreen={setCurrentScreen}
                onSelectTheme={setThemeMode}
              />

              {/* Bottom Quick Feature Jump Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-neutral-400">
                <span className="text-neutral-500 text-[10px]">快捷跳转体验：</span>
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 hover:text-white"
                >
                  主桌面 (天气+语录组件)
                </button>
                <button
                  onClick={() => setCurrentScreen('chat')}
                  className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 hover:text-white"
                >
                  LINE 对话
                </button>
                <button
                  onClick={() => setCurrentScreen('character-profile')}
                  className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 hover:text-white"
                >
                  角色档案
                </button>
                <button
                  onClick={() => setCurrentScreen('moments')}
                  className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 hover:text-white"
                >
                  朋友圈九宫格
                </button>
                <button
                  onClick={() => setCurrentScreen('music')}
                  className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 hover:text-white"
                >
                  大黑胶播放器
                </button>
              </div>

            </div>
          )}

          {/* Right Column: Style Analysis Panel */}
          {viewMode !== 'phone-only' && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-7 xl:col-span-7' : 'w-full'}`}>
              <StyleAnalysisPanel
                currentTheme={themeMode}
                onSelectTheme={setThemeMode}
              />
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-neutral-900 text-center text-xs text-neutral-500">
        <p>小手机 UI 全案设计系统 · 严格遵循规范化模块小组件与北欧 IG 极简美学</p>
      </footer>
    </div>
  );
}
