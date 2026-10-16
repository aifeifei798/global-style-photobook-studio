import { test } from 'node:test';
import assert from 'node:assert';
import { formatPrompt } from '../src/utils/formatPrompt';
import { PhotobookPrompt } from '../src/types';

const p: PhotobookPrompt = {
  id: 'x-1',
  index: 1,
  title: '测试卡片',
  theme: '海风漫游',
  style: 'hk',
  styleLabel: '港系',
  beautyType: '清冷文艺氧气千金',
  outfit: '复古港风丝质吊带长裙',
  location: '维多利亚港码头',
  composition: '85mm人像镜头浅景深半身构图',
  lighting: '黄昏逆光剪影',
  focalLength: '85mm',
  filmTone: '柯达Portra 400暖调胶片质感',
  aspectRatio: '3:4',
  tags: ['港系'],
  promptZh: '中文提示词测试长句',
  promptEn: 'english prompt test',
};

test('flux 格式返回原始中文', () => {
  assert.equal(formatPrompt(p, 'flux'), '中文提示词测试长句');
});

test('mj 格式追加 --ar --v 6.1 --style raw 参数', () => {
  assert.equal(formatPrompt(p, 'mj'), 'english prompt test --ar 3:4 --v 6.1 --style raw');
});

test('en 格式返回英文', () => {
  assert.equal(formatPrompt(p, 'en'), 'english prompt test');
});

test('英文为空时 mj/en 回退中文', () => {
  const noEn = { ...p, promptEn: '' };
  assert.equal(formatPrompt(noEn, 'mj'), '中文提示词测试长句 --ar 3:4 --v 6.1 --style raw');
  assert.equal(formatPrompt(noEn, 'en'), '中文提示词测试长句');
});
