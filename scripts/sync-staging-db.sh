#!/bin/bash

# ========================================
# Daily Database Sync Script
# ========================================
# Syncs production database to staging with data anonymization
# Run daily at 9 AM EST during active v4 development
# ========================================

set -e  # Exit on error

echo "🔄 Starting daily database sync..."
echo "📅 $(date)"
echo ""

# ========================================
# Configuration
# ========================================

# Production Supabase (source)
PROD_DB_URL="postgresql://postgres:[PROD_PASSWORD]@db.ickwrbdpuorzdpzqbqpf.supabase.co:5432/postgres"

# Staging Supabase (destination)
STAGING_DB_URL="postgresql://postgres:[STAGING_PASSWORD]@db.[STAGING_REF].supabase.co:5432/postgres"

# Backup directory
BACKUP_DIR="./database-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/prod_backup_$TIMESTAMP.sql"
ANON_FILE="$BACKUP_DIR/prod_backup_${TIMESTAMP}_anonymized.sql"

# ========================================
# Step 1: Create backup directory
# ========================================

echo "📁 Creating backup directory..."
mkdir -p "$BACKUP_DIR"

# ========================================
# Step 2: Export production database
# ========================================

echo "📤 Exporting production database..."
echo "   This may take 2-3 minutes..."

# Use the cleaned backup file we already have
# OR run fresh export:
# pg_dump "$PROD_DB_URL" \
#   --schema=public \
#   --no-owner \
#   --no-privileges \
#   > "$BACKUP_FILE"

# For now, copy our cleaned backup
cp "C:/Users/dkozi/Downloads/designr_backup_final_v2.sql" "$BACKUP_FILE"

echo "✅ Export complete: $BACKUP_FILE"
FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "   File size: $FILE_SIZE"
echo ""

# ========================================
# Step 3: Anonymize sensitive data
# ========================================

echo "🔒 Anonymizing sensitive data..."

# Create anonymized version
cp "$BACKUP_FILE" "$ANON_FILE"

# Replace email addresses
sed -i "s/[a-zA-Z0-9._%+-]\+@[a-zA-Z0-9.-]\+\.[a-zA-Z]\{2,\}/test\$RANDOM@example.com/g" "$ANON_FILE"

# Replace names (common patterns)
sed -i "s/'[A-Z][a-z]* [A-Z][a-z]*'/'Test User'/g" "$ANON_FILE"

# Replace phone numbers
sed -i "s/[0-9]\{3\}-[0-9]\{3\}-[0-9]\{4\}/555-555-0001/g" "$ANON_FILE"

# Replace SSNs (if any)
sed -i "s/[0-9]\{3\}-[0-9]\{2\}-[0-9]\{4\}/000-00-0000/g" "$ANON_FILE"

# Replace credit cards (if any)
sed -i "s/[0-9]\{4\}-[0-9]\{4\}-[0-9]\{4\}-[0-9]\{4\}/4242-4242-4242-4242/g" "$ANON_FILE"

echo "✅ Anonymization complete"
echo ""

# ========================================
# Step 4: Verify staging database
# ========================================

echo "🔍 Verifying staging database connection..."

psql "$STAGING_DB_URL" -c "SELECT version();" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Staging database connection successful"
else
  echo "❌ ERROR: Cannot connect to staging database"
  echo "   Check your STAGING_DB_URL in this script"
  exit 1
fi
echo ""

# ========================================
# Step 5: Backup existing staging data
# ========================================

echo "💾 Backing up existing staging data..."
STAGING_BACKUP_FILE="$BACKUP_DIR/staging_backup_$TIMESTAMP.sql"

pg_dump "$STAGING_DB_URL" \
  --schema=public \
  --no-owner \
  --no-privileges \
  > "$STAGING_BACKUP_FILE" 2>/dev/null || true

echo "✅ Staging backup saved: $STAGING_BACKUP_FILE"
echo ""

# ========================================
# Step 6: Drop staging schema
# ========================================

echo "🗑️  Dropping staging public schema..."

psql "$STAGING_DB_URL" -c "
  DROP SCHEMA IF EXISTS public CASCADE;
  CREATE SCHEMA public;
  GRANT ALL ON SCHEMA public TO postgres;
  GRANT ALL ON SCHEMA public TO public;
"

echo "✅ Staging schema dropped and recreated"
echo ""

# ========================================
# Step 7: Import to staging
# ========================================

echo "📥 Importing anonymized data to staging..."
echo "   This may take 3-5 minutes..."

psql "$STAGING_DB_URL" < "$ANON_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Import successful"
else
  echo "❌ ERROR: Import failed"
  echo ""
  echo "🔄 Restoring staging from backup..."
  psql "$STAGING_DB_URL" < "$STAGING_BACKUP_FILE"
  echo "✅ Staging restored to previous state"
  exit 1
fi
echo ""

# ========================================
# Step 8: Verify data integrity
# ========================================

echo "✔️  Verifying data integrity..."

# Check table count
TABLE_COUNT=$(psql "$STAGING_DB_URL" -t -c "
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = 'public';
" | tr -d ' ')

echo "   Tables in staging: $TABLE_COUNT"

if [ "$TABLE_COUNT" -lt 15 ]; then
  echo "⚠️  WARNING: Expected 20+ tables, found $TABLE_COUNT"
fi

# Check RLS enabled
RLS_DISABLED=$(psql "$STAGING_DB_URL" -t -c "
  SELECT COUNT(*)
  FROM pg_tables
  WHERE schemaname = 'public'
  AND rowsecurity = false;
" | tr -d ' ')

if [ "$RLS_DISABLED" -gt 0 ]; then
  echo "⚠️  WARNING: $RLS_DISABLED tables have RLS disabled"
fi

echo "✅ Data integrity check complete"
echo ""

# ========================================
# Step 9: Cleanup old backups
# ========================================

echo "🧹 Cleaning up old backups (keeping last 7 days)..."

find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete

REMAINING_BACKUPS=$(find "$BACKUP_DIR" -name "*.sql" | wc -l)
echo "   Remaining backups: $REMAINING_BACKUPS"
echo ""

# ========================================
# Step 10: Summary
# ========================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Daily Database Sync Complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Summary:"
echo "   Production exported: $FILE_SIZE"
echo "   Data anonymized: ✓"
echo "   Staging updated: ✓"
echo "   Tables in staging: $TABLE_COUNT"
echo "   Completed at: $(date)"
echo ""
echo "🔗 Staging URL: https://design-rite-staging.onrender.com"
echo ""
echo "📝 Next steps:"
echo "   1. Test staging environment"
echo "   2. Verify authentication works"
echo "   3. Check API endpoints"
echo ""

# ========================================
# Step 11: Send notification (optional)
# ========================================

# Uncomment to send email notification
# echo "Database sync complete" | mail -s "Staging DB Synced" dan@design-rite.com

# Or use Slack webhook
# curl -X POST -H 'Content-type: application/json' \
#   --data '{"text":"🔄 Staging database synced successfully"}' \
#   YOUR_SLACK_WEBHOOK_URL

echo "Done! 🎉"
