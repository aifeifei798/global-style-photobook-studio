import { PhotobookPrompt } from '../types';

export type PromptFormat = 'flux' | 'mj' | 'en';

export function formatPrompt(prompt: PhotobookPrompt, format: PromptFormat): string {
  const ar = prompt.aspectRatio || '3:4';
  switch (format) {
    case 'flux':
      // FLUX 纯自然语言：直接可用中文长句，无任何参数
      return prompt.promptZh;
    case 'mj':
      // Midjourney 带参数：英文提示词 + --ar --v 6.1
      // 若英文为空则回退中文
      const baseEn = prompt.promptEn || prompt.promptZh;
      return `${baseEn} --ar ${ar} --v 6.1 --style raw`;
    case 'en':
      return prompt.promptEn || prompt.promptZh;
    default:
      return prompt.promptZh;
  }
}

export const FORMAT_META: Record<PromptFormat, { label: string; shortLabel: string; desc: string }> = {
  flux: { label: 'FLUX 纯自然语言', shortLabel: 'FLUX', desc: '无参数·直接粘贴' },
  mj: { label: 'Midjourney --ar --v 6.1', shortLabel: 'MJ', desc: '带 --ar --v 6.1 参数' },
  en: { label: 'English 翻译', shortLabel: 'EN', desc: '英文一键翻译' },
};
