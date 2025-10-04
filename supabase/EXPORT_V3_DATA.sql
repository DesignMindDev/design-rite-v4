-- ============================================================================
-- EXPORT DATA FROM V3 PROJECT (ickwrbdpuorzdpzqbqpf)
-- Run these queries in V3 project, then copy results to CSV
-- ============================================================================

-- PRODUCTS (3,000+ items) - CRITICAL
COPY (
  SELECT * FROM products ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- DEMO BOOKINGS - CRITICAL
COPY (
  SELECT * FROM demo_bookings ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- ASSESSMENTS
COPY (
  SELECT * FROM assessments ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- DOCUMENTS
COPY (
  SELECT * FROM documents ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- UPLOADED DOCUMENTS
COPY (
  SELECT * FROM uploaded_documents ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- SPATIAL PROJECTS
COPY (
  SELECT * FROM spatial_projects ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- SPATIAL FLOORPLANS
COPY (
  SELECT * FROM spatial_floorplans ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- SUBSCRIPTIONS
COPY (
  SELECT * FROM subscriptions ORDER BY created_at
) TO STDOUT WITH CSV HEADER;

-- ============================================================================
-- OR use Supabase Dashboard UI Export:
-- 1. Go to V3 project → Table Editor
-- 2. Click on table (e.g., "products")
-- 3. Click "..." menu → "Export to CSV"
-- 4. Save file
-- 5. Repeat for all tables above
-- ============================================================================
