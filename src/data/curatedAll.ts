import { PhotobookPrompt } from '../types';
import { CURATED_50_PROMPTS } from './curated50Prompts';
import { CURATED_JP_PROMPTS } from './curated_jp';
import { CURATED_KR_PROMPTS } from './curated_kr';
import { CURATED_NY_PROMPTS } from './curated_ny';
import { CURATED_CA_PROMPTS } from './curated_ca';
import { CURATED_BIKINI_PROMPTS } from './curated_bikini';

const HK_STYLED: PhotobookPrompt[] = CURATED_50_PROMPTS.map((p) => ({
  ...p,
  style: (p as any).style || 'hk',
  styleLabel: '港系',
})) as PhotobookPrompt[];

export const ALL_CURATED_PROMPTS: PhotobookPrompt[] = [
  ...HK_STYLED,
  ...CURATED_JP_PROMPTS,
  ...CURATED_KR_PROMPTS,
  ...CURATED_NY_PROMPTS,
  ...CURATED_CA_PROMPTS,
  ...CURATED_BIKINI_PROMPTS,
];

export const CURATED_BY_STYLE = {
  hk: HK_STYLED,
  jp: CURATED_JP_PROMPTS,
  kr: CURATED_KR_PROMPTS,
  ny: CURATED_NY_PROMPTS,
  ca: CURATED_CA_PROMPTS,
  bikini: CURATED_BIKINI_PROMPTS,
} as const;

// Keep backward compat
export { CURATED_50_PROMPTS };
