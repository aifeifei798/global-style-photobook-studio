import { StyleId } from './stylePrompts';

// 全局红线词库 SKILL §2 统一（各风格均含）
const FORBIDDEN_PHRASES = [
  '男友视角', '偷拍', '恶作剧', '偷吃', '偷看他',
  '标准微笑', '手叉腰', '比耶', '凹造型', '摆 pose', '摆pose',
  '正对镜头尬笑',
] as const;

const FORBIDDEN_CHARS_RE = /[\[\]\(\)\+]/g;

// 风格专属补充（比基尼严禁低俗化）
const BIKINI_FORBIDDEN = ['性暗示', '暴露', '色情', '低俗'] as const;

// 蜜色：比基尼四要素词库（来自 jp-bikini-summer-50.md §视觉语法底座）
const BIKINI_COLORS = ['奶油白', '珍珠粉', '薄荷绿', '浅杏', '燕麦', '淡紫', '淡蓝', '浅橘', '樱花粉', '天蓝', '珍珠白', '鹅黄', '浅紫', '薄荷', '淡粉'] as const;
const BIKINI_CUTS = ['系带三角', '挂脖', '荷叶边', '蝴蝶结', '运动风', '连体', '高腰', '平角', '抹胸', '三角'] as const;
const BIKINI_FABRICS = ['弹力针织', '细罗纹', '水洗棉', '弹力蕾丝', '蕾丝', '亚麻混纺', '速干莱卡', '莱卡', '棉质', '针织', '弹力', '编织', '细编织'] as const;
const BIKINI_LOCATIONS = ['冲绳', '青之洞窟', '万座毛', '古宇利', '湘南', '江之岛', '江之电', '七里滨', '由比', '伊豆', '热海', '来宫', '河津', '镰仓', '逗子', '三浦', '稻村崎', '静冈', '滨松', '远州滩', '美国村'] as const;

function containsAny(text: string, list: readonly string[]): boolean {
  return list.some((w) => text.includes(w));
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  cleanedZh: string;
  cleanedEn: string;
}

export function cleanSkillViolations(text: string): string {
  let cleaned = text.replace(FORBIDDEN_CHARS_RE, '').replace(/[\[\]\(\)\+]/g, '');
  // 去除多余的 markdown 列表符号与编号
  cleaned = cleaned.replace(/^\s*[-*]\s+/gm, '').replace(/^\s*\d+[\.、]\s*/gm, '');
  // 压制多余空行，强制单段
  cleaned = cleaned.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  // 去除首尾引号与代码块
  cleaned = cleaned.replace(/^```[\s\S]*?```/g, '').replace(/^["“”']+|["“”']+$/g, '').trim();
  return cleaned;
}

export function validatePromptZh(promptZh: string, style: StyleId): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!promptZh || promptZh.length < 80) errors.push('长度不足80字，未达150-320字要求');
  if (promptZh.length > 600) errors.push('长度超过600字，需150-320字');
  if (FORBIDDEN_CHARS_RE.test(promptZh)) errors.push('包含禁止符号 []()+');
  // 重置正则 lastIndex
  FORBIDDEN_CHARS_RE.lastIndex = 0;
  const foundForbidden = FORBIDDEN_PHRASES.filter((p) => promptZh.includes(p));
  if (foundForbidden.length) errors.push(`包含违禁词:${foundForbidden.join('/')}`);
  if (style === 'bikini') {
    const bikiniBad = BIKINI_FORBIDDEN.filter((p) => promptZh.includes(p));
    if (bikiniBad.length) errors.push(`比基尼低俗化:${bikiniBad.join('/')}`);
  }
  // 换行/分段检测
  if (promptZh.includes('\n')) errors.push('包含换行，非单一连贯段落');
  if (/^\s*[-*]\s+/.test(promptZh) || /^\s*\d+[.、]/.test(promptZh)) errors.push('包含列表编号，非单一长句');
  // 5要素粗检：需包含标点分句至少2个逗号/分号，且提及光影或胶片关键词
  const hasComma = promptZh.includes('，') || promptZh.includes(',') || promptZh.includes('；');
  if (!hasComma) errors.push('缺少逗号/分号衔接，非连贯长句');
  const filmHints = ['mm', '毫米', '光圈', '胶片', 'Portra', 'Fujifilm', 'Pro 400', '柯达', '富士', '颗粒', '逆光', '柔焦', '散景', 'f/'];
  if (!filmHints.some((k) => promptZh.includes(k))) errors.push('缺少镜头/胶片/光影关键词（需含 mm/光圈/胶片/逆光等）');

  // 比基尼四要素强校验
  if (style === 'bikini') {
    if (!containsAny(promptZh, BIKINI_COLORS)) errors.push('比基尼缺少颜色要素（需含奶油白/珍珠粉/薄荷绿等粉彩色）');
    if (!containsAny(promptZh, BIKINI_CUTS)) errors.push('比基尼缺少款式要素（需含系带三角/挂脖/荷叶边/蝴蝶结/连体等）');
    if (!containsAny(promptZh, BIKINI_FABRICS)) errors.push('比基尼缺少材质要素（需含弹力针织/水洗棉/蕾丝/亚麻混纺/速干莱卡等）');
    if (!containsAny(promptZh, BIKINI_LOCATIONS)) errors.push('比基尼缺少地点要素（需含冲绳/湘南/伊豆/镰仓/静冈等日本海岸线）');
  }
  return { valid: errors.length === 0, errors };
}

export function validateAndClean(parsed: any, style: StyleId): ValidationResult {
  let zh = String(parsed.promptZh || '').trim();
  let en = String(parsed.promptEn || '').trim();
  // 先清洗
  zh = cleanSkillViolations(zh);
  en = cleanSkillViolations(en);
  // 英文同理去括号加号
  en = en.replace(FORBIDDEN_CHARS_RE, '').trim();
  FORBIDDEN_CHARS_RE.lastIndex = 0;

  const { valid, errors } = validatePromptZh(zh, style);
  const enErrors: string[] = [];
  if (!en || en.length < 20) enErrors.push('英文长度不足');
  if (FORBIDDEN_CHARS_RE.test(en)) enErrors.push('英文含禁止符号');
  FORBIDDEN_CHARS_RE.lastIndex = 0;
  if (FORBIDDEN_PHRASES.some((p) => en.includes(p))) enErrors.push('英文含违禁词');

  const allErrors = [...errors, ...enErrors.map((e) => `EN:${e}`)];
  return { valid: allErrors.length === 0, errors: allErrors, cleanedZh: zh, cleanedEn: en };
}

export const SKILL_META = {
  hk: { version: 'hk-visual-prompts v1.0.0', name: '港系' },
  jp: { version: 'jp-visual-prompts v1.0.0', name: '日系' },
  kr: { version: 'kr-visual-prompts v1.0.0', name: '韩系' },
  ny: { version: 'ny-visual-prompts v1.0.0', name: '纽约' },
  ca: { version: 'ca-visual-prompts v1.0.0', name: '加州' },
  bikini: { version: 'jp-visual-prompts + jp-bikini-summer-50.md', name: '比基尼特辑' },
} as const;
