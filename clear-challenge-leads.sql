-- Clear all test data from challenge_leads table
-- Run this in Supabase SQL Editor

DELETE FROM public.challenge_leads;

-- Or if you want to keep production data and only delete test emails:
-- DELETE FROM public.challenge_leads WHERE email LIKE '%@design-rite.com';

-- Verify deletion
SELECT COUNT(*) as remaining_leads FROM public.challenge_leads;
