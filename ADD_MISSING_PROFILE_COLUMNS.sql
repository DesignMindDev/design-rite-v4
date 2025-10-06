-- =====================================================
-- ADD MISSING COLUMNS TO profiles TABLE
-- =====================================================
-- Fix for: "column profiles.phone does not exist" error

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Verify columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('phone', 'avatar_url');

-- Expected result:
-- column_name | data_type
-- ------------|----------
-- phone       | text
-- avatar_url  | text
