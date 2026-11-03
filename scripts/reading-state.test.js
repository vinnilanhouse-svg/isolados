import test from 'node:test';
import assert from 'node:assert/strict';

let version = 0;
const anchor = (chapter, offset = 1200, started = true) => ({ chapter, offset, delta: 0, started });

async function load(storage = new Map(), blocked = false) {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem(key) { if (blocked) throw new Error('blocked'); return storage.get(key) ?? null; },
    setItem(key, value) { if (blocked) throw new Error('blocked'); storage.set(key, value); }
  } });
  const url = new URL('../src/reading-state.js', import.meta.url);
  url.searchParams.set('test', ++version);
  return { state: await import(url), storage };
}

test('migra o marcador antigo e consultar outro capítulo não substitui a leitura', async () => {
  const original = anchor(3, 4500);
  const { state, storage } = await load(new Map([['isolados-reading-progress', JSON.stringify(original)]]));
  assert.deepEqual(state.getReadingProgress(), original);
  state.saveReadingProgress(anchor(1, 0, false));
  assert.deepEqual(state.getReadingProgress(), original);
  assert.deepEqual(state.getReadingProgress(3), original);
  assert.deepEqual(state.getReadingProgress(1), anchor(1, 0, false));
  const reloaded = (await load(storage)).state;
  assert.deepEqual(reloaded.getReadingProgress(), original);
  assert.deepEqual(reloaded.getReadingProgress(3), original);
});

test('avançar em outra leitura troca o principal e mantém as duas posições', async () => {
  const { state, storage } = await load();
  state.saveReadingProgress(anchor(3, 4500), { activate: true });
  state.saveReadingProgress(anchor(1, 1800), { activate: true });
  assert.equal(state.getReadingProgress().chapter, 1);
  assert.equal(state.getReadingProgress(3).offset, 4500);
  state.saveReadingProgress(anchor(3, 4550));
  assert.equal(state.getReadingProgress().chapter, 1);
  assert.equal(state.getReadingProgress(3).offset, 4550);
  const reloaded = (await load(storage)).state;
  assert.equal(reloaded.getReadingProgress().chapter, 1);
  assert.equal(reloaded.getReadingProgress(1).offset, 1800);
  assert.equal(reloaded.getReadingProgress(3).offset, 4550);
});

test('voltar ao topo não apaga uma passagem salva', async () => {
  const { state } = await load();
  state.saveReadingProgress(anchor(3, 4500), { activate: true });
  state.saveReadingProgress(anchor(3, 0, false));
  assert.equal(state.getReadingProgress(3).offset, 4500);
  assert.equal(state.getReadingProgress().offset, 4500);
});

test('dados inválidos não criam capítulos ou posições fora do livro', async () => {
  const { state } = await load(new Map([
    ['isolados-reading-progress', '{broken'],
    ['isolados-reading-library', JSON.stringify({ version: 1, activeChapter: 10, chapters: { 10: anchor(10), 2: anchor(3), 1: anchor(1, -1) } })]
  ]));
  assert.equal(state.getReadingProgress(), null);
  for (const value of [anchor(0), anchor(10), anchor(1, -1), { ...anchor(2), delta: Infinity }]) state.saveReadingProgress(value);
  assert.equal(state.getReadingProgress(), null);
});

test('armazenamento bloqueado mantém o marcador durante a visita', async () => {
  const { state } = await load(new Map(), true);
  state.saveReadingProgress(anchor(3, 4500), { activate: true });
  state.saveReadingProgress(anchor(1, 0, false));
  assert.equal(state.getReadingProgress().chapter, 3);
  assert.equal(state.getReadingProgress(3).offset, 4500);
});
