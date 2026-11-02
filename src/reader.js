export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

// Esta edição do site publica somente os capítulos de 1 a 9.
export function siteChapters(chapters) {
  return chapters.filter(chapter => Number.isInteger(chapter.number) && chapter.number >= 1 && chapter.number <= 9)
    .toSorted((a, b) => a.number - b.number);
}

export function chapterIndex(chapters) {
  return `<div class="chapter-list">${chapters.map(chapter => `
    <a href="#/capitulos/${chapter.number}">
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
  return `<article class="reading chapter-reading">
    <span class="eyebrow">CAPÍTULO ${String(chapter.number).padStart(2, '0')}</span>
    <h2>${escapeHtml(chapter.title)}</h2>
    ${text}
    <nav class="chapter-nav" aria-label="Navegação de capítulos">
      ${previous ? `<a rel="prev" href="#/capitulos/${previous.number}">← Capítulo anterior</a>` : ''}
      <a href="#/capitulos">Índice de capítulos</a>
      ${next ? `<a rel="next" href="#/capitulos/${next.number}">Próximo capítulo →</a>` : ''}
    </nav>
  </article>`;
}
