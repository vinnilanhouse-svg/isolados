import { cover } from './cover.js';
export { chapters } from './chapters.js';
// Conteúdo editorial: substitua os placeholders pelos textos aprovados do autor.
export const book = {title:'ISOLADOS', author:'Vinícius Coradi Maddaloni', cover, symbol:'/images/simbolo-isolados.png'};
export const welcome = {
 title: 'Obrigado por estar aqui.',
 message: 'Obrigado por se interessar por ISOLADOS. Este é um projeto muito importante para mim, e fico feliz em compartilhar este espaço com você.',
 invitation: 'Se quiser comentar sobre a obra, tirar dúvidas ou simplesmente conversar, envie um e-mail para:',
 email: 'coradi.maddaloni@gmail.com',
 rightsTitle: 'Uma nota sobre os direitos autorais',
 rights: `ISOLADOS é uma obra de autoria e titularidade de ${book.author}. Todos os direitos reservados. Não é permitida a reprodução, distribuição, circulação ou divulgação não autorizada da obra, no todo ou em parte. Para solicitar autorização, entre em contato com o autor.`,
 button: 'Continuar para o site'
};
export const characters = ['Vinicius','Miguel','Fernanda','Amanda','Jennyfer','Allan','Gabriel','Henrique','Jorge'].map(name=>({name, codename:'Codinome a inserir', description:'Descrição do personagem a inserir.', image:null}));
export const posts = [
 {id:'primeiro-capitulo', category:'Capítulos', title:'Capítulo 01 — Título a inserir', excerpt:'O espaço onde a história começa. O texto do primeiro capítulo será inserido aqui pelo autor.', type:'chapter', label:'Texto a inserir', href:'#/capitulos/1'},
 {id:'universo', category:'Universo',title:'Universo — Artigo a inserir',excerpt:'Espaço reservado aos textos sobre espécies, poderes, lugares e organizações. O conteúdo será fornecido pelo autor.',label:'Conteúdo a inserir',href:'#/universo'},
 {id:'bastidores',category:'Bastidores',title:'Entre anotações e páginas',excerpt:'Um lugar para os registros do processo de escrita, as artes e o desenvolvimento do livro.',type:'notes',label:'Conteúdo a inserir',href:'#/bastidores/processo'}
];
