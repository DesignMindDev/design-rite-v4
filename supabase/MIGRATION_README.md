# Supabase Migration Guide

## How to Apply Migrations

### Local Development (Supabase Cloud Dashboard)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of the migration file
5. Paste into the SQL editor
6. Click **Run** (or press Ctrl+Enter)
7. Verify success in the Results panel

### Recent Migration: Project Management Features

**File**: `add_progress_due_date_to_ai_sessions.sql`

**Date**: 2025-10-13

**Purpose**: Add progress tracking and due date management to the `ai_sessions` table for the workspace dashboard Recent Projects feature.

**Changes**:
- ✅ Added `progress` column (INTEGER 0-100) with constraint
- ✅ Added `due_date` column (TIMESTAMPTZ) for priority sorting
- ✅ Added `tool` column (TEXT) for workflow identification
- ✅ Added `user_id` column (UUID) for user-specific queries
- ✅ Added `status` column (TEXT) for project lifecycle tracking
- ✅ Added `data` column (JSONB) for storing project payloads
- ✅ Created indexes for performance optimization
- ✅ Added column documentation comments

**Impact**:
- Enables progress percentage display in Recent Projects table
- Enables due date tracking with priority-based sorting
- Enables "Continue Working" functionality to resume projects
- Color-coded priority indicators (red/orange/yellow/green)

**How to Apply**:
```sql
-- Run this in your Supabase SQL Editor:
-- Copy contents of: supabase/add_progress_due_date_to_ai_sessions.sql
-- Paste into SQL Editor and execute
```

**Verification**:
```sql
-- Check that columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'ai_sessions'
  AND column_name IN ('progress', 'due_date', 'tool', 'user_id', 'status', 'data');

-- Check that indexes were created
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'ai_sessions'
  AND indexname LIKE 'idx_ai_sessions_%';
```

## Migration History

| Date | File | Description |
|------|------|-------------|
| 2025-10-13 | `add_progress_due_date_to_ai_sessions.sql` | Add project management features (progress, due dates, priority sorting) |
| Earlier | `ai_sessions_tables.sql` | Initial AI sessions and conversations tables |
| Earlier | `auth_tables.sql` | User authentication and authorization tables |
| Earlier | `2_SPATIAL_STUDIO.sql` | Spatial Studio floorplan analysis tables |
| Earlier | `1_CREATIVE_STUDIO.sql` | Creative Studio design tables |

## Best Practices

1. **Always backup before migrations**: Export your data before running destructive operations
2. **Test in development first**: Apply migrations to a test/dev project before production
3. **Review changes**: Always review the SQL before executing
4. **Check dependencies**: Ensure referenced tables/columns exist
5. **Verify success**: Run verification queries after applying migrations
6. **Document changes**: Update this README with new migrations

## Rollback

If you need to rollback the project management migration:

```sql
-- Remove columns (careful - this will delete data!)
ALTER TABLE ai_sessions DROP COLUMN IF EXISTS progress;
ALTER TABLE ai_sessions DROP COLUMN IF EXISTS due_date;

-- Remove indexes
DROP INDEX IF EXISTS idx_ai_sessions_due_date;
DROP INDEX IF EXISTS idx_ai_sessions_progress;
```

**⚠️ Warning**: Rollback will permanently delete progress and due date data!
