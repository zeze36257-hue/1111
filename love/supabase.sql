-- 恋爱手账 · 数据库设置
-- 用法：在 Supabase 后台左侧点 "SQL Editor"，把这整个文件的内容粘贴进去，点 "Run"。
-- 只需要运行一次。重复运行也没关系，不会删掉已有的记录。
--
-- 存进来的内容（文字、照片）在手机上就已经用你们的暗号加密了，
-- 这里只存加密后的乱码，Supabase 和任何其他人都看不懂。

create sequence if not exists love_rev;

create table if not exists love_items (
  book    text    not null,               -- 由暗号算出来的编号（不是暗号本身）
  col     text    not null,               -- 哪一类：memories / dates / wishes / meta
  id      text    not null,
  data    text,                           -- 加密后的内容
  deleted boolean not null default false,
  rev     bigint  not null default nextval('love_rev'),
  primary key (book, col, id)
);
create index if not exists love_items_book_rev on love_items (book, rev);

-- 不允许网页直接读写这张表，只能通过下面三个函数，并且必须知道暗号算出的编号。
alter table love_items enable row level security;
revoke all on table love_items from anon, authenticated;
revoke all on sequence love_rev from anon, authenticated;

-- 读取：某本手账里 rev 大于 p_since 的改动（每次最多 30 条，网页会接着读）
create or replace function love_pull(p_book text, p_since bigint)
returns table (col text, id text, data text, deleted boolean, rev bigint)
language sql stable security definer set search_path = public as $$
  select i.col, i.id, i.data, i.deleted, i.rev
  from love_items i
  where i.book = p_book and i.rev > coalesce(p_since, 0)
  order by i.rev
  limit 30;
$$;

-- 写入或修改一条
create or replace function love_put(p_book text, p_col text, p_id text, p_data text)
returns bigint
language plpgsql security definer set search_path = public as $$
declare r bigint;
begin
  if p_book !~ '^[0-9a-f]{64}$' or p_col !~ '^[a-z]{1,20}$'
     or p_id !~ '^[A-Za-z0-9_-]{1,64}$' or p_data is null or length(p_data) > 400000 then
    raise exception 'invalid input';
  end if;
  insert into love_items (book, col, id, data, deleted)
  values (p_book, p_col, p_id, p_data, false)
  on conflict (book, col, id)
  do update set data = excluded.data, deleted = false, rev = nextval('love_rev')
  returning love_items.rev into r;
  return r;
end $$;

-- 删除一条（留下一个“已删除”标记，这样另一台手机也知道要删掉）
create or replace function love_del(p_book text, p_col text, p_id text)
returns bigint
language plpgsql security definer set search_path = public as $$
declare r bigint;
begin
  if p_book !~ '^[0-9a-f]{64}$' or p_col !~ '^[a-z]{1,20}$' or p_id !~ '^[A-Za-z0-9_-]{1,64}$' then
    raise exception 'invalid input';
  end if;
  insert into love_items (book, col, id, data, deleted)
  values (p_book, p_col, p_id, null, true)
  on conflict (book, col, id)
  do update set data = null, deleted = true, rev = nextval('love_rev')
  returning love_items.rev into r;
  return r;
end $$;

-- 对账：只列出编号和版本号（很小），网页打开时用它检查有没有漏掉的改动
create or replace function love_index(p_book text)
returns table (col text, id text, rev bigint)
language sql stable security definer set search_path = public as $$
  select i.col, i.id, i.rev from love_items i where i.book = p_book;
$$;

revoke execute on function love_pull(text, bigint) from public;
revoke execute on function love_put(text, text, text, text) from public;
revoke execute on function love_del(text, text, text) from public;
revoke execute on function love_index(text) from public;
grant execute on function love_pull(text, bigint) to anon, authenticated;
grant execute on function love_put(text, text, text, text) to anon, authenticated;
grant execute on function love_del(text, text, text) to anon, authenticated;
grant execute on function love_index(text) to anon, authenticated;
