-- CREATE TEST ACCOUNTS IN SUBSCRIPTION PROJECT
-- Run this in aeorianxnxpxveoxzhov SQL Editor
-- Creates 3 test accounts with confirmed emails

-- Note: You'll need to set passwords via Supabase Dashboard or use these SQL inserts
-- For simplicity, create via Dashboard after running this, OR use the Dashboard method entirely

-- Method 1: Just use Supabase Dashboard (Easier)
-- Go to Authentication → Users → Add user → Create new user
-- Email: dkozich65@gmail.com, Password: (your choice), Auto Confirm User: YES
-- Email: dkozich2021@gmail.com, Password: (your choice), Auto Confirm User: YES
-- Email: zclient@design-rite.com, Password: (your choice), Auto Confirm User: YES

-- Method 2: If you want to use SQL (more complex, requires password hashing)
-- Uncomment and modify the below if you want to do it via SQL:

/*
-- Generate password hash first (use bcrypt with cost 10)
-- Then insert users:

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'dkozich65@gmail.com',
    crypt('YourPasswordHere', gen_salt('bf')), -- Replace with actual password
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    'authenticated'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'dkozich2021@gmail.com',
    crypt('YourPasswordHere', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    'authenticated'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'zclient@design-rite.com',
    crypt('YourPasswordHere', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
    'authenticated'
  );
*/

-- RECOMMENDED: Just use Supabase Dashboard → Authentication → Users → Add user
-- It's much easier and handles all the complexity automatically!
