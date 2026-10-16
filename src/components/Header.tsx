import React from 'react';
import { Sparkles, Sliders, Download, BookOpen, Search, Globe } from 'lucide-react';
import { FilterState, StyleId } from '../types';
import { STYLE_META, STYLE_IDS } from '../data/styleConfig';
import { Lang, t } from '../i18n';

interface HeaderProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onOpenGenerator: () => void;
  onOpenPresetLibrary: () => void;
  onOpenExport: () => void;
  onOpenGuidelines: () => void;
  totalCount: number;
  filteredCount: number;
  favoritesCount: number;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

export const Header: React.FC<HeaderProps> = ({
  filters,
  onFilterChange,
  onOpenGenerator,
  onOpenPresetLibrary,
  onOpenExport,
  onOpenGuidelines,
  totalCount,
  filteredCount,
  favoritesCount,
  lang,
  onLangChange,
}) => {
  const activeMeta = filters.style ? STYLE_META[filters.style as StyleId] : null;
  const accent = activeMeta?.accent || '#d4af37';
  const zh = lang === 'zh';

  return (
    <header id="vogue-hk-header" className="w-full bg-[#0d0d0d]/95 border-b border-[#222222] sticky top-0 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Masthead + actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="font-cinzel text-xl sm:text-2xl tracking-[0.18em] font-bold uppercase" style={{ color: accent }}>
              Global Style
            </h1>
            <span className="text-[11px] text-[#888888] hidden sm:inline">
              {zh ? '写真提示词工作室' : 'Photobook Prompt Studio'}
            </span>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border"
              style={{ background: `${accent}15`, color: accent, borderColor: `${accent}40` }}
            >
              {zh ? '夏日特辑 · 6 风格' : 'Summer Issue · 6 Styles'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-open-generator"
              onClick={onOpenGenerator}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#d4af37] text-black hover:bg-[#c4a030] text-xs font-bold tracking-wider transition-all shadow-md active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>{zh ? 'AI 灵感工作台' : 'AI Studio'}</span>
            </button>

            <button
              id="btn-open-presets"
              onClick={onOpenPresetLibrary}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] text-[#dcdcdc] hover:text-[#d4af37] text-xs font-medium border border-[#2a2a2a] hover:border-[#d4af37]/50 transition-all"
            >
              <Sliders className="w-4 h-4 text-[#888888]" />
              <span>{zh ? '预设库' : 'Presets'}</span>
            </button>

            <button
              id="btn-open-export"
              onClick={onOpenExport}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] text-[#dcdcdc] hover:text-[#d4af37] text-xs font-medium border border-[#2a2a2a] hover:border-[#d4af37]/50 transition-all"
            >
              <Download className="w-4 h-4 text-[#888888]" />
              <span>{zh ? `导出 (${filteredCount})` : `Export (${filteredCount})`}</span>
            </button>

            <button
              id="btn-open-guidelines"
              onClick={onOpenGuidelines}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[#aaaaaa] hover:text-[#d4af37] hover:bg-[#141414] text-xs border border-transparent hover:border-[#2a2a2a] transition-all"
              title={zh ? '查看视觉总监策划红线与美学规范' : 'View the visual director red lines and aesthetic rules'}
            >
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden lg:inline">{zh ? '总监准则' : 'Director Rules'}</span>
            </button>

            {/* Language toggle */}
            <div
              id="lang-toggle"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#141414] border border-[#2a2a2a]"
              title={t(lang, 'langSwitch')}
            >
              <Globe className="w-4 h-4 text-[#888888]" />
              <button
                onClick={() => onLangChange('zh')}
                className={`px-2 py-0.5 rounded-md text-xs font-medium transition-all ${zh ? 'bg-[#d4af37] text-black' : 'text-[#888888] hover:text-white'}`}
              >
                中文
              </button>
              <button
                onClick={() => onLangChange('en')}
                className={`px-2 py-0.5 rounded-md text-xs font-medium transition-all ${!zh ? 'bg-[#d4af37] text-black' : 'text-[#888888] hover:text-white'}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Style tabs + search + favorites */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => onFilterChange({ style: '' })}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap font-bold border transition-all ${!filters.style ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-[#141414] text-[#888888] border-[#2a2a2a] hover:text-white'}`}
          >
            {zh ? '全部风格' : 'All Styles'} <span className="opacity-60">{totalCount}</span>
          </button>
          {STYLE_IDS.map((sid) => {
            const meta = STYLE_META[sid];
            const isActive = filters.style === sid;
            return (
              <button
                key={sid}
                onClick={() => onFilterChange({ style: isActive ? '' : sid })}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap font-bold border transition-all flex items-center gap-1.5 ${isActive ? 'text-black shadow-xs' : 'bg-[#141414] text-[#888888] border-[#2a2a2a] hover:text-white'}`}
                style={isActive ? { background: meta.accent, borderColor: meta.accent } : {}}
              >
                <span>{meta.icon}</span>
                <span>{zh ? meta.label : meta.shortLabel}</span>
              </button>
            );
          })}

          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-prompts-input"
              type="text"
              placeholder={zh ? '搜索场景、穿搭、光影…' : 'Search locations, outfits, lighting…'}
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full pl-9 pr-8 py-1.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs text-[#e5e5e5] placeholder:text-[#666666] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange({ search: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#ffffff] text-xs"
                aria-label={zh ? '清除搜索' : 'Clear search'}
              >
                ✕
              </button>
            )}
          </div>

          <button
            id="toggle-favorites-filter"
            onClick={() => onFilterChange({ favoritesOnly: !filters.favoritesOnly })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
              filters.favoritesOnly
                ? 'bg-[#d4af37]/15 text-[#d4af37] border-[#d4af37]'
                : 'bg-[#141414] text-[#888888] border-[#2a2a2a] hover:text-[#e5e5e5] hover:border-[#3a3a3a]'
            }`}
          >
            <span>{zh ? '★ 收藏' : '★ Favorites'}</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#222222] text-[#d4af37] rounded-full font-bold">
              {favoritesCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
