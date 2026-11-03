import chapter1 from './chapters/01.js';
import chapter2 from './chapters/02.js';
import chapter3 from './chapters/03.js';
import chapter4 from './chapters/04.js';
import chapter5 from './chapters/05.js';
import chapter6 from './chapters/06.js';
import chapter7 from './chapters/07.js';
import chapter8 from './chapters/08.js';
import chapter9 from './chapters/09.js';
import { chapterCovers } from './chapter-covers.js';

export const chapters = [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7, chapter8, chapter9]
  .map(chapter => ({ ...chapter, cover: chapterCovers[chapter.number] }));
