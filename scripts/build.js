import { cp, mkdir, rm } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of ['index.html','src']) await cp(file,`dist/${file}`,{recursive:true});
await cp('public','dist',{recursive:true});
console.log('Build concluído: dist/');
