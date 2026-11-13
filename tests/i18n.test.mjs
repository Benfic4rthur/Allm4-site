import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import React from 'react';
const dictionary = JSON.parse(readFileSync(new URL('../lib/i18n/en.json', import.meta.url)));
const spanishDictionary = JSON.parse(readFileSync(new URL('../lib/i18n/es.json', import.meta.url)));
const source = readFileSync(new URL('../lib/i18n/runtime.tsx', import.meta.url), 'utf8').replace('import english from "./en.json";', `const english = ${JSON.stringify(dictionary)};`).replace('import spanish from "./es.json";', `const spanish = ${JSON.stringify(spanishDictionary)};`).replace('from "react"', `from ${JSON.stringify(pathToFileURL(import.meta.resolve('react').replace('file://', '')).href)}`);
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const runtime = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const storage = new Map();
globalThis.localStorage = { setItem: (key, value) => storage.set(key, value), getItem: key => storage.get(key) ?? null };
globalThis.document = { documentElement: { lang: 'pt-BR' } };
globalThis.window = { dispatchEvent() {} };

test('natural copy, whitespace and live values are translated without touching product identities', () => {
  assert.equal(runtime.translate('  Software para uma\n', 'en'), '  Software for a\n');
  assert.equal(runtime.translate('Conhecer Beira (abre em nova aba)', 'en'), 'Explore Beira (opens in a new tab)');
  assert.equal(runtime.translate('Revisar 2 arquivos', 'en'), 'Review 2 files');
  assert.equal(runtime.translate('Brilho na demonstração', 'en'), 'Brightness in the demo');
  assert.equal(runtime.translate('JáCopiei?', 'en'), 'JáCopiei?');
  assert.equal(runtime.translate('xattr -dr com.apple.quarantine /Applications/Beira.app', 'en'), 'xattr -dr com.apple.quarantine /Applications/Beira.app');
});

test('switching preserves keys, links, event handlers and animation properties', () => {
  const handler = () => {};
  const original = React.createElement('a', { key:'beira', id:'sobre', href:'/beira/', onClick:handler, 'data-story':3, 'aria-label':'Conhecer Beira (abre em nova aba)' }, React.createElement('span', null, 'Conhecer app'));
  runtime.setSiteLanguage('en');
  const translated = runtime.localizeTree(original);
  assert.equal(translated.key, original.key);
  assert.equal(translated.props.id, 'sobre');
  assert.equal(translated.props.href, '/beira/');
  assert.equal(translated.props.onClick, handler);
  assert.equal(translated.props['data-story'], 3);
  assert.equal(translated.props['aria-label'], 'Explore Beira (opens in a new tab)');
  assert.equal(translated.props.children.props.children, 'Explore app');
  runtime.setSiteLanguage('pt');
  assert.equal(runtime.localizeTree(original), original);
  assert.equal(document.documentElement.lang, 'pt-BR');
});

test('the preference survives navigation and works when browser storage is unavailable', () => {
  runtime.setSiteLanguage('en');
  globalThis.location = { search:'' };
  runtime.initializeSiteLanguage();
  assert.equal(document.documentElement.lang, 'en');
  globalThis.location = { search:'?lang=pt' };
  runtime.initializeSiteLanguage();
  assert.equal(document.documentElement.lang, 'pt-BR');
  const previous = globalThis.localStorage;
  globalThis.localStorage = { getItem(){ throw Error('blocked'); }, setItem(){ throw Error('blocked'); } };
  globalThis.location = { search:'?lang=en' };
  assert.doesNotThrow(() => runtime.initializeSiteLanguage());
  assert.equal(document.documentElement.lang, 'en');
  globalThis.localStorage = previous;
});

test('both languages cover the complete catalog and preserve dynamic placeholders', () => {
  assert.deepEqual(Object.keys(spanishDictionary).sort(), Object.keys(dictionary).sort());
  for (const [source, target] of Object.entries(spanishDictionary)) {
    assert.ok(target.trim(), source);
    assert.ok(!target.includes("\t"), `Unexpected tab in ${source}`);
    assert.deepEqual((target.match(/\{\{\d+\}\}/g) ?? []).sort(), (dictionary[source].match(/\{\{\d+\}\}/g) ?? []).sort(), source);
  }
  assert.equal(runtime.translate('Brilho na demonstração', 'es'), 'Brillo en la demostración');
  assert.equal(runtime.translate('Revisar 2 arquivos', 'es'), 'Revisar 2 archivos');
  assert.equal(runtime.translate('Sou Arthur Benfica, desenvolvedor full stack e criador do ALLM4. Aqui estão os aplicativos e extensões que crio e mantenho, da ideia à publicação.', 'es'), 'Soy Arthur Benfica, desarrollador full stack y creador de ALLM4. Aquí están las aplicaciones y extensiones que diseño, desarrollo y mantengo, desde la primera idea hasta su publicación.');
  runtime.setSiteLanguage('es');
  assert.equal(document.documentElement.lang, 'es');
  assert.equal(runtime.translate('Em andamento'), 'En curso');
  runtime.setSiteLanguage('pt');
});
