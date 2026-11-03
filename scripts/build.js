import { cp, mkdir, rm, stat, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
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
    if (!entry.isFile() || !/\.(jpe?g|png|webp|ico|svg)$/i.test(entry.name)) continue;
    candidates.push(join(directory, entry.name));
  }
}
const iconCandidates = candidates.filter(file => /(?:^|[ _-])(?:logo(?:tipo)?|[ií]cone|icon|favicon|s[ií]mbolo)(?:[ _.-]|$)/i.test(basename(file)));
const coverCandidates = candidates.filter(file => !iconCandidates.includes(file) && /\.(jpe?g|png|webp)$/i.test(file));
const namedCovers = coverCandidates.filter(file => /(?:^|\/)capa[-_]isolados\.(jpe?g|png|webp)$/i.test(file));
const preferred = namedCovers.length ? namedCovers : coverCandidates;
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
const explicitIcons = iconCandidates.filter(file => /^favicon\./i.test(basename(file)));
const logos = iconCandidates.filter(file => /^logo\./i.test(basename(file)));
const preferredIcons = explicitIcons.length ? explicitIcons : logos.length ? logos : iconCandidates;
if (preferredIcons.length > 1) {
  throw new Error('Mais de um possível ícone encontrado. Identifique o ícone da aba com o nome favicon.png ou logo.png.');
}
if (preferredIcons.length === 1) {
  const source = preferredIcons[0];
  const destination = `images/icone-isolados${extname(source).toLowerCase()}`;
  await mkdir('dist/images', { recursive: true });
  await cp(source, join('dist', destination));
  const html = await readFile('dist/index.html', 'utf8');
  await writeFile('dist/index.html', html.replace('href="/images/simbolo-isolados.png"', `href="/${destination}"`));
  console.log(`Ícone da aba incluído sem alterações: ${source}`);
}
// A nova composição do elenco pode manter o nome original do upload.
const otherArtwork = candidates.filter(file => !preferred.includes(file) && !iconCandidates.includes(file) && /\.(jpe?g|png|webp)$/i.test(file));
const namedCharacterArtwork = otherArtwork.filter(file => /(?:^|[ _-])(?:personagens|elenco|characters)(?:[ _.-]|$)/i.test(basename(file)));
const characterArtwork = namedCharacterArtwork.length ? namedCharacterArtwork : otherArtwork;
if (characterArtwork.length === 1) {
  const source = characterArtwork[0];
  const destination = `images/personagens-isolados${extname(source).toLowerCase()}`;
  await mkdir('dist/images', { recursive: true });
  await cp(source, join('dist', destination));
  await writeFile('dist/src/character-art.js', `export const characterArtwork = ${JSON.stringify('/' + destination)};\n`);
  console.log(`Arte dos personagens incluída sem alterações: ${source}`);
}
console.log('Build concluído: dist/');
