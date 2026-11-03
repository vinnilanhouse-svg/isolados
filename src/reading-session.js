import { escapeHtml } from './reader.js';
import { defaultReadingPreferences, getReadingPreferences, saveReadingPreferences, getReadingProgress, saveReadingProgress } from './reading-state.js';

let initialPage = true;
let pendingResume = null;

export function resumeReadingCard(chapters) {
  const saved = getReadingProgress();
  const chapter = chapters.find(item => item.number === saved?.chapter);
  if (!chapter) return '';
  return `<section class="resume-reading" aria-label="Sua leitura">
    <span class="eyebrow">SEU MARCADOR DE PÁGINA</span>
    <h2>${escapeHtml(chapter.title)}</h2>
    <a class="read-link" data-resume-reading href="#/capitulos/${chapter.number}">Continuar de onde parei <span aria-hidden="true">→</span></a>
  </section>`;
}

export function bindReading() {
  const saved = pendingResume || (initialPage ? getReadingProgress() : null);
  pendingResume = null;
  initialPage = false;
  for (const link of document.querySelectorAll('[data-resume-reading]')) {
    link.addEventListener('click', event => {
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) pendingResume = getReadingProgress();
    });
  }

  const article = document.querySelector('.chapter-reading');
  const text = article?.querySelector('.chapter-text');
  if (!text?.firstChild) return () => {};
  const chapter = Number(article.dataset.chapter);
  const controls = article.querySelector('.reading-settings');
  const decrease = controls.querySelector('[data-font-decrease]');
  const increase = controls.querySelector('[data-font-increase]');
  const size = controls.querySelector('output');
  const spacing = controls.querySelector('select');
  let preferences = getReadingPreferences();
  let cancelled = false;
  let ready = false;
  let timer;
  let viewportWidth = innerWidth;
  let currentAnchor = { chapter, offset: 0, delta: 0, started: false };

  function applyPreferences() {
    text.style.setProperty('--reader-font-size', `${preferences.fontSize}px`);
    text.style.setProperty('--reader-line-height', preferences.lineHeight);
    size.value = `${preferences.fontSize} px`;
    spacing.value = String(preferences.lineHeight);
    decrease.disabled = preferences.fontSize === 16;
    increase.disabled = preferences.fontSize === 28;
  }

  function readingTop() {
    return controls.getBoundingClientRect().height + 26;
  }

  // Um marcador no texto acompanha a mesma passagem mesmo após mudar fonte ou tela.
  // O nó de texto original permanece intacto; Range só mede a posição das letras.
  function characterRect(offset) {
    const range = document.createRange();
    const index = Math.min(Math.max(0, offset), text.firstChild.length - 1);
    range.setStart(text.firstChild, index);
    range.setEnd(text.firstChild, index + 1);
    return range.getBoundingClientRect();
  }

  function capture() {
    const top = readingTop();
    if (text.getBoundingClientRect().top > top) return { chapter, offset: 0, delta: 0, started: false };
    let low = 0;
    let high = text.firstChild.length - 1;
    while (low < high) {
      const middle = Math.floor((low + high) / 2);
      if (characterRect(middle).bottom < top) low = middle + 1;
      else high = middle;
    }
    return { chapter, offset: low, delta: Math.max(-100, Math.min(100, characterRect(low).top - top)), started: true };
  }

  function restore(anchor) {
    if (!anchor.started) return;
    const rect = characterRect(anchor.offset);
    window.scrollTo({ top: scrollY + rect.top - readingTop() - anchor.delta, behavior: 'instant' });
  }

  function save() {
    if (!ready || cancelled || document.querySelector('dialog[open]')) return;
    currentAnchor = capture();
    saveReadingProgress(currentAnchor);
  }

  function scheduleSave() {
    clearTimeout(timer);
    timer = setTimeout(save, 180);
  }

  function changePreferences(next) {
    const anchor = capture();
    ready = false;
    preferences = next;
    saveReadingPreferences(preferences);
    applyPreferences();
    requestAnimationFrame(() => {
      if (cancelled) return;
      restore(anchor);
      ready = true;
      save();
    });
  }

  decrease.addEventListener('click', () => changePreferences({ ...preferences, fontSize: Math.max(16, preferences.fontSize - 2) }));
  increase.addEventListener('click', () => changePreferences({ ...preferences, fontSize: Math.min(28, preferences.fontSize + 2) }));
  spacing.addEventListener('change', () => changePreferences({ ...preferences, lineHeight: Number(spacing.value) }));
  controls.querySelector('[data-reading-reset]').addEventListener('click', () => changePreferences({ ...defaultReadingPreferences }));
  function visibilityChanged() { if (document.visibilityState === 'hidden') save(); }
  function resized() {
    // A barra de endereço móvel muda a altura durante a rolagem; só a largura redistribui o texto.
    if (innerWidth === viewportWidth) return;
    viewportWidth = innerWidth;
    if (!ready) return;
    const anchor = currentAnchor;
    ready = false;
    requestAnimationFrame(() => {
      if (cancelled) return;
      restore(anchor);
      ready = true;
      save();
    });
  }

  applyPreferences();
  (async () => {
    const image = article.querySelector('.chapter-reading-artwork img');
    await Promise.all([document.fonts.ready, image?.decode().catch(() => {})]);
    let modal;
    while (!cancelled && (modal = document.querySelector('dialog[open]'))) {
      await new Promise(resolve => modal.addEventListener('close', resolve, { once: true }));
    }
    requestAnimationFrame(() => {
      if (cancelled) return;
      if (saved?.chapter === chapter) restore(saved);
      ready = true;
      article.dataset.readingReady = 'true';
      save();
    });
  })();
  window.addEventListener('scroll', scheduleSave, { passive: true });
  window.addEventListener('resize', resized);
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', visibilityChanged);
  return () => {
    save();
    cancelled = true;
    clearTimeout(timer);
    window.removeEventListener('scroll', scheduleSave);
    window.removeEventListener('resize', resized);
    window.removeEventListener('pagehide', save);
    document.removeEventListener('visibilitychange', visibilityChanged);
  };
}
