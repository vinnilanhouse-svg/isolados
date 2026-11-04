import { chapters } from './chapters.js';
import { characters } from './characters.js';

export const chapterArtworks = chapters.map(chapter => ({
  id: `chapter-${chapter.number}`,
  kind: 'chapter',
  title: chapter.title,
  src: chapter.cover.src,
  thumbnail: `/images/art-thumbnails/chapter-${String(chapter.number).padStart(2, '0')}.webp`,
  width: 720, height: 480,
  alt: chapter.cover.alt,
  href: `#/capitulos/${chapter.number}`,
  linkLabel: 'Ler o capítulo'
}));

export const characterArtworks = characters.map(character => ({
  id: `character-${character.name.toLowerCase()}`,
  kind: 'character',
  title: character.codename,
  subtitle: character.name,
  src: character.image,
  thumbnail: `/images/art-thumbnails/character-${character.name.toLowerCase()}.webp`,
  width: 720, height: 900,
  alt: `${character.codename} — ${character.name}`,
  href: `#/personagens/${character.name.toLowerCase()}`,
  linkLabel: 'Ver ficha'
}));

// Fanarts aguardam arquivos e créditos fornecidos pelo autor. Não usar exemplos fictícios.
// Cada entrada: { id, kind: 'fanart', title, src, alt, artist, width, height, thumbnail? }.
export const fanarts = [];
