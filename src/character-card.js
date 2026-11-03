import { escapeHtml } from './reader.js';

export function characterCard(character, detail = false) {
  const { x, y, width, height } = character.crop;
  const portraitStyle = `--portrait-width:${1536 / width * 100}%;--portrait-left:${-x / width * 100}%;--portrait-top:${-y / height * 100}%`;
  const href = `#/personagens/${character.name.toLowerCase()}`;
  return `<article class="character-card">
    <div class="character-photo" style="${portraitStyle}">
      <img src="${escapeHtml(character.image)}" loading="lazy" decoding="async" alt="${escapeHtml(character.codename)} — ${escapeHtml(character.name)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false">
      <div class="portrait-placeholder" hidden><span>Arte aguardando arquivo original</span><b aria-hidden="true">${character.name.charAt(0)}</b></div>
    </div>
    <span class="eyebrow">PERSONAGEM</span>
    <h2 class="hero-name">${detail ? escapeHtml(character.codename) : `<a href="${href}">${escapeHtml(character.codename)}</a>`}</h2>
    <p class="civil-name">${escapeHtml(character.name)}</p>
    <p class="character-description">${escapeHtml(character.description)}</p>
    ${detail ? '<a class="read-link" href="#/personagens">← Todos os personagens</a>' : `<a class="read-link" href="${href}">Abrir ficha ↗</a>`}
  </article>`;
}
