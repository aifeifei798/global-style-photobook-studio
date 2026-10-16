export type StyleId = 'hk' | 'jp' | 'kr' | 'ny' | 'ca' | 'bikini';

export interface StyleMeta {
  id: StyleId;
  label: string;
  shortLabel: string;
  enLabel: string;
  description: string;
  descriptionEn: string;
  tagline: string;
  taglineEn: string;
  accent: string; // tailwind hex
  bgAccent: string;
  borderAccent: string;
  icon: string;
}

export const STYLE_META: Record<StyleId, StyleMeta> = {
  hk: {
    id: 'hk',
    label: '港系',
    shortLabel: 'HK',
    enLabel: 'VOGUE HONG KONG',
    descriptionEn: 'HK high-fashion photography · Vogue Hong Kong',
    description: '港系高级时尚写真 · Vogue 香港',
    taglineEn: 'Crystal-clear air · high fashion · Hong Kong cinema aesthetics',
    tagline: '清透氧气 · 高级时尚 · 香港电影美学',
    accent: '#d4af37',
    bgAccent: 'bg-[#d4af37]',
    borderAccent: 'border-[#d4af37]',
    icon: '🇭🇰',
  },
  jp: {
    id: 'jp',
    label: '日系',
    shortLabel: 'JP',
    enLabel: 'JP SOFT FILM',
    descriptionEn: 'Japanese soft-focus · first-love / linen / dreamy film',
    description: '日系小清新 · 初恋感 / 棉麻感 / 柔焦胶片',
    taglineEn: 'Tender innocence · cotton-candy airiness · Japanese first-love film',
    tagline: '温柔青涩 · 棉花糖氧气感 · 日系初恋电影',
    accent: '#f0a6b5',
    bgAccent: 'bg-[#f0a6b5]',
    borderAccent: 'border-[#f0a6b5]',
    icon: '🇯🇵',
  },
  kr: {
    id: 'kr',
    label: '韩系',
    shortLabel: 'KR',
    enLabel: 'SEOUL DRAMA',
    descriptionEn: 'Korean mood · K-pop / Seoul urban film',
    description: '韩系氛围感 · K-pop / 首尔都市胶片',
    taglineEn: 'Atmosphere · MZ urban · heart-fluttering tears',
    tagline: '氛围感 · MZ 都市 · 心动的眼泪感',
    accent: '#8ecae6',
    bgAccent: 'bg-[#8ecae6]',
    borderAccent: 'border-[#8ecae6]',
    icon: '🇰🇷',
  },
  ny: {
    id: 'ny',
    label: '纽约',
    shortLabel: 'NY',
    enLabel: 'NYC EDITORIAL',
    descriptionEn: 'NYC models · US-edition editorial spreads / street ease',
    description: '纽约模特 · 美版时尚编辑大片 / 街头随性',
    taglineEn: 'American confidence · street ease · editorial presence',
    tagline: '美式自信 · 街头随性 · 编辑气场',
    accent: '#ff595e',
    bgAccent: 'bg-[#ff595e]',
    borderAccent: 'border-[#ff595e]',
    icon: '🇺🇸',
  },
  ca: {
    id: 'ca',
    label: '加州',
    shortLabel: 'CA',
    enLabel: 'CALIFORNIA GIRL',
    descriptionEn: 'California girl · sunny coast / surf vintage',
    description: '加州邻家女孩 · 阳光海岸 / 冲浪复古',
    taglineEn: 'Sun-drenched · approachable · healthy energy',
    tagline: '阳光灿烂 · 亲切自然 · 健康活力',
    accent: '#ffb703',
    bgAccent: 'bg-[#ffb703]',
    borderAccent: 'border-[#ffb703]',
    icon: '🌴',
  },
  bikini: {
    id: 'bikini',
    label: '比基尼特辑',
    shortLabel: 'BIKINI',
    enLabel: 'JP BIKINI SUMMER',
    descriptionEn: 'Japanese bikini · summer girlfriend 5-coastline series',
    description: '日系比基尼 · 夏日女友 5海岸线特辑',
    taglineEn: 'Okinawa · Shonan · Izu · Kamakura · Shizuoka · coastline confession',
    tagline: '冲绳·湘南·伊豆·镰仓·静冈 · 海岸线告白',
    accent: '#ff8fab',
    bgAccent: 'bg-[#ff8fab]',
    borderAccent: 'border-[#ff8fab]',
    icon: '👙',
  },
};

export const STYLE_IDS: StyleId[] = ['hk', 'jp', 'kr', 'ny', 'ca', 'bikini'];

export const STYLE_LABELS: Record<StyleId, string> = {
  hk: '港系',
  jp: '日系',
  kr: '韩系',
  ny: '纽约',
  ca: '加州',
  bikini: '比基尼',
};

export function getStyleMeta(id: string): StyleMeta {
  return STYLE_META[(id as StyleId)] || STYLE_META.hk;
}
