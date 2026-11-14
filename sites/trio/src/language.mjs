const languages = ['pt', 'en', 'es'];
const supported = value => languages.includes(value) ? value : null;

// Explicit language routes stay shareable. A query overrides them; the root
// follows the preference shared with ALLM4, then the browser on a first visit.
export function resolveLanguage({ language = 'pt', search = '', saved, browser = '' } = {}) {
  return supported(new URLSearchParams(search).get('lang'))
    || (language !== 'pt' && supported(language))
    || supported(saved)
    || supported(browser.toLowerCase().split('-')[0])
    || 'pt';
}

export function languageTarget(language, { urls, href }) {
  if (!languages.includes(language)) throw new Error('Unsupported language');
  const current = new URL(href);
  const next = new URL(urls[language], current);
  next.search = current.search;
  next.searchParams.delete('lang');
  next.hash = current.hash;
  return next.href;
}
