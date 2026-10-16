import { ALL_CURATED_PROMPTS } from '../src/data/curatedAll';

const themes = new Set<string>();
for (const p of ALL_CURATED_PROMPTS) themes.add(p.theme);
console.log(JSON.stringify([...themes]));
