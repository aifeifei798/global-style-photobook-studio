import React, { useState } from 'react';
import { Copy, Check, Star, Sparkles, ChevronDown, ChevronUp, Share2, Compass, Film, Eye, Sparkle } from 'lucide-react';
import { PhotobookPrompt, StyleId } from '../types';
import { STYLE_META } from '../data/styleConfig';

interface PromptCardProps {
  prompt: PhotobookPrompt;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onUseInGenerator: (prompt: PhotobookPrompt) => void;
  onShowToast: (msg: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  isFavorite,
  onToggleFavorite,
  onUseInGenerator,
  onShowToast,
}) => {
  const [copiedZh, setCopiedZh] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'zh' | 'en'>('zh');

  const styleMeta = prompt.style ? STYLE_META[prompt.style as StyleId] : null;
  const accent = styleMeta?.accent || '#d4af37';

  const copyToClipboard = async (text: string, lang: 'zh' | 'en') => {
    try {
      await navigator.clipboard.writeText(text);
      if (lang === 'zh') {
        setCopiedZh(true);
        setTimeout(() => setCopiedZh(false), 2000);
        onShowToast(`已复制「${prompt.title}」中文提示词 (无方括号/加号，纯净可直接生图)`);
      } else {
        setCopiedEn(true);
        setTimeout(() => setCopiedEn(false), 2000);
        onShowToast(`已复制「${prompt.title}」Midjourney/FLUX 英文提示词`);
      }
    } catch (e) {
      onShowToast('复制失败，请手动选择文字');
    }
  };

  return (
    <article
      id={`prompt-card-${prompt.id}`}
      className="bg-[#111111] rounded-xl border border-[#222222] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
      style={{ borderColor: undefined }}
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
                {styleMeta.icon} {styleMeta.label}
              </span>
            )}
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#1c1c1c] text-[#cccccc] border border-[#292929]">
              {prompt.theme}
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
                title={isFavorite ? '取消收藏' : '加入收藏'}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} style={isFavorite ? { fill: accent, color: accent } : {}} />
              </button>
            <button
              onClick={() => onUseInGenerator(prompt)}
              className="p-1.5 rounded-lg text-[#666666] hover:text-[#d4af37] hover:bg-[#1c1c1c] transition-colors"
              title="载入AI灵感工作台定制修改"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif-hk text-lg font-bold text-white mt-2 tracking-wide transition-colors group-hover:opacity-90" style={{ }}>
          {prompt.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {prompt.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 rounded-full bg-[#181818] text-[#888888] border border-[#262626]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Prompt Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        {/* Language Tabs */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 bg-[#181818] p-0.5 rounded-md text-xs border border-[#242424]">
            <button
              onClick={() => setActiveTab('zh')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                activeTab === 'zh'
                  ? 'bg-[#262626] text-[#d4af37] shadow-xs'
                  : 'text-[#777777] hover:text-[#cccccc]'
              }`}
            >
              中文自然语言 (纯净无加号)
            </button>
            <button
              onClick={() => setActiveTab('en')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                activeTab === 'en'
                  ? 'bg-[#262626] text-[#d4af37] shadow-xs'
                  : 'text-[#777777] hover:text-[#cccccc]'
              }`}
            >
              English (MJ/FLUX)
            </button>
          </div>

          <span className="text-[10px] text-[#666666] tracking-wider font-mono">
            {activeTab === 'zh' ? `${prompt.promptZh.length} 字` : `${prompt.promptEn.split(' ').length} words`}
          </span>
        </div>

        {/* Prompt Content Container */}
        <div className="relative bg-[#0a0a0a] rounded-lg p-3.5 border border-[#222222] text-[#cccccc] text-xs sm:text-sm leading-relaxed font-serif-hk">
          {activeTab === 'zh' ? (
            <p className="line-clamp-6 select-text text-[#d4d4d4]">{prompt.promptZh}</p>
          ) : (
            <p className="line-clamp-6 select-text font-sans text-xs text-[#b8b8b8] leading-normal">
              {prompt.promptEn}
            </p>
          )}
        </div>

        {/* Expanded Metadata Details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-[#222222] text-xs space-y-1.5 bg-[#0d0d0d] p-3 rounded-lg border border-[#1f1f1f] animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#888888]">
              <div>
                <span className="text-[#666666] font-medium">容颜神态：</span>
                <span className="text-[#cccccc] font-serif-hk">{prompt.beautyType}</span>
              </div>
              <div>
                <span className="text-[#666666] font-medium">高定穿搭：</span>
                <span className="text-[#cccccc] font-serif-hk">{prompt.outfit}</span>
              </div>
              <div>
                <span className="text-[#666666] font-medium">拍摄场景：</span>
                <span className="text-[#cccccc] font-serif-hk">{prompt.location}</span>
              </div>
              <div>
                <span className="text-[#666666] font-medium">构图光影：</span>
                <span className="text-[#cccccc] font-serif-hk">{prompt.composition}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#666666] font-medium">胶片质感：</span>
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
              <span>收起维度</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>展开维度分解</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        <div className="flex items-center gap-1.5">
          {activeTab === 'zh' ? (
            <button
              onClick={() => copyToClipboard(prompt.promptZh, 'zh')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-black text-xs font-bold transition-all active:scale-98 shadow-md"
              style={{ background: accent }}
            >
              {copiedZh ? <Check className="w-3.5 h-3.5 text-black font-bold" /> : <Copy className="w-3.5 h-3.5 text-black" />}
              <span>{copiedZh ? '已复制中文' : '复制中文生图词'}</span>
            </button>
          ) : (
            <button
              onClick={() => copyToClipboard(prompt.promptEn, 'en')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-black text-xs font-bold transition-all active:scale-98 shadow-md"
              style={{ background: accent }}
            >
              {copiedEn ? <Check className="w-3.5 h-3.5 text-black font-bold" /> : <Copy className="w-3.5 h-3.5 text-black" />}
              <span>{copiedEn ? 'Copied' : 'Copy English'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
