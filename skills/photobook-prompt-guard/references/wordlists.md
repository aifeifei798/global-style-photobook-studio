# SkillGuard Word Lists (exact, from server/skillGuard.ts)

## Forbidden phrases (all styles, zh and en checked)
男友视角 · 偷拍 · 恶作剧 · 偷吃 · 偷看他 · 标准微笑 · 手叉腰 · 比耶 · 凹造型 · 摆 pose · 摆pose · 正对镜头尬笑

## Forbidden characters (all styles)
`[` `]` `(` `)` `+`

## Bikini-only forbidden
性暗示 · 暴露 · 色情 · 低俗

## Lens/film keyword requirement (at least one)
mm · 毫米 · 光圈 · 胶片 · Portra · Fujifilm · Pro 400 · 柯达 · 富士 · 颗粒 · 逆光 · 柔焦 · 散景 · f/

## Bikini four required elements
- Colors: 奶油白 珍珠粉 薄荷绿 浅杏 燕麦 淡紫 淡蓝 浅橘 樱花粉 天蓝 珍珠白 鹅黄 浅紫 薄荷 淡粉
- Cuts: 系带三角 挂脖 荷叶边 蝴蝶结 运动风 连体 高腰 平角 抹胸 三角
- Fabrics: 弹力针织 细罗纹 水洗棉 弹力蕾丝 蕾丝 亚麻混纺 速干莱卡 莱卡 棉质 针织 弹力 编织 细编织
- Locations (real Japanese coastline): 冲绳 青之洞窟 万座毛 古宇利 湘南 江之岛 江之电 七里滨 由比 伊豆 热海 来宫 河津 镰仓 逗子 三浦 稻村崎 静冈 滨松 远州滩 美国村

## cleanSkillViolations steps (run before validation)
1. Strip `[]()+`
2. Remove leading `-`/`*` bullets and `1.`/`1、` numbering
3. Collapse newlines to spaces, collapse runs of spaces
4. Strip surrounding quotes and code fences
