---
name: photobook-prompt-guard
description: "Write Chinese image prompts that pass SkillGuard checks."
version: 0.1.0
author: aifeifei798, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [ai-prompts, validation, photobook]
    related_skills: [photobook-studio, photobook-style-recipes]
---

# Photobook Prompt Guard Skill

Hard constraints enforced by `server/skillGuard.ts` in global-style-photobook-studio. Every prompt destined for the studio must satisfy these rules.

## Hard rules (all six styles)
1. Single coherent Chinese paragraph; 150–320 chars target (guard rejects <80 or >600)
2. Must contain ， , or ; connectors
3. Must contain at least one lens/film keyword: mm, 毫米, 光圈, 胶片, Portra, Fujifilm, 柯达, 富士, 颗粒, 逆光, 柔焦, 散景, f/
4. Never contains `[ ] ( ) +`
5. Never contains forbidden phrases: 男友视角 偷拍 恶作剧 偷吃 偷看他 标准微笑 手叉腰 比耶 凹造型 摆pose 摆 pose 正对镜头尬笑
6. No newlines, no markdown bullets or numbering
7. Weave the 5 elements in order: 构图景别 → 动态神态 → 穿搭细节 → 环境实景 → 光影胶片

## Bikini-only extras
- Also forbidden: 性暗示 暴露 色情 低俗
- Must explicitly include all four elements: color + cut + fabric + a real Japanese coastline location (exact word lists in references/wordlists.md)
- Offline fallback injects defaults: 奶油白系带三角比基尼，面料细罗纹弹力针织配蕾丝滚边 / 冲绳青之洞窟浅滩礁石

## Procedure
1. Draft the prompt with the 5-element skeleton (recipes in photobook-style-recipes)
2. Self-check rules 1–7 before submitting
3. `POST /api/validate-prompt`; on failure apply the clean step (strip `[]()+`, bullets, newlines) and re-validate
4. Ship only when `valid: true`

## Verification
```bash
curl -s -X POST localhost:3000/api/validate-prompt \
  -H 'Content-Type: application/json' \
  -d '{"style":"hk","promptZh":"...","promptEn":"..."}'
```
Returns `{valid, errors, cleanedZh, cleanedEn}`.
