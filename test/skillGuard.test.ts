import { test } from 'node:test';
import assert from 'node:assert';
import { cleanSkillViolations, validatePromptZh, validateAndClean } from '../server/skillGuard';

// 一条符合 SkillGuard 全部红线的标准港系提示词（作为测试基准）
const VALID_HK =
  '85mm人像镜头浅景深半身构图，维多利亚港码头黄昏，清冷文艺氧气千金身姿自然舒展，神态清透从容，微风轻拂乌黑长发，她身穿复古港风丝质吊带长裙，面料随海风自然垂坠，逆光剪影镀上温润高光，呈现柯达Portra 400暖调胶片质感，90年代港影黄金氛围';

const VALID_BIKINI =
  '50mm标准视角全身构图，冲绳青之洞窟浅滩礁石，清冷文艺氧气千金身姿自然舒展，神态清透从容，微风轻拂乌黑长发，她身穿奶油白系带三角比基尼，面料细罗纹弹力针织随海风自然垂坠，柔焦散景逆光镀上温润高光，呈现富士Pro 400H清冷通透胶片质感，夏日氧气感扑面而来';

test('cleanSkillViolations 去除禁止符号、换行与列表编号', () => {
  const dirty = '[测试] 少女（海边）+ 微笑\n\n1. 手叉腰 凹造型\n- 列表项';
  const clean = cleanSkillViolations(dirty);
  assert.ok(!/[\[\]\(\)\+]/.test(clean), '禁止符号未被清除');
  assert.ok(!clean.includes('\n'), '换行未被压制');
  assert.ok(clean.includes('测试'), '正文文字应保留');
});

test('标准港系提示词通过校验', () => {
  const r = validatePromptZh(VALID_HK, 'hk');
  assert.ok(r.valid, `应通过，实际错误: ${r.errors.join('; ')}`);
});

test('违禁词（标准微笑/手叉腰/凹造型）被拒绝', () => {
  const bad = VALID_HK + '，标准微笑 手叉腰 凹造型';
  const r = validatePromptZh(bad, 'hk');
  assert.ok(!r.valid);
  assert.ok(r.errors.some((e) => e.includes('违禁词')));
});

test('过短提示词被拒绝', () => {
  const r = validatePromptZh('少女在海边', 'hk');
  assert.ok(!r.valid);
  assert.ok(r.errors.some((e) => e.includes('长度不足')));
});

test('缺少镜头/胶片关键词被拒绝', () => {
  const noFilm =
    '半身构图，维多利亚港码头黄昏，清冷文艺氧气千金身姿自然舒展，神态清透从容，微风轻拂乌黑长发，她身穿复古港风丝质吊带长裙，面料随海风自然垂坠，整体氛围柔和高级，90年代港影黄金氛围，画面干净通透自然光均匀，人物与场景融合自然，构图平衡色彩协调，细节丰富质感真实，画面呼吸感自然通透';
  const r = validatePromptZh(noFilm, 'hk');
  assert.ok(!r.valid);
  assert.ok(r.errors.some((e) => e.includes('镜头')));
});

test('比基尼风格强制四要素：缺失时被拒绝', () => {
  const r = validatePromptZh(VALID_HK, 'bikini');
  assert.ok(!r.valid);
  assert.ok(r.errors.filter((e) => e.includes('比基尼')).length === 4, '应报 4 条四要素缺失');
});

test('比基尼四要素齐备时通过校验', () => {
  const r = validatePromptZh(VALID_BIKINI, 'bikini');
  assert.ok(r.valid, `应通过，实际错误: ${r.errors.join('; ')}`);
});

test('validateAndClean 先清洗再校验，清洗后无禁止符号', () => {
  const r = validateAndClean(
    { promptZh: '[测试] ' + VALID_HK, promptEn: 'hk editorial photography, 85mm portrait lens, Victoria Harbour dusk, film grain, natural effortless posture' },
    'hk'
  );
  assert.ok(!/[\[\]\(\)\+]/.test(r.cleanedZh));
  assert.ok(r.valid, `清洗后应通过，实际错误: ${r.errors.join('; ')}`);
});

test('英文过短时 validateAndClean 报 EN 错误', () => {
  const r = validateAndClean({ promptZh: VALID_HK, promptEn: 'short' }, 'hk');
  assert.ok(!r.valid);
  assert.ok(r.errors.some((e) => e.startsWith('EN:')));
});
