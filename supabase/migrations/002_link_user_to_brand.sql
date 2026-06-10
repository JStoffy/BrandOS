-- ============================================================
-- Run AFTER 001 and AFTER you've signed up for the first time.
-- This links your Supabase auth user to the BrandOS brand row.
-- Replace 'your-email@example.com' with the email you signed up with.
-- ============================================================

-- Step 1: Insert yourself into the users table
insert into users (id, brand_id, email, role)
select
  au.id,
  b.id,
  au.email,
  'owner'
from auth.users au
cross join brands b
where au.email = 'your-email@example.com'  -- ← change this
  and b.name = 'BrandOS'
on conflict (id) do update
  set brand_id = excluded.brand_id,
      role = excluded.role;
