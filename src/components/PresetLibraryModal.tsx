import React, { useState } from 'react';
import { X, Search, Copy, Sparkles, Check } from 'lucide-react';
import { ALL_PRESETS } from '../data/presetsData';
import { PresetCategory, PresetItem, StyleId } from '../types';
import { STYLE_META, STYLE_IDS } from '../data/styleConfig';

interface PresetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPresetForGenerator: (preset: PresetItem) => void;
  onShowToast: (msg: string) => void;
  activeStyle?: StyleId;
}

export const PresetLibraryModal: React.FC<PresetLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectPresetForGenerator,
  onShowToast,
  activeStyle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PresetCategory | 'ALL'>('ALL');
  const [selectedStyle, setSelectedStyle] = useState<StyleId | 'ALL'>(activeStyle || 'ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // sync external style filter
  React.useEffect(() => { if (activeStyle) setSelectedStyle(activeStyle); }, [activeStyle]);

  if (!isOpen) return null;

  const filteredPresets = ALL_PRESETS.filter((preset) => {
    const matchesStyle = selectedStyle === 'ALL' || preset.style === selectedStyle;
    const matchesCategory = selectedCategory === 'ALL' || preset.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStyle && matchesCategory && matchesSearch;
  });

  const CATEGORY_TABS: { id: PresetCategory | 'ALL'; label: string }[] = [
    { id: 'ALL', label: `全部预设 (${ALL_PRESETS.length})` },
    { id: 'beauty', label: `🌸 容颜 (${ALL_PRESETS.filter((p) => p.category === 'beauty').length})` },
    { id: 'outfit', label: `👗 穿搭 (${ALL_PRESETS.filter((p) => p.category === 'outfit').length})` },
    { id: 'scene', label: `🏖️ 场景 (${ALL_PRESETS.filter((p) => p.category === 'scene').length})` },
    { id: 'composition', label: `📐 构图 (${ALL_PRESETS.filter((p) => p.category === 'composition').length})` },
    { id: 'lighting', label: `🎞️ 光影 (${ALL_PRESETS.filter((p) => p.category === 'lighting').length})` },
  ];

  const handleCopy = (preset: PresetItem) => {
    navigator.clipboard.writeText(preset.desc);
    setCopiedId(preset.id);
    setTimeout(() => setCopiedId(null), 1500);
    onShowToast(`已复制预设「${preset.name}」细节描述`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111111] rounded-2xl w-full max-w-6xl max-h-[92vh] shadow-2xl border border-[#2a2a2a] flex flex-col overflow-hidden text-[#e5e5e5]">
        <div className="p-4 sm:p-6 border-b border-[#222222] flex items-center justify-between bg-[#0a0a0a]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-cinzel font-bold text-[#d4af37] bg-[#d4af37]/15 px-2.5 py-0.5 rounded border border-[#d4af37]/40 tracking-wider">400+ PRESET MATRIX · 6 STYLES</span>
              <h2 className="text-xl font-bold font-serif-hk text-white">全球风格 400+ 专业维度预设库</h2>
            </div>
            <p className="text-xs text-[#888888] font-serif-hk mt-1">港系 / 日系 / 韩系 / 纽约 / 加州 / 比基尼特辑 · 每种风格独立语汇库与场景库</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-[#666666] hover:text-white hover:bg-[#1a1a1a]"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 border-b border-[#222222] bg-[#0c0c0c] flex flex-col gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 text-xs">
            <button onClick={() => setSelectedStyle('ALL')} className={`px-3 py-1.5 rounded-full whitespace-nowrap font-bold border transition-all ${selectedStyle === 'ALL' ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-[#141414] text-[#888888] border-[#242424] hover:text-white'}`}>全部风格</button>
            {STYLE_IDS.map((sid) => {
              const meta = STYLE_META[sid];
              const isActive = selectedStyle === sid;
              const count = ALL_PRESETS.filter((p) => p.style === sid).length;
              return <button key={sid} onClick={() => setSelectedStyle(isActive ? 'ALL' : sid)} className={`px-3 py-1.5 rounded-full whitespace-nowrap font-bold border flex items-center gap-1 transition-all ${isActive ? 'text-black' : 'bg-[#141414] text-[#888888] border-[#242424] hover:text-white'}`} style={isActive ? { background: meta.accent, borderColor: meta.accent } : {}}>{meta.icon} {meta.label} {count}</button>;
            })}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
              {CATEGORY_TABS.map((tab) => (
                <button key={tab.id} onClick={() => setSelectedCategory(tab.id)} className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${selectedCategory === tab.id ? 'bg-[#1e1e1e] text-[#d4af37] border border-[#d4af37]/60 shadow-xs' : 'bg-[#141414] text-[#888888] border border-[#242424] hover:text-[#e5e5e5]'}`}>{tab.label}</button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="搜索预设名称、面料、地点..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-1.5 bg-[#161616] border border-[#2a2a2a] rounded-lg text-xs sm:text-sm text-[#e5e5e5] placeholder:text-[#666666] focus:outline-none focus:border-[#d4af37]" />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredPresets.map((preset) => {
            const meta = preset.style ? STYLE_META[preset.style as StyleId] : null;
            return (
              <div key={preset.id} className="bg-[#0f0f0f] rounded-xl border border-[#222222] p-4 hover:shadow-lg transition-all flex flex-col justify-between" style={{ borderColor: meta ? `${meta.accent}30` : undefined }} onMouseEnter={(e) => { if(meta) e.currentTarget.style.borderColor = `${meta.accent}80`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = meta ? `${meta.accent}30` : '#222222'; }}>
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-sm font-serif-hk leading-tight">{preset.name}</h4>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#181818] text-[#888888] border border-[#262626] font-mono">{preset.category}</span>
                      {meta && <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold text-black" style={{ background: meta.accent }}>{meta.label}</span>}
                    </div>
                  </div>
                  <p className="text-xs text-[#aaaaaa] font-serif-hk mt-2 leading-relaxed">{preset.desc}</p>
                  {preset.visualHint && <div className="mt-2 text-[11px] rounded px-2 py-1 border" style={{ color: meta?.accent || '#d4af37', background: `${meta?.accent || '#d4af37'}12`, borderColor: `${meta?.accent || '#d4af37'}30` }}>💡 <span className="font-medium">视觉亮点：</span> {preset.visualHint}</div>}
                </div>
                <div className="mt-3 pt-3 border-t border-[#1c1c1c] flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">{preset.tags.slice(0,4).map((tag, idx) => <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-[#161616] text-[#777777] border border-[#222222]">#{tag}</span>)}</div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleCopy(preset)} className="p-1.5 rounded text-[#666666] hover:text-[#e5e5e5] hover:bg-[#181818]">{copiedId === preset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}</button>
                    <button onClick={() => { onSelectPresetForGenerator(preset); onClose(); }} className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-black text-[11px] font-bold shadow-xs" style={{ background: meta?.accent || '#d4af37' }}><Sparkles className="w-3 h-3 text-black" /><span>载入</span></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#222222] bg-[#0a0a0a] flex items-center justify-between text-xs text-[#666666]">
          <span>共找到 {filteredPresets.length} 个高定写真预设 · {selectedStyle !== 'ALL' ? STYLE_META[selectedStyle as StyleId].label : '全部风格'} · {selectedCategory === 'ALL' ? '全部分类' : selectedCategory}</span>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-[#1a1a1a] text-[#cccccc] hover:bg-[#282828] font-medium border border-[#333333]">关闭预设库</button>
        </div>
      </div>
    </div>
  );
};
