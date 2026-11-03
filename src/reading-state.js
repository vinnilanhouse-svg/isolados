export const defaultReadingPreferences = { fontSize: 18, lineHeight: 1.9 };
const progressKey = 'isolados-reading-progress';
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
let progress = validProgress(saved) ? saved : null;
const preferences = read(preferencesKey);
let readingPreferences = {
  fontSize: [16, 18, 20, 22, 24, 26, 28].includes(preferences?.fontSize) ? preferences.fontSize : defaultReadingPreferences.fontSize,
  lineHeight: [1.6, 1.9, 2.2].includes(preferences?.lineHeight) ? preferences.lineHeight : defaultReadingPreferences.lineHeight
};

export function getReadingProgress() { return progress; }
export function saveReadingProgress(value) {
  if (!validProgress(value)) return;
  progress = value;
  write(progressKey, value);
}

export function getReadingPreferences() { return { ...readingPreferences }; }
export function saveReadingPreferences(value) {
  readingPreferences = { ...value };
  write(preferencesKey, readingPreferences);
}
