# AGENTS.md

## Commands
- `npm run dev` — starts Express + Vite middleware via `tsx server.ts` on `http://localhost:3000` (not `vite` alone).
- `npm run build` — `vite build` (frontend) + `esbuild server.ts --bundle --platform=node --format=cjs --packages=external -> dist/server.cjs`.
- `npm start` — `node dist/server.cjs` serves `dist/` statically; requires prior `build`.
- `npm run lint` — actually `tsc --noEmit` (typecheck only, no ESLint/Prettier).
- `npm run clean` — `rm -rf dist server.js`.
- No test suite exists; no `test` script, no CI/pre-commit config.

## Architecture
- Single-package app, not a monorepo. Two entrypoints: `server.ts` (Express API + Vite SSR/dev) and `src/main.tsx` -> `src/App.tsx`.
- Dev: `server.ts:309` creates Vite in `middlewareMode` and mounts `vite.middlewares`. Prod: serves `dist/` static + SPA fallback `* -> index.html`.
- Frontend: React 19 + Vite 6 + Tailwind 4 via `@tailwindcss/vite` (`src/index.css` has only `@import "tailwindcss"`). `@vitejs/plugin-react` for JSX.
- Path alias `@` resolves to repo root (`.`) per `vite.config.ts:71` and `tsconfig.json:18` (`@/* -> ./*`).
- Data layer: `src/data/styleConfig.ts` (6 `StyleMeta`), `src/data/presets_*.ts` (374 presets), `src/data/curated_*.ts` + `curatedAll.ts` (92 curated prompts), `src/utils/formatPrompt.ts` (flux/mj/en switch).

## Env & Server
- `import 'dotenv/config'` in `server.ts:1` loads `.env` and `.env.local` (both gitignored except `.env.example`).
- Required: `OPENAI_API_KEY` (if absent, `/api/generate-prompt` falls back to deterministic handcrafted generator — `server.ts:82`). Optional: `OPENAI_MODEL` (default `gpt-4o-mini`), `OPENAI_BASE_URL`, `PORT` (default `3000`), `APP_URL`. `GEMINI_API_KEY` is legacy, only echoed in `/api/health`.
- Dual lockfiles present: `bun.lock` + `package-lock.json`; either `npm install` or `bun install` works but keep both in sync.
- Node 18+ required.

## API
- `GET /api/health` -> `{ status, hasOpenAIKey, hasGeminiKey, model, supportedStyles: ['hk','jp','kr','ny','ca','bikini'], skillVersions }`
- `GET /api/styles` -> 6 styles with `skill` version.
- `POST /api/generate-prompt` body `{ style, theme, beautyType, outfit, location, composition, lighting, focalLength, filmTone, aspectRatio, customKeywords }` -> `data: { promptZh, promptEn, skill, skillValid, skillErrors }`. Retries once on SkillGuard failure at `temperature:0.7` (`server.ts:228`).
- `POST /api/validate-prompt` body `{ style, promptZh, promptEn }` -> `{ valid, errors, cleanedZh, cleanedEn }` (thin wrapper over `skillGuard.ts:75 validateAndClean`).

## SkillGuard — Prompt Hard Constraints
- All prompts are single coherent Chinese paragraph, 150-320 chars (guard enforces 80-600 at `skillGuard.ts:45`). Must contain `，`/`,`/`；` and at least one lens/film keyword (`mm`, `光圈`, `胶片`, `Portra`, `逆光`, `柔焦`, `散景`, `f/`).
- Forbidden everywhere: `[]` `()` `+` (`FORBIDDEN_CHARS_RE` at `skillGuard.ts:10`), phrases `男友视角` `偷拍` `恶作剧` `偷吃` `标准微笑` `手叉腰` `比耶` `凹造型` `摆pose`/`摆 pose` `正对镜头尬笑` (`skillGuard.ts:4`). No markdown list/bullet/numbering, no `\n` — enforced by `cleanSkillViolations` and `validatePromptZh`.
- Bikini style (`bikini`) additionally requires 4 explicit elements — color (`BIKINI_COLORS`), cut (`BIKINI_CUTS`), fabric (`BIKINI_FABRICS`), Japanese coastline (`BIKINI_LOCATIONS`) at `skillGuard.ts:66`; offline fallback injects defaults `奶油白系带三角比基尼…细罗纹弹力针织` + `冲绳青之洞窟浅滩礁石` (`server.ts:104`).
- System prompts live in `server/stylePrompts.ts:5 STYLE_SYSTEM_PROMPTS` — 6 skills replicating `~/.config/opencode/skills/*/SKILL.md v1.0.0` §1-8 and `jp-bikini-summer-50.md` for bikini. `STYLE_SKILL_VERSION` is the version anchor; `GET /api/health` exposes it.
- `cleanSkillViolations` (`skillGuard.ts:32`) strips `[]()+`, leading `-/1.` markers, collapses newlines, trims quotes — always run before validation; do not reintroduce brackets in prompts.

## Frontend Quirks
- `vite.config.ts:8 aistudioMediaPlugin` serves `/assets/aistudio/*` from `public/assets/aistudio/` with directory-traversal guard + MIME map; don't break the `filePath.startsWith(aistudioDir + path.sep)` check.
- `vite.config.ts:78` HMR/file-watching disabled when `DISABLE_HMR=true` (AI Studio). `watch: null` saves CPU during agent edits.
- `src/utils/formatPrompt.ts:5` — `flux` returns raw `promptZh`, `mj` appends ` --ar {aspectRatio} --v 6.1 --style raw` to `promptEn`, `en` returns `promptEn`. Respect this when adding formats.
- Favorites persisted to `localStorage` key `vogue_hk_favorites` (`src/App.tsx:20`).

## Style Matrix
- Canonical 6 ids: `hk` `#d4af37`, `jp` `#f0a6b5`, `kr` `#8ecae6`, `ny` `#ff595e`, `ca` `#ffb703`, `bikini` `#ff8fab` — defined in `src/data/styleConfig.ts:16 STYLE_META` and `server/stylePrompts.ts:144 STYLE_LABELS`. Keep both files in sync when adding styles.
- Any new style needs entries in: `styleConfig.ts` + `server/stylePrompts.ts` (`STYLE_SYSTEM_PROMPTS`, `STYLE_LABELS`, `STYLE_SKILL_VERSION`) + `server.ts` health/styles endpoints + `src/App.tsx` blind-box `themesByStyle`.
