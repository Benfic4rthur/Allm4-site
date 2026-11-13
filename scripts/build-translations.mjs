import { readFileSync, writeFileSync, cpSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const languages = ['en', 'es'];
const dictionaries = Object.fromEntries(languages.map(code => [code, JSON.parse(readFileSync(new URL(`lib/i18n/${code}.json`, root), 'utf8'))]));
const assetVersion = createHash('sha256').update(JSON.stringify(dictionaries)).update(readFileSync(new URL('public/i18n/standalone.js', root))).digest('hex').slice(0, 12);
writeFileSync(new URL('public/i18n/translations.js', root), `window.ALLM4_TRANSLATIONS=${JSON.stringify(dictionaries)};\n`);
mkdirSync(new URL('sites/gelamac/lib/i18n', root), { recursive: true });
cpSync(new URL('lib/i18n', root), new URL('sites/gelamac/lib/i18n', root), { recursive: true });
writeFileSync(new URL('sites/gelamac/components/language-bar.tsx', root), readFileSync(new URL('components/language-bar.tsx', root), 'utf8').replaceAll('@/lib/i18n/runtime', '../lib/i18n/runtime'));
for (const name of ['jacopiei', 'alwaysdarkmode']) {
 const path = new URL(`public/${name}/index.html`, root);
 let html = readFileSync(path, 'utf8');
 if (!html.includes('/i18n/standalone.js')) html = html.replace('</head>', '<link rel="stylesheet" href="/i18n/language.css">\n<script defer src="/i18n/translations.js"></script>\n<script defer src="/i18n/standalone.js"></script>\n</head>');
 html = html.replace(/\/i18n\/(translations|standalone)\.js(?:\?v=[a-f0-9]+)?/g, `/i18n/$1.js?v=${assetVersion}`);
 writeFileSync(path, html);
}
