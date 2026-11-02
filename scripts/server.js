import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(process.argv[2]||'.');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{try{let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=resolve(root,'.'+path);if(file!==root&&!file.startsWith(root+sep))throw Error();if((await stat(file)).isDirectory()) file=resolve(file,'index.html');let body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(body);}catch{res.writeHead(404);res.end('Arquivo não encontrado');}}).listen(Number(process.env.PORT)||5173,'0.0.0.0',()=>console.log('Servidor iniciado na porta '+(process.env.PORT||5173)));
