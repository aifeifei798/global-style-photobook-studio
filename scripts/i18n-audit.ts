import { ALL_PRESETS } from '../src/data/presetsData';
import { ALL_CURATED_PROMPTS } from '../src/data/curatedAll';
import { PRESET_EN_BASE } from '../src/data/translations_base';
import { PRESET_EN_JP } from '../src/data/translations_jp';
import { PRESET_EN_KRNYCA } from '../src/data/translations_krnyca';
import { PRESET_EN_BK } from '../src/data/translations_bk';
import { CURATED_EN_TITLES, TAG_EN } from '../src/data/translations_curated';
import { PRESET_TAG_EN } from '../src/data/translations_tags';

const presetEn = { ...PRESET_EN_BASE, ...PRESET_EN_JP, ...PRESET_EN_KRNYCA, ...PRESET_EN_BK };

console.log('presets:', ALL_PRESETS.length, 'translated:', Object.keys(presetEn).length);

const presetTags = new Set<string>();
for (const p of ALL_PRESETS) for (const t of p.tags) presetTags.add(t);
const curatedTags = new Set<string>();
for (const p of ALL_CURATED_PROMPTS) for (const t of p.tags) curatedTags.add(t);

const tagMap = { ...TAG_EN, ...PRESET_TAG_EN };
console.log('tag map size:', Object.keys(tagMap).length);
const allTags = new Set([...presetTags, ...curatedTags]);
const missingTags = [...allTags].filter((t) => !tagMap[t]);
console.log('unique tags:', allTags.size, 'missing tag translations:', missingTags.length);
console.log(missingTags.join('\n'));

console.log('curated:', ALL_CURATED_PROMPTS.length, 'titles:', Object.keys(CURATED_EN_TITLES).length);
const missingTitles = ALL_CURATED_PROMPTS.filter((p) => !CURATED_EN_TITLES[p.id]).map((p) => p.id);
console.log('missing titles:', missingTitles.length, missingTitles.join(','));

// categoryLabel check
const cats = new Set(ALL_PRESETS.map((p) => p.categoryLabel));
console.log('category labels:', [...cats].join(', '));
