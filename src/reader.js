export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

export function chapterArtwork(cover, className, loading = 'lazy') {
  if (!cover) return '';
  return `<figure class="chapter-artwork ${className}"><img src="${escapeHtml(cover.src)}" alt="${escapeHtml(cover.alt)}" width="${cover.width}" height="${cover.height}" loading="${loading}" decoding="async"></figure>`;
}

// Esta edição do site publica somente os capítulos de 1 a 9.
export function siteChapters(chapters) {
  return chapters.filter(chapter => Number.isInteger(chapter.number) && chapter.number >= 1 && chapter.number <= 9)
    .toSorted((a, b) => a.number - b.number);
}

export function chapterIndex(chapters) {
  return `<div class="chapter-list">${chapters.map(chapter => `
    <a href="#/capitulos/${chapter.number}">
      ${chapterArtwork(chapter.cover, 'chapter-index-artwork')}
      <span class="chapter-number">${String(chapter.number).padStart(2, '0')}</span>
      <div><h2>${escapeHtml(chapter.title)}</h2>${chapter.text === null ? '<p>Texto a inserir pelo autor</p>' : ''}</div>
      <span aria-hidden="true">↗</span>
    </a>`).join('')}</div>`;
}

export function chapterReading(chapters, number) {
  const selected = /^0?[1-9]$/.test(number) ? Number(number) : NaN;
  const position = chapters.findIndex(chapter => chapter.number === selected);
  if (position === -1) {
    return '<section class="reading"><h2>Capítulo não disponível</h2><p>Este capítulo não está disponível no site.</p><a href="#/capitulos">← Voltar ao índice</a></section>';
  }
  const chapter = chapters[position];
  const previous = chapters[position - 1];
  const next = chapters[position + 1];
  const text = typeof chapter.text === 'string'
    ? `<div class="chapter-text">${escapeHtml(chapter.text)}</div>`
    : '<span class="placeholder">Texto a inserir</span><p class="empty-text">O texto deste capítulo ainda não está disponível no site.</p>';
  return `<article class="reading chapter-reading" data-chapter="${chapter.number}">
    <span class="eyebrow">CAPÍTULO ${String(chapter.number).padStart(2, '0')}</span>
    <h2>${escapeHtml(chapter.title)}</h2>
    ${chapterArtwork(chapter.cover, 'chapter-reading-artwork', 'eager')}
    <details class="reading-settings">
      <summary>Ajustar leitura</summary>
      <div class="reading-settings-body">
        <fieldset class="reading-font"><legend>Tamanho do texto</legend>
          <button type="button" data-font-decrease aria-label="Diminuir tamanho do texto">A−</button>
          <output aria-live="polite" aria-label="Tamanho atual do texto">18 px</output>
          <button type="button" data-font-increase aria-label="Aumentar tamanho do texto">A+</button>
        </fieldset>
        <label class="reading-spacing">Entrelinhas
          <select aria-label="Espaçamento entre linhas">
            <option value="1.6">Compacto</option>
            <option value="1.9" selected>Confortável</option>
            <option value="2.2">Amplo</option>
          </select>
        </label>
        <button class="reading-reset" type="button" data-reading-reset>Restaurar padrão</button>
        <button class="reading-close" type="button" data-reading-close>Fechar ajustes</button>
      </div>
    </details>
    ${text}
    ${!next ? `<section class="publication-status" aria-labelledby="publication-status-title">
      <p>Você chegou ao último capítulo disponível.</p>
      <h3 id="publication-status-title">Mais capítulos em breve.</h3>
    </section>` : ''}
    <nav class="chapter-nav" aria-label="Navegação de capítulos">
      ${previous ? `<a rel="prev" href="#/capitulos/${previous.number}">← Capítulo anterior</a>` : ''}
      <a href="#/capitulos">Índice de capítulos</a>
      ${next ? `<a rel="next" href="#/capitulos/${next.number}">Próximo capítulo →</a>` : ''}
    </nav>
  </article>`;
}
