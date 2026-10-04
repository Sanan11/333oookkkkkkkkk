import { useRef } from 'react';
import { ArrowLeft, Database, Download, KeyRound, RotateCcw, Save, Shield, SlidersHorizontal, Trash2 } from 'lucide-react';
import { ScreenType } from '../../types';
import { usePersistentState } from '../../store/usePersistentState';

interface AppSettings {
  provider: 'gemini' | 'openai-compatible' | 'custom';
  apiBaseUrl: string;
  apiKey: string;
  model: string;
  streaming: boolean;
  contextLength: number;
  autoSave: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  provider: 'gemini',
  apiBaseUrl: '',
  apiKey: '',
  model: 'gemini-2.5-flash',
  streaming: true,
  contextLength: 24,
  autoSave: true,
};

function exportLocalData() {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key || (!key.startsWith('phone:') && !key.startsWith('line:'))) continue;
    try {
      data[key] = JSON.parse(localStorage.getItem(key) || 'null');
    } catch {
      data[key] = localStorage.getItem(key);
    }
  }
  const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data }, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `sane333-backup-${Date.now()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function SettingsScreenView({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const importRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = usePersistentState<AppSettings>('phone:settings', DEFAULT_SETTINGS);
  const [notice, setNotice] = usePersistentState<string>('phone:settings-notice', '');

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 1800);
  };

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const importBackup = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const data = parsed?.data;
      if (!data || typeof data !== 'object') throw new Error('备份文件格式不正确');

      for (const [key, value] of Object.entries(data)) {
        if (!key.startsWith('phone:') && !key.startsWith('line:')) continue;
        localStorage.setItem(key, JSON.stringify(value));
      }
      notify('备份已恢复，刷新页面后所有数据会重新加载');
    } catch (error) {
      notify(error instanceof Error ? error.message : '恢复失败');
    } finally {
      if (importRef.current) importRef.current.value = '';
    }
  };

  const clearAll = () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key?.startsWith('phone:') || key?.startsWith('line:')) keys.push(key);
    }
    keys.forEach(key => localStorage.removeItem(key));
    setSettings(DEFAULT_SETTINGS);
    notify('本机项目数据已清除');
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <div className="absolute inset-0 opacity-15 bg-paper-noise pointer-events-none" />

      <header className="relative z-10 px-5 pt-12 pb-3.5 border-b border-[rgba(40,36,31,.12)] bg-[rgba(247,244,238,.85)] backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="w-8 h-8 rounded-full bg-white/40 border border-white/60 grid place-items-center text-xs text-[#242323]">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[8px] font-mono tracking-[2px] text-[#817a72] uppercase">SYSTEM SETTINGS · PRIVATE DEVICE</div>
            <h2 className="font-serif font-bold text-base tracking-tight text-[#242323]">设置 · System</h2>
          </div>
        </div>
        <SlidersHorizontal className="w-4 h-4 text-[#8b7560]" />
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 text-xs">
        <section className="p-4 rounded-2xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)]">
          <div className="flex items-center gap-2 text-[8px] font-mono tracking-[1.5px] text-[#8b8782] mb-3">
            <KeyRound className="w-3 h-3" /> AI CONNECTION
          </div>

          <div className="space-y-2.5">
            <label className="block text-[9px] text-[#7e7770]">Provider
              <select value={settings.provider} onChange={e => update('provider', e.target.value as AppSettings['provider'])} className="w-full mt-1 bg-white/70 rounded-xl p-2 text-xs outline-none">
                <option value="gemini">Gemini</option>
                <option value="openai-compatible">OpenAI Compatible</option>
                <option value="custom">Custom Endpoint</option>
              </select>
            </label>

            <label className="block text-[9px] text-[#7e7770]">API Base URL
              <input value={settings.apiBaseUrl} onChange={e => update('apiBaseUrl', e.target.value)} placeholder="留空使用 Provider 默认地址" className="w-full mt-1 bg-white/70 rounded-xl p-2 text-xs outline-none" />
            </label>

            <label className="block text-[9px] text-[#7e7770]">API Key
              <input type="password" value={settings.apiKey} onChange={e => update('apiKey', e.target.value)} placeholder="只保存在本机 localStorage" className="w-full mt-1 bg-white/70 rounded-xl p-2 text-xs outline-none" />
            </label>

            <label className="block text-[9px] text-[#7e7770]">Model
              <input value={settings.model} onChange={e => update('model', e.target.value)} className="w-full mt-1 bg-white/70 rounded-xl p-2 text-xs outline-none font-mono" />
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="bg-white/55 rounded-xl p-2 text-[9px]">Context Length
                <input type="number" min={4} max={200} value={settings.contextLength} onChange={e => update('contextLength', Number(e.target.value) || 24)} className="w-full mt-1 bg-transparent outline-none font-mono text-xs" />
              </label>
              <button onClick={() => update('streaming', !settings.streaming)} className="bg-white/55 rounded-xl p-2 text-left text-[9px]">
                Streaming
                <div className="mt-1 text-xs font-semibold text-[#8b7560]">{settings.streaming ? 'ON' : 'OFF'}</div>
              </button>
            </div>
          </div>

          <div className="mt-3 text-[8px] leading-relaxed text-[#958e86]">
            API Key 会保存在当前浏览器本机。真正接入远程模型时，我们会再加一层后端代理，避免把密钥暴露给页面网络请求。
          </div>
        </section>

        <section className="p-4 rounded-2xl bg-[#eee9df] border border-[rgba(40,36,31,.12)]">
          <div className="flex items-center gap-2 text-[8px] font-mono tracking-[1.5px] text-[#8b8782] mb-3">
            <Database className="w-3 h-3" /> LOCAL DATA
          </div>
          <button onClick={() => update('autoSave', !settings.autoSave)} className="w-full flex items-center justify-between py-2 border-b border-[rgba(40,36,31,.1)]">
            <span>自动保存</span><b className="text-[#8b7560]">{settings.autoSave ? 'ON' : 'OFF'}</b>
          </button>
          <button onClick={exportLocalData} className="w-full flex items-center gap-2 py-2.5 text-left border-b border-[rgba(40,36,31,.1)]">
            <Download className="w-3.5 h-3.5 text-[#8b7560]" />导出全部本机数据
          </button>
          <button onClick={() => importRef.current?.click()} className="w-full flex items-center gap-2 py-2.5 text-left border-b border-[rgba(40,36,31,.1)]">
            <Save className="w-3.5 h-3.5 text-[#8b7560]" />恢复数据备份
          </button>
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={e => importBackup(e.target.files?.[0])} />
        </section>

        <section className="p-4 rounded-2xl bg-white/55 border border-[rgba(40,36,31,.1)]">
          <div className="flex items-center gap-2 text-[8px] font-mono tracking-[1.5px] text-[#8b8782] mb-3">
            <Shield className="w-3 h-3" /> SAFETY
          </div>
          <p className="text-[10px] leading-relaxed text-[#6f6861]">
            这是本机项目空间。角色卡、聊天、世界书和剧情存档默认留在浏览器本地，不会自动上传。
          </p>
          <button
            onClick={clearAll}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#292724] text-white text-[10px]"
          >
            <Trash2 className="w-3.5 h-3.5" />清除本机项目数据
          </button>
        </section>

        <section className="p-4 rounded-2xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)]">
          <div className="flex items-center gap-2 text-[8px] font-mono tracking-[1.5px] text-[#8b8782] mb-3">
            <RotateCcw className="w-3 h-3" /> PROJECT ROADMAP
          </div>
          <div className="space-y-1.5 text-[10px] text-[#5d5751]">
            <div>✓ 手机壳 / 主题 / 首页</div>
            <div>✓ LINE UI（保持现状）</div>
            <div>✓ 角色卡本地导入</div>
            <div>✓ World Book 管理 UI</div>
            <div>→ AI Provider / Streaming</div>
            <div>→ Memory / 自动摘要</div>
            <div>→ 主动事件 / 主动消息</div>
            <div>→ 线下剧情引擎</div>
          </div>
        </section>
      </div>

      {notice && <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-16 bg-[#292724] text-white px-3.5 py-2 rounded-full text-[10px]">{notice}</div>}
    </div>
  );
}
