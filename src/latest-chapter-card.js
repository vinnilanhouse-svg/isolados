import { chapterArtwork, escapeHtml } from './reader.js';

export function latestChapterCard(chapters) {
  const chapter = chapters.toSorted((a, b) => b.number - a.number)[0];
  if (!chapter) return '';
  const excerpt = chapter.text?.split('\n\n')[0] || '';
  return `<section class="latest-chapter" aria-label="Novo capítulo">
    ${chapterArtwork(chapter.cover, 'latest-chapter-cover')}
    <div class="latest-chapter-copy">
      <span class="category-label">NOVO CAPÍTULO</span>
      <h2><a href="#/capitulos/${chapter.number}">${escapeHtml(chapter.title)}</a></h2>
      ${excerpt ? `<p>${escapeHtml(excerpt)}</p>` : ''}
      <div class="latest-chapter-actions">
        <a class="latest-chapter-button" href="#/capitulos/${chapter.number}">Ler capítulo ${chapter.number} <span aria-hidden="true">→</span></a>
        <a class="read-link" href="#/capitulos">Ver todos os capítulos <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>`;
}
