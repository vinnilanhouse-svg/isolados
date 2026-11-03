export class CommunityError extends Error {
  constructor(code, status = 0) { super(code); this.code = code; this.status = status; }
}

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const sessionKey = 'isolados-community-session';
function browserStorage() { try { return globalThis.localStorage; } catch { return null; } }

export function createCommunityClient(config, { fetcher = globalThis.fetch.bind(globalThis), storage = browserStorage(), now = Date.now } = {}) {
  const base = config.url.replace(/\/+$/, '');
  let session = null;
  let authPending;
  try {
    const value = JSON.parse(storage?.getItem(sessionKey) || 'null');
    if (value && uuid.test(value.user?.id) && typeof value.access_token === 'string'
        && typeof value.refresh_token === 'string' && Number.isFinite(value.expires_at)) session = value;
  } catch { /* Participação possível mesmo sem armazenamento persistente. */ }

  function persist(value) {
    session = value;
    try {
      if (value) storage?.setItem(sessionKey, JSON.stringify(value));
      else storage?.removeItem(sessionKey);
    } catch { /* Mantém a sessão em memória nesta visita. */ }
  }

  async function request(path, { method = 'GET', body, headers = {}, signal } = {}) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (signal?.aborted) abort();
    signal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(abort, 15000);
    try {
      const response = await fetcher(base + path, {
        method, credentials: 'omit', signal: controller.signal,
        headers: { apikey: config.publishableKey, Accept: 'application/json', ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...headers },
        ...(body === undefined ? {} : { body: JSON.stringify(body) })
      });
      const data = response.status === 204 ? null : await response.json().catch(() => null);
      if (!response.ok) throw new CommunityError(data?.code || data?.error_code || `HTTP_${response.status}`, response.status);
      return data;
    } catch (error) {
      if (error instanceof CommunityError) throw error;
      throw new CommunityError('NETWORK');
    } finally {
      clearTimeout(timeout);
      signal?.removeEventListener('abort', abort);
    }
  }

  function acceptSession(data) {
    if (!uuid.test(data?.user?.id) || typeof data.access_token !== 'string'
        || typeof data.refresh_token !== 'string' || !Number.isFinite(data.expires_in)) throw new CommunityError('BAD_SESSION');
    const value = { access_token: data.access_token, refresh_token: data.refresh_token,
      expires_at: Math.floor(now() / 1000) + data.expires_in, user: { id: data.user.id } };
    persist(value);
    return value;
  }

  async function authenticate(create = true) {
    if (session && session.expires_at > now() / 1000 + 60) return session;
    if (authPending) { await authPending; return session || (create ? authenticate(true) : null); }
    if (!session && !create) return null;
    authPending = (async () => {
      if (session) {
        try { return acceptSession(await request('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: session.refresh_token } })); }
        catch (error) {
          if (![400, 401, 403].includes(error.status)) throw error;
          persist(null);
        }
      }
      if (!create) return null;
      return acceptSession(await request('/auth/v1/signup', { method: 'POST', body: {} }));
    })();
    try { return await authPending; } finally { authPending = null; }
  }

  async function signed(action) {
    let identity = await authenticate();
    try { return await action(identity); }
    catch (error) {
      if (error.status !== 401) throw error;
      if (session) session.expires_at = 0;
      identity = await authenticate();
      return action(identity);
    }
  }

  function chapterNumber(chapter) {
    if (!Number.isInteger(chapter) || chapter < 1 || chapter > 9) throw new CommunityError('INVALID_CHAPTER');
    return chapter;
  }

  return {
    participationId: () => session?.user.id || null,
    async likeCount(chapter, signal) {
      const data = await request(`/rest/v1/rpc/isolados_like_count?p_chapter=${chapterNumber(chapter)}`, { signal });
      if (!Number.isSafeInteger(Number(data)) || Number(data) < 0 || data === null) throw new CommunityError('BAD_RESPONSE');
      return Number(data);
    },
    async ownLike(chapter, signal) {
      chapterNumber(chapter);
      const identity = await authenticate(false);
      if (!identity) return false;
      const query = new URLSearchParams({ select: 'chapter', chapter: `eq.${chapter}`, user_id: `eq.${identity.user.id}` });
      const rows = await request('/rest/v1/isolados_likes?' + query, { signal, headers: { Authorization: `Bearer ${identity.access_token}` } });
      if (!Array.isArray(rows)) throw new CommunityError('BAD_RESPONSE');
      return rows.length > 0;
    },
    async setLike(chapter, liked) {
      chapterNumber(chapter);
      await signed(async identity => {
        const headers = { Authorization: `Bearer ${identity.access_token}`, Prefer: 'return=minimal' };
        if (liked) {
          try { await request('/rest/v1/isolados_likes', { method: 'POST', headers, body: { chapter, user_id: identity.user.id } }); }
          catch (error) { if (error.code !== '23505') throw error; }
        } else {
          const query = new URLSearchParams({ chapter: `eq.${chapter}`, user_id: `eq.${identity.user.id}` });
          await request('/rest/v1/isolados_likes?' + query, { method: 'DELETE', headers });
        }
      });
      return Boolean(liked);
    },
    async comments(chapter, offset = 0, signal) {
      const query = new URLSearchParams({ select: 'id,display_name,body,created_at', chapter: `eq.${chapterNumber(chapter)}`,
        order: 'created_at.desc,id.desc', limit: '20', offset: String(Math.max(0, offset)) });
      const rows = await request('/rest/v1/isolados_comments?' + query, { signal });
      if (!Array.isArray(rows)) throw new CommunityError('BAD_RESPONSE');
      return rows;
    },
    async submitComment(chapter, name, body, submissionId) {
      chapterNumber(chapter);
      name = name.trim(); body = body.trim();
      if (name.length < 2 || name.length > 50 || /[\u0000-\u001f\u007f]/.test(name) || !body || body.length > 2000 || !uuid.test(submissionId)) throw new CommunityError('INVALID_COMMENT');
      await signed(async identity => {
        try {
          await request('/rest/v1/isolados_comments', { method: 'POST', headers: { Authorization: `Bearer ${identity.access_token}`, Prefer: 'return=minimal' },
            body: { chapter, user_id: identity.user.id, submission_id: submissionId, display_name: name, body } });
        } catch (error) { if (error.code !== '23505') throw error; }
      });
    }
  };
}
