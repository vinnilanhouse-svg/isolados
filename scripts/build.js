import { cp, mkdir, rm, stat, readdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of ['index.html','src']) await cp(file,`dist/${file}`,{recursive:true});
let publicExists = false;
try {
  await stat('public');
  publicExists = true;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
if (publicExists) await cp('public','dist',{recursive:true});

// Aceita o nome original do arquivo enviado pelo autor pelo GitHub.
// Um nome explícito tem prioridade; os demais só são usados sem ambiguidade.
const candidates = [];
for (const directory of ['public/images', '.']) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
  for (const entry of entries) {
    if (!entry.isFile() || !/\.(jpe?g|png|webp)$/i.test(entry.name)) continue;
    if (/^simbolo[-_]isolados\./i.test(entry.name)) continue;
    candidates.push(join(directory, entry.name));
  }
}
const namedCovers = candidates.filter(file => /(?:^|\/)capa[-_]isolados\.(jpe?g|png|webp)$/i.test(file));
const preferred = namedCovers.length ? namedCovers : candidates;
if (preferred.length > 1) {
  throw new Error('Mais de uma possível capa encontrada. Mantenha apenas uma imagem chamada capa-isolados.jpg, capa-isolados.png ou capa-isolados.webp.');
}
if (preferred.length === 1) {
  const source = preferred[0];
  const destination = `images/capa-isolados${extname(source).toLowerCase()}`;
  await mkdir('dist/images', { recursive: true });
  await cp(source, join('dist', destination));
  await writeFile('dist/src/cover.js', `export const cover = ${JSON.stringify('/' + destination)};\n`);
  console.log(`Capa incluída sem alterações: ${source}`);
}
console.log('Build concluído: dist/');
