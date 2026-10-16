---
name: photobook-studio
description: "Run, extend, and call the photobook prompt studio API."
version: 0.1.0
author: aifeifei798, Hermes Agent
license: MIT
platforms: [linux, macos]
metadata:
  hermes:
    tags: [photobook, ai-prompts, express, api]
    related_skills: [photobook-prompt-guard, photobook-style-recipes]
---

# Photobook Studio Skill

global-style-photobook-studio (repo: /home/feifei/develop/global-style-photobook-studio) — Express + Vite studio that generates SkillGuard-validated Chinese AI image prompts for six styles: hk jp kr ny ca bikini.

## When to Use
- User wants to install, start, stop, or health-check the studio server
- User wants to generate or validate prompts through the studio API
- User wants to add a style/preset or change SkillGuard rules
- Don't use for: prompt writing without the project — use photobook-prompt-guard / photobook-style-recipes

## Quick Reference
| Task | Command |
|---|---|
| One-shot setup (deps, .env, lint, tests, build) | `./install.sh` |
| Start production in background | `./server.sh start` |
| Status / logs / stop / restart | `./server.sh status` / `logs [N]` / `stop` / `restart` |
| Dev mode (Vite HMR) | `./server.sh dev` |
| Unit tests | `./server.sh test` |
| Typecheck | `npm run lint` (tsc --noEmit) |

## API (default port 3000, override with PORT)
- `GET /api/health` — status, hasOpenAIKey, model, supportedStyles, skillVersions
- `GET /api/styles` — six styles with skill versions
- `POST /api/generate-prompt` — `{style, theme, beautyType, outfit, location, composition, lighting, focalLength, filmTone, aspectRatio, customKeywords}` → `{success, data:{promptZh, promptEn, skill, skillValid, skillErrors}}`
- `POST /api/validate-prompt` — `{style, promptZh, promptEn}` → `{success, data:{valid, errors, cleanedZh, cleanedEn}}`

Full request/response shapes and curl examples: references/api.md.

## Offline fallback semantics
If `OPENAI_API_KEY` is unset or left as the placeholder `MY_OPENAI_API_KEY`, `/api/generate-prompt` uses the deterministic handcrafted generator instead of OpenAI. `/api/health` reports `hasOpenAIKey: false` in that case — this is by design, not a bug.

## Adding a new style (all four files must be updated)
1. `src/data/styleConfig.ts` — STYLE_META entry (id + accent hex)
2. `server/stylePrompts.ts` — STYLE_SYSTEM_PROMPTS, STYLE_LABELS, STYLE_SKILL_VERSION
3. `server.ts` — health/styles endpoints
4. `src/App.tsx` — blind-box themesByStyle
Then verify: `npm run lint && npm run test && npm run build`.

## Pitfalls
- `npm start` and `server.sh start` require a prior build (`dist/server.cjs`); server.sh builds automatically if missing
- Rate limit on generate-prompt: 20 req/min per IP → 429
- Unknown `/api/*` routes return JSON 404, not SPA HTML
- Set `DISABLE_HMR=true` in dev when many files are being edited at once

## Verification
`./server.sh status` prints the health JSON; a generate-prompt curl returns `skillValid: true`.
