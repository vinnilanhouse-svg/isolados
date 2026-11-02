import { cp, mkdir, rm, stat } from 'node:fs/promises';
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
console.log('Build concluído: dist/');
