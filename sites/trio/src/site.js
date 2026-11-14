import { resolveRelease } from './release.mjs';
import { resolveLanguage, languageTarget } from './language.mjs';

const runtime = JSON.parse(document.querySelector('#trio-runtime').textContent);
const { copy, language, base } = runtime;
const root = document.documentElement;
const storage = { get(key) { try { return localStorage.getItem(key); } catch { return null; } }, set(key, value) { try { localStorage.setItem(key, value); } catch {} } };
const languageKey = 'allm4.language.v1';
const languageUrls = { pt: `${base}/`, en: `${base}/en/`, es: `${base}/es/` };
const requestedLanguage = resolveLanguage({ language, search: location.search, saved: storage.get(languageKey), browser: navigator.language });
function navigateLanguage(next) {
  if (!['pt', 'en', 'es'].includes(next)) return;
  storage.set(languageKey, next);
  if (next !== language) location.replace(languageTarget(next, { urls: languageUrls, href: location.href }));
}
document.querySelectorAll('[data-language]').forEach(link => {
  if (link.dataset.language === language) link.setAttribute('aria-current', 'page');
  link.addEventListener('click', () => storage.set(languageKey, link.dataset.language));
});
navigateLanguage(requestedLanguage);
addEventListener('storage', event => { if (event.key === languageKey) navigateLanguage(event.newValue); });
const announcer = document.querySelector('.live-announcement');
let announcementTimer;
function announce(message) {
  clearTimeout(announcementTimer);
  announcer.textContent = message;
  announcementTimer = setTimeout(() => { announcer.textContent = ''; }, 2400);
}
const reducedSystem = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = storage.get('trio.reducedMotion') === 'true' || reducedSystem.matches;
function setMotion(value) {
  reduced = value;
  root.dataset.reduced = String(value);
  root.dataset.reveal = String(!value && Boolean(window.ScrollCraft));
  document.querySelector('[data-motion]').setAttribute('aria-pressed', String(value));
}
setMotion(reduced);
if (window.ScrollCraft) window.ScrollCraft.mount(document);
document.querySelector('[data-motion]').addEventListener('click', () => {
  setMotion(!reduced);
  storage.set('trio.reducedMotion', String(reduced));
  announce(reduced ? copy.motionOff : copy.motionOn);
});
reducedSystem.addEventListener('change', event => setMotion(event.matches || storage.get('trio.reducedMotion') === 'true'));

const demos = [];
document.querySelectorAll('[data-demo]').forEach(windowElement => {
  const parent = windowElement.parentElement;
  const traffic = windowElement.querySelector('[data-traffic]');
  const green = traffic.querySelector('.green');
  const placeholder = parent.querySelector('[data-placeholder]');
  const stateText = placeholder.querySelector('[data-state-text]');
  const reopen = placeholder.querySelector('[data-reopen]');
  let returnTimer, menuOpenTimer, menuCloseTimer, menu;
  let state = 'normal';
  let previousPosition = '';
  const closeMenu = () => {
    clearTimeout(menuOpenTimer); clearTimeout(menuCloseTimer);
    // Removing a focused menu fires focusout synchronously. Clear ownership
    // first so that the focus handler can safely dismiss it again.
    const oldMenu = menu;
    menu = null;
    green.setAttribute('aria-expanded', 'false');
    oldMenu?.remove();
  };
  const reset = () => {
    clearTimeout(returnTimer); closeMenu(); state = 'normal';
    windowElement.inert = false;
    windowElement.removeAttribute('aria-hidden');
    windowElement.dataset.state = 'normal';
    delete windowElement.dataset.position;
    green.setAttribute('aria-label', copy.demoMaximize);
  };
  function act(action, autoReturn = true) {
    clearTimeout(returnTimer); closeMenu();
    if (action === 'close' || action === 'minimize') {
      state = action === 'close' ? 'closed' : 'minimized';
      windowElement.dataset.state = state;
      windowElement.inert = true;
      windowElement.setAttribute('aria-hidden', 'true');
      stateText.textContent = action === 'close' ? copy.closedTitle : copy.minimizedTitle;
      reopen.textContent = action === 'close' ? copy.reopen : copy.restore;
      announce(action === 'close' ? copy.closedState : copy.minimizedState);
      returnTimer = setTimeout(reset, reduced ? 1500 : 1100);
    } else if (action === 'maximize') {
      if (state === 'maximized') {
        state = 'normal'; windowElement.dataset.state = state;
        if (previousPosition) windowElement.dataset.position = previousPosition;
        else delete windowElement.dataset.position;
        green.setAttribute('aria-label', copy.demoMaximize); announce(copy.restoredState);
      } else {
        previousPosition = windowElement.dataset.position || '';
        delete windowElement.dataset.position;
        state = 'maximized'; windowElement.dataset.state = state;
        green.setAttribute('aria-label', copy.demoRestore); announce(copy.maximizedState);
        if (autoReturn) returnTimer = setTimeout(() => act('maximize', false), 1800);
      }
    } else {
      state = 'normal'; windowElement.dataset.state = state;
      if (action === 'center') delete windowElement.dataset.position;
      else windowElement.dataset.position = action;
      green.setAttribute('aria-label', copy.demoMaximize);
    }
  }
  function openMenu() {
    if (menu || state === 'closed' || state === 'minimized') return;
    clearTimeout(menuCloseTimer);
    menu = document.createElement('div'); menu.className = 'green-options';
    menu.setAttribute('role', 'group'); menu.setAttribute('aria-label', copy.greenMenuLabel);
    [[copy.arrangeMaximize, 'maximize'], [copy.arrangeLeft, 'left'], [copy.arrangeRight, 'right'], [copy.arrangeCenter, 'center']].forEach(([label, action]) => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
      button.addEventListener('click', () => act(action, false)); menu.append(button);
    });
    menu.addEventListener('pointerenter', () => clearTimeout(menuCloseTimer));
    menu.addEventListener('pointerleave', () => { menuCloseTimer = setTimeout(closeMenu, 100); });
    menu.addEventListener('focusout', event => { if (!menu?.contains(event.relatedTarget) && event.relatedTarget !== green) closeMenu(); });
    windowElement.querySelector('.window-bar').append(menu);
    green.setAttribute('aria-expanded', 'true');
  }
  green.setAttribute('aria-haspopup', 'true'); green.setAttribute('aria-expanded', 'false');
  green.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { clearTimeout(menuCloseTimer); menuOpenTimer = setTimeout(openMenu, 350); } });
  green.addEventListener('pointerleave', () => { clearTimeout(menuOpenTimer); menuCloseTimer = setTimeout(closeMenu, 140); });
  green.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); openMenu(); menu?.querySelector('button').focus(); }
  });
  windowElement.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); green.focus(); } });
  traffic.querySelectorAll('[data-action]').forEach(button => {
    button.setAttribute('aria-label', copy[`demo${button.dataset.action[0].toUpperCase()}${button.dataset.action.slice(1)}`]);
    button.addEventListener('click', () => act(button.dataset.action));
    if (button !== green) button.addEventListener('pointerenter', closeMenu);
  });
  reopen.addEventListener('click', reset);
  demos.push({ reset, closeMenu });
});
document.querySelector('[data-reset-all]').addEventListener('click', () => { demos.forEach(demo => demo.reset()); announce(copy.restoredState); });
document.addEventListener('pointerdown', event => { if (!event.target.closest('[data-demo]')) demos.forEach(demo => demo.closeMenu()); });
document.addEventListener('visibilitychange', () => { if (document.hidden) demos.forEach(demo => demo.closeMenu()); });

// A finite, scroll-driven wave. Pointer input takes priority; it never triggers an action.
const chapter = document.querySelector('.wave-chapter');
const lights = [...document.querySelectorAll('.wave-light')];
const wave = document.querySelector('.wave-lights');
let manualWave = false;
function drawWave(position) {
  lights.forEach((light, index) => {
    const influence = Math.max(0, 1 - Math.abs(index - position) / 1.05);
    light.style.setProperty('--wave', String(1 + .82 * influence * influence));
    light.style.setProperty('--z', String(Math.round(influence * 10) + 1));
  });
}
function scrollWave() {
  if (manualWave || reduced) return;
  const rect = chapter.getBoundingClientRect();
  if (rect.bottom <= 0 || rect.top >= innerHeight) return;
  const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - innerHeight)));
  drawWave(progress * 2);
}
let scrollFrame;
addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { scrollFrame = null; scrollWave(); }); }, { passive: true });
wave.addEventListener('pointermove', event => {
  manualWave = true;
  const center = lights[0].getBoundingClientRect();
  const last = lights[2].getBoundingClientRect();
  const start = center.left + center.width / 2;
  const end = last.left + last.width / 2;
  drawWave(Math.max(0, Math.min(2, (event.clientX - start) / Math.max(1, end - start) * 2)));
});
wave.addEventListener('pointerleave', () => { manualWave = false; lights.forEach(light => light.style.setProperty('--wave', '1')); });
const range = document.querySelector('#control-size');
range.addEventListener('input', () => {
  const number = Number(range.value);
  range.nextElementSibling.textContent = `${new Intl.NumberFormat(runtime.locale, { maximumFractionDigits: 1 }).format(number)}×`;
  const mobile = matchMedia('(max-width:700px)').matches;
  wave.style.setProperty('--play-size', `${(mobile ? 66 : 94) * number / 1.5}px`);
  document.querySelectorAll('[data-demo]').forEach(demo => demo.style.setProperty('--control-size', `${16 * number}px`));
});

document.querySelector('[data-copy]').addEventListener('click', async () => {
  const text = document.querySelector('#install-command').textContent;
  try { await navigator.clipboard.writeText(text); announce(copy.copySuccess); }
  catch { const selection = getSelection(); const range = document.createRange(); range.selectNodeContents(document.querySelector('#install-command')); selection.removeAllRanges(); selection.addRange(range); announce(copy.copyFailure); }
});

resolveRelease({ fallback: runtime.release, base, timeoutMs: 2400 }).then(release => {
  document.querySelectorAll('[data-download]').forEach(link => { link.href = release.downloadUrl || release.url; });
  document.querySelectorAll('[data-version]').forEach(element => { element.textContent = release.version; });
  document.querySelectorAll('[data-checksum]').forEach(link => {
    link.hidden = !release.checksumUrl;
    if (release.checksumUrl) link.href = release.checksumUrl;
  });
}).catch(() => { /* The verified bundled download remains usable, including without JavaScript. */ });
