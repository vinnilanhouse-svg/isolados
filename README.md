# ISOLADOS
Site literário de Vinícius Coradi Maddaloni. JavaScript, CSS e HTML, sem dependências de execução ou instalação.

## Desenvolvimento
Node.js 20 ou superior. Execute `npm run dev`. Para produção: `npm run build`; para validar o resultado: `npm run preview`.

## Vercel
Importe este repositório. A configuração `vercel.json` define `npm run build` e a saída `dist`. Não são necessárias variáveis ou segredos. As páginas usam rotas com hash para suportar atualização e links diretos em hospedagem estática.

## Imagens pendentes
Os anexos da conversa não foram disponibilizados como arquivos neste ambiente. Adicione os originais aprovados, sem modificá-los:
- `public/images/capa-isolados.jpg`: capa panorâmica completa.
- `public/images/simbolo-isolados.png`: símbolo branco original.

A capa é exibida na proporção original, inclusive no celular. Até os arquivos serem adicionados, há um placeholder de capa e a marca não é renderizada; nenhum símbolo substituto foi criado.

## Conteúdo
Edite `src/content.js`: livro, capítulos, publicações e nove personagens. Todos os textos canônicos ausentes estão identificados como placeholders. Os visuais dos cards são composições tipográficas decorativas, sem imagens canônicas inventadas. As fontes têm alternativas locais e usam Google Fonts quando disponível.
