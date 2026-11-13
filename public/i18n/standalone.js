(() => {
  const key = 'allm4.language.v1';
  const dictionaries = window.ALLM4_TRANSLATIONS || {};
  const available = ['pt', ...Object.keys(dictionaries)];
  let locale = 'pt';
  try { const saved = new URLSearchParams(location.search).get('lang') || localStorage.getItem(key) || navigator.language.split('-')[0]; if (available.includes(saved)) locale = saved; } catch {}
  const textState = new WeakMap();
  const attrState = new WeakMap();
  const patterns = {};
  for (const [code, dictionary] of Object.entries(dictionaries)) patterns[code] = Object.entries(dictionary).filter(([key]) => key.includes('{{')).map(([key, replacement]) => [new RegExp('^' + key.split(/(\{\{\d+\}\})/).map(part => /^\{\{\d+\}\}$/.test(part) ? '(.+?)' : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('') + '$'), replacement]);
  function translate(text) {
    if (locale === 'pt') return text;
    const normalized = text.replace(/\s+/g, ' ').trim();
    let result = dictionaries[locale]?.[normalized];
    if (!result) for (const [regex, replacement] of patterns[locale] || []) { const match = normalized.match(regex); if (match) { result = replacement.replace(/\{\{(\d+)\}\}/g, (_, index) => match[Number(index) + 1] || ''); break; } }
    return result ? text.replace(/\S[\s\S]*\S|\S/, result) : text;
  }
  function updateText(node) {
    if (!node.data.trim() || node.parentElement?.closest('script,style,code,pre,[data-allm4-language]')) return;
    const state = textState.get(node);
    const original = state && state.output === node.data ? state.original : node.data;
    const output = translate(original);
    textState.set(node, { original, output });
    if (output !== node.data) node.data = output;
  }
  function updateElement(element) {
    if (element.matches('[data-allm4-language], [data-allm4-language] *')) return;
    let state = attrState.get(element); if (!state) { state = {}; attrState.set(element, state); }
    for (const attribute of ['aria-label', 'aria-valuetext', 'title', 'alt', 'placeholder', 'content']) {
      if (attribute === 'content' && !element.matches('meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]')) continue;
      const current = element.getAttribute(attribute); if (current === null) continue;
      const original = state[attribute]?.output === current ? state[attribute].original : current;
      const output = translate(original); state[attribute] = { original, output };
      if (output !== current) element.setAttribute(attribute, output);
    }
  }
  function walk(root) {
    if (root.nodeType === Node.TEXT_NODE) { updateText(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE && root !== document) return;
    if (root.nodeType === Node.ELEMENT_NODE) updateElement(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) { if (walker.currentNode.nodeType === Node.TEXT_NODE) updateText(walker.currentNode); else updateElement(walker.currentNode); }
  }
  const bar = document.createElement('nav'); bar.className = 'allm4-language-bar'; bar.dataset.allm4Language = ''; bar.setAttribute('aria-label', 'Language / Idioma');
  const names = { pt: 'Português', en: 'English', es: 'Español' };
  for (const code of available) { const button = document.createElement('button'); button.type = 'button'; button.lang = code; button.textContent = code.toUpperCase(); button.setAttribute('aria-label', names[code]); button.dataset.language = code; button.addEventListener('click', () => setLanguage(code)); bar.appendChild(button); }
  document.body.prepend(bar);
  function setLanguage(code) {
    locale = code; try { localStorage.setItem(key, code); } catch {}
    document.documentElement.lang = code === 'pt' ? 'pt-BR' : code;
    for (const button of bar.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.language === code));
    walk(document);
  }
  setLanguage(locale);
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'characterData') updateText(record.target);
      else if (record.type === 'attributes') updateElement(record.target);
      else for (const added of record.addedNodes) walk(added);
    }
  });
  observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-label','aria-valuetext','title','alt','placeholder','content'] });
})();
