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

## Leitura e marcador

Na página inicial, o bloco “Comece por aqui” traz a capa do primeiro capítulo, o acesso à leitura e a sinopse, logo acima do marcador. O convite usa papel marfim e o marcador usa um recorte roxo com ícone de fita e botão de retomada, inspirados na proposta visual 5. Ambos se adaptam ao celular e aos quatro temas.

O site salva a passagem de cada capítulo no navegador, sem conta. Abrir outro capítulo para consultar ou voltar ao topo não apaga o ponto anterior. O marcador principal muda quando o leitor avança um trecho na outra leitura. As posições ficam em `isolados-reading-library`, com migração automática do marcador antigo, preservado para compatibilidade. O cartão “Continuar de onde parei” aparece na página inicial e no índice. Reabrir um capítulo restaura sua passagem salva. O marcador usa uma posição no texto para acompanhar mudanças de fonte e largura de tela.

“Ajustar leitura”, dentro dos capítulos, permite escolher o tamanho de 16 a 28 px e três espaçamentos de linha, com opção de restaurar o padrão. O painel é compacto e pode ser recolhido por “Fechar ajustes”, pelo título ou com Escape, preservando a passagem visível. As preferências ficam salvas no mesmo navegador. O texto original não é modificado. O controle permanece acessível durante a rolagem e funciona nos quatro temas. Se o armazenamento estiver indisponível, os controles continuam funcionando durante a visita.

As publicações e o arquivo lateral da página inicial seguem a ordem decrescente dos capítulos, e o bloco “NOVO CAPÍTULO”, abaixo do marcador, destaca automaticamente o mais recente disponível. O índice e a navegação de leitura continuam na ordem 1–9. Ao terminar o último disponível, uma mensagem informa “Você chegou ao último capítulo disponível” e “Mais capítulos em breve”, fora do texto original.

A mensagem do autor aparece automaticamente até ser fechada na primeira visita. Depois, continua acessível pelo botão “Mensagem do autor” no rodapé, com a preferência salva no navegador.

## Fichas dos personagens

Os nove nomes civis, codinomes e caminhos dos retratos ficam em `src/characters.js`. Cada protagonista tem uma imagem própria em `public/images/characters/`, gerada individualmente a pedido do autor. A composição em `public/images/personagens-isolados.png` permanece como referência visual. O codinome aparece em destaque e o nome civil logo abaixo. As biografias ainda aguardam textos do autor.
