# Studio API Reference

Base: `http://localhost:3000` (PORT env overrides). All responses are JSON.

## GET /api/health
```json
{
  "status": "ok",
  "hasOpenAIKey": false,
  "hasGeminiKey": false,
  "model": "gpt-4o-mini",
  "supportedStyles": ["hk", "jp", "kr", "ny", "ca", "bikini"],
  "skillVersions": { "hk": "hk-visual-prompts v1.0.0", "...": "..." }
}
```
`hasOpenAIKey` is false when the key is unset OR still the placeholder `MY_OPENAI_API_KEY`.

## GET /api/styles
Six styles with id, label, accent color, skill version.

## POST /api/generate-prompt
Body (all optional except style):
```json
{
  "style": "bikini",
  "theme": "夏日海滩",
  "beautyType": "清冷文艺氧气千金",
  "outfit": "...",
  "location": "冲绳",
  "composition": "...",
  "lighting": "...",
  "focalLength": "85mm",
  "filmTone": "经典柯达Portra 400暖调微颗粒胶片质感",
  "aspectRatio": "3:4",
  "customKeywords": "..."
}
```
Response:
```json
{
  "success": true,
  "data": {
    "promptZh": "50mm标准视角全身构图，冲绳青之洞窟浅滩礁石，...",
    "promptEn": "...",
    "skill": "jp-visual-prompts + jp-bikini-summer-50.md",
    "skillValid": true,
    "skillErrors": []
  }
}
```
Behavior notes:
- For `bikini`, missing color/cut/fabric/location are auto-filled by `applyBikiniDefaults` before generation.
- Rate limit: 20 requests per 60 seconds per IP → HTTP 429 with `{success:false, message:"请求过于频繁，请稍后再试"}`.
- On OpenAI failure the server retries once at temperature 0.7, then falls back to the deterministic generator.

curl example:
```bash
curl -s -X POST http://localhost:3000/api/generate-prompt \
  -H 'Content-Type: application/json' \
  -d '{"style":"hk","theme":"旧港光影","aspectRatio":"3:4"}'
```

## POST /api/validate-prompt
Body: `{ "style": "hk", "promptZh": "...", "promptEn": "..." }`
Response: `{ success: true, data: { valid, errors, cleanedZh, cleanedEn } }`
Errors are strings like `包含违禁词:标准微笑`, `比基尼缺少颜色要素（...）`, `EN:英文长度不足`.

## Unknown routes
Any unmatched `/api/*` → 404 `{ "success": false, "message": "接口不存在" }`.
