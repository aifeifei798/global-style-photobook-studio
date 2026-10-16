
import { ALL_PRESETS } from '../src/data/presetsData';
import { PRESET_EN_BASE } from '../src/data/translations_base';
import { PRESET_EN_JP } from '../src/data/translations_jp';
import { PRESET_EN_KRNYCA } from '../src/data/translations_krnyca';
import { PRESET_EN_BK } from '../src/data/translations_bk';
const m = { ...PRESET_EN_BASE, ...PRESET_EN_JP, ...PRESET_EN_KRNYCA, ...PRESET_EN_BK };
console.log('presets', ALL_PRESETS.length, 'maps', Object.keys(m).length);
const missing = ALL_PRESETS.filter(p => !m[p.id]).map(p => p.id);
console.log('missing', missing.length, missing.join(','));
