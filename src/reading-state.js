export const defaultReadingPreferences = { fontSize: 18, lineHeight: 1.9 };
const progressKey = 'isolados-reading-progress';
const libraryKey = 'isolados-reading-library';
const preferencesKey = 'isolados-reading-preferences';

function read(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}

function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* A leitura também funciona sem armazenamento. */ }
}

function validProgress(value) {
  return value && Number.isInteger(value.chapter) && value.chapter >= 1 && value.chapter <= 9
    && Number.isInteger(value.offset) && value.offset >= 0
    && Number.isFinite(value.delta) && Math.abs(value.delta) <= 100
    && typeof value.started === 'boolean';
}

const saved = read(progressKey);
const library = read(libraryKey);
const positions = Object.create(null);
if (library?.version === 1 && library.chapters && typeof library.chapters === 'object') {
  for (const [number, value] of Object.entries(library.chapters)) {
    if (validProgress(value) && String(value.chapter) === number) positions[number] = value;
  }
}
// Preserva o marcador da versão anterior na primeira atualização.
if (!Object.keys(positions).length && validProgress(saved)) positions[saved.chapter] = saved;
let progress = positions[library?.activeChapter] || (validProgress(saved) ? positions[saved.chapter] : null) || null;
const preferences = read(preferencesKey);
let readingPreferences = {
  fontSize: [16, 18, 20, 22, 24, 26, 28].includes(preferences?.fontSize) ? preferences.fontSize : defaultReadingPreferences.fontSize,
  lineHeight: [1.6, 1.9, 2.2].includes(preferences?.lineHeight) ? preferences.lineHeight : defaultReadingPreferences.lineHeight
};

export function getReadingProgress(chapter) { return chapter === undefined ? progress : positions[chapter] || null; }
export function saveReadingProgress(value, { activate = false } = {}) {
  if (!validProgress(value)) return;
  // Voltar ao cabeçalho ou abrir uma página no topo não apaga uma passagem já lida.
  if (!value.started && positions[value.chapter]?.started) return;
  positions[value.chapter] = { ...value };
  if (activate || !progress || progress.chapter === value.chapter) progress = positions[value.chapter];
  write(libraryKey, { version: 1, activeChapter: progress?.chapter || null, chapters: positions });
  // Mantém compatibilidade com o marcador simples da edição anterior.
  if (progress) write(progressKey, progress);
}

export function getReadingPreferences() { return { ...readingPreferences }; }
export function saveReadingPreferences(value) {
  readingPreferences = { ...value };
  write(preferencesKey, readingPreferences);
}
