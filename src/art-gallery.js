import { chapterArtworks, characterArtworks, fanarts } from './art-content.js';
import { escapeHtml } from './reader.js';

const sections = [
  ['', 'Todas'], ['capitulos', 'Capítulos'], ['personagens', 'Personagens'], ['fanarts', 'Fanarts']
];

function groupsFor(section) {
  const groups = [
    { key: 'capitulos', title: 'Artes dos capítulos', items: chapterArtworks },
    { key: 'personagens', title: 'Retratos dos personagens', items: characterArtworks },
    { key: 'fanarts', title: 'Fanarts', items: fanarts }
  ];
  return section ? groups.filter(group => group.key === section) : groups.filter(group => group.items.length);
}

function artworkCard(art) {
  const subtitle = art.subtitle || (art.artist ? `Arte de ${art.artist}` : '');
  return `<figure class="art-card art-card--${art.kind}">
    <button type="button" class="art-image-button" data-art-id="${escapeHtml(art.id)}" aria-label="Ampliar arte: ${escapeHtml(art.title)}">
      <img src="${escapeHtml(art.thumbnail || art.src)}" alt="${escapeHtml(art.alt)}" width="${art.width}" height="${art.height}" loading="lazy" decoding="async">
      <span class="art-enlarge-hint" aria-hidden="true">Ampliar ↗</span>
    </button>
    <figcaption><h3>${escapeHtml(art.title)}</h3>${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''}
      ${art.href ? `<a href="${escapeHtml(art.href)}">${escapeHtml(art.linkLabel)} <span aria-hidden="true">→</span></a>` : ''}
    </figcaption>
  </figure>`;
}

export function artGalleryPage(section = '') {
  if (!sections.some(([key]) => key === section)) return '<p>Seção de artes não encontrada.</p><a class="read-link" href="#/artes">← Voltar às artes</a>';
  const tabs = `<nav class="art-tabs" aria-label="Seções de artes">${sections.map(([key, label]) =>
    `<a href="#/artes${key ? '/' + key : ''}"${key === section ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
  const content = groupsFor(section).map(group => group.items.length
    ? `<section class="art-group" aria-labelledby="art-group-${group.key}"><h2 id="art-group-${group.key}">${group.title}</h2><div class="art-grid">${group.items.map(artworkCard).join('')}</div></section>`
    : `<section class="fanarts-empty"><span class="book-symbol" aria-hidden="true"></span><h2>Fanarts</h2><span class="placeholder">Artes a inserir</span><p>Ainda não há fanarts publicadas. Este espaço está reservado às artes dos leitores.</p></section>`).join('');
  return `${tabs}<div class="art-gallery" data-art-section="${section}">${content}</div>`;
}

export function bindArtGallery() {
  const root = document.querySelector('.art-gallery');
  if (!root) return () => {};
  const items = groupsFor(root.dataset.artSection).flatMap(group => group.items);
  if (!items.length) return () => {};
  let dialog;
  let index = 0;
  let opener;
  let disposed = false;

  function showImage(next) {
    if (next < 0 || next >= items.length) return;
    index = next;
    const art = items[index];
    const image = dialog.querySelector('.art-viewer-image');
    const status = dialog.querySelector('[data-art-status]');
    image.hidden = true;
    status.textContent = 'Carregando arte…';
    image.onload = () => { if (!disposed) { image.hidden = false; status.textContent = ''; } };
    image.onerror = () => { if (!disposed) status.textContent = 'Não foi possível carregar esta arte. Feche e tente novamente.'; };
    image.alt = art.alt;
    image.src = art.src;
    dialog.querySelector('#art-viewer-title').textContent = art.title;
    dialog.querySelector('.art-viewer-subtitle').textContent = art.subtitle || (art.artist ? `Arte de ${art.artist}` : '');
    dialog.querySelector('[data-art-position]').textContent = `${index + 1} de ${items.length}`;
    dialog.querySelector('[data-art-previous]').disabled = index === 0;
    dialog.querySelector('[data-art-next]').disabled = index === items.length - 1;
  }

  function open(button) {
    const position = items.findIndex(art => art.id === button.dataset.artId);
    if (position < 0) return;
    opener = button;
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.className = 'art-viewer';
      dialog.setAttribute('aria-labelledby', 'art-viewer-title');
      dialog.innerHTML = `<div class="art-viewer-toolbar"><span class="eyebrow">CADERNO DE ARTES</span><form method="dialog"><button class="art-viewer-close" aria-label="Fechar imagem ampliada">×</button></form></div>
        <div class="art-viewer-frame"><img class="art-viewer-image" alt=""><p class="art-viewer-status" data-art-status role="status"></p></div>
        <div class="art-viewer-caption"><h2 id="art-viewer-title"></h2><p class="art-viewer-subtitle"></p></div>
        <nav class="art-viewer-nav" aria-label="Navegação de artes"><button type="button" data-art-previous>← Imagem anterior</button><span data-art-position></span><button type="button" data-art-next>Próxima imagem →</button></nav>`;
      dialog.querySelector('[data-art-previous]').onclick = () => showImage(index - 1);
      dialog.querySelector('[data-art-next]').onclick = () => showImage(index + 1);
      dialog.addEventListener('keydown', event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          showImage(index + (event.key === 'ArrowLeft' ? -1 : 1));
        }
      });
      dialog.addEventListener('close', () => {
        document.body.classList.remove('art-viewer-open');
        if (!disposed && opener?.isConnected) opener.focus({ preventScroll: true });
      });
      document.body.append(dialog);
    }
    showImage(position);
    document.body.classList.add('art-viewer-open');
    dialog.showModal();
    dialog.querySelector('.art-viewer-close').focus({ preventScroll: true });
  }

  root.querySelectorAll('[data-art-id]').forEach(button => button.addEventListener('click', () => open(button)));
  return () => {
    disposed = true;
    if (dialog?.open) dialog.close();
    dialog?.remove();
    document.body.classList.remove('art-viewer-open');
  };
}
