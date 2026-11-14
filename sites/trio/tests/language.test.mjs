import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLanguage, languageTarget } from '../src/language.mjs';

test('shared preference, browser and explicit routes choose one supported language', () => {
  assert.equal(resolveLanguage({ saved: 'es', browser: 'en-US' }), 'es');
  assert.equal(resolveLanguage({ browser: 'en-US' }), 'en');
  assert.equal(resolveLanguage({ browser: 'de-DE', saved: 'xx' }), 'pt');
  assert.equal(resolveLanguage({ language: 'en', saved: 'pt' }), 'en');
  assert.equal(resolveLanguage({ language: 'es', search: '?lang=pt', saved: 'en' }), 'pt');
  assert.equal(resolveLanguage({ search: '?lang=xx', saved: 'es' }), 'es');
});

test('language navigation stays under Trio and keeps the section and other query values', () => {
  const urls = { pt: '../', en: '../en/', es: '../es/' };
  assert.equal(languageTarget('es', { urls, href: 'https://allm4.com/trio/en/?lang=es&ref=home#installation' }), 'https://allm4.com/trio/es/?ref=home#installation');
  assert.throws(() => languageTarget('https://example.com', { urls, href: 'https://allm4.com/trio/' }));
});
