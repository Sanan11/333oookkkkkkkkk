import { useRef, useState } from 'react';
import { ArrowLeft, BookOpen, Database, Download, FileText, KeyRound, Save, Settings2, Sparkles, Users } from 'lucide-react';
import type { ProjectManifest, ScreenType, WorldBook } from '../../types';
import type { ImportedCharacter } from '../../data/characterImport';
import { usePersistentState } from '../../store/usePersistentState';
import { DEFAULT_PROJECT_MANIFEST, saveProjectManifest } from '../../store/projectManifest';
import { getCharacterMemory } from '../../store/characterMemory';
import { generateCreativeText, readStoredAiSettings } from '../../ai/aiEngine';

interface PersonaItem {
  id: string;
  name: string;
  identity?: string;
  gender?: string;
  traits?: string;
  background?: string;
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ProjectStudioScreenView({ onNavigate }: { onNavigate: (screen: ScreenType) => void }) {
  const [manifest, setManifest] = useState<ProjectManifest>(() => {
    if (typeof window === 'undefined') return DEFAULT_PROJECT_MANIFEST;
    try {
      const raw = window.localStorage.getItem('phone:project-manifest');
      return raw ? { ...DEFAULT_PROJECT_MANIFEST, ...JSON.parse(raw) } : DEFAULT_PROJECT_MANIFEST;
    } catch {
      return DEFAULT_PROJECT_MANIFEST;
    }
  });
  const [characters, setCharacters] = usePersistentState<ImportedCharacter[]>('phone:characters', []);
  const [worldbooks, setWorldbooks] = usePersistentState<WorldBook[]>('phone:worldbooks', []);
  const [personas] = usePersistentState<PersonaItem[]>('line:user-personas', []);
  const [notice, setNotice] = useState('');
  const [openSection, setOpenSection] = useState<'project' | 'context' | 'data'>('project');
  const [assistantPrompt, setAssistantPrompt] = useState('');
  const [assistantBusy, setAssistantBusy] = useState(false);
  const [assistantProposal, setAssistantProposal] = useState<{
    message: string;
    projectPatch?: Partial<Pick<ProjectManifest, 'name' | 'subtitle' | 'description' | 'genre' | 'language' | 'tone' | 'globalPrompt'>>;
    characterPatch?: Partial<Pick<ImportedCharacter, 'description' | 'personality' | 'scenario' | 'firstMessage' | 'exampleDialogue' | 'creatorNotes' | 'systemPrompt' | 'postHistoryInstructions' | 'tags'>>;
  } | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const activeCharacter = characters.find(item => item.id === manifest.activeCharacterId) || null;
  const activeWorldBook = worldbooks.find(item => item.id === manifest.activeWorldBookId) || null;

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 1800);
  };

  const patch = (next: Partial<ProjectManifest>) => {
    const saved = saveProjectManifest(next);
    setManifest(saved);
  };

  const askProjectAssistant = async () => {
    const request = assistantPrompt.trim();
    if (!request || assistantBusy) return;

    const settings = readStoredAiSettings();
    if (!settings.apiKey.trim()) {
      notify('请先在设置里配置聊天 API');
      return;
    }

    setAssistantBusy(true);
    setAssistantProposal(null);

    const activeCharacterSnapshot = activeCharacter ? {
      name: activeCharacter.name,
      description: activeCharacter.description,
      personality: activeCharacter.personality,
      scenario: activeCharacter.scenario,
      firstMessage: activeCharacter.firstMessage,
      exampleDialogue: activeCharacter.exampleDialogue,
      creatorNotes: activeCharacter.creatorNotes,
      systemPrompt: activeCharacter.systemPrompt,
      postHistoryInstructions: activeCharacter.postHistoryInstructions,
      tags: activeCharacter.tags,
    } : null;

    const systemPrompt = [
      '你是这个私人虚拟手机项目的编辑助手。',
      '用户希望修改当前私人虚拟手机项目。你要基于现有资料提出精确、可执行的结构化修改。',
      '只修改项目设定和当前默认角色允许编辑的文字字段；不要创建虚假的角色，不要删除数据，不要修改 ID。',
      '必须返回严格 JSON，不要 Markdown，不要代码围栏。',
      'JSON 格式必须是：',
      JSON.stringify({
        message: '一句中文说明这次修改想达到什么效果',
        projectPatch: {
          name: '可选；没有修改就省略',
          subtitle: '可选',
          description: '可选',
          genre: '可选',
          language: '可选',
          tone: '可选',
          globalPrompt: '可选',
        },
        characterPatch: {
          description: '可选',
          personality: '可选',
          scenario: '可选',
          firstMessage: '可选',
          exampleDialogue: '可选',
          creatorNotes: '可选',
          systemPrompt: '可选',
          postHistoryInstructions: '可选',
          tags: ['可选标签'],
        },
      }),
      '如果某一部分不需要修改，使用空对象 {}。',
    ].join('\n');

    const userPrompt = [
      '【当前项目】',
      JSON.stringify(manifest, null, 2),
      '',
      '【当前默认角色】',
      JSON.stringify(activeCharacterSnapshot, null, 2),
      '',
      '【当前世界书概况】',
      JSON.stringify(worldbooks.map(book => ({
        id: book.id,
        name: book.name,
        enabled: book.enabled,
        entries: book.entries.length,
      })), null, 2),
      '',
      '【用户修改要求】',
      request,
    ].join('\n');

    try {
      const raw = await generateCreativeText({
        settings,
        systemPrompt,
        userPrompt,
        temperature: 0.35,
      });
      const cleaned = raw.trim().replace(/^\`\`\`(?:json)?\s*/i, '').replace(/\s*\`\`\`$/i, '');
      const parsed = JSON.parse(cleaned);

      const proposal = {
        message: typeof parsed?.message === 'string' ? parsed.message : 'AI 已生成一组项目修改建议。',
        projectPatch: parsed?.projectPatch && typeof parsed.projectPatch === 'object' ? parsed.projectPatch : {},
        characterPatch: parsed?.characterPatch && typeof parsed.characterPatch === 'object' ? parsed.characterPatch : {},
      };
      setAssistantProposal(proposal);
      notify('AI 修改方案已生成，请检查后应用');
    } catch (error) {
      notify(error instanceof Error ? error.message : 'AI 项目修改失败');
    } finally {
      setAssistantBusy(false);
    }
  };

  const applyAssistantProposal = () => {
    if (!assistantProposal) return;

    if (assistantProposal.projectPatch) {
      patch(assistantProposal.projectPatch);
    }

    if (assistantProposal.characterPatch && activeCharacter) {
      const allowed = assistantProposal.characterPatch;
      setCharacters(prev => prev.map(character =>
        character.id === activeCharacter.id
          ? { ...character, ...allowed }
          : character
      ));
    }

    setAssistantProposal(null);
    setAssistantPrompt('');
    notify('AI 修改已应用并保存到本机项目');
  };

  const createStarterBook = () => {
    const id = 'worldbook-' + Date.now();
    const book: WorldBook = {
      id,
      name: '新世界书',
      description: '',
      enabled: true,
      updatedAt: new Date().toISOString(),
      entries: [],
    };
    setWorldbooks(prev => [book, ...prev]);
    patch({ activeWorldBookId: id });
    notify('已创建一个空世界书');
  };

  const exportProjectSnapshot = () => {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || (!key.startsWith('phone:') && !key.startsWith('line:'))) continue;
      try { data[key] = JSON.parse(localStorage.getItem(key) || 'null'); }
      catch { data[key] = localStorage.getItem(key); }
    }
    downloadJson((manifest.name || 'sane333') + '-project.json', { version: 2, exportedAt: new Date().toISOString(), project: manifest, data });
    notify('项目快照已导出');
  };

  const importProjectSnapshot = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const data = parsed?.data;
      if (!data || typeof data !== 'object') throw new Error('项目快照格式不正确');
      for (const [key, value] of Object.entries(data)) {
        if (!key.startsWith('phone:') && !key.startsWith('line:')) continue;
        localStorage.setItem(key, JSON.stringify(value));
      }
      if (parsed.project && typeof parsed.project === 'object') {
        const next = { ...DEFAULT_PROJECT_MANIFEST, ...parsed.project, updatedAt: new Date().toISOString() };
        localStorage.setItem('phone:project-manifest', JSON.stringify(next));
        setManifest(next);
      }
      setCharacters(prev => prev);
      setWorldbooks(prev => prev);
      notify('项目快照已恢复；重新进入其他页面即可刷新全部数据');
    } catch (error) {
      notify(error instanceof Error ? error.message : '恢复项目失败');
    } finally {
      if (importRef.current) importRef.current.value = '';
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden" style={{ background: 'var(--paper)', color: 'var(--ink)' }}>
      <div className="absolute inset-0 opacity-15 bg-paper-noise pointer-events-none" />
      <header className="relative z-10 px-5 pt-12 pb-3.5 border-b border-[rgba(40,36,31,.12)] bg-[rgba(247,244,238,.85)] backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => onNavigate('settings')} className="w-8 h-8 rounded-full bg-white/40 border border-white/60 grid place-items-center text-xs text-[#242323] shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="text-[8px] font-mono tracking-[2px] text-[#817a72] uppercase">PROJECT STUDIO · LOCAL EDITOR</div>
            <h2 className="font-serif font-bold text-base tracking-tight text-[#242323] truncate">{manifest.name || '项目工作台'}</h2>
          </div>
        </div>
        <button onClick={exportProjectSnapshot} className="w-8 h-8 rounded-full bg-[#292724] text-white grid place-items-center" title="导出项目快照">
          <Download className="w-3.5 h-3.5" />
        </button>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        <section className="p-4 rounded-2xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)]">
          <div className="flex items-center gap-2 text-[8px] font-mono tracking-[1.5px] text-[#8b8782]">
            <FileText className="w-3.5 h-3.5" /> PROJECT CONTROL
          </div>
          <div className="mt-2 font-serif font-bold text-lg text-[#242323]">这个页面就是你的项目编辑器。</div>
          <p className="mt-2 text-[10px] leading-relaxed text-[#6c655e]">这里修改的内容会直接保存到本机项目，并参与后续 AI 生成。以后接 AI 编辑器时，项目级数据也可以直接从这里修改。</p>
        </section>

        <section className="p-4 rounded-2xl bg-white/55 border border-[rgba(40,36,31,.1)]">
          <div className="flex items-center gap-2 text-[8px] font-mono tracking-[1.5px] text-[#8b8782]">
            <Sparkles className="w-3.5 h-3.5 text-[#9b625b]" /> AI PROJECT ASSISTANT
          </div>
          <div className="mt-2 font-serif font-bold text-base text-[#292724]">直接告诉 AI，你想把项目改成什么样。</div>
          <p className="mt-1 text-[9px] leading-relaxed text-[#7a736c]">AI 会读取当前项目和默认角色，先给出修改方案；你确认后才会真正写入。</p>
          <textarea
            value={assistantPrompt}
            onChange={e => setAssistantPrompt(e.target.value)}
            placeholder="例如：把这个项目整体调整成现代东京雨夜、克制电影感；角色说话少一点，但保留暧昧张力。"
            className="w-full mt-2.5 min-h-[78px] bg-white/70 rounded-xl p-2.5 text-[10.5px] outline-none resize-y leading-relaxed"
          />
          <button
            onClick={askProjectAssistant}
            disabled={assistantBusy || !assistantPrompt.trim()}
            className="mt-2.5 w-full py-2.5 rounded-xl bg-[#292724] text-white text-[10px] flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <Sparkles className={`w-3.5 h-3.5 ${assistantBusy ? 'animate-pulse' : ''}`} />
            {assistantBusy ? 'AI 正在理解项目……' : '生成修改方案'}
          </button>

          {assistantProposal && (
            <div className="mt-3 p-3 rounded-xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)]">
              <div className="text-[9px] font-semibold text-[#433e38]">AI 方案预览</div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-[#5d5650]">{assistantProposal.message}</p>
              <div className="mt-2 space-y-1 text-[8.5px] text-[#7b746d] font-mono">
                {assistantProposal.projectPatch && Object.keys(assistantProposal.projectPatch).length > 0 && (
                  <div>PROJECT · {Object.keys(assistantProposal.projectPatch).join(' · ')}</div>
                )}
                {assistantProposal.characterPatch && Object.keys(assistantProposal.characterPatch).length > 0 && (
                  <div>CHARACTER · {Object.keys(assistantProposal.characterPatch).join(' · ')}</div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2.5">
                <button onClick={applyAssistantProposal} className="py-2 rounded-xl bg-[#292724] text-white text-[9px]">应用修改</button>
                <button onClick={() => setAssistantProposal(null)} className="py-2 rounded-xl bg-white/65 border border-black/5 text-[#665f58] text-[9px]">取消</button>
              </div>
            </div>
          )}
        </section>

        <div className="grid grid-cols-3 gap-1.5">
          <button onClick={() => setOpenSection('project')} className="p-2 rounded-xl bg-white/55 border border-[rgba(40,36,31,.1)] text-[9px] text-[#4f4943]">项目资料</button>
          <button onClick={() => setOpenSection('context')} className="p-2 rounded-xl bg-white/55 border border-[rgba(40,36,31,.1)] text-[9px] text-[#4f4943]">运行配置</button>
          <button onClick={() => setOpenSection('data')} className="p-2 rounded-xl bg-white/55 border border-[rgba(40,36,31,.1)] text-[9px] text-[#4f4943]">数据工作区</button>
        </div>

        {openSection === 'project' && (
          <section className="p-4 rounded-2xl bg-white/50 border border-[rgba(40,36,31,.1)] space-y-2.5">
            <label className="block text-[9px] text-[#7e7770]">项目名称
              <input value={manifest.name} onChange={e => patch({ name: e.target.value })} className="w-full mt-1 bg-white/70 rounded-xl p-2 text-xs outline-none" />
            </label>
            <label className="block text-[9px] text-[#7e7770]">副标题
              <input value={manifest.subtitle} onChange={e => patch({ subtitle: e.target.value })} className="w-full mt-1 bg-white/70 rounded-xl p-2 text-xs outline-none" />
            </label>
            <label className="block text-[9px] text-[#7e7770]">项目简介
              <textarea value={manifest.description} onChange={e => patch({ description: e.target.value })} className="w-full mt-1 min-h-[70px] bg-white/70 rounded-xl p-2 text-xs outline-none resize-y" />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-[9px] text-[#7e7770]">类型 / Genre
                <input value={manifest.genre} onChange={e => patch({ genre: e.target.value })} className="w-full mt-1 bg-white/70 rounded-xl p-2 text-[10px] outline-none" />
              </label>
              <label className="block text-[9px] text-[#7e7770]">语言
                <input value={manifest.language} onChange={e => patch({ language: e.target.value })} className="w-full mt-1 bg-white/70 rounded-xl p-2 text-[10px] outline-none" />
              </label>
            </div>
            <label className="block text-[9px] text-[#7e7770]">全局创作规则
              <textarea value={manifest.tone} onChange={e => patch({ tone: e.target.value })} className="w-full mt-1 min-h-[90px] bg-white/70 rounded-xl p-2 text-[10.5px] outline-none resize-y leading-relaxed" placeholder="例如：角色保持自己的性格；不要替用户行动；聊天自然、有生活感。" />
            </label>
            <label className="block text-[9px] text-[#7e7770]">项目级 AI 指令
              <textarea value={manifest.globalPrompt} onChange={e => patch({ globalPrompt: e.target.value })} className="w-full mt-1 min-h-[110px] bg-white/70 rounded-xl p-2 text-[10.5px] outline-none resize-y leading-relaxed font-mono" placeholder="写给 AI 的项目总规则。" />
            </label>
            <button onClick={() => { patch({ updatedAt: new Date().toISOString() }); notify('项目已保存'); }} className="w-full py-2 rounded-xl bg-[#292724] text-white text-[10px] flex items-center justify-center gap-1.5">
              <Save className="w-3.5 h-3.5" /> 保存项目
            </button>
          </section>
        )}

        {openSection === 'context' && (
          <section className="p-4 rounded-2xl bg-white/50 border border-[rgba(40,36,31,.1)] space-y-2.5">
            <div className="flex items-center gap-2 text-[8px] tracking-[1.5px] font-mono text-[#8b8782]"><Users className="w-3 h-3" /> DEFAULT CHARACTER</div>
            <select value={manifest.activeCharacterId || ''} onChange={e => patch({ activeCharacterId: e.target.value || null })} className="w-full bg-white/70 rounded-xl px-3 py-2 text-xs outline-none">
              <option value="">不指定默认角色</option>
              {characters.map(character => <option key={character.id} value={character.id}>{character.name}</option>)}
            </select>
            {activeCharacter && <div className="p-2.5 rounded-xl bg-[#ebe7df] text-[9px] text-[#665f58]">当前角色：<b>{activeCharacter.name}</b><div className="mt-1 text-[#8b8782]">长期记忆 {getCharacterMemory(activeCharacter.id, activeCharacter.name).items.length} 条</div></div>}
            <div className="flex items-center gap-2 text-[8px] tracking-[1.5px] font-mono text-[#8b8782] pt-2"><BookOpen className="w-3 h-3" /> DEFAULT WORLD BOOK</div>
            <select value={manifest.activeWorldBookId || ''} onChange={e => patch({ activeWorldBookId: e.target.value || null })} className="w-full bg-white/70 rounded-xl px-3 py-2 text-xs outline-none">
              <option value="">不指定默认世界书</option>
              {worldbooks.map(book => <option key={book.id} value={book.id}>{book.name}</option>)}
            </select>
            {activeWorldBook && <div className="text-[9px] text-[#8b8782]">{activeWorldBook.entries.length} 个条目 · {activeWorldBook.enabled ? '启用' : '停用'}</div>}
            <div className="flex items-center gap-2 text-[8px] tracking-[1.5px] font-mono text-[#8b8782] pt-2"><KeyRound className="w-3 h-3" /> PERSONA</div>
            <div className="p-2.5 rounded-xl bg-[#ebe7df] text-[10px] text-[#5f5852]">{personas.length ? '当前有 ' + personas.length + ' 个人设；LINE 使用全局活动人设。' : '还没有 Persona，可去 LINE → 人设管理器添加。'}</div>
          </section>
        )}

        {openSection === 'data' && (
          <section className="p-4 rounded-2xl bg-white/50 border border-[rgba(40,36,31,.1)] space-y-2.5">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-[#ebe7df] text-center"><div className="text-lg font-serif font-bold">{characters.length}</div><div className="text-[8px] text-[#8b8782]">角色</div></div>
              <div className="p-2.5 rounded-xl bg-[#ebe7df] text-center"><div className="text-lg font-serif font-bold">{worldbooks.length}</div><div className="text-[8px] text-[#8b8782]">世界书</div></div>
              <div className="p-2.5 rounded-xl bg-[#ebe7df] text-center"><div className="text-lg font-serif font-bold">{personas.length}</div><div className="text-[8px] text-[#8b8782]">Persona</div></div>
            </div>
            <button onClick={() => onNavigate('character-profile')} className="w-full py-2.5 rounded-xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)] text-[10px] text-left px-3 flex items-center gap-2"><Users className="w-3.5 h-3.5 text-[#8b7560]" /> 编辑角色档案</button>
            <button onClick={() => onNavigate('world-book')} className="w-full py-2.5 rounded-xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)] text-[10px] text-left px-3 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-[#8b7560]" /> 编辑世界书</button>
            <button onClick={() => onNavigate('settings')} className="w-full py-2.5 rounded-xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)] text-[10px] text-left px-3 flex items-center gap-2"><Settings2 className="w-3.5 h-3.5 text-[#8b7560]" /> AI / 数据 / 备份设置</button>
            <button onClick={createStarterBook} className="w-full py-2.5 rounded-xl bg-[#292724] text-white text-[10px] flex items-center justify-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> 新建空世界书</button>
            <button onClick={exportProjectSnapshot} className="w-full py-2.5 rounded-xl bg-white/75 border border-[rgba(40,36,31,.12)] text-[10px] flex items-center justify-center gap-1.5"><Download className="w-3.5 h-3.5" /> 导出完整项目快照</button>
            <button onClick={() => importRef.current?.click()} className="w-full py-2.5 rounded-xl bg-white/75 border border-[rgba(40,36,31,.12)] text-[10px] flex items-center justify-center gap-1.5"><Save className="w-3.5 h-3.5" /> 恢复项目快照</button>
            <input ref={importRef} type="file" accept=".json" className="hidden" onChange={e => importProjectSnapshot(e.target.files?.[0])} />
          </section>
        )}
      </div>

      <div className="relative z-10 p-3 text-center text-[9px] text-[#8b8782] font-mono border-t border-[rgba(40,36,31,.1)]">PROJECT STUDIO · LOCAL FIRST · EVERYTHING YOU EDIT IS SAVED</div>
      {notice && <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-16 bg-[#292724] text-white px-3.5 py-2 rounded-full text-[10px]">{notice}</div>}
    </div>
  );
}