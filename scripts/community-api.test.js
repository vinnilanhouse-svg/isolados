import test from 'node:test';
import assert from 'node:assert/strict';
import { createCommunityClient } from '../src/community-api.js';
import { analyticsPath } from '../src/privacy.js';

const user = '00000000-0000-4000-8000-000000000001';
const submission = '10000000-0000-4000-8000-000000000001';
const config = { url: 'https://example.supabase.co', publishableKey: 'sb_publishable_test' };
const identity = { access_token: 'access-token-test', refresh_token: 'refresh-token-test', expires_in: 3600, user: { id: user } };
const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } });
function memory(initial = {}) {
  const data = new Map(Object.entries(initial));
  return { getItem: key => data.get(key) || null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
}

test('leitura pública não cria usuário e consulta somente colunas públicas', async () => {
  const calls = [];
  const client = createCommunityClient(config, { storage: memory(), fetcher: async (url, options) => {
    calls.push({ url, options });
    return json(url.includes('like_count') ? 0 : []);
  } });
  assert.deepEqual(await client.comments(2), []);
  assert.equal(await client.likeCount(2), 0);
  assert.equal(await client.ownLike(2), false);
  assert.equal(calls.length, 2);
  assert(!calls.some(call => call.url.includes('/auth/')));
  assert(!calls[0].options.headers.Authorization);
  assert.equal(new URL(calls[0].url).searchParams.get('select'), 'id,display_name,body,created_at');
});

test('participação simultânea compartilha sessão e não envia campos de aprovação', async () => {
  const calls = [];
  const storage = memory();
  const client = createCommunityClient(config, { storage, fetcher: async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith('/signup')) { await new Promise(resolve => setTimeout(resolve, 5)); return json(identity); }
    return new Response(null, { status: 201 });
  } });
  await Promise.all([client.setLike(3, true), client.submitComment(3, 'Leitor de teste', 'Mensagem de teste.', submission)]);
  assert.equal(calls.filter(call => call.url.endsWith('/signup')).length, 1);
  const comment = calls.find(call => call.url.endsWith('/isolados_comments'));
  assert.deepEqual(JSON.parse(comment.options.body), { chapter: 3, user_id: user, submission_id: submission, display_name: 'Leitor de teste', body: 'Mensagem de teste.' });
  assert.equal(comment.options.headers.Authorization, 'Bearer access-token-test');
  assert.equal(client.participationId(), user);
  assert(storage.getItem('isolados-community-session'));
});

test('sessão expirada é renovada sem criar outro participante', async () => {
  const calls = [];
  const storage = memory({ 'isolados-community-session': JSON.stringify({ ...identity, expires_at: 1 }) });
  const client = createCommunityClient(config, { storage, fetcher: async url => {
    calls.push(url); return json(url.includes('/token?') ? identity : [{ chapter: 1 }]);
  } });
  assert.equal(await client.ownLike(1), true);
  assert.equal(calls.filter(url => url.includes('/token?')).length, 1);
  assert(!calls.some(url => url.endsWith('/signup')));
});

test('reenvio confirmado não duplica comentário; falha preserva erro utilizável', async () => {
  const client = createCommunityClient(config, { storage: memory(), fetcher: async url => {
    if (url.endsWith('/signup')) return json(identity);
    return json({ code: '23505' }, 409);
  } });
  await client.submitComment(1, 'Leitor de teste', 'Mensagem de teste.', submission);
  const offline = createCommunityClient(config, { storage: memory(), fetcher: async () => { throw Error('offline'); } });
  await assert.rejects(() => offline.likeCount(1), error => error.code === 'NETWORK');
  await assert.rejects(() => client.submitComment(1, 'A', 'Texto', submission), error => error.code === 'INVALID_COMMENT');
  await assert.rejects(() => client.likeCount(10), error => error.code === 'INVALID_CHAPTER');
});

test('métricas usam só caminhos conhecidos, sem consultas ou textos de visitantes', () => {
  assert.equal(analyticsPath('#/capitulos/3?email=pessoal@example.com'), '/capitulos/3');
  assert.equal(analyticsPath('#/personagens/miguel'), '/personagens/miguel');
  assert.equal(analyticsPath('#/artes'), '/artes');
  assert.equal(analyticsPath('#/artes/fanarts'), '/artes/fanarts');
  assert.equal(analyticsPath('#/artes/fanarts/nome-pessoal'), '/pagina-nao-encontrada');
  assert.equal(analyticsPath('#/comentario/qualquer-texto-pessoal'), '/pagina-nao-encontrada');
  assert.equal(analyticsPath('#/'), '/');
});
