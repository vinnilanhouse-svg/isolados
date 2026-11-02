// Conteúdo editorial: substitua os placeholders pelos textos aprovados do autor.
export const book = {title:'ISOLADOS', author:'Vinícius Coradi Maddaloni', cover:'/images/capa-isolados.jpg', symbol:'/images/simbolo-isolados.png'};
export const characters = ['Vinicius','Miguel','Fernanda','Amanda','Jennyfer','Allan','Gabriel','Henrique','Jorge'].map(name=>({name, codename:'Codinome a inserir', description:'Descrição do personagem a inserir.', image:null}));
export const chapters = [{number:1,title:'Título a inserir',text:null}];
export const posts = [
 {id:'primeiro-capitulo', category:'Capítulos', title:'O primeiro capítulo', excerpt:'O espaço onde a história começa. O texto do primeiro capítulo será inserido aqui pelo autor.', type:'chapter', label:'Texto a inserir', href:'#/capitulos/1'},
 {id:'protagonistas', category:'Personagens',title:'Nove nomes. Um caderno aberto.',excerpt:'Vinicius, Miguel, Fernanda, Amanda, Jennyfer, Allan, Gabriel, Henrique e Jorge. Conheça o espaço reservado aos protagonistas de ISOLADOS.',type:'characters',label:'Fichas em preparação',href:'#/personagens'},
 {id:'bastidores',category:'Bastidores',title:'Entre anotações e páginas',excerpt:'Um lugar para os registros do processo de escrita, as artes e o desenvolvimento do livro.',type:'notes',label:'Conteúdo a inserir',href:'#/bastidores/processo'}
];
