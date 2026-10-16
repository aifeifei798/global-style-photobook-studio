import type { Lang } from '../i18n';
import { CATEGORY_LABEL_EN } from '../i18n';
import type { PresetItem, PhotobookPrompt } from '../types';
import { PRESET_EN_BASE } from './translations_base';
import { PRESET_EN_JP } from './translations_jp';
import { PRESET_EN_KRNYCA } from './translations_krnyca';
import { PRESET_EN_BK } from './translations_bk';
import { TAG_EN, CURATED_EN_TITLES } from './translations_curated';
import { PRESET_TAG_EN } from './translations_tags';

const PRESET_EN: Record<string, [string, string, string]> = {
  ...PRESET_EN_BASE,
  ...PRESET_EN_JP,
  ...PRESET_EN_KRNYCA,
  ...PRESET_EN_BK,
};

const ALL_TAG_EN: Record<string, string> = { ...TAG_EN, ...PRESET_TAG_EN };

/** Returns [name, desc, visualHint] in the requested language, falling back to the Chinese original. */
export function localizePreset(preset: PresetItem, lang: Lang): PresetItem {
  if (lang === 'zh') return preset;
  const en = PRESET_EN[preset.id];
  return {
    ...preset,
    name: en ? en[0] : preset.name,
    desc: en ? en[1] : preset.desc,
    visualHint: preset.visualHint && en && en[2] ? en[2] : preset.visualHint,
    categoryLabel: CATEGORY_LABEL_EN[preset.categoryLabel] || preset.categoryLabel,
    tags: preset.tags.map((tag) => ALL_TAG_EN[tag] || tag),
  };
}

export function localizeTag(tag: string, lang: Lang): string {
  return lang === 'en' ? ALL_TAG_EN[tag] || tag : tag;
}

/** Returns the display title of a prompt in the requested language. */
export function promptTitle(prompt: PhotobookPrompt, lang: Lang): string {
  if (lang === 'zh') return prompt.title;
  return CURATED_EN_TITLES[prompt.id] || prompt.title;
}

/** Returns the prompt text for the given output format/language. */
export function promptText(prompt: PhotobookPrompt, format: 'flux' | 'mj' | 'en'): string {
  if (format === 'flux') return prompt.promptZh;
  if (format === 'en') return prompt.promptEn;
  return `${prompt.promptEn} --ar ${prompt.aspectRatio} --v 6.1 --style raw`;
}
