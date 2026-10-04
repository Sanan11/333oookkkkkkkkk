import { useRef, useState } from 'react';
import { ArrowLeft, Download, FileDown, FilePlus2, ShieldCheck, Trash2, UserRound } from 'lucide-react';
import { ScreenType } from '../../types';
import { usePersistentState } from '../../store/usePersistentState';
import {
  ImportedCharacter,
  exportCharacterJson,
  parseCharacterFile,
} from '../../data/characterImport';

interface CharacterProfileViewProps {
  themeMode?: any;
  onNavigate: (screen: ScreenType) => void;
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function CharacterProfileView({ onNavigate }: CharacterProfileViewProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [characters, setCharacters] = usePersistentState<ImportedCharacter[]>('phone:characters', []);
  const [selectedId, setSelectedId] = usePersistentState<string | null>(
    'phone:active-character',
    null,
  );
  const [notice, setNotice] = useState('');
  const selected = characters.find(character => character.id === selectedId) || characters[0] || null;

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const handleImport = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = await parseCharacterFile(file);
      setCharacters(prev => {
        const existing = prev.findIndex(item => item.id === parsed.id);
        if (existing >= 0) {
          return prev.map(item => item.id === parsed.id ? parsed : item);
        }
        return [parsed, ...prev];
      });
      setSelectedId(parsed.id);
      showNotice(`已导入「${parsed.name}」 · ${parsed.sourceFormat.toUpperCase()}`);
    } catch (error) {
      showNotice(error instanceof Error ? error.message : '角色卡解析失败');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = () => {
    if (!selected) return;
    setCharacters(prev => prev.filter(item => item.id !== selected.id));
    setSelectedId(characters.find(item => item.id !== selected.id)?.id || null);
    showNotice(`已移除「${selected.name}」`);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col justify-between select-none overflow-hidden"
      style={{ background: 'var(--paper)', color: 'var(--ink)' }}
    >
      <div className="absolute inset-0 opacity-15 bg-paper-noise pointer-events-none" />

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
              CHARACTER ARCHIVE · IMPORTABLE CARDS
            </div>
            <h2 className="font-serif font-bold text-base tracking-tight text-[#242323]">
              角色档案 · {selected ? selected.name : '我的角色'}
            </h2>
          </div>
        </div>

        <button
          onClick={() => fileRef.current?.click()}
          className="w-8 h-8 rounded-full bg-[#292724] text-white grid place-items-center hover:bg-black active:scale-95 transition-all"
          title="导入角色卡"
        >
          <FilePlus2 className="w-3.5 h-3.5" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".png,.json,.yaml,.yml"
          className="hidden"
          onChange={event => handleImport(event.target.files?.[0])}
        />
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar">
        {characters.length === 0 ? (
          <div className="p-5 h-full flex items-center justify-center">
            <div className="w-full rounded-2xl bg-[#eee9df] border border-[rgba(40,36,31,.14)] shadow-[0_8px_25px_rgba(45,37,30,.08)] p-5">
              <div className="flex items-center gap-2 text-[8px] tracking-[2px] font-mono text-[#8b8782]">
                <ShieldCheck className="w-3 h-3" />
                NO CHARACTER LOADED
              </div>
              <h3 className="mt-3 font-serif font-bold text-xl text-[#242323]">
                先把你的角色带进来。
              </h3>
              <p className="mt-2 font-serif-sc text-xs leading-relaxed text-[#5b554f]">
                支持 PNG 角色卡、JSON、YAML / YML。导入后会保存在本机，不会把 Ethan、顾言之类的演示数据冒充成你的角色。
              </p>
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#292724] text-white text-xs font-serif tracking-wider flex items-center justify-center gap-2"
              >
                <FilePlus2 className="w-3.5 h-3.5" />
                导入我的角色卡
              </button>
              <div className="mt-3 text-[9px] text-[#8b8782] font-mono text-center">
                PNG · JSON · YAML · YML
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {characters.map(character => (
                <button
                  key={character.id}
                  onClick={() => setSelectedId(character.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full border text-[10px] font-medium transition-all ${
                    selected?.id === character.id
                      ? 'bg-[#292724] text-white border-[#292724]'
                      : 'bg-white/55 text-[#655f59] border-[rgba(40,36,31,.14)]'
                  }`}
                >
                  {character.name}
                </button>
              ))}
              <button
                onClick={() => fileRef.current?.click()}
                className="shrink-0 px-3 py-1.5 rounded-full border border-dashed border-[#8b7560]/50 text-[10px] text-[#8b7560]"
              >
                ＋ 导入
              </button>
            </div>

            {selected && (
              <>
                <div className="relative p-3 pb-5 rounded-2xl bg-[#eee9df] border border-[rgba(40,36,31,.14)] shadow-[0_8px_25px_rgba(45,37,30,.12)] rotate-[0.7deg]">
                  <div className="absolute right-4 top-4 border-2 border-[#9b625b]/60 text-[#9b625b] text-[8px] font-mono tracking-widest px-2 py-0.5 rounded -rotate-[10deg]">
                    IMPORTED
                  </div>
                  <div className="flex gap-3.5 items-center">
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-[#ded7cc] border border-black/10 shrink-0 grid place-items-center">
                      {selected.avatar ? (
                        <img src={selected.avatar} alt={selected.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <UserRound className="w-10 h-10 text-[#8b8782]" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="font-serif font-bold text-lg leading-tight text-[#242323] truncate">
                        {selected.name}.
                      </div>
                      <div className="text-[10px] text-[#8b8782] font-mono truncate">
                        SOURCE · {selected.sourceFormat.toUpperCase()} · {selected.creator || 'UNKNOWN CREATOR'}
                      </div>
                      <div className="text-[10px] text-[#55504a] font-mono pt-1">
                        VERSION · {selected.characterVersion || 'unspecified'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[rgba(40,36,31,.1)] text-[9px] text-[#8b8782] font-mono">
                    IMPORTED {new Date(selected.importedAt).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#ebe7df] border border-[rgba(40,36,31,.12)]">
                  <div className="text-[8px] tracking-[1.5px] font-mono text-[#8b8782] mb-1">
                    CHARACTER ESSENCE
                  </div>
                  <div className="space-y-3 text-xs leading-relaxed text-[#443f3a] font-serif-sc">
                    <section>
                      <div className="text-[8px] font-mono text-[#8b8782] mb-1">DESCRIPTION</div>
                      <p className="whitespace-pre-wrap">{selected.description || '未填写'}</p>
                    </section>
                    <section>
                      <div className="text-[8px] font-mono text-[#8b8782] mb-1">PERSONALITY</div>
                      <p className="whitespace-pre-wrap">{selected.personality || '未填写'}</p>
                    </section>
                    <section>
                      <div className="text-[8px] font-mono text-[#8b8782] mb-1">SCENARIO</div>
                      <p className="whitespace-pre-wrap">{selected.scenario || '未填写'}</p>
                    </section>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => downloadText(`${selected.name}.json`, exportCharacterJson(selected))}
                    className="py-2.5 rounded-xl bg-[#292724] text-white text-xs font-serif flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    导出 JSON
                  </button>
                  <button
                    onClick={handleDelete}
                    className="py-2.5 rounded-xl bg-[#ebe7df] border border-[rgba(40,36,31,.15)] text-[#9b625b] text-xs font-serif flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    移除角色
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white/55 border border-[rgba(40,36,31,.1)]">
                  <div className="text-[8px] tracking-[1.5px] font-mono text-[#8b8782] mb-2">CARD CONTENT · AI MEMORY INPUTS</div>
                  <div className="space-y-2 text-[10.5px] text-[#5a544e]">
                    <div><span className="font-mono text-[#8b8782]">FIRST MESSAGE</span><p className="mt-1 whitespace-pre-wrap font-serif-sc">{selected.firstMessage || '未填写'}</p></div>
                    <div><span className="font-mono text-[#8b8782]">ALTERNATE GREETINGS</span><p className="mt-1 font-serif-sc">{selected.alternateGreetings.length || 0} 条</p></div>
                    <div><span className="font-mono text-[#8b8782]">TAGS</span><p className="mt-1 font-serif-sc">{selected.tags.join(' · ') || '无'}</p></div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="relative z-10 p-3 text-center text-[9px] text-[#8b8782] font-mono border-t border-[rgba(40,36,31,.1)]">
        CHARACTER ARCHIVE · LOCAL ONLY
      </div>

      {notice && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-16 bg-[#292724] text-white px-3.5 py-2 rounded-full text-[10px] shadow-lg">
          {notice}
        </div>
      )}
    </div>
  );
}
