# ISOLADOS
Site literário de Vinícius Coradi Maddaloni. JavaScript, CSS e HTML, sem dependências de execução ou instalação.

## Desenvolvimento
Node.js 24.x. Execute `npm run dev`. Para produção: `npm run build`; para validar o resultado: `npm run preview`.

## Vercel
Importe este repositório. A configuração `vercel.json` define `npm run build` e a saída `dist`. Não são necessárias variáveis ou segredos. As páginas usam rotas com hash para suportar atualização e links diretos em hospedagem estática.

## Imagens pendentes
Os anexos da conversa não foram disponibilizados como arquivos neste ambiente. Adicione os originais aprovados, sem modificá-los:
- `public/images/`: envie a capa panorâmica completa em JPG, PNG ou WebP, com qualquer nome. Se houver várias imagens, identifique a capa como `capa-isolados.jpg`, `capa-isolados.png` ou `capa-isolados.webp`.
- `public/images/simbolo-isolados.png`: símbolo branco original.

O envio pode ser feito pelo GitHub, sem editar código: https://github.com/vinnilanhouse-svg/isolados/upload/main/public/images. Há uma página de orientação em `/enviar-capa.html`. O build também reconhece uma única imagem enviada na raiz do repositório. Depois de salvar o arquivo na main, a Vercel atualiza o site automaticamente. Para conferir a seleção localmente, rode `npm run build` e `npm run preview`. A seleção é gravada somente em dist/src/cover.js; o arquivo original permanece intacto.

A capa é exibida na proporção original, inclusive no celular. Até os arquivos serem adicionados, há um placeholder de capa e a marca não é renderizada; nenhum símbolo substituto foi criado.

## Conteúdo
Edite `src/content.js`: livro, capítulos, publicações e nove personagens. Todos os textos canônicos ausentes estão identificados como placeholders. As publicações não usam imagens. O visual segue a referência de caderno: papel marfim, perfurações, recortes lilás, cabeçalho preto e anotações manuscritas. As fontes Barlow Condensed e Caveat são servidas localmente, com licenças em public/fonts.
