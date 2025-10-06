#!/bin/bash

# ========================================
# Code Promotion Script
# ========================================
# Promotes code between environments with validation
# Usage: ./scripts/promote.sh [source] [destination]
# Examples:
#   ./scripts/promote.sh develop staging
#   ./scripts/promote.sh staging production
# ========================================

set -e  # Exit on error

# ========================================
# Configuration
# ========================================

SOURCE_BRANCH=$1
DEST_BRANCH=$2

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ========================================
# Validation
# ========================================

if [ -z "$SOURCE_BRANCH" ] || [ -z "$DEST_BRANCH" ]; then
  echo -e "${RED}❌ Error: Missing arguments${NC}"
  echo ""
  echo "Usage: ./scripts/promote.sh [source] [destination]"
  echo ""
  echo "Examples:"
  echo "  ./scripts/promote.sh develop staging       # Promote to validation lab"
  echo "  ./scripts/promote.sh staging production    # Promote to production"
  exit 1
fi

# Convert staging → main for production
if [ "$DEST_BRANCH" == "production" ]; then
  DEST_BRANCH="main"
fi

# ========================================
# Header
# ========================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🚀 Code Promotion${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "From: ${YELLOW}$SOURCE_BRANCH${NC}"
echo -e "To:   ${GREEN}$DEST_BRANCH${NC}"
echo "Date: $(date)"
echo ""

# ========================================
# Pre-flight checks
# ========================================

echo -e "${BLUE}🔍 Running pre-flight checks...${NC}"
echo ""

# Check if git repo
if [ ! -d ".git" ]; then
  echo -e "${RED}❌ Error: Not a git repository${NC}"
  exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
  echo ""
  git status --short
  echo ""
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Promotion cancelled"
    exit 1
  fi
fi

# Check if branches exist
if ! git show-ref --verify --quiet "refs/heads/$SOURCE_BRANCH"; then
  echo -e "${RED}❌ Error: Source branch '$SOURCE_BRANCH' does not exist${NC}"
  exit 1
fi

if ! git show-ref --verify --quiet "refs/heads/$DEST_BRANCH"; then
  echo -e "${RED}❌ Error: Destination branch '$DEST_BRANCH' does not exist${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Pre-flight checks passed${NC}"
echo ""

# ========================================
# Fetch latest changes
# ========================================

echo -e "${BLUE}📥 Fetching latest changes...${NC}"
git fetch origin

# Check if local branches are up to date
LOCAL_SOURCE=$(git rev-parse $SOURCE_BRANCH)
REMOTE_SOURCE=$(git rev-parse origin/$SOURCE_BRANCH)

if [ "$LOCAL_SOURCE" != "$REMOTE_SOURCE" ]; then
  echo -e "${YELLOW}⚠️  Your local $SOURCE_BRANCH is not up to date with origin${NC}"
  echo ""
  read -p "Pull latest changes? (Y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    git checkout $SOURCE_BRANCH
    git pull origin $SOURCE_BRANCH
  fi
fi

echo -e "${GREEN}✅ Branches up to date${NC}"
echo ""

# ========================================
# Show changes to be promoted
# ========================================

echo -e "${BLUE}📝 Changes to be promoted:${NC}"
echo ""

# Get commit log
COMMITS=$(git log origin/$DEST_BRANCH..origin/$SOURCE_BRANCH --oneline)

if [ -z "$COMMITS" ]; then
  echo -e "${YELLOW}⚠️  No new commits to promote${NC}"
  echo "   Source and destination are already in sync"
  exit 0
fi

echo "$COMMITS" | head -10

COMMIT_COUNT=$(echo "$COMMITS" | wc -l)
echo ""
echo "Total commits: $COMMIT_COUNT"
echo ""

# ========================================
# Confirmation prompt
# ========================================

if [ "$DEST_BRANCH" == "main" ]; then
  echo -e "${RED}⚠️  WARNING: You are about to promote to PRODUCTION${NC}"
  echo ""
  echo "   This will affect live users!"
  echo ""
  echo "   Have you completed the validation checklist? (see VALIDATION_CHECKLIST.md)"
  echo ""
  read -p "   Type 'PRODUCTION' to confirm: " CONFIRM

  if [ "$CONFIRM" != "PRODUCTION" ]; then
    echo ""
    echo "Promotion cancelled"
    exit 1
  fi
else
  read -p "Continue with promotion? (Y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "Promotion cancelled"
    exit 1
  fi
fi

echo ""

# ========================================
# Perform promotion
# ========================================

echo -e "${BLUE}🚀 Promoting code...${NC}"
echo ""

# Checkout destination branch
echo "1. Checking out $DEST_BRANCH..."
git checkout $DEST_BRANCH

# Pull latest
echo "2. Pulling latest $DEST_BRANCH..."
git pull origin $DEST_BRANCH

# Merge source branch
echo "3. Merging $SOURCE_BRANCH into $DEST_BRANCH..."
git merge origin/$SOURCE_BRANCH --no-ff -m "Promote $SOURCE_BRANCH to $DEST_BRANCH"

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Merge conflict detected${NC}"
  echo ""
  echo "Please resolve conflicts manually:"
  echo "  1. Fix conflicts in the files listed above"
  echo "  2. git add <resolved-files>"
  echo "  3. git commit"
  echo "  4. git push origin $DEST_BRANCH"
  exit 1
fi

# Push to origin
echo "4. Pushing to origin/$DEST_BRANCH..."
git push origin $DEST_BRANCH

echo ""
echo -e "${GREEN}✅ Code promotion successful${NC}"
echo ""

# ========================================
# Next steps
# ========================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Promotion Complete${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps:"
echo ""

if [ "$DEST_BRANCH" == "staging" ]; then
  echo "1. Manually deploy on Render:"
  echo "   → https://dashboard.render.com"
  echo "   → Select: design-rite-staging"
  echo "   → Click: Manual Deploy → Deploy latest commit"
  echo ""
  echo "2. Test in validation lab:"
  echo "   → https://design-rite-staging.onrender.com"
  echo ""
  echo "3. Complete validation checklist:"
  echo "   → See VALIDATION_CHECKLIST.md"
  echo ""
  echo "4. If validation passes:"
  echo "   → ./scripts/promote.sh staging production"

elif [ "$DEST_BRANCH" == "main" ]; then
  echo "1. Manually deploy on Render:"
  echo "   → https://dashboard.render.com"
  echo "   → Select: design-rite-v4 (PRODUCTION)"
  echo "   → Click: Manual Deploy → Deploy latest commit"
  echo ""
  echo "2. Monitor production:"
  echo "   → https://design-rite-v4.onrender.com"
  echo "   → Check logs for errors"
  echo "   → Test critical paths"
  echo ""
  echo "3. Notify team:"
  echo "   ✉️  Dan, Phil, Nicholas - production deployed"
  echo ""
  echo "4. If issues occur:"
  echo "   → Rollback: git revert HEAD && git push"
  echo "   → Or redeploy previous version in Render"
fi

echo ""
echo "🎉 Happy deploying!"
echo ""

# ========================================
# Optional: Trigger Render deployment
# ========================================

# Uncomment if you set up Render deploy hooks
# if [ "$DEST_BRANCH" == "staging" ]; then
#   echo "Triggering Render staging deployment..."
#   curl -X POST $RENDER_STAGING_DEPLOY_HOOK
# elif [ "$DEST_BRANCH" == "main" ]; then
#   echo "Triggering Render production deployment..."
#   curl -X POST $RENDER_PRODUCTION_DEPLOY_HOOK
# fi
