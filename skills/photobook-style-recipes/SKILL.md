---
name: photobook-style-recipes
description: "Six-style photobook prompt recipes with film-tone presets."
version: 0.1.0
author: aifeifei798, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [ai-prompts, photography, photobook]
    related_skills: [photobook-studio, photobook-prompt-guard]
---

# Photobook Style Recipes Skill

Condensed recipes extracted from `server/stylePrompts.ts` of global-style-photobook-studio. Full per-style word banks: references/recipes.md.

## Style matrix
| Style | Accent | Lens | Film tone | Signature scenes | Mood words |
|---|---|---|---|---|---|
| hk 港系 | #d4af37 | 35mm / 85mm f/1.4 | Portra 400 warm faded | 中环石板街 天星小轮 石澳 旺角雨后 | 清冷微甜 疏离自洽 |
| jp 日系 | #f0a6b5 | 50–85mm f/1.4–2.0 | Portra 400 / Pro 400H | 校园图书馆 樱花道 便利店 芦苇荡 | 温柔青涩 氧气感 |
| kr 韩系 | #8ecae6 | 35–85mm f/1.4–2.0 | Portra 400 cool cel | 汉江野餐 弘大霓虹 圣水洞 雨天玻璃窗 | 克制心动 |
| ny 纽约 | #ff595e | 35–85mm f/1.4–2.8 | Portra 400 high contrast | 第五大道 苏活区 布鲁克林大桥 高线公园 | 自信洒脱 |
| ca 加州 | #ffb703 | 35–85mm f/1.8–2.8 | Portra 400 saturated warm | Santa Monica 码头 Venice 涂鸦 Malibu | 阳光活力 |
| bikini | #ff8fab | 50/85mm f/1.8 soft | Portra 400 / Pro 400H | 冲绳青之洞窟 七里滨 稻村崎 | 初恋杂志质感 |

## 5-element skeleton (strict order)
构图景别 → 动态神态 (natural motion, never posed) → 穿搭细节 (color + fabric + cut) → 环境实景 (real locations) → 光影胶片 (lens + light + film stock)

## Film tone presets (8, category `film`)
Portra 400 暖调微颗粒 / Portra 800 高感柔暖 / Pro 400H 清冷通透 / Superia 400 千禧快照 / Gold 200 复古金色 / Ilford HP5 黑白银盐 / Velvia 50 高饱和正片 / 拍立得柔焦即时成像

## Output format switch (src/utils/formatPrompt.ts)
- flux → raw promptZh
- mj → promptEn + ` --ar {aspectRatio} --v 6.1 --style raw`
- en → promptEn

## Pitfalls
- Bikini prompts additionally require the four explicit elements — see photobook-prompt-guard
- Never use brackets, parentheses, or plus signs even inside scene or film names
- Chinese is the source of truth; English is only a translation for MJ/EN formats
