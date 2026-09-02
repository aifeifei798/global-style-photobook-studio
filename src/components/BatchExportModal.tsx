import React, { useState } from 'react';
import { X, Download, Copy, Check, FileText, Code, Table } from 'lucide-react';
import { PhotobookPrompt } from '../types';

interface BatchExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: PhotobookPrompt[];
  favorites: string[];
  onShowToast: (msg: string) => void;
}

type ExportScope = 'ALL' | 'FAVORITES' | 'CURRENT';
type ExportFormat = 'TXT_ZH' | 'MARKDOWN' | 'JSON' | 'CSV' | 'TXT_EN';

export const BatchExportModal: React.FC<BatchExportModalProps> = ({
  isOpen,
  onClose,
  prompts,
  favorites,
  onShowToast,
}) => {
  const [scope, setScope] = useState<ExportScope>('ALL');
  const [format, setFormat] = useState<ExportFormat>('TXT_ZH');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const [styleFilter, setStyleFilter] = useState<string>('ALL');

  const targetPrompts = prompts.filter((p) => {
    if (scope === 'FAVORITES' && !favorites.includes(p.id)) return false;
    if (styleFilter !== 'ALL' && p.style !== styleFilter) return false;
    return true;
  });

  const generateExportContent = () => {
    if (format === 'TXT_ZH') {
      return targetPrompts
        .map(
          (p, idx) =>
            `【${p.title}】\n${p.promptZh}\n`
        )
        .join('\n----------------------------------------\n\n');
    }

    if (format === 'TXT_EN') {
      return targetPrompts
        .map((p) => `// ${p.title}\n${p.promptEn}\n`)
        .join('\n\n');
    }

    if (format === 'MARKDOWN') {
      let md = `# 全球风格写真矩阵 AI 生图提示词全集 (${targetPrompts.length}组)\n\n`;
      md += `> 风格矩阵：港系 / 日系 / 韩系 / 纽约 / 加州 / 比基尼特辑 · 纯净无违禁词与加号。\n\n`;

      targetPrompts.forEach((p, idx) => {
        md += `## ${p.title} [${p.styleLabel || p.style}]\n`;
        md += `- **风格**：${p.styleLabel || p.style}\n`;
        md += `- **主题系列**：${p.theme}\n`;
        md += `- **容颜神态**：${p.beautyType}\n`;
        md += `- **高定穿搭**：${p.outfit}\n`;
        md += `- **拍摄取景**：${p.location}\n`;
        md += `- **构图光影**：${p.composition} | ${p.lighting}\n`;
        md += `- **镜头画幅**：${p.focalLength} | ${p.aspectRatio} | ${p.filmTone}\n`;
        md += `\n### 中文提示词 (直接复制生图)\n\`\`\`text\n${p.promptZh}\n\`\`\`\n`;
        md += `\n### English Prompt (Midjourney / FLUX)\n\`\`\`text\n${p.promptEn}\n\`\`\`\n\n---\n\n`;
      });
      return md;
    }

    if (format === 'JSON') {
      return JSON.stringify(targetPrompts, null, 2);
    }

    if (format === 'CSV') {
      const header = '序号,标题,风格,主题,容颜,穿搭,地点,构图,光影,中文生图提示词,英文生图提示词\n';
      const rows = targetPrompts
        .map((p) => {
          const escape = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
          return [
            p.index,
            escape(p.title),
            escape(p.styleLabel || p.style),
            escape(p.theme),
            escape(p.beautyType),
            escape(p.outfit),
            escape(p.location),
            escape(p.composition),
            escape(p.lighting),
            escape(p.promptZh),
            escape(p.promptEn),
          ].join(',');
        })
        .join('\n');
      return header + rows;
    }

    return '';
  };

  const handleCopyAll = () => {
    const text = generateExportContent();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast(`已复制 ${targetPrompts.length} 组写真提示词到剪贴板！`);
  };

  const handleDownloadFile = () => {
    const text = generateExportContent();
    let filename = `Global_Studio_Prompts_${styleFilter}_${targetPrompts.length}`;
    let ext = 'txt';
    let mime = 'text/plain;charset=utf-8';

    if (format === 'MARKDOWN') {
      ext = 'md';
      mime = 'text/markdown;charset=utf-8';
    } else if (format === 'JSON') {
      ext = 'json';
      mime = 'application/json;charset=utf-8';
    } else if (format === 'CSV') {
      ext = 'csv';
      mime = 'text/csv;charset=utf-8';
    }

    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast(`已下载 ${filename}.${ext}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111111] rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl border border-[#2a2a2a] flex flex-col overflow-hidden text-[#e5e5e5]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#222222] flex items-center justify-between bg-[#0a0a0a]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-cinzel font-bold text-[#d4af37] bg-[#d4af37]/15 px-2.5 py-0.5 rounded border border-[#d4af37]/40 tracking-wider">
                BATCH EXPORT
              </span>
              <h2 className="text-xl font-bold font-serif-hk text-white">
                批量导出写真集生图提示词
              </h2>
            </div>
            <p className="text-xs text-[#888888] font-serif-hk mt-1">
              一键打包 50 组纯净连贯中文自然语言生图词，适配 Midjourney, Stable Diffusion, FLUX, 剪映等
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#666666] hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 sm:p-6 space-y-4 border-b border-[#222222] bg-[#0c0c0c]">
          {/* Scope selection */}
          <div>
            <label className="block text-xs font-semibold text-[#cccccc] mb-2 font-serif-hk">
              导出范围
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setScope('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  scope === 'ALL'
                    ? 'bg-[#1e1e1e] text-[#d4af37] border-[#d4af37]/60 shadow-xs'
                    : 'bg-[#141414] text-[#888888] border-[#262626] hover:text-white'
                }`}
              >
                全部 {prompts.length} 组全库
              </button>
              <button
                onClick={() => setScope('FAVORITES')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  scope === 'FAVORITES'
                    ? 'bg-[#1e1e1e] text-[#d4af37] border-[#d4af37]/60 shadow-xs'
                    : 'bg-[#141414] text-[#888888] border-[#262626] hover:text-white'
                }`}
              >
                仅已收藏写真 ({favorites.length})
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cccccc] mb-2 font-serif-hk">风格筛选</label>
            <div className="flex flex-wrap gap-2">
              {['ALL','hk','jp','kr','ny','ca','bikini'].map((sid) => (
                <button key={sid} onClick={() => setStyleFilter(sid)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${styleFilter===sid ? 'bg-[#d4af37] text-black border-[#d4af37]' : 'bg-[#141414] text-[#888888] border-[#262626] hover:text-white'}`}>
                  {sid==='ALL' ? '全部风格' : sid==='hk'?'🇭🇰 港系' : sid==='jp'?'🇯🇵 日系' : sid==='kr'?'🇰🇷 韩系' : sid==='ny'?'🇺🇸 纽约' : sid==='ca'?'🌴 加州' : '👙 比基尼'}
                </button>
              ))}
            </div>
          </div>

          {/* Format selection */}
          <div>
            <label className="block text-xs font-semibold text-[#cccccc] mb-2 font-serif-hk">
              导出格式
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setFormat('TXT_ZH')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  format === 'TXT_ZH'
                    ? 'bg-[#1e1e1e] border-[#d4af37] text-[#d4af37] font-medium'
                    : 'bg-[#141414] border-[#262626] text-[#888888] hover:text-[#cccccc]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">纯中文文本 (.txt)</span>
                  <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                </div>
                <span className="text-[10px] text-[#666666]">无符号直接贴入生图</span>
              </button>

              <button
                onClick={() => setFormat('MARKDOWN')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  format === 'MARKDOWN'
                    ? 'bg-[#1e1e1e] border-[#d4af37] text-[#d4af37] font-medium'
                    : 'bg-[#141414] border-[#262626] text-[#888888] hover:text-[#cccccc]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">排版文档 (.md)</span>
                  <FileText className="w-3.5 h-3.5 text-[#d4af37]" />
                </div>
                <span className="text-[10px] text-[#666666]">含中英双语与维度</span>
              </button>

              <button
                onClick={() => setFormat('JSON')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  format === 'JSON'
                    ? 'bg-[#1e1e1e] border-[#d4af37] text-[#d4af37] font-medium'
                    : 'bg-[#141414] border-[#262626] text-[#888888] hover:text-[#cccccc]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">结构化数据 (.json)</span>
                  <Code className="w-3.5 h-3.5 text-[#d4af37]" />
                </div>
                <span className="text-[10px] text-[#666666]">程序与接口导入</span>
              </button>

              <button
                onClick={() => setFormat('CSV')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  format === 'CSV'
                    ? 'bg-[#1e1e1e] border-[#d4af37] text-[#d4af37] font-medium'
                    : 'bg-[#141414] border-[#262626] text-[#888888] hover:text-[#cccccc]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">表格数据 (.csv)</span>
                  <Table className="w-3.5 h-3.5 text-[#d4af37]" />
                </div>
                <span className="text-[10px] text-[#666666]">Excel / 飞书表格</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Window */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#080808] text-[#cccccc] font-mono text-xs border-b border-[#1c1c1c]">
          <div className="flex items-center justify-between mb-2 text-[#666666] text-[11px] pb-1 border-b border-[#1c1c1c]">
            <span className="text-[#d4af37]">PREVIEW ({targetPrompts.length} ITEMS)</span>
            <span>UTF-8 ENCODED</span>
          </div>
          <pre className="whitespace-pre-wrap leading-relaxed select-text font-serif-hk text-[#b5b5b5]">
            {generateExportContent().slice(0, 3000)}
            {generateExportContent().length > 3000 && '\n\n... (更多内容将在导出文件中完整呈现) ...'}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#0a0a0a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#777777] font-serif-hk">
            当前将导出 <strong className="text-[#d4af37]">{targetPrompts.length}</strong> 组写真生图词
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyAll}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] text-[#dcdcdc] text-xs sm:text-sm font-medium border border-[#2e2e2e] transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '已复制到剪贴板' : '一键复制全部'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#d4af37] hover:bg-[#c4a030] text-black text-xs sm:text-sm font-bold transition-all shadow-md"
            >
              <Download className="w-4 h-4 text-black" />
              <span>下载数据文件</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
