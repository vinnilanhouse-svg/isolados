import { cover } from './cover.js';
import { chapters } from './chapters.js';
export { chapters };
// Conteúdo editorial: substitua os placeholders pelos textos aprovados do autor.
export const book = {title:'ISOLADOS', author:'Vinícius Coradi Maddaloni', tagline:'Nem todo herói é bom e nem todo vilão é mal', cover, symbol:'/images/simbolo-isolados.png'};
export const synopsis = [
 'Imagine um mundo idêntico a este em que você vive, só que com algumas diferenças. Um átomo de carbono, no início de tudo, decidiu que iria um pouco para a esquerda, e isso possibilitou uma grande mudança no DNA de várias espécies. Essa mudança criou seres mais fortes, mais rápidos, mais inteligentes, e esses foram nomeados "SUPERS".',
 'O super mais poderoso e famoso de todos os tempos é o Midnight Warrior, um herói com o poder de destruir montanhas com seu soco sombrio.',
 '+',
 'Ainda bem que essa história não é sobre esse cara. Na verdade, é a história de um garoto que não tem controle sobre seus poderes. Você deve estar pensando que o Midnight Warrior é o ídolo desse garoto, mas não, nosso protagonista tem um ódio profundo por esse cara e pelos outros heróis. Podemos até dizer que nosso garoto é um vilão, pelo menos era, até agora.'
];
export const welcome = {
 title: 'Obrigado por estar aqui.',
 message: 'Obrigado por se interessar por ISOLADOS. Este é um projeto muito importante para mim, e fico feliz em compartilhar este espaço com você.',
 invitation: 'Se quiser comentar sobre a obra, tirar dúvidas ou simplesmente conversar, envie um e-mail para:',
 email: 'coradi.maddaloni@gmail.com',
 rightsTitle: 'Uma nota sobre os direitos autorais',
 rights: `ISOLADOS é uma obra de autoria e titularidade de ${book.author}. Todos os direitos reservados. Não é permitida a reprodução, distribuição, circulação ou divulgação não autorizada da obra, no todo ou em parte. Para solicitar autorização, entre em contato com o autor.`,
 button: 'Continuar para o site'
};
export { characters } from './characters.js';
export const posts = [
 ...chapters.filter(chapter=>chapter.number>=1&&chapter.number<=9).map(chapter=>({id:`capitulo-${chapter.number}`, category:'Capítulos', title:chapter.title, cover:chapter.cover, excerpt:chapter.text?.split('\n\n')[0]||'Texto a inserir pelo autor.', label:'Texto original do autor', href:`#/capitulos/${chapter.number}`})),
 {id:'universo', category:'Universo',title:'Universo — Artigo a inserir',excerpt:'Espaço reservado aos textos sobre espécies, poderes, lugares e organizações. O conteúdo será fornecido pelo autor.',label:'Conteúdo a inserir',href:'#/universo'},
 {id:'bastidores',category:'Bastidores',title:'Entre anotações e páginas',excerpt:'Um lugar para os registros do processo de escrita, as artes e o desenvolvimento do livro.',type:'notes',label:'Conteúdo a inserir',href:'#/bastidores/processo'}
];
