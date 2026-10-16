import React, { useState, useEffect, useMemo } from 'react';
import { ALL_CURATED_PROMPTS } from './data/curatedAll';
import { PhotobookPrompt, FilterState, PresetItem, StyleId } from './types';
import { STYLE_META } from './data/styleConfig';
import { Header } from './components/Header';
import { PromptCard } from './components/PromptCard';
import { PresetLibraryModal } from './components/PresetLibraryModal';
import { PromptGeneratorModal } from './components/PromptGeneratorModal';
import { BatchExportModal } from './components/BatchExportModal';
import { DirectorGuidelinesModal } from './components/DirectorGuidelinesModal';
import { Toast } from './components/Toast';
import { ArrowUp, Camera, Shuffle } from 'lucide-react';
import { STYLE_IDS } from './data/styleConfig';
import { ALL_PRESETS } from './data/presetsData';
import { Lang, t, themeName } from './i18n';
import { promptTitle, localizePreset } from './data/localized';

export default function App() {
  // 自定义/盲盒提示词持久化到 localStorage，刷新页面后不丢失
  const [customPrompts, setCustomPrompts] = useState<PhotobookPrompt[]>(() => {
    try {
      const saved = localStorage.getItem('vogue_hk_custom_prompts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const prompts = [...customPrompts, ...ALL_CURATED_PROMPTS];
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vogue_hk_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filters, setFilters] = useState<FilterState>({
    style: '',
    theme: '',
    search: '',
    favoritesOnly: false,
  });

  // UI language (en default, persisted)
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return localStorage.getItem('studio_lang') === 'zh' ? 'zh' : 'en';
    } catch {
      return 'en';
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('studio_lang', lang);
    } catch {
      // localStorage unavailable, ignore
    }
  }, [lang]);
  const zh = lang === 'zh';

  // Modals state
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isPresetLibraryOpen, setIsPresetLibraryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [selectedPresetForGenerator, setSelectedPresetForGenerator] = useState<PresetItem | null>(null);
  const [generatorInitialPrompt, setGeneratorInitialPrompt] = useState<PhotobookPrompt | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    try {
      localStorage.setItem('vogue_hk_custom_prompts', JSON.stringify(customPrompts));
    } catch {
      // localStorage 不可用（隐私模式），静默忽略
    }
  }, [customPrompts]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vogue_hk_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast(t(lang, 'toastUnfavorited'));
        return prev.filter((item) => item !== id);
      } else {
        showToast(t(lang, 'toastFavorited'));
        return [...prev, id];
      }
    });
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Add custom generated prompt to the collection
  const handleSaveCustomPrompt = (newPrompt: PhotobookPrompt) => {
    setCustomPrompts((prev) => [newPrompt, ...prev]);
    showToast(t(lang, 'toastSaved', { title: newPrompt.title }));
  };

  const handleUseInGenerator = (prompt: PhotobookPrompt) => {
    setGeneratorInitialPrompt(prompt);
    setIsGeneratorOpen(true);
    showToast(t(lang, 'toastLoaded', { title: promptTitle(prompt, lang) }));
  };

  const handleSelectPresetForGenerator = (preset: PresetItem) => {
    setSelectedPresetForGenerator(preset);
    setIsGeneratorOpen(true);
    showToast(t(lang, 'toastPresetLoaded', { name: localizePreset(preset, lang).name }));
  };

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((item) => {
      if (filters.style && item.style !== filters.style) {
        return false;
      }
      if (filters.theme && item.theme !== filters.theme) {
        return false;
      }
      if (filters.favoritesOnly && !favorites.includes(item.id)) {
        return false;
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query) || promptTitle(item, lang).toLowerCase().includes(query);
        const matchZh = item.promptZh.toLowerCase().includes(query);
        const matchEn = item.promptEn.toLowerCase().includes(query);
        const matchBeauty = item.beautyType.toLowerCase().includes(query);
        const matchOutfit = item.outfit.toLowerCase().includes(query);
        const matchLocation = item.location.toLowerCase().includes(query);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(query));
        const matchStyle = (item.styleLabel || item.style || '').toLowerCase().includes(query);
        if (!matchTitle && !matchZh && !matchEn && !matchBeauty && !matchOutfit && !matchLocation && !matchTags && !matchStyle) {
          return false;
        }
      }
      return true;
    });
  }, [prompts, filters, favorites]);

  const activeStyleMeta = filters.style ? STYLE_META[filters.style as StyleId] : null;

  const [isBlindBoxLoading, setIsBlindBoxLoading] = useState(false);

  const handleGlobalBlindBox = async () => {
    setIsBlindBoxLoading(true);
    const randomStyle = STYLE_IDS[Math.floor(Math.random() * STYLE_IDS.length)] as StyleId;
    const randPresets = ALL_PRESETS.filter((p) => !p.style || p.style === randomStyle);
    const pick = (cat: string) => {
      const pool = randPresets.filter((p) => p.category === cat);
      return pool[Math.floor(Math.random() * pool.length)]?.name || '';
    };
    const themesByStyle: Record<string, string[]> = {
      hk: ['海风漫游', '旧港光影', '绿意庭院'],
      jp: ['校园初恋', '自然季节', '海与风'],
      kr: ['首尔日常', '心动瞬间', 'K-pop舞台'],
      ny: ['街头随性', '都市地标', '时装周'],
      ca: ['阳光海岸', '加州日常', '公路旅行'],
      bikini: ['冲绳海岸', '湘南海岸', '伊豆热海'],
    };
    const tList = themesByStyle[randomStyle] || ['海风漫游'];
    const theme = tList[Math.floor(Math.random() * tList.length)];
    const payload = {
      style: randomStyle,
      theme,
      beautyType: pick('beauty'),
      outfit: pick('outfit'),
      location: pick('scene'),
      composition: pick('composition'),
      lighting: pick('lighting'),
      focalLength: ['85mm','50mm','35mm','28mm'][Math.floor(Math.random()*4)],
      filmTone: pick('film'),
      aspectRatio: ['3:4','16:9','1:1','9:16'][Math.floor(Math.random()*4)],
      customKeywords: '',
    };
    try {
      const res = await fetch('/api/generate-prompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.status === 429) throw new Error('rate-limited');
      if (data.success && data.data) {
        setCustomPrompts((prev) => [data.data, ...prev]);
        showToast(t(lang, 'toastBlindBoxOpened', { style: zh ? STYLE_META[randomStyle].label : STYLE_META[randomStyle].shortLabel, theme: themeName(lang, theme) }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else throw new Error();
    } catch (error: any) {
      // 离线兜底
      const meta = STYLE_META[randomStyle];
      const zhPrompt = `${payload.composition}，${payload.location}，${payload.beautyType}身姿自然舒展，神态清透从容。她身穿${payload.outfit}，${payload.lighting}，呈现${payload.filmTone}胶片感。`;
      const en = `Cinematic ${meta.enLabel} ${payload.composition}, ${payload.beautyType} at ${payload.location}, ${payload.lighting}`;
      const fallback: PhotobookPrompt = { id: `blind-${Date.now()}`, index: 99, title: zh ? `盲盒·${meta.label}·${theme}` : `Blind Box · ${meta.shortLabel} · ${themeName(lang, theme)}`, theme, style: randomStyle, styleLabel: meta.label, beautyType: payload.beautyType, outfit: payload.outfit, location: payload.location, composition: payload.composition, lighting: payload.lighting, focalLength: payload.focalLength, filmTone: payload.filmTone, aspectRatio: payload.aspectRatio, tags: [meta.label, theme, '盲盒'], promptZh: zhPrompt, promptEn: en };
      setCustomPrompts((prev) => [fallback, ...prev]);
      showToast(error?.message === 'rate-limited'
        ? t(lang, 'toastBlindBoxOfflineRate')
        : t(lang, 'toastBlindBoxOffline', { style: zh ? meta.label : meta.shortLabel, theme: themeName(lang, theme) }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsBlindBoxLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-[#e5e5e5] selection:bg-[#d4af37]/30 selection:text-[#ffffff]">
      {/* Navigation Header */}
      <Header
        filters={filters}
        onFilterChange={handleFilterChange}
        onOpenGenerator={() => {
          setSelectedPresetForGenerator(null);
          setGeneratorInitialPrompt(null);
          setIsGeneratorOpen(true);
        }}
        onOpenPresetLibrary={() => setIsPresetLibraryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
        totalCount={prompts.length}
        filteredCount={filteredPrompts.length}
        favoritesCount={favorites.length}
        lang={lang}
        onLangChange={setLang}
      />

      {/* Main Showcase Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Curatorial Brief Bar with Elegant Dark Gold Accents */}
        <div className="bg-[#0f0f0f] rounded-2xl border border-[#222222] p-5 sm:p-6 mb-6 sm:mb-8 shadow-2xl relative overflow-hidden">
          {/* Subtle gold ambient light */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          {/* Gold subtle corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#d4af37]/40"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#d4af37]/40"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-cinzel text-xs font-bold tracking-[0.2em] uppercase" style={{ color: activeStyleMeta?.accent || '#d4af37' }}>
                  Editorial Directive · {activeStyleMeta ? activeStyleMeta.enLabel : 'GLOBAL STUDIO'}
                </span>
                <span className="text-[#333333]">|</span>
                <span className="text-xs text-[#888888] font-serif-hk">{activeStyleMeta ? (zh ? activeStyleMeta.tagline : activeStyleMeta.taglineEn) : zh ? '六大风格矩阵 · 港系 / 日系 / 韩系 / 纽约 / 加州 / 比基尼' : 'Six-style matrix · HK / JP / KR / NY / CA / Bikini'}</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold font-serif-hk text-white tracking-wide">
                {activeStyleMeta
                  ? zh
                    ? `《${activeStyleMeta.label}》夏季特辑 · ${activeStyleMeta.description}`
                    : `"${activeStyleMeta.shortLabel}" Summer Issue · ${activeStyleMeta.descriptionEn}`
                  : zh
                    ? '全球风格写真矩阵 · 92组精选生图词库'
                    : 'Global Style Photobook Matrix · 92 curated prompt collections'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#aaaaaa] font-serif-hk leading-relaxed">
                {zh ? (
                  <>
                    全套提示词严格遵循视觉总监规范：<strong style={{ color: activeStyleMeta?.accent || '#d4af37' }}>彻底严禁男友视角、偷吃恶作剧及机械摆拍</strong>；
                    格式为<strong className="text-[#e5e5e5]">纯净连贯的自然语言长段落（无任何加号与方括号）</strong>，
                    {activeStyleMeta ? `当前风格：${activeStyleMeta.label} · ${activeStyleMeta.tagline}` : '支持六风格一键切换，每种风格独立语汇库与场景库'}。
                  </>
                ) : (
                  <>
                    Every prompt follows the visual director's rules: <strong style={{ color: activeStyleMeta?.accent || '#d4af37' }}>no boyfriend-POV, no prank gimmicks, no mechanical posing</strong>;
                    format is a <strong className="text-[#e5e5e5]">pure coherent natural-language paragraph (no plus signs or brackets)</strong>,
                    {activeStyleMeta ? ` current style: ${activeStyleMeta.shortLabel} · ${activeStyleMeta.taglineEn}` : 'one-click switching across six styles, each with its own vocabulary and location library'}.
                  </>
                )}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 w-full lg:w-auto">
              <div className="bg-[#141414] p-3 rounded-xl border border-[#242424] text-center hover:border-[#d4af37]/30 transition-colors">
                <div className="font-cinzel text-xl sm:text-2xl font-bold text-white">{filteredPrompts.length}</div>
                <div className="text-[11px] text-[#888888] font-serif-hk mt-0.5">{zh ? '当前筛选' : 'Filtered'}</div>
              </div>
              <div className="bg-[#141414] p-3 rounded-xl border border-[#242424] text-center hover:border-[#d4af37]/30 transition-colors">
                <div className="font-cinzel text-xl sm:text-2xl font-bold text-white">{prompts.length}</div>
                <div className="text-[11px] text-[#888888] font-serif-hk mt-0.5">{zh ? '全库总数' : 'Total library'}</div>
              </div>
              <div className="bg-[#141414] p-3 rounded-xl border border-[#242424] text-center hover:border-[#d4af37]/30 transition-colors">
                <div className="font-cinzel text-xl sm:text-2xl font-bold" style={{ color: activeStyleMeta?.accent || '#d4af37' }}>6</div>
                <div className="text-[11px] text-[#888888] font-serif-hk mt-0.5">{zh ? '风格体系' : 'Style systems'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Header and Active Filter Pill */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <h3 className="font-serif-hk font-bold text-[#e5e5e5] text-sm sm:text-base tracking-wide">
              {zh ? '写真集画报一览' : 'Lookbook overview'}
            </h3>
            <span className="text-xs bg-[#1a1a1a] text-[#d4af37] border border-[#2a2a2a] px-2.5 py-0.5 rounded-full font-mono">
              {filteredPrompts.length} / {prompts.length}
            </span>
            <span className="hidden sm:inline text-[11px] text-[#666666]">· {zh ? `${prompts.length} 组 · Skill 强控 · 单段无括号` : `${prompts.length} collections · SkillGuard enforced · single paragraph, no brackets`}</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleGlobalBlindBox}
              disabled={isBlindBoxLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-black text-xs sm:text-sm font-black shadow-lg border transition-all active:scale-95 disabled:opacity-60"
              style={{ background: activeStyleMeta?.accent || '#d4af37', borderColor: activeStyleMeta?.accent || '#d4af37' }}
              title={zh ? '随机组合风格、镜头和场景，瞬间生成灵感卡片' : 'Randomly combine style, lens and location for an instant inspiration card'}
            >
              <Shuffle className={`w-4 h-4 ${isBlindBoxLoading ? 'animate-spin' : ''}`} />
              <span>{isBlindBoxLoading ? (zh ? '盲盒开箱中...' : 'Opening blind box...') : (zh ? '🎲 随机盲盒' : '🎲 Random blind box')}</span>
              <span className="hidden sm:inline text-[10px] bg-black/15 px-1.5 py-0.5 rounded-full">{zh ? '一键灵感' : 'Instant idea'}</span>
            </button>

          {(filters.style || filters.theme || filters.search || filters.favoritesOnly) && (
            <button
              onClick={() => setFilters({ style: '', theme: '', search: '', favoritesOnly: false })}
              className="text-xs hover:underline font-serif-hk transition-colors"
              style={{ color: activeStyleMeta?.accent || '#d4af37' }}
            >
              {zh ? '清空全部筛选条件' : 'Clear all filters'}
            </button>
          )}
          </div>
        </div>

        {/* Grid of Prompt Cards */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                isFavorite={favorites.includes(prompt.id)}
                onToggleFavorite={handleToggleFavorite}
                onUseInGenerator={handleUseInGenerator}
                onShowToast={showToast}
                lang={lang}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-[#0f0f0f] rounded-2xl border border-dashed border-[#333333] p-12 text-center my-8">
            <Camera className="w-12 h-12 text-[#555555] mx-auto mb-3" />
            <h4 className="text-base font-bold text-white font-serif-hk">{zh ? '未找到匹配的写真提示词' : 'No matching photobook prompts found'}</h4>
            <p className="text-xs text-[#888888] font-serif-hk mt-1 max-w-md mx-auto">
              {zh ? '尝试更换搜索关键词，或使用 AI 灵感工作台定制专属的夏日写真组合。' : 'Try a different search keyword, or customize your own summer shot combination in the AI Studio.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => setFilters({ style: '', theme: '', search: '', favoritesOnly: false })}
                className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-[#cccccc] text-xs font-medium border border-[#333333] hover:bg-[#252525] transition-all"
              >
                {zh ? '重置筛选' : 'Reset filters'}
              </button>
              <button
                onClick={() => {
                  setGeneratorInitialPrompt(null);
                  setIsGeneratorOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-[#d4af37] text-black text-xs font-bold hover:bg-[#c4a030] transition-all"
              >
                {zh ? '前往 AI 工作台定制' : 'Open AI Studio to customize'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Scroll-to-Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-[#141414] hover:bg-[#222222] text-[#d4af37] hover:text-white shadow-xl border border-[#2a2a2a] hover:border-[#d4af37] transition-all active:scale-95 backdrop-blur-xs"
        title={zh ? '返回顶部' : 'Back to top'}
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Footer */}
      <footer className="w-full bg-[#000000] text-[#666666] text-xs py-8 border-t border-[#222222] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-cinzel text-lg font-bold text-[#d4af37] tracking-widest uppercase">
              VOGUE HONG KONG
            </span>
            <span className="text-[#333333]">|</span>
            <span className="font-serif-hk text-[#aaaaaa]">{zh ? '港姐夏日写真集 视觉总监策划专案' : 'Summer Photobook · Visual Director Edition'}</span>
          </div>

          <p className="text-[#666666] font-serif-hk text-center md:text-right">
            {zh
              ? `${prompts.length} 组纯净中文自然语言 AI 生图词 · 适配 Midjourney v6 / FLUX / SDXL / 剪映`
              : `${prompts.length} clean natural-language AI prompts · works with Midjourney v6 / FLUX / SDXL / CapCut`}
          </p>
        </div>
      </footer>

      {/* Modals */}
      <PresetLibraryModal
        isOpen={isPresetLibraryOpen}
        onClose={() => setIsPresetLibraryOpen(false)}
        onSelectPresetForGenerator={handleSelectPresetForGenerator}
        onShowToast={showToast}
        activeStyle={filters.style || undefined}
        lang={lang}
      />

      <PromptGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        initialPreset={selectedPresetForGenerator}
        initialPrompt={generatorInitialPrompt}
        onSavePrompt={handleSaveCustomPrompt}
        onShowToast={showToast}
        initialStyle={(filters.style as any) || undefined}
        lang={lang}
      />

      <BatchExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        prompts={prompts}
        favorites={favorites}
        onShowToast={showToast}
        lang={lang}
      />

      <DirectorGuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
        lang={lang}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
