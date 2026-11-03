import { communityConfig } from './community-config.js';
import { createCommunityClient } from './community-api.js';

const client = createCommunityClient(communityConfig);
const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';

export function chapterCommunity(chapter) {
  return `<section class="chapter-community" data-community-chapter="${chapter}" aria-labelledby="community-title-${chapter}">
    <div class="chapter-appreciation">
      <button type="button" class="chapter-like" aria-pressed="false" disabled>${heart}<span data-like-label>Curtir este capítulo</span><span class="like-count" data-like-count></span></button>
      <p class="community-status" data-like-status role="status">Carregando curtidas…</p>
    </div>
    <h2 id="community-title-${chapter}" tabindex="-1">Comentários</h2>
    <p class="community-intro">Converse sobre este capítulo. Os comentários aparecem após a aprovação do autor.</p>
    <form class="comment-form">
      <fieldset disabled>
        <legend class="sr-only">Deixar um comentário</legend>
        <label>Seu nome ou apelido<input name="display_name" autocomplete="nickname" minlength="2" maxlength="50" required></label>
        <label>Seu comentário<textarea name="body" rows="4" maxlength="2000" required></textarea></label>
        <label class="comment-honeypot" aria-hidden="true">Deixe em branco<input name="website" tabindex="-1" autocomplete="off"></label>
        <p class="comment-notice">Seu nome e comentário poderão ficar públicos após aprovação. Ao enviar, você concorda com os <a href="#/termos">Termos de uso</a>. Veja como tratamos seus dados na <a href="#/privacidade">Política de privacidade</a>.</p>
        <button type="submit" class="comment-submit">Enviar comentário</button>
      </fieldset>
      <p class="community-status" data-form-status role="status"></p>
    </form>
    <div class="comments-heading"><h3>Conversa do capítulo</h3><button type="button" class="community-text-button" data-comments-refresh>Atualizar comentários</button></div>
    <p class="community-status" data-comments-status role="status">Carregando comentários…</p>
    <div class="comments-list"></div>
    <button type="button" class="community-text-button" data-comments-more hidden>Carregar mais comentários</button>
  </section>`;
}

function errorMessage(error, action) {
  if (error.status === 429 || error.code === 'P0001') return 'Aguarde alguns minutos antes de tentar novamente.';
  if (error.code === 'INVALID_COMMENT') return 'Informe um nome de 2 a 50 caracteres e um comentário de até 2.000 caracteres.';
  return action === 'send' ? 'Não foi possível enviar agora. Seu texto continua aqui; tente novamente em instantes.' : 'Não foi possível carregar agora. Tente novamente em instantes.';
}

export function bindCommunity() {
  const root = document.querySelector('[data-community-chapter]');
  if (!root) return () => {};
  const chapter = Number(root.dataset.communityChapter);
  const controller = new AbortController();
  let disposed = false;
  let liked = false;
  let likeBusy = false;
  let count = null;
  let offset = 0;
  let commentsBusy = false;
  let draft = { signature: '', id: '' };
  const displayed = new Set();
  const button = root.querySelector('.chapter-like');
  const likeStatus = root.querySelector('[data-like-status]');
  const form = root.querySelector('form');
  const fields = form.querySelector('fieldset');
  const name = form.elements.display_name;
  const body = form.elements.body;
  const formStatus = root.querySelector('[data-form-status]');
  const submit = form.querySelector('[type="submit"]');
  const list = root.querySelector('.comments-list');
  const commentsStatus = root.querySelector('[data-comments-status]');
  const more = root.querySelector('[data-comments-more]');
  const refresh = root.querySelector('[data-comments-refresh]');

  function renderLike() {
    button.setAttribute('aria-pressed', String(liked));
    button.querySelector('[data-like-label]').textContent = liked ? 'Você curtiu este capítulo' : 'Curtir este capítulo';
    button.querySelector('[data-like-count]').textContent = count === null ? '' : String(count);
  }

  async function loadLikes() {
    button.disabled = true;
    likeStatus.textContent = 'Carregando curtidas…';
    try {
      const [total, own] = await Promise.all([client.likeCount(chapter, controller.signal), client.ownLike(chapter, controller.signal)]);
      if (disposed) return;
      count = total; liked = own; renderLike(); button.disabled = false;
      likeStatus.textContent = 'Sua curtida fica vinculada a este navegador.';
    } catch {
      if (disposed) return;
      likeStatus.textContent = 'Curtidas temporariamente indisponíveis.';
    }
  }

  button.addEventListener('click', async () => {
    if (likeBusy) return;
    likeBusy = true; button.disabled = true; likeStatus.textContent = 'Salvando sua escolha…';
    try {
      liked = await client.setLike(chapter, !liked);
      if (disposed) return;
      renderLike();
      try { count = await client.likeCount(chapter, controller.signal); }
      catch { count = null; }
      if (disposed) return;
      renderLike(); likeStatus.textContent = liked ? 'Curtida salva. Obrigado por ler!' : 'Curtida removida.';
    } catch (error) { if (!disposed) likeStatus.textContent = errorMessage(error, 'like'); }
    finally { likeBusy = false; if (!disposed) button.disabled = false; }
  });

  function appendComment(comment) {
    if (!comment || typeof comment.id !== 'string' || displayed.has(comment.id)) return;
    displayed.add(comment.id);
    const item = document.createElement('article'); item.className = 'reader-comment';
    const header = document.createElement('div'); header.className = 'reader-comment-meta';
    const author = document.createElement('strong'); author.textContent = String(comment.display_name || 'Leitor');
    header.append(author);
    const date = new Date(comment.created_at);
    if (Number.isFinite(date.getTime())) {
      const time = document.createElement('time'); time.dateTime = date.toISOString();
      time.textContent = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date); header.append(time);
    }
    const text = document.createElement('p'); text.textContent = String(comment.body || '');
    item.append(header, text); list.append(item);
  }

  async function loadComments(reset = false) {
    if (commentsBusy) return;
    commentsBusy = true; refresh.disabled = true; more.disabled = true;
    commentsStatus.textContent = 'Carregando comentários…';
    try {
      const nextOffset = reset ? 0 : offset;
      const rows = await client.comments(chapter, nextOffset, controller.signal);
      if (disposed) return;
      if (reset) { offset = 0; displayed.clear(); list.replaceChildren(); }
      rows.forEach(appendComment); offset += rows.length;
      more.hidden = rows.length < 20;
      fields.disabled = false;
      commentsStatus.textContent = displayed.size ? '' : 'Ainda não há comentários publicados. Quer deixar o primeiro?';
    } catch (error) {
      if (disposed) return;
      commentsStatus.textContent = errorMessage(error, 'load');
    } finally { commentsBusy = false; if (!disposed) { refresh.disabled = false; more.disabled = false; } }
  }
  refresh.addEventListener('click', () => { loadComments(true); if (count === null && !likeBusy) loadLikes(); });
  more.addEventListener('click', () => loadComments());
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled || form.elements.website.value) return;
    const sentName = name.value.trim(); const sentBody = body.value.trim();
    const signature = sentName + '\u0000' + sentBody;
    if (draft.signature !== signature) draft = { signature, id: crypto.randomUUID() };
    submit.disabled = true; formStatus.textContent = 'Enviando comentário…';
    try {
      await client.submitComment(chapter, sentName, sentBody, draft.id);
      if (disposed) return;
      if (body.value.trim() === sentBody) body.value = '';
      draft = { signature: '', id: '' };
      formStatus.textContent = 'Comentário enviado! Ele aparecerá após a aprovação do autor.';
    } catch (error) { if (!disposed) formStatus.textContent = errorMessage(error, 'send'); }
    finally { if (!disposed) submit.disabled = false; }
  });
  loadLikes(); loadComments(true);
  return () => { disposed = true; controller.abort(); };
}

export function participationId() { return client.participationId(); }
