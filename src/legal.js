export function legalPage(type) {
  const contact = '<a href="mailto:coradi.maddaloni@gmail.com">coradi.maddaloni@gmail.com</a>';
  if (type === 'termos') return `<article class="legal-reading">
    <h2>Termos de uso</h2>
    <p>Este site é de responsabilidade da Elemental Corp. O livro ISOLADOS é de autoria de Vinícius Coradi Maddaloni. A identificação da responsável pelo site não transfere a autoria ou os direitos do livro.</p>
    <h3>Leitura e direitos autorais</h3>
    <p>Os capítulos são disponibilizados para leitura neste site. Não é permitida a reprodução, distribuição ou circulação não autorizada da obra, no todo ou em parte. Pedidos de autorização podem ser enviados para ${contact}.</p>
    <h3>Comentários e curtidas</h3>
    <p>A participação é opcional e usa uma identidade técnica anônima deste navegador, sem exigir uma conta pessoal. Seu nome ou apelido e comentário poderão ser publicados após aprovação. Use um apelido se preferir e evite divulgar dados pessoais seus ou de outras pessoas.</p>
    <p>Não publique spam, ameaças, ataques pessoais, conteúdo ilegal ou material de terceiros sem autorização. Comentários podem ser recusados ou removidos na moderação. Os comentários são de responsabilidade de quem os envia e não representam necessariamente a Elemental Corp ou o autor.</p>
    <p>Há uma curtida por capítulo para cada identidade do navegador, com opção de desfazer. Limpar o armazenamento, trocar de navegador ou usar outro dispositivo pode criar uma identidade diferente; o sistema não comprova a identidade civil de cada participante.</p>
    <h3>Privacidade e contato</h3>
    <p>Consulte a <a href="#/privacidade">Política de privacidade</a>. Para dúvidas, moderação, direitos sobre conteúdo ou solicitações relativas a dados pessoais, escreva para ${contact}.</p>
  </article>`;
  return `<article class="legal-reading">
    <h2>Política de privacidade</h2>
    <p>A Elemental Corp é a responsável pela operação deste site. O contato para questões de privacidade e exercício de direitos é ${contact}. O livro ISOLADOS permanece de autoria de Vinícius Coradi Maddaloni.</p>
    <h3>Dados e finalidades</h3>
    <ul>
      <li><strong>Leitura e aparência:</strong> capítulo, posição da leitura, fonte e tema escolhidos ficam no seu navegador para atender às suas preferências.</li>
      <li><strong>Participação:</strong> se você curtir ou comentar, o Supabase cria uma identidade técnica anônima. São armazenados o identificador, as curtidas, o nome ou apelido informado, o texto, a situação da moderação e os horários dos comentários. O nome e o texto só ficam públicos após aprovação; os identificadores de autenticação não aparecem na lista pública.</li>
      <li><strong>Métricas opcionais:</strong> com sua autorização, a Vercel Web Analytics registra visualizações de páginas e informações técnicas de navegação para entender o uso do site. Não enviamos nomes, comentários ou identificadores de participação como eventos de análise.</li>
      <li><strong>Operação e segurança:</strong> os provedores de hospedagem e banco de dados podem tratar informações técnicas de conexão, como IP e registros de acesso, para operar e proteger os serviços.</li>
    </ul>
    <h3>Cookies e armazenamento local</h3>
    <p>As funções do site usam principalmente armazenamento local do navegador: marcador de leitura, aparência, preferências de privacidade, confirmação da mensagem inicial e sessão de participação. Não inserimos cookies de publicidade. A Vercel Web Analytics é oferecida como uma métrica opcional e seu script só é carregado depois da sua aceitação.</p>
    <p>Você pode recusar as métricas sem perder o acesso à leitura, às curtidas ou aos comentários. Ao retirar a autorização, novos eventos de análise são bloqueados. Limpar os dados do navegador remove as preferências locais e pode impedir que você reconheça ou desfaça curtidas associadas à identidade anterior.</p>
    <button class="legal-privacy-button" type="button" data-open-privacy>Gerenciar minhas preferências</button>
    <h3>Fundamentos e escolhas</h3>
    <p>As informações necessárias atendem às funções que você solicita ao usar o site, como guardar uma preferência ou enviar um comentário, e à segurança e moderação da participação. A análise opcional de visitas depende do seu consentimento, que pode ser retirado a qualquer momento. O uso e a publicação dos dados de participação são explicados antes do envio do formulário.</p>
    <h3>Provedores e armazenamento</h3>
    <p>Usamos Vercel para hospedagem e análise opcional, e Supabase para participação e banco de dados. Esses serviços podem envolver tratamento fora do Brasil, conforme a infraestrutura utilizada. Consulte as políticas da <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel</a> e do <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase</a> para informações sobre suas operações e salvaguardas.</p>
    <h3>Conservação e exclusão</h3>
    <p>As preferências ficam no navegador até serem alteradas ou apagadas. Curtidas permanecem vinculadas à identidade técnica até serem desfeitas ou excluídas. Comentários enviados, publicados ou pendentes, permanecem no banco para moderação e funcionamento da conversa até sua remoção. A responsável pode removê-los, e você pode solicitar a avaliação e exclusão pelo contato de privacidade. Registros técnicos dos provedores seguem suas próprias políticas de conservação.</p>
    <h3>Seus direitos</h3>
    <p>Você pode solicitar confirmação de tratamento, acesso, correção, informações sobre compartilhamento, revisão da necessidade de conservação e exclusão ou anonimização quando aplicáveis, além de retirar o consentimento das métricas. Para proteger os dados, pode ser necessário verificar a vinculação da solicitação à participação. Também é possível apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).</p>
    <p>Se você já participou neste navegador, este botão copia apenas seu identificador técnico, para ajudar a localizar seus registros em uma solicitação. Não compartilhe tokens ou dados de sessão.</p>
    <button type="button" class="legal-privacy-button" data-copy-participation>Copiar meu identificador de participação</button><p role="status" data-participation-status></p>
    <h3>Crianças e adolescentes</h3>
    <p>Evite informar dados pessoais de crianças ou adolescentes nos comentários. Responsáveis podem usar o contato de privacidade para esclarecer o tratamento e solicitar avaliação ou remoção de dados. Situações envolvendo esse público exigem atenção ao seu melhor interesse e às regras específicas aplicáveis.</p>
    <h3>Atualizações e contato</h3>
    <p>Esta política descreve as funções atuais do site. Mudanças relevantes nas finalidades ou nas opções de métricas serão apresentadas para nova escolha quando necessário. Para qualquer solicitação, escreva para ${contact}.</p>
  </article>`;
}
