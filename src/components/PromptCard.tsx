import React, { useState } from 'react';
import { Copy, Check, Star, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { PhotobookPrompt, StyleId } from '../types';
import { STYLE_META } from '../data/styleConfig';
import { formatPrompt, PromptFormat, FORMAT_META } from '../utils/formatPrompt';
import { Lang, t, themeName } from '../i18n';
import { promptTitle, localizeTag } from '../data/localized';

interface PromptCardProps {
  prompt: PhotobookPrompt;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onUseInGenerator: (prompt: PhotobookPrompt) => void;
  onShowToast: (msg: string) => void;
  lang: Lang;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  isFavorite,
  onToggleFavorite,
  onUseInGenerator,
  onShowToast,
  lang,
}) => {
  const [copied, setCopied] = useState<PromptFormat | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [format, setFormat] = useState<PromptFormat>(lang === 'en' ? 'en' : 'flux');

  const styleMeta = prompt.style ? STYLE_META[prompt.style as StyleId] : null;
  const accent = styleMeta?.accent || '#d4af37';
  const zh = lang === 'zh';
  // NO.xx badge already shows the number, so strip the "01 · " prefix from the title
  const title = promptTitle(prompt, lang).replace(/^\d+\s·\s?/, '');

  const currentText = formatPrompt(prompt, format);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentText);
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
      const label = FORMAT_META[format].label;
      onShowToast(zh ? `已复制「${title}」· ${label}` : `Copied "${title}" · ${label}`);
    } catch (e) {
      onShowToast(zh ? '复制失败，请手动选择文字' : 'Copy failed, please select the text manually');
    }
  };

  return (
    <article
      id={`prompt-card-${prompt.id}`}
      className="bg-[#111111] rounded-xl border border-[#222222] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}60`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#222222'; }}
    >
      {/* Top Header info */}
      <div className="p-4 sm:p-5 pb-3 border-b border-[#1c1c1c]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-cinzel text-xs font-bold px-2.5 py-0.5 rounded border" style={{ color: accent, background: `${accent}15`, borderColor: `${accent}40` }}>
              NO.{prompt.index < 10 ? `0${prompt.index}` : prompt.index}
            </span>
            {styleMeta && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-black" style={{ background: accent }}>
                {styleMeta.icon} {zh ? styleMeta.label : styleMeta.shortLabel}
              </span>
            )}
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#1c1c1c] text-[#cccccc] border border-[#292929]">
              {zh ? prompt.theme : themeName(lang, prompt.theme)}
            </span>
            <span className="text-xs font-serif-hk text-[#777777] hidden sm:inline">
              {prompt.focalLength} · {prompt.aspectRatio}
            </span>
          </div>

          {/* Favorite & Action */}
          <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleFavorite(prompt.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isFavorite ? 'hover:opacity-80' : 'text-[#666666] hover:text-[#e5e5e5] hover:bg-[#1c1c1c]'
                }`}
                style={isFavorite ? { color: accent, background: `${accent}15` } : {}}
                title={isFavorite ? (zh ? '取消收藏' : 'Remove from favorites') : (zh ? '加入收藏' : 'Add to favorites')}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} style={isFavorite ? { fill: accent, color: accent } : {}} />
              </button>
            <button
              onClick={() => onUseInGenerator(prompt)}
              className="p-1.5 rounded-lg text-[#666666] hover:text-[#d4af37] hover:bg-[#1c1c1c] transition-colors"
              title={zh ? '载入AI灵感工作台定制修改' : 'Load into AI Studio for customization'}
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif-hk text-lg font-bold text-white mt-2 tracking-wide transition-colors group-hover:opacity-90">
          {title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {prompt.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-full bg-[#181818] text-[#888888] border border-[#262626]"
            >
              #{localizeTag(tag, lang)}
            </span>
          ))}
        </div>
      </div>

      {/* Prompt Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {/* Format Switcher */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-1 bg-[#181818] p-0.5 rounded-full text-[11px] border border-[#242424] overflow-x-auto">
            {(['flux','mj','en'] as PromptFormat[]).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-all ${format===f ? 'text-black shadow-xs' : 'text-[#777777] hover:text-[#cccccc]'}`}
                style={format===f ? { background: accent } : {}}
                title={FORMAT_META[f].label}
              >
                {FORMAT_META[f].shortLabel}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-[#666666] tracking-wider font-mono whitespace-nowrap">
            {format==='flux' ? `${prompt.promptZh.length} chars` : format==='mj' ? `--ar ${prompt.aspectRatio} · v6.1` : `${prompt.promptEn.split(' ').length} words`}
          </span>
        </div>

        {/* Prompt Content Container */}
        <div className="relative bg-[#0a0a0a] rounded-lg p-3.5 border border-[#222222] text-[#cccccc] text-xs sm:text-sm leading-relaxed font-serif-hk">
          <p className={`select-text ${format==='en' || format==='mj' ? 'font-sans text-xs text-[#b8b8b8] leading-normal' : 'text-[#d4d4d4]'} line-clamp-6`}>{currentText}</p>
        </div>

        {/* Expanded Metadata Details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-[#222222] text-xs space-y-1.5 bg-[#0d0d0d] p-3 rounded-lg border border-[#1f1f1f] animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#888888]">
              <div>
                <span className="text-[#666666] font-medium">{zh ? '容颜神态：' : 'Expression:'}</span>
                <span className="text-[#cccccc] font-serif-hk">{prompt.beautyType}</span>
              </div>
              <div>
                <span className="text-[#666666] font-medium">{zh ? '高定穿搭：' : 'Outfit:'}</span>
                <span className="text-[#cccccc] font-serif-hk">{prompt.outfit}</span>
              </div>
              <div>
                <span className="text-[#666666] font-medium">{zh ? '拍摄场景：' : 'Location:'}</span>
                <span className="text-[#cccccc] font-serif-hk">{prompt.location}</span>
              </div>
              <div>
                <span className="text-[#666666] font-medium">{zh ? '构图光影：' : 'Composition:'}</span>
                <span className="text-[#cccccc] font-serif-hk">{prompt.composition}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#666666] font-medium">{zh ? '胶片质感：' : 'Film tone:'}</span>
                <span className="text-[#d4af37] font-serif-hk">{prompt.filmTone} ({prompt.focalLength})</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="p-3 sm:px-5 sm:py-3 bg-[#0d0d0d] border-t border-[#1c1c1c] flex items-center justify-between gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-[#888888] hover:text-[#d4af37] inline-flex items-center gap-1 font-medium transition-colors"
        >
          {isExpanded ? (
            <>
              <span>{zh ? '收起维度' : 'Collapse breakdown'}</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>{zh ? '展开维度分解' : 'Expand breakdown'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-black text-xs font-bold transition-all active:scale-98 shadow-md"
            style={{ background: accent }}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-black font-bold" /> : <Copy className="w-3.5 h-3.5 text-black" />}
            <span>{copied ? (zh ? `已复制 ${FORMAT_META[format].shortLabel}` : `Copied ${FORMAT_META[format].shortLabel}`) : (zh ? `复制 ${FORMAT_META[format].shortLabel}` : `Copy ${FORMAT_META[format].shortLabel}`)}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
