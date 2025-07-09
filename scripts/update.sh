#!/bin/bash
# Design-Rite Platform - Zero-Downtime Update Script

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

echo -e "${BLUE}🔄 Design-Rite Platform Update${NC}"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Create backup before update
log "💾 Creating backup before update..."
./backup.sh

# Pull latest code (if using git)
if [ -d ".git" ]; then
    log "📥 Pulling latest code..."
    git pull origin main
fi

# Pull latest images
log "📦 Pulling latest Docker images..."
$DOCKER_COMPOSE pull

# Rolling update strategy
log "🔄 Performing rolling update..."

# Update backend first (API)
log "🔧 Updating backend service..."
$DOCKER_COMPOSE up -d --no-deps --build backend

# Wait for backend to be healthy
sleep 20

# Update frontend
log "🎨 Updating frontend service..."
$DOCKER_COMPOSE up -d --no-deps --build frontend

# Update n8n
log "🔄 Updating n8n workflows..."
$DOCKER_COMPOSE up -d --no-deps n8n

# Final health check
log "🔍 Running post-update health checks..."
sleep 30

if curl -f -s "http://localhost:3000" > /dev/null && \
   curl -f -s "http://localhost:8000/health" > /dev/null; then
    log "✅ Update completed successfully!"
else
    log "⚠️  Health check failed - please review logs"
    $DOCKER_COMPOSE logs --tail=50
fi

echo -e "${BLUE}🎉 Platform updated and ready!${NC}"
