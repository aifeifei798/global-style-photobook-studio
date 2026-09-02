# 全球风格写真矩阵 · Global Style Photobook Studio

> 港系 / 日系 / 韩系 / 纽约 / 加州 / 比基尼特辑 · 六风格 AI 提示词策划生成器

基于 `OpenAI` 的时尚写真提示词工厂，支持 **6 大视觉体系**、**400+ 专业预设**、**92 组精选提示词**。单一连贯自然语言段落（无方括号/加号），直接复制至 Midjourney / FLUX / SDXL / 即梦 等生图模型。

## ✨ 六风格矩阵

| 风格 | 代号 | 美学定调 | 色板 | 代表场景 |
|------|------|----------|------|----------|
| 🇭🇰 港系 | `hk` | 清冷微甜·氧气感·港片褪色暖调 | `#d4af37` | 浅水湾·石澳·天星小轮·重庆大厦 |
| 🇯🇵 日系 | `jp` | 温柔青涩·棉花糖氧气感·柔焦奶油散景 | `#f0a6b5` | 樱花道·图书馆窗光·便利店暖光 |
| 🇰🇷 韩系 | `kr` | 氛围感·MZ冷调·赛璐璐光泽 | `#8ecae6` | 圣水洞·弘大霓虹·汉江野餐 |
| 🇺🇸 纽约 | `ny` | 美式自信·街头随性·高对比时装调 | `#ff595e` | 第五大道·苏活区·高线公园 |
| 🌴 加州 | `ca` | 阳光灿烂·邻家真实·小麦肌 | `#ffb703` | Santa Monica·Venice·Malibu |
| 👙 比基尼 | `bikini` | 日系夏日女友·四要素必含 | `#ff8fab` | 冲绳·湘南·伊豆·镰仓·静冈 |

`比基尼特辑` 严格遵循 `jp-bikini-summer-50.md`：每条必含 **颜色 / 款式 / 材质 / 日本海岸线地点**，5 条海岸线各 10 组。

> 全风格统一红线：**严禁男友视角 / 偷拍 / 恶作剧 / 机械摆拍词 / 方括号 `[]` 圆括号 `()` 加号 `+`**。

## 🚀 快速开始

**环境：** Node.js 18+

```bash
npm install
# 配置 OpenAI
cp .env.example .env.local
# .env.local 填入：
# OPENAI_API_KEY=sk-...
# OPENAI_MODEL=gpt-4o-mini
# OPENAI_BASE_URL=https://api.openai.com/v1  # 可选，支持中转

npm run dev      # 开发：http://localhost:3000
npm run build    # 构建：vite + esbuild -> dist/
npm start        # 生产：node dist/server.cjs
```

## 🔌 API

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/health` | 健康检查 `{hasOpenAIKey, model, supportedStyles}` |
| `GET` | `/api/styles` | 六风格元数据 |
| `POST` | `/api/generate-prompt` | 生成提示词 `body: {style, theme, beautyType, outfit, location, composition, lighting, focalLength, filmTone, aspectRatio, customKeywords}` |

无 `OPENAI_API_KEY` 时自动降级为确定性拼接，保证离线可用。

## 📁 目录结构

```
server.ts                 # Express + Vite 混合服务
server/stylePrompts.ts    # 六风格 SystemPrompt
src/data/styleConfig.ts   # 风格元数据（色板/标签）
src/data/presets_*.ts     # 400+ 预设（分风格）
src/data/curated_*.ts     # 92 组精选
src/data/curatedAll.ts    # 合并导出
src/components/           # Header / PromptCard / Generator / Library 等
```

## 🎨 前端特性

- 顶部风格胶囊筛选（`全部 / HK / JP / KR / NY / CA / Bikini`）
- 主题 + 搜索 + 收藏过滤 + 清空
- AI 灵感工作台：风格体系 → 主题 → 容颜/穿搭/场景/构图/光影 → 镜头/画幅 → 附加灵感 → 生成
- 预设库：按风格/分类/关键词过滤，400+ 卡片一键载入工作台
- 批量导出：按风格/范围筛选，支持 `TXT / MD / JSON / CSV`
- 风格化卡片：胶囊色、边框悬停色、收藏星跟随 `accent`

## 🔧 配置

`.env.example`：

```
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"
# OPENAI_BASE_URL="https://api.openai.com/v1"
APP_URL="http://localhost:3000"
```

## 📄 许可

MIT. Skills 语汇库源自 `opencode-visual-config` 七风格工作坊（HK/JP/KR/NY/CA/UK/WF）。
