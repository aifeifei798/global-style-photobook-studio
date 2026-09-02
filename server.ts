import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import OpenAI from 'openai';
import { getStylePrompt, isValidStyle, STYLE_LABELS, STYLE_SKILL_VERSION } from './server/stylePrompts';
import { validateAndClean, cleanSkillViolations } from './server/skillGuard';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Helper to get OpenAI client
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    // keep legacy field for backward compatibility during migration
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    supportedStyles: ['hk', 'jp', 'kr', 'ny', 'ca', 'bikini'],
    skillVersions: STYLE_SKILL_VERSION,
  });
});

app.get('/api/styles', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'hk', label: '港系', enLabel: 'VOGUE HONG KONG', tagline: '清透氧气 · 高级时尚 · 香港电影美学', skill: STYLE_SKILL_VERSION.hk },
      { id: 'jp', label: '日系', enLabel: 'JP SOFT FILM', tagline: '温柔青涩 · 棉花糖氧气感 · 日系初恋电影', skill: STYLE_SKILL_VERSION.jp },
      { id: 'kr', label: '韩系', enLabel: 'SEOUL DRAMA', tagline: '氛围感 · MZ 都市 · 心动的眼泪感', skill: STYLE_SKILL_VERSION.kr },
      { id: 'ny', label: '纽约', enLabel: 'NYC EDITORIAL', tagline: '美式自信 · 街头随性 · 编辑气场', skill: STYLE_SKILL_VERSION.ny },
      { id: 'ca', label: '加州', enLabel: 'CALIFORNIA GIRL', tagline: '阳光灿烂 · 亲切自然 · 健康活力', skill: STYLE_SKILL_VERSION.ca },
      { id: 'bikini', label: '比基尼特辑', enLabel: 'JP BIKINI SUMMER', tagline: '冲绳·湘南·伊豆·镰仓·静冈海岸线告白', skill: STYLE_SKILL_VERSION.bikini },
    ],
  });
});

// Skill 合规自检接口：供前端/测试直观验证每条生成是否命中 Skill 红线
app.post('/api/validate-prompt', (req, res) => {
  const { promptZh = '', promptEn = '', style = 'hk' } = req.body || {};
  const styleId = isValidStyle(style) ? style : 'hk';
  const result = validateAndClean({ promptZh, promptEn }, styleId as any);
  res.json({ success: true, data: { valid: result.valid, errors: result.errors, cleanedZh: result.cleanedZh, cleanedEn: result.cleanedEn, style: styleId, skill: STYLE_SKILL_VERSION[styleId as keyof typeof STYLE_SKILL_VERSION] } });
});

// API: AI Custom Prompt Generation based on selected presets or custom idea
app.post('/api/generate-prompt', async (req, res) => {
  try {
    const {
      style = 'hk',
      theme = '海风漫游',
      beautyType = '经典港风明艳大美人',
      outfit = '珍珠白19姆米桑蚕丝细吊带大露背长裙',
      location = '浅水湾落日金辉细软退潮沙滩',
      composition = '85mm f/1.4大光圈清透人像特写',
      lighting = '傍晚落日熔金温润逆光',
      focalLength = '85mm',
      filmTone = '柯达Portra 400暖调微颗粒胶片',
      aspectRatio = '3:4',
      customKeywords = '',
    } = req.body;

    const styleId = isValidStyle(style) ? style : 'hk';
    const styleLabel = STYLE_LABELS[styleId] || '港系';

    const openai = getOpenAIClient();

    if (!openai) {
      // Return high-quality deterministic handcrafted generation when API key is not yet set (已按 Skill §2 去括号加号并满足5要素)
      const stylePrefixes: Record<string, string> = {
        hk: '港系高级时尚',
        jp: '日系小清新柔焦',
        kr: '韩系氛围感都市',
        ny: '纽约编辑大片街头随性',
        ca: '加州阳光海岸邻家',
        bikini: '日系比基尼夏日女友',
      };
      const styleEnPrefixes: Record<string, string> = {
        hk: 'Vogue Hong Kong',
        jp: 'Japanese soft film',
        kr: 'Seoul drama atmosphere',
        ny: 'NYC editorial street-style',
        ca: 'California girl sunny coast',
        bikini: 'Japanese bikini summer girlfriend',
      };
      const prefixZh = stylePrefixes[styleId] || stylePrefixes.hk;
      const prefixEn = styleEnPrefixes[styleId] || styleEnPrefixes.hk;
      // 5要素顺序：构图→动态神态→穿搭→环境→光影，单一长句，无括号加号
      // 比基尼特辑强制注入四要素默认值，保证离线校验也能通过
      let effectiveOutfit = outfit;
      let effectiveLocation = location;
      if (styleId === 'bikini') {
        const hasColor = ['奶油白','珍珠粉','薄荷绿','浅杏','燕麦','淡紫','淡蓝','浅橘','樱花粉','天蓝','珍珠白','鹅黄'].some((c) => outfit.includes(c));
        const hasCut = ['系带三角','挂脖','荷叶边','蝴蝶结','连体','高腰','平角','抹胸','三角'].some((c) => outfit.includes(c));
        const hasFabric = ['弹力针织','细罗纹','水洗棉','蕾丝','亚麻混纺','速干莱卡','莱卡'].some((c) => outfit.includes(c));
        if (!hasColor || !hasCut || !hasFabric) {
          effectiveOutfit = '奶油白系带三角比基尼，面料细罗纹弹力针织配蕾丝滚边';
        }
        const hasLocation = ['冲绳','青之洞窟','万座毛','古宇利','湘南','江之岛','伊豆','热海','镰仓','逗子','三浦','静冈','滨松','远州滩'].some((c) => location.includes(c));
        if (!hasLocation) {
          effectiveLocation = '冲绳青之洞窟浅滩礁石';
        }
      }
      const rawZh = `${prefixZh} ${composition}，${effectiveLocation}，${beautyType}身姿自然舒展，神态清透从容，微风吹拂着乌黑长发。她身穿${effectiveOutfit}，面料随海风自然垂坠，细节考究。${lighting}，微光在锁骨与发丝边缘形成温润高光。呈现${filmTone}的纯净氧气感与电影呼吸感。`;
      const rawEn = `${prefixEn} editorial photobook, ${composition}, ${beautyType} at ${effectiveLocation}, relaxed and effortless graceful posture. Wearing ${effectiveOutfit}. ${lighting}, ${filmTone}, high-fashion cinematography, no artificial posing, pure summer vitality.`;
      const cleanedZh = cleanSkillViolations(rawZh);
      const cleanedEn = cleanSkillViolations(rawEn);
      const validation = validateAndClean({ promptZh: cleanedZh, promptEn: cleanedEn }, styleId as any);

      return res.json({
        success: true,
        data: {
          id: `custom-${Date.now()}`,
          title: `定制·${theme}夏日写真`,
          style: styleId,
          styleLabel,
          theme,
          beautyType,
          outfit,
          location,
          composition,
          lighting,
          focalLength,
          filmTone,
          aspectRatio,
          tags: [theme, styleLabel, beautyType.slice(0, 4), '夏日写真'],
          promptZh: validation.cleanedZh,
          promptEn: validation.cleanedEn,
          isAiGenerated: false,
          skill: STYLE_SKILL_VERSION[styleId as keyof typeof STYLE_SKILL_VERSION],
          skillValid: validation.valid,
          skillErrors: validation.errors,
        },
      });
    }

    const systemPrompt = getStylePrompt(styleId);

    const userPrompt = `写真要素：
- 风格体系：${styleLabel} (${styleId})
- 主题系列：${theme}
- 容颜神态：${beautyType}
- 高定穿搭：${outfit}
- 拍摄场景：${location}
- 构图景别：${composition}
- 光影氛围：${lighting}
- 镜头焦段：${focalLength}
- 胶片影调：${filmTone}
- 画面比例：${aspectRatio}
${customKeywords ? `- 附加灵感：${customKeywords}` : ''}
${styleId === 'bikini' ? '- 比基尼特辑要求：必须明确比基尼颜色/款式/材质与日本海岸线地点（冲绳/湘南江之岛/伊豆热海/镰仓逗子三浦/静冈远州滩）' : ''}

请生成一套顶级的 ${styleLabel} 夏日写真集 AI 生图提示词。`;

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    // 首轮生成：严格受 Skill 控制（温度 0.85，JSON mode）
    let completion = await openai.chat.completions.create({
      model,
      temperature: 0.85,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const rawContent = completion.choices[0]?.message?.content?.trim() || '{}';
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      const match = rawContent.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = {};
        }
      }
    }

    // Fallback if model returned empty fields (按 Skill 5要素与单段要求，比基尼注入四要素)
    if (!parsed.promptZh || !parsed.promptEn) {
      let fbOutfit = outfit;
      let fbLocation = location;
      if (styleId === 'bikini') {
        const hasColor = ['奶油白','珍珠粉','薄荷绿','浅杏','燕麦','淡紫','淡蓝','浅橘','樱花粉','天蓝'].some((c) => outfit.includes(c));
        const hasCut = ['系带三角','挂脖','荷叶边','蝴蝶结','连体','高腰','平角','抹胸'].some((c) => outfit.includes(c));
        const hasFabric = ['弹力针织','细罗纹','水洗棉','蕾丝','亚麻混纺','速干莱卡'].some((c) => outfit.includes(c));
        if (!hasColor || !hasCut || !hasFabric) fbOutfit = '奶油白系带三角比基尼，面料细罗纹弹力针织配蕾丝滚边';
        const hasLoc = ['冲绳','青之洞窟','万座毛','古宇利','湘南','江之岛','伊豆','热海','镰仓','逗子','三浦','静冈','滨松','远州滩'].some((c) => location.includes(c));
        if (!hasLoc) fbLocation = '冲绳青之洞窟浅滩礁石';
      }
      const fallbackZh = `${composition}，${fbLocation}，${beautyType}身姿自然舒展，神态清透从容，微风轻拂黑发。她身穿${fbOutfit}，面料随风飘拂。${lighting}，锁骨与发丝被镀上温润微光，呈现${filmTone}的纯净氧气感与${styleLabel}氛围。`;
      const fallbackEn = `Cinematic ${styleLabel} summer photography, ${composition}, ${beautyType} at ${fbLocation}, effortless natural posture. Wearing ${fbOutfit}. ${lighting}, high-fashion film grain, pure oxygen mood.`;
      parsed.promptZh = parsed.promptZh || fallbackZh;
      parsed.promptEn = parsed.promptEn || fallbackEn;
      parsed.title = parsed.title || `定制·${theme}夏日写真`;
      parsed.tags = parsed.tags || [theme, styleLabel, '电影感'];
    }

    // Skill 自检与清洗（红线/括号/四要素/5要素）
    let validation = validateAndClean(parsed, styleId as any);
    parsed.promptZh = validation.cleanedZh;
    parsed.promptEn = validation.cleanedEn;

    // 若未通过 Skill 自检，自动纠错重试一次（注入错误列表，温度降低至 0.7 提升可控性）
    if (!validation.valid) {
      console.warn(`[SkillGuard] ${styleId} first pass invalid:`, validation.errors);
      try {
        const correctionUserPrompt = `${userPrompt}\n\n【上次输出因违反 Skill 自检未通过，请重写】\n违规项：${validation.errors.join('；')}\n要求：严格遵循 ${STYLE_SKILL_VERSION[styleId as keyof typeof STYLE_SKILL_VERSION]} 的5要素顺序与禁忌，输出单一连贯中文长句（150-320字），无[]() +，比基尼需含四要素颜色/款式/材质/海岸线。只输出 JSON。`;
        const retry = await openai.chat.completions.create({
          model,
          temperature: 0.7,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: correctionUserPrompt },
          ],
        });
        const retryRaw = retry.choices[0]?.message?.content?.trim() || '{}';
        let retryParsed: any = {};
        try { retryParsed = JSON.parse(retryRaw); } catch { const m = retryRaw.match(/\{[\s\S]*\}/); if (m) try { retryParsed = JSON.parse(m[0]); } catch {} }
        if (retryParsed.promptZh) {
          const retryValidation = validateAndClean(retryParsed, styleId as any);
          if (retryValidation.valid) {
            parsed = { ...retryParsed, promptZh: retryValidation.cleanedZh, promptEn: retryValidation.cleanedEn };
            validation = retryValidation;
          } else {
            console.warn(`[SkillGuard] retry still invalid:`, retryValidation.errors);
            // 保留清洗后的重试结果，哪怕仍有瑕疵，前端可见 errors
            parsed.promptZh = retryValidation.cleanedZh;
            parsed.promptEn = retryValidation.cleanedEn;
            validation = retryValidation;
          }
        }
      } catch (e) {
        console.warn('[SkillGuard] retry failed', e);
      }
    }

    return res.json({
      success: true,
      data: {
        id: `custom-${Date.now()}`,
        title: parsed.title || `定制·${theme}夏日特辑`,
        style: styleId,
        styleLabel,
        theme,
        beautyType,
        outfit,
        location,
        composition,
        lighting,
        focalLength,
        filmTone,
        aspectRatio,
        tags: parsed.tags || [theme, styleLabel, '电影感'],
        promptZh: parsed.promptZh,
        promptEn: parsed.promptEn,
        isAiGenerated: true,
        model,
        skill: STYLE_SKILL_VERSION[styleId as keyof typeof STYLE_SKILL_VERSION],
        skillValid: validation.valid,
        skillErrors: validation.errors,
      },
    });
  } catch (error: any) {
    console.error('Error generating prompt:', error);
    const status = error?.status || error?.statusCode;
    let message = error?.message || '生成失败，请重试';
    let httpStatus = 500;

    if (status === 401) {
      message = 'OpenAI API Key 无效或未配置，请检查 OPENAI_API_KEY';
      httpStatus = 401;
    } else if (status === 429) {
      message = '请求过于频繁或额度不足，请稍后重试';
      httpStatus = 429;
    } else if (status === 400) {
      message = `请求参数错误: ${error.message}`;
      httpStatus = 400;
    }

    return res.status(httpStatus).json({
      success: false,
      message,
    });
  }
});

// Start Express server and setup Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vogue HK Photobook Director server running on http://0.0.0.0:${PORT}`);
    console.log(`OpenAI model: ${process.env.OPENAI_MODEL || 'gpt-4o-mini'} | hasKey: ${Boolean(process.env.OPENAI_API_KEY)}`);
  });
}

startServer();
