export type PresetCategory = 'beauty' | 'outfit' | 'scene' | 'composition' | 'lighting' | 'BEAUTY' | 'OUTFIT' | 'SCENE' | 'COMPOSITION' | 'LIGHTING';
export type StyleId = 'hk' | 'jp' | 'kr' | 'ny' | 'ca' | 'bikini';

export interface PresetItem {
  id: string;
  name: string;
  category: 'beauty' | 'outfit' | 'scene' | 'composition' | 'lighting';
  categoryLabel: string;
  desc: string;
  tags: string[];
  visualHint?: string;
  iconName?: string;
  style?: StyleId;
}

export interface PhotobookPrompt {
  id: string;
  index: number;
  title: string;
  theme: string;
  promptZh: string;
  promptEn: string;
  beautyType: string;
  outfit: string;
  location: string;
  composition: string;
  lighting: string;
  focalLength: string;
  filmTone: string;
  aspectRatio: string;
  tags: string[];
  isCurated?: boolean;
  coverImage?: string;
  style?: StyleId;
  styleLabel?: string;
}

export interface FilterState {
  theme: string;
  search: string;
  favoritesOnly: boolean;
  style: StyleId | '';
}

export interface GenerationParams {
  count: number;
  selectedBeauty?: string;
  selectedOutfit?: string;
  selectedScene?: string;
  selectedComposition?: string;
  selectedLighting?: string;
  customKeyword?: string;
  themeStyle?: string;
  targetPlatform?: 'Midjourney' | 'FLUX' | 'Stable Diffusion' | 'DALL-E 3' | 'Gemini / 通用';
  aspectRatio?: string;
}

export type ActiveTab = 'curated' | 'presets' | 'ai-director' | 'lookbook' | 'favorites';

