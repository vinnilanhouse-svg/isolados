# ISOLADOS
Site literário de Vinícius Coradi Maddaloni. JavaScript, CSS e HTML, sem dependências de execução ou instalação.

## Desenvolvimento
Node.js 24.x. Execute `npm run dev`. Para produção: `npm run build`; para validar o resultado: `npm run preview`.

## Vercel
Importe este repositório. A configuração `vercel.json` define `npm run build` e a saída `dist`. Não são necessárias variáveis ou segredos. As páginas usam rotas com hash para suportar atualização e links diretos em hospedagem estática.

## Imagens
A capa e o símbolo enviados pelo autor estão em `public/images/capa-isolados.png` e `public/images/simbolo-isolados.png`, preservados sem edição. O símbolo também é usado como ícone da aba. Para futuras substituições:
- `public/images/`: envie a capa panorâmica completa em JPG, PNG ou WebP, com qualquer nome. Se houver várias imagens, identifique a capa como `capa-isolados.jpg`, `capa-isolados.png` ou `capa-isolados.webp`.
- `public/images/simbolo-isolados.png`: símbolo branco original.
- `public/images/logo.png` ou `public/images/favicon.png`: logo para o ícone da aba. Ele é selecionado separadamente da capa e preservado sem edição.

O envio pode ser feito pelo GitHub, sem editar código: https://github.com/vinnilanhouse-svg/isolados/upload/main/public/images. Há uma página de orientação em `/enviar-capa.html`. O build também reconhece uma única imagem enviada na raiz do repositório. Depois de salvar o arquivo na main, a Vercel atualiza o site automaticamente. Para conferir a seleção localmente, rode `npm run build` e `npm run preview`. A seleção é gravada somente em dist/src/cover.js; o arquivo original permanece intacto.

A capa é exibida na proporção original, inclusive no celular. As imagens mantêm suas proporções originais, inclusive no celular.

## Conteúdo
Edite `src/content.js`: livro, capítulos, publicações e nove personagens. Todos os textos canônicos ausentes estão identificados como placeholders. As publicações dos capítulos usam as capas aprovadas pelo autor. O visual segue a referência de caderno: papel marfim, perfurações, recortes lilás, cabeçalho preto e anotações manuscritas. As fontes Bebas Neue, Barlow Condensed e Caveat são servidas localmente, com licenças em public/fonts.

## Capítulos publicados

Somente os capítulos 1–9 do arquivo **Isolados V2.pdf** foram importados, em `src/chapters/01.js` a `09.js`. Os títulos e todas as palavras e pontuações foram preservados. As quebras de linha de diagramação do PDF foram reorganizadas em parágrafos para leitura responsiva, usando a estrutura marcada do PDF. Não houve revisão, correção ou reescrita.

A importação compara integralmente cada capítulo com uma extração independente via pdftotext antes de gravar os arquivos. O registro de origem e os hashes estão em `scripts/chapter-import-audit.json`. Para reproduzir localmente, use `python3 scripts/import-chapters.py /caminho/arquivo.pdf` com pypdf, pdfplumber e pdftotext disponíveis. Essas ferramentas não são necessárias para o build ou a hospedagem. O PDF completo e os capítulos 10 em diante não são publicados.

A sinopse fornecida pelo autor está em `src/content.js` e pode ser lida em `/#/sobre`, com acesso pela barra lateral.

## Aparência

As nove capas de capítulo estão em `public/images/chapters/`, em WebP com a composição inteira e resolução de 1536 × 1024. O mapeamento e as descrições acessíveis ficam em `src/chapter-covers.js`, separados dos textos. As imagens aparecem nas publicações da página inicial, no índice e na abertura de cada capítulo. Foram usadas as versões aprovadas: Miguel transformado no capítulo 3; Jennyfer e Henrique surpresos no 4; Miguel determinado e os amigos surpresos no 8.

O botão no cabeçalho abre quatro opções: Fogo (totalmente claro), Água (totalmente escuro), Terra (tom intermediário) e Ar (claro, papel marfim). A escolha fica salva no navegador. Preferências de modo claro/escuro da versão anterior são preservadas.

## Fichas dos personagens

Os nove nomes civis, codinomes e caminhos dos retratos ficam em `src/characters.js`. Cada protagonista tem uma imagem própria em `public/images/characters/`, gerada individualmente a pedido do autor. A composição em `public/images/personagens-isolados.png` permanece como referência visual. O codinome aparece em destaque e o nome civil logo abaixo. As biografias ainda aguardam textos do autor.
