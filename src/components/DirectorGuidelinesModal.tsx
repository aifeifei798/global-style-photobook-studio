import React from 'react';
import { X, ShieldAlert, Sparkles, CheckCircle2, XCircle, Camera, Award } from 'lucide-react';
import { Lang } from '../i18n';

interface DirectorGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
}

export const DirectorGuidelinesModal: React.FC<DirectorGuidelinesModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const zh = lang === 'zh';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111111] rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl border border-[#2a2a2a] flex flex-col overflow-hidden text-[#e5e5e5]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#222222] flex items-center justify-between bg-[#0a0a0a]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-cinzel font-bold text-[#d4af37] bg-[#d4af37]/15 px-2.5 py-0.5 rounded border border-[#d4af37]/40 tracking-wider">
                EDITORIAL MANIFESTO · 6 STYLES
              </span>
              <h2 className="text-xl font-bold font-serif-hk text-white">
                {zh ? '全球风格矩阵 · 视觉总监策划红线与美学定调' : 'Global Style Matrix · Editorial Red Lines & Aesthetic Tone'}
              </h2>
            </div>
            <p className="text-xs text-[#888888] font-serif-hk mt-1">
              {zh ? '港系 / 日系 / 韩系 / 纽约 / 加州 / 比基尼特辑 · 六风格统一红线，分风格差异化执行' : 'HK / JP / KR / NY / CA / Bikini · one shared set of red lines, style-specific execution'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#666666] hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-[#cccccc] text-xs sm:text-sm font-serif-hk leading-relaxed">
          {/* Section 1: Core Aesthetic */}
          <div className="bg-[#181818] p-4 rounded-xl border border-[#2c2c2c]">
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2 font-serif-hk">
              <Award className="w-4 h-4 text-[#d4af37]" />
              <span>{zh ? '一、六风格定调矩阵 (Global Style Matrix)' : '1. Six-Style Tone Matrix (Global Style Matrix)'}</span>
            </h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a]"><strong className="text-[#d4af37]">🇭🇰 {zh ? '港系' : 'HK'}</strong><span className="text-[#a8a8a8] ml-1">{zh ? '清冷微甜·氧气感·港片褪色暖调' : 'Cool yet sweet · airy oxygen · faded HK-film warmth'}</span></div>
              <div className="p-2.5 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a]"><strong className="text-[#f0a6b5]">🇯🇵 {zh ? '日系' : 'JP'}</strong><span className="text-[#a8a8a8] ml-1">{zh ? '温柔青涩·棉花糖氧气感·柔焦奶油散景' : 'Gentle & fresh · marshmallow airiness · soft-focus cream bokeh'}</span></div>
              <div className="p-2.5 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a]"><strong className="text-[#8ecae6]">🇰🇷 {zh ? '韩系' : 'KR'}</strong><span className="text-[#a8a8a8] ml-1">{zh ? '氛围感·MZ冷调·心动的眼泪感·赛璐璐光泽' : 'Mood-driven · MZ cool tones · tearful romance · cel-shaded glow'}</span></div>
              <div className="p-2.5 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a]"><strong className="text-[#ff595e]">🇺🇸 {zh ? '纽约' : 'NY'}</strong><span className="text-[#a8a8a8] ml-1">{zh ? '美式自信·街头随性·高对比时装调' : 'American confidence · street ease · high-contrast fashion tones'}</span></div>
              <div className="p-2.5 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a]"><strong className="text-[#ffb703]">🌴 {zh ? '加州' : 'CA'}</strong><span className="text-[#a8a8a8] ml-1">{zh ? '阳光灿烂·邻家真实·小麦肌·高饱和琥珀光' : 'Sun-drenched · next-door authenticity · tan skin · saturated amber light'}</span></div>
              <div className="p-2.5 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a]"><strong className="text-[#ff8fab]">👙 {zh ? '比基尼' : 'Bikini'}</strong><span className="text-[#a8a8a8] ml-1">{zh ? '日系夏日女友·四要素(颜色/款式/材质/海岸线)必含' : 'JP summer girlfriend · must include color, cut, fabric, coastline'}</span></div>
            </div>
            <p className="mt-2 text-[#666666] text-[11px]">
              {zh ? '摄影机位不局限本地，但每种风格严格遵循对应 skill 语汇库与场景库。' : 'Camera locations are not limited to one place, but every style strictly follows its own skill vocabulary and scene library.'}
            </p>
          </div>

          {/* Section 2: Strict Prohibitions */}
          <div className="bg-[#1f1010] p-4 rounded-xl border border-[#3e1b1b] space-y-3">
            <h3 className="font-bold text-rose-300 text-sm sm:text-base flex items-center gap-2 font-serif-hk">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>{zh ? '二、彻底严禁的创作红线 (Strict Prohibitions)' : '2. Strictly Forbidden Red Lines (Strict Prohibitions)'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-start gap-2 bg-[#140b0b] p-2.5 rounded-lg border border-[#341616]">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-[#d09e9e]">
                  <strong className="text-rose-200">{zh ? '严禁低幼尴尬剧情：' : 'No cringe juvenile storylines:'}</strong> {zh ? '严禁出现“男友视角”、“偷拍视角”、“恶作剧”、“偷吃”等情节。' : 'No “boyfriend POV”, “secret snapshot”, “prank”, or “sneaking food” plots.'}
                </span>
              </div>
              <div className="flex items-start gap-2 bg-[#140b0b] p-2.5 rounded-lg border border-[#341616]">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-[#d09e9e]">
                  <strong className="text-rose-200">{zh ? '严禁机械死板摆拍：' : 'No stiff mechanical posing:'}</strong> {zh ? '严禁“标准职业微笑”、“双手叉腰站立”、“剪刀手”等僵硬动作。' : 'No “standard professional smile”, “hands-on-hips standing”, or “peace-sign” gestures.'}
                </span>
              </div>
              <div className="flex items-start gap-2 bg-[#140b0b] p-2.5 rounded-lg border border-[#341616] sm:col-span-2">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="text-[#d09e9e]">
                  <strong className="text-rose-200">{zh ? '严禁符号拼接与方括号：' : 'No symbol stitching or brackets:'}</strong> {zh ? '严禁在提示词中输出任何方括号“[]”或加号“+”，必须是一整段连贯、优美、可以直接复制给 AI 生图软件的自然语言描述。' : 'Never output brackets “[]” or plus signs “+” in a prompt — it must be one coherent, beautiful natural-language paragraph you can paste straight into an image generator.'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Executing Excellence */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2 font-serif-hk">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{zh ? '三、五大维度美学标准 (5 Pillars of Excellence)' : '3. Five Dimensions of Aesthetic Standards (5 Pillars of Excellence)'}</span>
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 bg-[#151515] rounded-lg border border-[#242424]">
                <strong className="text-white">{zh ? '1. 容颜与动态：' : '1. Face & movement:'}</strong>
                <span className="text-[#aaaaaa] ml-1">
                  {zh ? '动作自然舒展（如海风抚发、侧首凝望海平面、台阶闲坐、漫步回眸）；神态清透高级、呼吸感强。' : 'Natural, relaxed gestures (sea breeze through hair, turning to gaze at the horizon, sitting on steps, glancing back while walking); clear, refined expression with a strong sense of breath.'}
                </span>
              </div>
              <div className="p-3 bg-[#151515] rounded-lg border border-[#242424]">
                <strong className="text-white">{zh ? '2. 穿搭面料细节：' : '2. Fabric & garment detail:'}</strong>
                <span className="text-[#aaaaaa] ml-1">
                  {zh ? '明确标注高级面料质感（19姆米桑蚕丝、高支水洗亚麻、双绉真丝、香云纱、素绉缎等）与立体剪裁细节（削肩、大露背、荡领、深V法式裹身）。' : 'Name premium fabrics (19-momme mulberry silk, high-count washed linen, crepe silk, gauze silk, satin crepe) and sculptural cuts (sliced shoulders, deep open backs, draped cowl necks, deep-V French wrap).'}
                </span>
              </div>
              <div className="p-3 bg-[#151515] rounded-lg border border-[#242424]">
                <strong className="text-white">{zh ? '3. 构图与镜头焦段：' : '3. Composition & focal length:'}</strong>
                <span className="text-[#aaaaaa] ml-1">
                  {zh ? '选用 85mm f/1.4 大光圈清透特写、50mm 标准定焦人文视角、35mm 经典电影抓拍、24mm 广角海天壮阔画幅。' : 'Use 85mm f/1.4 clear wide-aperture close-ups, 50mm standard humanistic framing, 35mm classic film snapshots, and 24mm wide sea-and-sky panoramas.'}
                </span>
              </div>
              <div className="p-3 bg-[#151515] rounded-lg border border-[#242424]">
                <strong className="text-white">{zh ? '4. 胶片影调与光影互动：' : '4. Film tone & light play:'}</strong>
                <span className="text-[#aaaaaa] ml-1">
                  {zh ? '融入柯达 Portra 400 暖调微颗粒、富士 Provia 100F 通透蓝绿调、哈苏中画幅温润感，结合落日熔金逆光与丁达尔光斑。' : 'Blend Kodak Portra 400 warm fine grain, Fujifilm Provia 100F transparent blue-green tones, and Hasselblad medium-format warmth, with molten-gold sunset backlight and Tyndall light shafts.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#222222] bg-[#0a0a0a] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#d4af37] text-black hover:bg-[#c4a030] text-xs font-bold transition-all shadow-md"
          >
            {zh ? '我已熟知总监准则' : 'I know the director rules'}
          </button>
        </div>
      </div>
    </div>
  );
};
