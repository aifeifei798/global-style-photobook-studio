import React, { useState, useEffect, useMemo } from 'react';
import { X, Sparkles, Dices, Copy, Check, Save, Loader2 } from 'lucide-react';
import { ALL_PRESETS } from '../data/presetsData';
import { PhotobookPrompt, PresetItem, StyleId } from '../types';
import { STYLE_META, STYLE_IDS } from '../data/styleConfig';

interface PromptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPreset?: PresetItem | null;
  initialStyle?: StyleId;
  onSavePrompt: (prompt: PhotobookPrompt) => void;
  onShowToast: (msg: string) => void;
}

const THEMES_BY_STYLE: Record<string, string[]> = {
  hk: ['海风漫游', '旧港光影', '绿意庭院', '文艺天星', '法式海岛', '池畔日光'],
  jp: ['校园初恋', '都市日常', '自然季节', '海与风', '樱花物语', '雨后清新'],
  kr: ['首尔日常', '心动瞬间', 'K-pop舞台', '首尔夜', '雨天氛围', '天台自由'],
  ny: ['街头随性', '都市地标', '时装周', '都市夜', '都市日常', '天际线'],
  ca: ['阳光海岸', '加州街头', '加州日常', '海边日常', '公路旅行', '粉色黄昏'],
  bikini: ['冲绳海岸', '湘南海岸', '伊豆热海', '镰仓三浦', '静冈远州', '夏日女友'],
};
const ALL_THEMES = ['海风漫游', '旧港光影', '绿意庭院', '文艺天星', '校园初恋', '首尔日常', '街头随性', '阳光海岸', '冲绳海岸'];

const FOCAL_LENGTHS = ['85mm', '50mm', '35mm', '28mm', '24mm'];
const ASPECT_RATIOS = ['3:4', '16:9', '4:3', '1:1', '9:16'];

export const PromptGeneratorModal: React.FC<PromptGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialPreset,
  initialStyle,
  onSavePrompt,
  onShowToast,
}) => {
  const [style, setStyle] = useState<StyleId>(initialStyle || 'hk');

  const filteredPresets = useMemo(() => ALL_PRESETS.filter((p) => !p.style || p.style === style), [style]);
  const beautyPresets = filteredPresets.filter((p) => p.category === 'beauty');
  const outfitPresets = filteredPresets.filter((p) => p.category === 'outfit');
  const scenePresets = filteredPresets.filter((p) => p.category === 'scene');
  const compositionPresets = filteredPresets.filter((p) => p.category === 'composition');
  const lightingPresets = filteredPresets.filter((p) => p.category === 'lighting');

  const themes = THEMES_BY_STYLE[style] || ALL_THEMES;

  const [theme, setTheme] = useState(themes[0]);
  const [selectedBeauty, setSelectedBeauty] = useState(beautyPresets[0]?.name || '');
  const [selectedOutfit, setSelectedOutfit] = useState(outfitPresets[0]?.name || '');
  const [selectedScene, setSelectedScene] = useState(scenePresets[0]?.name || '');
  const [selectedComposition, setSelectedComposition] = useState(compositionPresets[0]?.name || '');
  const [selectedLighting, setSelectedLighting] = useState(lightingPresets[0]?.name || '');
  const [focalLength, setFocalLength] = useState('85mm');
  const [aspectRatio, setAspectRatio] = useState('3:4');
  const [customKeywords, setCustomKeywords] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<PhotobookPrompt | null>(null);
  const [copiedZh, setCopiedZh] = useState(false);

  useEffect(() => {
    if (initialStyle) setStyle(initialStyle);
  }, [initialStyle]);

  useEffect(() => {
    if (initialPreset) {
      if (initialPreset.style) setStyle(initialPreset.style);
      const cat = initialPreset.category?.toLowerCase();
      if (cat === 'beauty') setSelectedBeauty(initialPreset.name);
      if (cat === 'outfit') setSelectedOutfit(initialPreset.name);
      if (cat === 'scene') setSelectedScene(initialPreset.name);
      if (cat === 'composition') setSelectedComposition(initialPreset.name);
      if (cat === 'lighting') setSelectedLighting(initialPreset.name);
    }
  }, [initialPreset]);

  useEffect(() => {
    // when style changes, reset to first of filtered to avoid invalid selection
    setTheme(themes[0]);
    if (beautyPresets[0]) setSelectedBeauty(beautyPresets[0].name);
    if (outfitPresets[0]) setSelectedOutfit(outfitPresets[0].name);
    if (scenePresets[0]) setSelectedScene(scenePresets[0].name);
    if (compositionPresets[0]) setSelectedComposition(compositionPresets[0].name);
    if (lightingPresets[0]) setSelectedLighting(lightingPresets[0].name);
  }, [style]);

  const activeMeta = STYLE_META[style];

  if (!isOpen) return null;

  const handleRandomize = () => {
    const t = themes[Math.floor(Math.random() * themes.length)];
    const rb = beautyPresets[Math.floor(Math.random() * beautyPresets.length)]?.name || selectedBeauty;
    const ro = outfitPresets[Math.floor(Math.random() * outfitPresets.length)]?.name || selectedOutfit;
    const rs = scenePresets[Math.floor(Math.random() * scenePresets.length)]?.name || selectedScene;
    const rc = compositionPresets[Math.floor(Math.random() * compositionPresets.length)]?.name || selectedComposition;
    const rl = lightingPresets[Math.floor(Math.random() * lightingPresets.length)]?.name || selectedLighting;
    const rf = FOCAL_LENGTHS[Math.floor(Math.random() * FOCAL_LENGTHS.length)];
    setTheme(t); setSelectedBeauty(rb); setSelectedOutfit(ro); setSelectedScene(rs); setSelectedComposition(rc); setSelectedLighting(rl); setFocalLength(rf);
    onShowToast(`🎲 已随机碰撞一套${activeMeta.label}写真组合`);
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style,
          theme,
          beautyType: selectedBeauty,
          outfit: selectedOutfit,
          location: selectedScene,
          composition: selectedComposition,
          lighting: selectedLighting,
          focalLength,
          filmTone: selectedLighting,
          aspectRatio,
          customKeywords,
        }),
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setGeneratedPrompt(resData.data);
        onShowToast(`✨ ${activeMeta.label}视觉总监 AI 创作完成！`);
      } else throw new Error(resData.message || '生成失败');
    } catch (error: any) {
      const fallbackZh = `${selectedComposition}，${selectedScene}，${selectedBeauty}身姿自然舒展，神态清透从容，微风轻拂黑发。她身穿${selectedOutfit}，面料随风飘拂。${selectedLighting}，锁骨与发丝被镀上温润微光，充满${activeMeta.tagline}氛围。`;
      const fallbackEn = `Cinematic ${activeMeta.enLabel} photography, ${selectedComposition}, ${selectedBeauty} at ${selectedScene}, effortless natural posture. Wearing ${selectedOutfit}. ${selectedLighting}, high-fashion film grain, pure oxygen mood.`;
      const fallbackPrompt: PhotobookPrompt = {
        id: `custom-${Date.now()}`, index: 99, title: `定制·${theme}夏日写真`, theme, style, styleLabel: activeMeta.label, beautyType: selectedBeauty, outfit: selectedOutfit, location: selectedScene, composition: selectedComposition, lighting: selectedLighting, focalLength, filmTone: selectedLighting, aspectRatio, tags: [theme, activeMeta.label, '高定写真'], promptZh: fallbackZh, promptEn: fallbackEn,
      };
      setGeneratedPrompt(fallbackPrompt);
      onShowToast('已基于高定矩阵生成写真提示词');
    } finally { setIsLoading(false); }
  };

  const handleCopyZh = () => {
    if (generatedPrompt) { navigator.clipboard.writeText(generatedPrompt.promptZh); setCopiedZh(true); setTimeout(()=>setCopiedZh(false),2000); onShowToast('已复制中文提示词 (无方括号/加号)'); }
  };
  const handleSaveToPhotobook = () => { if (generatedPrompt) { onSavePrompt(generatedPrompt); onShowToast(`已将「${generatedPrompt.title}」存入写真集！`); onClose(); } };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111111] rounded-2xl w-full max-w-4xl max-h-[92vh] shadow-2xl border border-[#2a2a2a] flex flex-col overflow-hidden text-[#e5e5e5]">
        <div className="p-4 sm:p-6 border-b border-[#222222] flex items-center justify-between" style={{ background: `${activeMeta.accent}10` }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-cinzel font-bold px-2.5 py-0.5 rounded border tracking-wider" style={{ color: activeMeta.accent, background: `${activeMeta.accent}18`, borderColor: `${activeMeta.accent}60` }}>AI STUDIO DIRECTOR · {activeMeta.enLabel}</span>
              <h2 className="text-xl font-bold font-serif-hk text-white">《{activeMeta.label}》写真总监 AI 灵感工作台</h2>
            </div>
            <p className="text-xs text-[#888888] font-serif-hk mt-1">当前风格：{activeMeta.description} · {activeMeta.tagline} · 自由组合五大维度</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-[#666666] hover:text-white hover:bg-[#1a1a1a]"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          <div className="flex items-center justify-between bg-[#161616] p-3 rounded-xl border border-[#262626]">
            <span className="text-xs text-[#999999] font-serif-hk">💡 严禁男友视角 · 严禁机械摆拍 · 严格无方括号与加号</span>
            <button onClick={handleRandomize} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2c2c2c] text-xs font-medium border border-[#333333] transition-all shadow-xs" style={{ color: activeMeta.accent }}><Dices className="w-3.5 h-3.5" style={{ color: activeMeta.accent }} /><span>灵感随机碰撞</span></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#cccccc] mb-1.5 font-serif-hk">0. 风格体系</label>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_IDS.map((sid) => {
                  const meta = STYLE_META[sid];
                  const active = style === sid;
                  return <button key={sid} onClick={() => setStyle(sid)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1 ${active ? 'text-black' : 'bg-[#161616] text-[#888888] border-[#2a2a2a] hover:text-white'}`} style={active ? { background: meta.accent, borderColor: meta.accent } : {}}>{meta.icon} {meta.label}</button>;
                })}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#cccccc] mb-1.5 font-serif-hk">1. 写真主题系列</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#e5e5e5] focus:outline-none" style={{ borderColor: `${activeMeta.accent}40` }}>
                {themes.map((t) => <option key={t} value={t} className="bg-[#1a1a1a] text-white">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#cccccc] mb-1.5 font-serif-hk">2. 容颜神态与气质 ({beautyPresets.length} 预设)</label>
              <select value={selectedBeauty} onChange={(e) => setSelectedBeauty(e.target.value)} className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#e5e5e5] focus:outline-none">
                {beautyPresets.map((p) => <option key={p.id} value={p.name} className="bg-[#1a1a1a] text-white">{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#cccccc] mb-1.5 font-serif-hk">3. 高定穿搭与面料 ({outfitPresets.length} 预设)</label>
              <select value={selectedOutfit} onChange={(e) => setSelectedOutfit(e.target.value)} className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#e5e5e5] focus:outline-none">
                {outfitPresets.map((p) => <option key={p.id} value={p.name} className="bg-[#1a1a1a] text-white">{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#cccccc] mb-1.5 font-serif-hk">4. 拍摄取景与地标 ({scenePresets.length} 预设)</label>
              <select value={selectedScene} onChange={(e) => setSelectedScene(e.target.value)} className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#e5e5e5] focus:outline-none">
                {scenePresets.map((p) => <option key={p.id} value={p.name} className="bg-[#1a1a1a] text-white">{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#cccccc] mb-1.5 font-serif-hk">5. 构图景别与透视 ({compositionPresets.length} 预设)</label>
              <select value={selectedComposition} onChange={(e) => setSelectedComposition(e.target.value)} className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#e5e5e5] focus:outline-none">
                {compositionPresets.map((p) => <option key={p.id} value={p.name} className="bg-[#1a1a1a] text-white">{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#cccccc] mb-1.5 font-serif-hk">6. 光影氛围与胶片影调 ({lightingPresets.length} 预设)</label>
              <select value={selectedLighting} onChange={(e) => setSelectedLighting(e.target.value)} className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#e5e5e5] focus:outline-none">
                {lightingPresets.map((p) => <option key={p.id} value={p.name} className="bg-[#1a1a1a] text-white">{p.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-xs font-semibold text-[#cccccc] mb-1.5 font-serif-hk">镜头焦段</label><select value={focalLength} onChange={(e) => setFocalLength(e.target.value)} className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#e5e5e5]">{FOCAL_LENGTHS.map((f) => <option key={f} value={f} className="bg-[#1a1a1a] text-white">{f}</option>)}</select></div>
              <div><label className="block text-xs font-semibold text-[#cccccc] mb-1.5 font-serif-hk">生图画幅比例</label><select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#e5e5e5]">{ASPECT_RATIOS.map((ar) => <option key={ar} value={ar} className="bg-[#1a1a1a] text-white">{ar}</option>)}</select></div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#cccccc] mb-1.5 font-serif-hk">附加个性化细节 (可选)</label>
              <input type="text" placeholder={style==='bikini' ? '例如：薄荷绿蕾丝边系带、冲绳青之洞窟礁石、珍珠白荷叶边...' : '例如：发丝沾着微细水珠、手中握着青椰、落日晚霞染红海面...'} value={customKeywords} onChange={(e) => setCustomKeywords(e.target.value)} className="w-full bg-[#161616] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#e5e5e5] placeholder:text-[#666666] focus:outline-none" />
            </div>
          </div>

          <div className="pt-2">
            <button id="btn-trigger-ai-generation" onClick={handleGenerate} disabled={isLoading} className="w-full py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 active:scale-99" style={{ background: activeMeta.accent, color: '#000' }}>
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /><span>视觉总监 AI 正在构思{activeMeta.label}提示词...</span></> : <><Sparkles className="w-5 h-5" /><span>生成{activeMeta.label}高定写真提示词 (纯净无加号)</span></>}
            </button>
          </div>

          {generatedPrompt && (
            <div className="mt-4 p-4 sm:p-5 bg-[#0a0a0a] rounded-xl border border-[#282828] shadow-lg space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between"><span className="font-serif-hk font-bold text-white text-base">{generatedPrompt.title}</span><span className="text-xs px-2.5 py-0.5 rounded font-medium border" style={{ background: `${activeMeta.accent}18`, color: activeMeta.accent, borderColor: `${activeMeta.accent}60` }}>{generatedPrompt.theme} · {generatedPrompt.styleLabel || activeMeta.label}</span></div>
              {(generatedPrompt as any).skill && (
                <div className="flex items-center justify-between text-[11px] bg-[#141414] px-2.5 py-1.5 rounded-lg border border-[#222222]">
                  <span className="text-[#888888]">Skill 控制：<span className="text-[#cccccc]">{(generatedPrompt as any).skill}</span></span>
                  {(generatedPrompt as any).skillValid === false ? <span className="text-rose-400">⚠ {((generatedPrompt as any).skillErrors || []).slice(0,2).join('；')}</span> : <span className="text-emerald-400">✓ Skill 自检通过 · 单段无括号加号{ (generatedPrompt as any).style === 'bikini' ? ' · 四要素齐全' : ''}</span>}
                </div>
              )}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-[#888888]"><span>中文连贯自然语言 (可直接贴入生图软件)</span><button onClick={handleCopyZh} className="font-medium inline-flex items-center gap-1" style={{ color: activeMeta.accent }}>{copiedZh ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}<span>{copiedZh ? '已复制' : '一键复制'}</span></button></div>
                <div className="p-3 bg-[#141414] rounded-lg text-xs sm:text-sm text-[#d4d4d4] font-serif-hk leading-relaxed border border-[#222222] select-text">{generatedPrompt.promptZh}</div>
              </div>
              <div className="space-y-1"><span className="text-xs text-[#888888]">Midjourney / FLUX 英文提示词</span><div className="p-3 bg-[#141414] rounded-lg text-xs text-[#a0a0a0] leading-relaxed border border-[#222222] select-text font-sans">{generatedPrompt.promptEn}</div></div>
              <div className="pt-2 flex justify-end gap-2"><button onClick={handleSaveToPhotobook} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#222222] hover:bg-[#333333] border text-xs sm:text-sm font-semibold transition-all shadow-xs" style={{ color: activeMeta.accent, borderColor: `${activeMeta.accent}80` }}><Save className="w-4 h-4" /><span>收录至当前写真集</span></button></div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#222222] bg-[#0a0a0a] flex items-center justify-between text-xs text-[#666666]">
          <span>基于 OpenAI {activeMeta.label}视觉总监模型 · {activeMeta.enLabel}</span>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-[#1a1a1a] text-[#cccccc] hover:bg-[#282828] font-medium transition-colors border border-[#333333]">关闭工作台</button>
        </div>
      </div>
    </div>
  );
};
