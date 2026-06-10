-- ============================================================
-- BrandOS — Initial Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension (already on by default in Supabase)
create extension if not exists "uuid-ossp";

-- ============================================================
-- brands
-- One row per brand. v1 = just BrandOS itself.
-- Every other table references this via brand_id.
-- ============================================================
create table if not exists brands (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  voice_notes   text,          -- tone, personality, do/don't say
  guidelines    text,          -- visual + messaging rules
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Seed row for BrandOS itself
insert into brands (name, voice_notes, guidelines)
values (
  'BrandOS',
  'Direct, confident, and human. We talk to busy founders who are sick of agency jargon. No buzzwords. Concrete outcomes only.',
  'Primary color: #2563EB (blue-600). Clean sans-serif. Lead with the problem, land on the outcome. Never say "leverage" or "synergy".'
);

-- ============================================================
-- users (extends Supabase auth.users)
-- ============================================================
create table if not exists users (
  id          uuid primary key references auth.users(id) on delete cascade,
  brand_id    uuid references brands(id) on delete set null,
  email       text,
  role        text not null default 'owner' check (role in ('owner', 'editor', 'viewer')),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- pages
-- Every generated landing page lives here.
-- ============================================================
create table if not exists pages (
  id                uuid primary key default uuid_generate_v4(),
  brand_id          uuid references brands(id) on delete cascade,
  title             text not null,
  prompt            text,                  -- the user's original request
  generated_content text,                  -- the full HTML output from Claude
  status            text not null default 'draft' check (status in ('draft', 'live', 'archived')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- Users can only see data for their brand.
-- ============================================================

alter table brands enable row level security;
alter table users  enable row level security;
alter table pages  enable row level security;

-- brands: a user can see their brand
create policy "Users can view their brand"
  on brands for select
  using (
    id in (
      select brand_id from users where id = auth.uid()
    )
  );

-- users: a user can see and update their own row
create policy "Users can view own record"
  on users for select
  using (id = auth.uid());

create policy "Users can update own record"
  on users for update
  using (id = auth.uid());

-- pages: users can CRUD pages for their brand
create policy "Users can view pages for their brand"
  on pages for select
  using (
    brand_id in (
      select brand_id from users where id = auth.uid()
    )
  );

create policy "Users can insert pages for their brand"
  on pages for insert
  with check (
    brand_id in (
      select brand_id from users where id = auth.uid()
    )
    or brand_id is null  -- allow null brand_id during early dev
  );

create policy "Users can update pages for their brand"
  on pages for update
  using (
    brand_id in (
      select brand_id from users where id = auth.uid()
    )
  );

-- ============================================================
-- Auto-update updated_at on edits
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger brands_updated_at
  before update on brands
  for each row execute procedure update_updated_at();

create trigger pages_updated_at
  before update on pages
  for each row execute procedure update_updated_at();
