# ISOLADOS
Site literário de ISOLADOS, obra de Vinícius Coradi Maddaloni. O site é de propriedade e responsabilidade da Elemental Corp. JavaScript, CSS e HTML estáticos; o SDK oficial da Vercel Analytics é incluído no build.

## Desenvolvimento
Node.js 24.x. Instale com `npm ci`; execute `npm test` e `npm run build`. Para validar o resultado: `npm run preview`. O site compilado fica em `dist/`.

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

## Galeria de artes

A aba **Artes** fica em `/#/artes`, com filtros **Todas**, **Capítulos**, **Personagens** e a subaba **Fanarts**. As nove capas e os nove retratos usam os arquivos já aprovados; nomes e títulos vêm dos conteúdos existentes. Cada imagem pode ser ampliada com clique ou Enter, com navegação pelas setas e fechamento por Escape. As composições são exibidas inteiras, sem recortes.

O conteúdo da galeria fica separado em `src/art-content.js`. As miniaturas em `public/images/art-thumbnails/` tornam a grade mais leve, enquanto a ampliação carrega o arquivo original. Para incluir fanarts, adicione ao array `fanarts` os arquivos e créditos fornecidos pelo autor; há um formato de entrada documentado nesse arquivo. Enquanto o array estiver vazio, a página informa que as artes ainda serão inseridas. Não há exemplos fictícios nem envio automático de arquivos.

## Comentários e curtidas

Os nove capítulos têm participação ao final da leitura. A configuração pública do Supabase fica em `src/community-config.js`. Somente a URL do projeto e a chave publishable são usadas no navegador. Nunca incluir chave secret, service_role ou senha do banco.

Para ativar, abra `/configurar-comentarios.html` na versão publicada: a página fornece o SQL completo com botão de copiar e link ao painel do projeto. Execute `supabase/setup.sql` no SQL Editor e ative **Authentication → Sign In / Providers → Anonymous Sign-Ins**. Nenhuma dessas ações pode ser feita com a chave pública enviada ao site.

O visitante pode ler comentários aprovados sem autenticar. A identidade anônima é criada apenas ao curtir ou comentar e a sessão é mantida no navegador. A mesma identidade pode curtir uma vez por capítulo e desfazer a própria curtida. Isso não equivale a identificar uma pessoa civil: limpar dados ou trocar de navegador pode criar outra identidade.

Os comentários entram com `approved = false`. Para publicar, o responsável usa **Table Editor → isolados_comments**, revisa e altera `approved` para `true`; para recusar ou remover, apaga pelo painel. Leitores não podem aprovar, editar ou apagar comentários pelo acesso público. Os identificadores de usuário não são expostos na lista pública. O banco limita envios e o formulário evita duplicação em reenvios de uma mesma mensagem. Não há conteúdo fictício ou números de engajamento de demonstração no site.

Caso as tabelas ou a autenticação ainda não estejam prontas, ou a conexão falhe, o site apresenta indisponibilidade e mantém a leitura. Testes de interface usam respostas locais; as permissões do SQL também foram verificadas em PostgreSQL local com papéis anon/authenticated. A validação online exige as duas etapas administrativas acima e acesso ao projeto.

## Métricas e privacidade

O pacote `@vercel/analytics` usa a integração de JavaScript puro. A Vercel deve ter Web Analytics habilitado no projeto. As visitas podem ser consultadas em **Vercel → projeto → Analytics** depois do deploy e de visitas com aceitação das métricas, respeitando o plano e suas cotas.

O SDK e o script de métricas não são carregados antes da aceitação. “Somente necessários” e “Aceitar métricas” têm destaque equivalente, com personalização e revogação pelo rodapé. O middleware bloqueia novos eventos após a revogação. As rotas com hash são registradas manualmente como caminhos conhecidos, como `/capitulos/3`; consultas, comentários, apelidos e identificadores de participação não são enviados como eventos. Recusa, indisponibilidade ou bloqueio das métricas não impedem a leitura ou participação.

As páginas `/#/privacidade` e `/#/termos` descrevem os dados, finalidades, armazenamento, fornecedores, moderação, contato e escolhas implementadas. A Elemental Corp é a responsável pelo site; a autoria e os direitos do livro continuam de Vinícius Coradi Maddaloni. O contato informado é `coradi.maddaloni@gmail.com`. Não foram inventados razão social, CNPJ, endereço ou encarregado. O responsável deve validar a identificação jurídica, fundamentos, conservação, transferências e regras aplicáveis ao seu público antes de afirmar conformidade integral com a LGPD. Textos e controles técnicos, por si só, não certificam essa conformidade.
