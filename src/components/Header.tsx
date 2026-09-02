import React from 'react';
import { Sparkles, Sliders, Download, BookOpen, Search, Eye, Filter, Flame } from 'lucide-react';
import { FilterState, StyleId } from '../types';
import { STYLE_META, STYLE_IDS } from '../data/styleConfig';

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
}

const THEMES = [
  '全部写真',
  '海风漫游',
  '旧港光影',
  '绿意庭院',
  '文艺天星',
  '法式海岛',
  '池畔日光',
  '校园初恋',
  '首尔日常',
  '街头随性',
  '阳光海岸',
  '冲绳海岸',
];

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
}) => {
  const activeMeta = filters.style ? STYLE_META[filters.style as StyleId] : null;
  return (
    <header id="vogue-hk-header" className="w-full bg-[#0a0a0a] border-b border-[#222222] sticky top-0 z-30 shadow-xl backdrop-blur-md">
      {/* Top Banner Notice */}
      <div className="bg-[#050505] text-[#888888] text-xs px-4 py-1.5 flex items-center justify-between tracking-widest uppercase border-b border-[#1c1c1c]">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: activeMeta?.accent || '#d4af37' }}></span>
          <span className="text-[#cccccc]">{activeMeta ? `${activeMeta.enLabel} · ${activeMeta.label}夏季特辑` : 'GLOBAL STUDIO SUMMER SPECIAL 2025 · 六风格写真矩阵'}</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[#888888]">
          <span className="text-[#aaaaaa]">摄影总监策划版</span>
          <span className="text-[#333333]">|</span>
          <span className="font-medium tracking-normal" style={{ color: activeMeta?.accent || '#d4af37' }}>严禁机械摆拍 · 严禁低幼剧情 · 纯粹自然氧气感</span>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1 className="font-cinzel text-3xl sm:text-4xl tracking-widest font-bold uppercase drop-shadow-sm" style={{ color: activeMeta?.accent || '#d4af37' }}>
                VOGUE <span className="text-[#e5e5e5] font-serif-hk text-2xl sm:text-3xl tracking-normal font-normal">{activeMeta ? activeMeta.label : '全球'}</span>
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border" style={{ background: `${activeMeta?.accent || '#d4af37'}15`, color: activeMeta?.accent || '#d4af37', borderColor: `${activeMeta?.accent || '#d4af37'}40` }}>
                Summer Issue · 6 Styles
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#888888] font-serif-hk mt-1 tracking-wide">
              {activeMeta ? `${activeMeta.description} · ${activeMeta.tagline}` : '六风格矩阵「港系·日系·韩系·纽约·加州·比基尼」· 92组高定电影感 AI 提示词 · 400+ 独家元素库'}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              id="btn-open-generator"
              onClick={onOpenGenerator}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d4af37] text-black hover:bg-[#c4a030] text-xs sm:text-sm font-bold tracking-wider transition-all shadow-md active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>AI灵感工作台</span>
            </button>

            <button
              id="btn-open-presets"
              onClick={onOpenPresetLibrary}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] text-[#dcdcdc] hover:text-[#d4af37] text-xs sm:text-sm font-medium border border-[#2a2a2a] hover:border-[#d4af37]/50 transition-all"
            >
              <Sliders className="w-4 h-4 text-[#888888]" />
              <span>400+ 预设库</span>
            </button>

            <button
              id="btn-open-export"
              onClick={onOpenExport}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#141414] hover:bg-[#1f1f1f] text-[#dcdcdc] hover:text-[#d4af37] text-xs sm:text-sm font-medium border border-[#2a2a2a] hover:border-[#d4af37]/50 transition-all"
            >
              <Download className="w-4 h-4 text-[#888888]" />
              <span>批量导出 ({filteredCount}组)</span>
            </button>

            <button
              id="btn-open-guidelines"
              onClick={onOpenGuidelines}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[#aaaaaa] hover:text-[#d4af37] hover:bg-[#141414] text-xs sm:text-sm border border-transparent hover:border-[#2a2a2a] transition-all"
              title="查看视觉总监策划红线与美学规范"
            >
              <BookOpen className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden lg:inline">总监策划红线</span>
            </button>
          </div>
        </div>

        {/* Style Tabs */}
        <div className="mt-4 pt-3 border-t border-[#222222] flex flex-col gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 text-xs">
            <button
              onClick={() => onFilterChange({ style: '' })}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap font-bold border transition-all ${!filters.style ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-[#141414] text-[#888888] border-[#2a2a2a] hover:text-white'}`}
            >
              全部风格 {totalCount}
            </button>
            {STYLE_IDS.map((sid) => {
              const meta = STYLE_META[sid];
              const isActive = filters.style === sid;
              return (
                <button
                  key={sid}
                  onClick={() => onFilterChange({ style: isActive ? '' : sid })}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap font-bold border transition-all flex items-center gap-1 ${isActive ? 'text-black shadow-xs' : 'bg-[#141414] text-[#888888] border-[#2a2a2a] hover:text-white'}`}
                  style={isActive ? { background: meta.accent, borderColor: meta.accent } : {}}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Themes Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
              {THEMES.map((theme) => {
                const isActive = (theme === '全部写真' && !filters.theme) || filters.theme === theme;
                return (
                  <button
                    key={theme}
                    onClick={() => onFilterChange({ theme: theme === '全部写真' ? '' : theme })}
                    className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-all font-medium ${
                      isActive
                        ? 'bg-[#1e1e1e] border shadow-xs'
                        : 'text-[#888888] hover:bg-[#161616] hover:text-[#e5e5e5]'
                    }`}
                    style={isActive ? { color: activeMeta?.accent || '#d4af37', borderColor: `${activeMeta?.accent || '#d4af37'}60` } as any : {}}
                  >
                    {theme}
                  </button>
                );
              })}
            </div>

          {/* Search Input & Favorite Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-prompts-input"
                type="text"
                placeholder="搜索场景、穿搭面料、光影..."
                value={filters.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                className="w-full pl-9 pr-3 py-1.5 bg-[#141414] border border-[#2a2a2a] rounded-lg text-xs sm:text-sm text-[#e5e5e5] placeholder:text-[#666666] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]"
              />
              {filters.search && (
                <button
                  onClick={() => onFilterChange({ search: '' })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#ffffff] text-xs"
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
              <span>★ 收藏</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#222222] text-[#d4af37] rounded-full font-bold">
                {favoritesCount}
              </span>
            </button>
          </div>
        </div>
        </div>
      </div>
    </header>
  );
};
