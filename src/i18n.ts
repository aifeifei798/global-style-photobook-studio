export type Lang = 'zh' | 'en';

export const LANGS: Lang[] = ['zh', 'en'];

/** UI string dictionary. `{var}` placeholders are interpolated via t(). */
const UI: Record<string, { zh: string; en: string }> = {
  // Brand
  'brand': { zh: '全球风格写真提示词工作室', en: 'Global Style Photobook Prompt Studio' },
  'brandShort': { zh: '写真提示词工作室', en: 'Photobook Prompt Studio' },
  'brandTagline': { zh: '港系 · 日系 · 韩系 · 纽约 · 加州 · 比基尼 · 6 大风格 · 382 预设 · 92 精选提示词', en: 'HK · JP · KR · NY · CA · Bikini · 6 styles · 382 presets · 92 curated prompts' },
  'langSwitch': { zh: '语言', en: 'Language' },

  // Brief bar
  'briefTitle': { zh: '写作守则速览', en: 'Writing Rules at a Glance' },
  'brief1': { zh: '单一连贯段落，150-320 字，禁止方括号与加号', en: 'One coherent paragraph, 150-320 chars, no brackets or plus signs' },
  'brief2': { zh: '穿搭写具体单品，地点写具体地名，拒绝摆拍', en: 'Name specific garments and places, no posed stock shots' },
  'brief3': { zh: '每个提示词必须含镜头/胶片关键词', en: 'Every prompt must include a lens/film keyword' },

  // Tabs
  'tabCurated': { zh: '精选提示词', en: 'Curated Prompts' },
  'tabPresets': { zh: '预设库', en: 'Preset Library' },
  'tabDirector': { zh: 'AI 导演手册', en: 'AI Director Handbook' },
  'tabLookbook': { zh: '写真集', en: 'Lookbook' },
  'tabFavorites': { zh: '收藏', en: 'Favorites' },

  // Header
  'searchPlaceholder': { zh: '搜索提示词、标签、地点…', en: 'Search prompts, tags, locations…' },
  'allThemes': { zh: '全部主题', en: 'All Themes' },
  'clearFilters': { zh: '清除筛选', en: 'Clear filters' },
  'filterStyle': { zh: '风格', en: 'Style' },
  'favoritesOnly': { zh: '仅收藏', en: 'Favorites only' },
  'resultsCount': { zh: '{count} 条提示词', en: '{count} prompts' },

  // Prompt card
  'promptLabel': { zh: '提示词', en: 'Prompt' },
  'formatLabel': { zh: '格式', en: 'Format' },
  'tagsLabel': { zh: '标签', en: 'Tags' },
  'copyPrompt': { zh: '复制提示词', en: 'Copy prompt' },
  'copied': { zh: '已复制', en: 'Copied' },
  'favorite': { zh: '收藏', en: 'Save' },
  'favorited': { zh: '已收藏', en: 'Saved' },
  'curatedBadge': { zh: '精选', en: 'Curated' },
  'emptyTitle': { zh: '没有匹配的提示词', en: 'No matching prompts' },
  'emptyHint': { zh: '试试清除筛选，或从预设库组合生成新的提示词。', en: 'Try clearing filters, or generate new prompts from the preset library.' },
  'footerNote': { zh: '提示词遵循 SkillGuard 硬约束：单段连贯 · 无括号 · 无摆拍', en: 'Prompts follow SkillGuard hard rules: single paragraph · no brackets · no posed shots' },

  // Preset library
  'presetLibraryTitle': { zh: '预设库', en: 'Preset Library' },
  'presetLibrarySub': { zh: '选择预设组合，生成提示词', en: 'Pick preset combinations to generate prompts' },
  'presetSearchPlaceholder': { zh: '搜索预设…', en: 'Search presets…' },
  'selectedPresets': { zh: '已选 {count} 个预设', en: '{count} presets selected' },
  'generatePrompt': { zh: '生成提示词', en: 'Generate prompts' },
  'clearSelection': { zh: '清空选择', en: 'Clear selection' },
  'categoryBeauty': { zh: '美女类型', en: 'Beauty Type' },
  'categoryOutfit': { zh: '穿搭时尚', en: 'Outfit & Fashion' },
  'categoryScene': { zh: '拍摄地点', en: 'Location' },
  'categoryComposition': { zh: '构图镜头', en: 'Composition & Lens' },
  'categoryLighting': { zh: '灯光效果', en: 'Lighting' },
  'categoryFilm': { zh: '胶片影调', en: 'Film Tone' },
  'category光影胶片': { zh: '光影胶片', en: 'Light & Film' },

  // Generator modal
  'generatorTitle': { zh: '组合生成提示词', en: 'Generate Prompt Combinations' },
  'generatorSub': { zh: '从预设组合生成符合 SkillGuard 的提示词', en: 'Build SkillGuard-compliant prompts from preset combinations' },
  'fieldCount': { zh: '生成数量', en: 'Number of prompts' },
  'fieldBeauty': { zh: '美女类型', en: 'Beauty type' },
  'fieldOutfit': { zh: '穿搭', en: 'Outfit' },
  'fieldScene': { zh: '地点', en: 'Location' },
  'fieldComposition': { zh: '构图', en: 'Composition' },
  'fieldLighting': { zh: '灯光', en: 'Lighting' },
  'fieldKeyword': { zh: '自定义关键词', en: 'Custom keywords' },
  'fieldKeywordPlaceholder': { zh: '例如：樱花, 逆光, 35mm', en: 'e.g. cherry blossoms, backlight, 35mm' },
  'fieldPlatform': { zh: '目标平台', en: 'Target platform' },
  'fieldRatio': { zh: '画面比例', en: 'Aspect ratio' },
  'randomCombo': { zh: '随机组合', en: 'Random combo' },
  'close': { zh: '关闭', en: 'Close' },

  // Batch export
  'exportTitle': { zh: '批量导出', en: 'Batch Export' },
  'exportSub': { zh: '导出当前筛选的提示词', en: 'Export the currently filtered prompts' },
  'exportFormat': { zh: '导出格式', en: 'Export format' },
  'exportMarkdown': { zh: 'Markdown', en: 'Markdown' },
  'exportCsv': { zh: 'CSV', en: 'CSV' },
  'exportJson': { zh: 'JSON', en: 'JSON' },
  'exportCount': { zh: '{count} 条提示词待导出', en: '{count} prompts ready to export' },
  'exportButton': { zh: '导出', en: 'Export' },
  'csvHeaderTitle': { zh: '标题', en: 'Title' },
  'csvHeaderStyle': { zh: '风格', en: 'Style' },
  'csvHeaderTheme': { zh: '主题', en: 'Theme' },
  'csvHeaderPrompt': { zh: '提示词', en: 'Prompt' },
  'csvHeaderTags': { zh: '标签', en: 'Tags' },

  // Director handbook
  'directorTitle': { zh: 'AI 导演手册', en: 'AI Director Handbook' },
  'directorSub': { zh: '六风格写作守则与胶片参数', en: 'Writing rules and film parameters for all six styles' },

  // Toasts
  'toastCopied': { zh: '提示词已复制到剪贴板', en: 'Prompt copied to clipboard' },
  'toastFavorited': { zh: '已加入收藏', en: 'Added to favorites' },
  'toastUnfavorited': { zh: '已从收藏移除', en: 'Removed from favorites' },
  'toastGenerated': { zh: '已生成 {count} 条提示词', en: 'Generated {count} prompts' },
  'toastGenerateFailed': { zh: '生成失败，请重试', en: 'Generation failed, please try again' },
  'toastExported': { zh: '已导出 {count} 条提示词', en: 'Exported {count} prompts' },
  'toastBlindBox': { zh: '盲盒生成：{theme} · {style}', en: 'Blind box: {theme} · {style}' },
  'toastBlindBoxOpened': { zh: '🎁 盲盒开箱：{style}·{theme} 灵感卡片已加入顶部！', en: '🎁 Blind box opened: {style} · {theme} — inspiration card added to the top!' },
  'toastBlindBoxOfflineRate': { zh: '⏳ 请求过于频繁，盲盒已离线生成，稍后可重试', en: '⏳ Too many requests — blind box generated offline, retry later' },
  'toastBlindBoxOffline': { zh: '🎁 盲盒已生成（离线）· {style}·{theme}', en: '🎁 Blind box generated (offline) · {style} · {theme}' },
  'toastNeedSelection': { zh: '至少选择一个预设', en: 'Select at least one preset' },
  'toastSaved': { zh: '已成功收录「{title}」至写真集', en: 'Saved "{title}" to the lookbook' },
  'toastLoaded': { zh: '已载入「{title}」至工作台', en: 'Loaded "{title}" into the studio' },
  'toastPresetLoaded': { zh: '已将预设「{name}」载入工作台', en: 'Preset "{name}" loaded into the studio' },

  // Pagination
  'loadMore': { zh: '加载更多', en: 'Load more' },
  'showingCount': { zh: '显示 {shown} / {total}', en: 'Showing {shown} of {total}' },

  // Themes
  'themeSummer': { zh: '夏日写真', en: 'Summer Shots' },
  'themeStreet': { zh: '都市街拍', en: 'City Street Style' },
  'themeVintage': { zh: '复古胶片', en: 'Vintage Film' },
  'themeCoastal': { zh: '海岸线特辑', en: 'Coastal Series' },
  'themeMood': { zh: '氛围感', en: 'Mood & Atmosphere' },
  'themeEditorial': { zh: '编辑大片', en: 'Editorial Spread' },
};

export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  const entry = UI[key];
  if (!entry) return key;
  let s = entry[lang];
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return s;
}

/** English names for the theme tabs / blind-box themes. */
export const THEME_EN: Record<string, string> = {
  '全部': 'All',
  '全部写真': 'All Shots',
  '夏日写真': 'Summer Shots',
  '都市街拍': 'City Street Style',
  '复古胶片': 'Vintage Film',
  '海岸线特辑': 'Coastal Series',
  '氛围感': 'Mood & Atmosphere',
  '编辑大片': 'Editorial Spread',
  '海风漫游': 'Seaside Strolls',
  '旧港光影': 'Old Harbour Light',
  '绿意庭院': 'Garden Courtyards',
  '文艺天星': 'Artsy Starlight',
  '法式海岛': 'French Islands',
  '池畔日光': 'Poolside Sunlight',
  '校园初恋': 'Campus First Love',
  '自然季节': 'Natural Seasons',
  '海与风': 'Sea & Wind',
  '首尔日常': 'Seoul Daily',
  '心动瞬间': 'Heart-Flutter Moments',
  'K-pop舞台': 'K-pop Stage',
  '街头随性': 'Street Ease',
  '都市地标': 'City Landmarks',
  '时装周': 'Fashion Week',
  '阳光海岸': 'Sunny Coast',
  '加州日常': 'California Daily',
  '公路旅行': 'Road Trip',
  '冲绳海岸': 'Okinawa Coast',
  '湘南海岸': 'Shonan Coast',
  '伊豆热海': 'Izu Atami',
};

/** English labels for preset categoryLabel strings used in the data. */
export const CATEGORY_LABEL_EN: Record<string, string> = {
  '美女类型': 'Beauty Type',
  '穿搭时尚': 'Outfit & Fashion',
  '拍摄地点': 'Location',
  '拍摄风格': 'Shooting Style',
  '灯光效果': 'Lighting',
  '容颜神态': 'Expression & Mood',
  '构图镜头': 'Composition & Lens',
  '光影胶片': 'Light & Film',
  '胶片影调': 'Film Tone',
};

export function themeName(lang: Lang, theme: string): string {
  return lang === 'en' ? THEME_EN[theme] || theme : theme;
}

export function categoryLabel(lang: Lang, label: string): string {
  return lang === 'en' ? CATEGORY_LABEL_EN[label] || label : label;
}
