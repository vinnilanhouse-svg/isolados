-- ISOLADOS: executar uma vez no SQL Editor do projeto do autor.
-- Pode ser executado novamente sem apagar comentários ou curtidas.
begin;

create table if not exists public.isolados_comments (
  id uuid primary key default gen_random_uuid(),
  chapter smallint not null check (chapter between 1 and 9),
  user_id uuid not null references auth.users(id) on delete cascade,
  submission_id uuid not null,
  display_name text not null check (
    display_name = btrim(display_name)
    and char_length(display_name) between 2 and 50
    and display_name !~ '[[:cntrl:]]'
  ),
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, submission_id)
);
create index if not exists isolados_comments_public_order
  on public.isolados_comments (chapter, created_at desc, id desc) where approved;
create index if not exists isolados_comments_user_recent
  on public.isolados_comments (user_id, created_at desc);

create table if not exists public.isolados_likes (
  chapter smallint not null check (chapter between 1 and 9),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (chapter, user_id)
);

alter table public.isolados_comments enable row level security;
alter table public.isolados_likes enable row level security;

-- Visitantes leem somente comentários aprovados, sem identificadores privados.
revoke all on public.isolados_comments from public, anon, authenticated;
grant select (id, chapter, display_name, body, created_at)
  on public.isolados_comments to anon, authenticated;
grant insert (chapter, user_id, submission_id, display_name, body)
  on public.isolados_comments to authenticated;

drop policy if exists isolados_comments_read on public.isolados_comments;
create policy isolados_comments_read on public.isolados_comments
  for select to anon, authenticated using (approved);
drop policy if exists isolados_comments_submit on public.isolados_comments;
create policy isolados_comments_submit on public.isolados_comments
  for insert to authenticated
  with check ((select auth.uid()) = user_id and not approved);

-- Uma curtida por identidade anônima do navegador, sem expor quem curtiu.
revoke all on public.isolados_likes from public, anon, authenticated;
grant select (chapter, user_id), insert (chapter, user_id), delete
  on public.isolados_likes to authenticated;
drop policy if exists isolados_likes_own_read on public.isolados_likes;
create policy isolados_likes_own_read on public.isolados_likes
  for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists isolados_likes_own_insert on public.isolados_likes;
create policy isolados_likes_own_insert on public.isolados_likes
  for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists isolados_likes_own_delete on public.isolados_likes;
create policy isolados_likes_own_delete on public.isolados_likes
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Só a contagem é pública. O argumento não permite consultar outros dados.
create or replace function public.isolados_like_count(p_chapter integer)
returns bigint language sql stable security definer set search_path = ''
as $$
  select count(*) from public.isolados_likes
  where chapter = p_chapter and p_chapter between 1 and 9;
$$;
revoke all on function public.isolados_like_count(integer) from public;
grant execute on function public.isolados_like_count(integer) to anon, authenticated;

-- Limite no servidor: no máximo 3 comentários a cada 10 minutos por identidade.
-- Aprovar ou apagar no Table Editor continua disponível somente ao dono do projeto.
create schema if not exists isolados_private;
revoke all on schema isolados_private from public, anon, authenticated;
create or replace function isolados_private.limit_comment_submissions()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  perform pg_advisory_xact_lock(hashtextextended(new.user_id::text, 0));
  if exists (select 1 from public.isolados_comments
             where user_id = new.user_id and submission_id = new.submission_id) then
    return new;
  end if;
  if (select count(*) from public.isolados_comments
      where user_id = new.user_id and created_at > now() - interval '10 minutes') >= 3 then
    raise exception 'ISOLADOS_RATE_LIMIT' using errcode = 'P0001';
  end if;
  return new;
end;
$$;
revoke all on function isolados_private.limit_comment_submissions() from public, anon, authenticated;
drop trigger if exists isolados_comments_limit on public.isolados_comments;
create trigger isolados_comments_limit before insert on public.isolados_comments
  for each row execute function isolados_private.limit_comment_submissions();

commit;
