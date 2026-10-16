import { test } from 'node:test';
import assert from 'node:assert';
import {
  ALL_PRESETS,
  BEAUTY_PRESETS,
  OUTFIT_PRESETS,
  SCENE_PRESETS,
  COMPOSITION_PRESETS,
  LIGHTING_PRESETS,
  FILM_PRESETS,
} from '../src/data/presetsData';
import { ALL_CURATED_PROMPTS } from '../src/data/curatedAll';
import { FORBIDDEN_PHRASES, FORBIDDEN_CHARS_TEST_RE } from '../server/skillGuard';

// 预设数据完整性：数量、字段、违禁字符
test('preset counts match README/AGENTS contract', () => {
  assert.strictEqual(ALL_PRESETS.length, 382);
  assert.strictEqual(FILM_PRESETS.length, 8);
  assert.strictEqual(ALL_CURATED_PROMPTS.length, 92);
  const byCategory: Record<string, number> = {};
  for (const p of ALL_PRESETS) byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  assert.strictEqual(byCategory.beauty + byCategory.outfit + byCategory.scene + byCategory.composition + byCategory.lighting + byCategory.film, 382);
});

test('every preset has required fields and a valid category', () => {
  const validCategories = new Set(['beauty', 'outfit', 'scene', 'composition', 'lighting', 'film']);
  for (const p of ALL_PRESETS) {
    assert.ok(p.id && p.name && p.categoryLabel && p.desc, `preset ${p.id} missing fields`);
    assert.ok(validCategories.has(p.category), `preset ${p.id} has invalid category ${p.category}`);
    assert.ok(Array.isArray(p.tags), `preset ${p.id} tags is not an array`);
  }
});

test('no preset text contains SkillGuard-forbidden chars or phrases', () => {
  for (const p of ALL_PRESETS) {
    const text = `${p.name} ${p.desc} ${p.visualHint ?? ''}`;
    assert.ok(!FORBIDDEN_CHARS_TEST_RE.test(text), `preset ${p.id} contains forbidden chars: ${text}`);
    for (const phrase of FORBIDDEN_PHRASES) {
      assert.ok(!text.includes(phrase), `preset ${p.id} contains forbidden phrase "${phrase}"`);
    }
  }
});

test('curated prompts are single-paragraph and within guard length bounds', () => {
  for (const c of ALL_CURATED_PROMPTS) {
    assert.ok(c.promptZh && c.promptEn, `curated ${c.id} missing prompt text`);
    assert.ok(!c.promptZh.includes('\n'), `curated ${c.id} promptZh contains newlines`);
    assert.ok(c.promptZh.length >= 80 && c.promptZh.length <= 600, `curated ${c.id} promptZh length ${c.promptZh.length} out of guard bounds`);
  }
});
