import { test } from 'node:test';
import assert from 'node:assert';
import { ALL_PRESETS } from '../src/data/presetsData';
import { ALL_CURATED_PROMPTS } from '../src/data/curatedAll';
import { PRESET_EN_BASE } from '../src/data/translations_base';
import { PRESET_EN_JP } from '../src/data/translations_jp';
import { PRESET_EN_KRNYCA } from '../src/data/translations_krnyca';
import { PRESET_EN_BK } from '../src/data/translations_bk';
import { TAG_EN, CURATED_EN_TITLES } from '../src/data/translations_curated';
import { PRESET_TAG_EN } from '../src/data/translations_tags';
import { localizePreset, localizeTag, promptTitle } from '../src/data/localized';
import { t, themeName, categoryLabel, THEME_EN, CATEGORY_LABEL_EN } from '../src/i18n';
import { STYLE_META, StyleId } from '../src/data/styleConfig';

const PRESET_EN = { ...PRESET_EN_BASE, ...PRESET_EN_JP, ...PRESET_EN_KRNYCA, ...PRESET_EN_BK };
const TAG_MAP = { ...TAG_EN, ...PRESET_TAG_EN };

// 翻译覆盖完整性：每个预设、精选标题、标签都有英文翻译
test('every preset has an English translation', () => {
  const missing = ALL_PRESETS.filter((p) => !PRESET_EN[p.id]).map((p) => p.id);
  assert.strictEqual(missing.length, 0, `missing preset translations: ${missing.join(', ')}`);
  assert.strictEqual(ALL_PRESETS.length, 382);
});

test('every curated prompt has an English title', () => {
  const missing = ALL_CURATED_PROMPTS.filter((p) => !CURATED_EN_TITLES[p.id]).map((p) => p.id);
  assert.strictEqual(missing.length, 0, `missing curated titles: ${missing.join(', ')}`);
  assert.strictEqual(ALL_CURATED_PROMPTS.length, 92);
});

test('every tag used by presets or curated prompts has an English translation', () => {
  const tags = new Set<string>();
  for (const p of ALL_PRESETS) for (const tag of p.tags) tags.add(tag);
  for (const p of ALL_CURATED_PROMPTS) for (const tag of p.tags) tags.add(tag);
  const missing = [...tags].filter((tag) => !TAG_MAP[tag]);
  assert.strictEqual(missing.length, 0, `missing tag translations: ${missing.join(', ')}`);
});

test('localizePreset returns English name/desc and keeps zh for Chinese', () => {
  const preset = ALL_PRESETS[0];
  const en = localizePreset(preset, 'en');
  assert.notStrictEqual(en.name, preset.name);
  assert.ok(en.name.length > 0);
  assert.strictEqual(localizePreset(preset, 'zh'), preset);
});

test('localizeTag and promptTitle fall back gracefully', () => {
  assert.strictEqual(localizeTag('不存在的标签', 'en'), '不存在的标签');
  assert.strictEqual(localizeTag('夏日写真', 'zh'), '夏日写真');
  const fake = { id: 'nonexistent-id', title: '中文标题' } as any;
  assert.strictEqual(promptTitle(fake, 'en'), '中文标题');
});

test('all six styles have English description and tagline', () => {
  const ids: StyleId[] = ['hk', 'jp', 'kr', 'ny', 'ca', 'bikini'];
  for (const id of ids) {
    const meta = STYLE_META[id];
    assert.ok(meta.descriptionEn && meta.descriptionEn.length > 0, `${id} missing descriptionEn`);
    assert.ok(meta.taglineEn && meta.taglineEn.length > 0, `${id} missing taglineEn`);
  }
});

test('themeName and categoryLabel translate known values and pass through unknown ones', () => {
  assert.strictEqual(themeName('en', '海风漫游'), THEME_EN['海风漫游']);
  assert.strictEqual(themeName('zh', '海风漫游'), '海风漫游');
  assert.strictEqual(themeName('en', '未知主题'), '未知主题');
  for (const label of new Set(ALL_PRESETS.map((p) => p.categoryLabel))) {
    assert.ok(categoryLabel('en', label) !== label || CATEGORY_LABEL_EN[label], `category "${label}" has no EN label`);
  }
});

test('t() interpolates {var} placeholders', () => {
  assert.strictEqual(t('en', 'resultsCount', { count: 5 }), '5 prompts');
  assert.strictEqual(t('zh', 'resultsCount', { count: 5 }), '5 条提示词');
});
