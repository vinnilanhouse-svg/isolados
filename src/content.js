// Conteúdo editorial: substitua os placeholders pelos textos aprovados do autor.
export const book = {title:'ISOLADOS', author:'Vinícius Coradi Maddaloni', cover:'/images/capa-isolados.jpg', symbol:'/images/simbolo-isolados.png'};
export const characters = ['Vinicius','Miguel','Fernanda','Amanda','Jennyfer','Allan','Gabriel','Henrique','Jorge'].map(name=>({name, codename:'Codinome a inserir', description:'Descrição do personagem a inserir.', image:null}));
export const chapters = [{number:1,title:'Título a inserir',text:null}];
export const posts = [
 {id:'primeiro-capitulo', category:'Capítulos', title:'Capítulo 01 — Título a inserir', excerpt:'O espaço onde a história começa. O texto do primeiro capítulo será inserido aqui pelo autor.', type:'chapter', label:'Texto a inserir', href:'#/capitulos/1'},
 {id:'universo', category:'Universo',title:'Universo — Artigo a inserir',excerpt:'Espaço reservado aos textos sobre espécies, poderes, lugares e organizações. O conteúdo será fornecido pelo autor.',label:'Conteúdo a inserir',href:'#/universo'},
 {id:'bastidores',category:'Bastidores',title:'Entre anotações e páginas',excerpt:'Um lugar para os registros do processo de escrita, as artes e o desenvolvimento do livro.',type:'notes',label:'Conteúdo a inserir',href:'#/bastidores/processo'}
];
