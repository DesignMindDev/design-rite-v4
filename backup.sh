#!/bin/bash
# Design-Rite Platform - Automated Backup System

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

echo -e "${BLUE}💾 Design-Rite Platform Backup${NC}"

# Create backup directory with timestamp
BACKUP_DIR="./backups/backup-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

log "📁 Creating backup in: $BACKUP_DIR"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Backup n8n workflows and data
log "🔄 Backing up n8n workflows..."
if [ -d "./workflows" ]; then
    cp -r ./workflows "$BACKUP_DIR/"
fi

# Backup Redis data
log "📊 Backing up Redis data..."
if docker ps | grep -q design-rite-redis; then
    docker exec design-rite-redis redis-cli --rdb /data/dump.rdb > /dev/null
    docker cp design-rite-redis:/data/dump.rdb "$BACKUP_DIR/redis_dump.rdb"
fi

# Backup uploaded files
log "📎 Backing up uploaded files..."
if [ -d "./backend/uploads" ]; then
    cp -r ./backend/uploads "$BACKUP_DIR/"
fi

# Backup configuration
log "⚙️  Backing up configuration..."
cp .env "$BACKUP_DIR/env_backup" 2>/dev/null || true
cp docker-compose.yml "$BACKUP_DIR/"
if [ -d "./config" ]; then
    cp -r ./config "$BACKUP_DIR/" 2>/dev/null || true
fi

# Create backup manifest
log "📋 Creating backup manifest..."
cat > "$BACKUP_DIR/BACKUP_INFO.txt" << EOF
Design-Rite Platform Backup
===========================
Backup Date: $(date)
Platform Version: $(git describe --tags 2>/dev/null || echo "unknown")
Git Commit: $(git rev-parse HEAD 2>/dev/null || echo "unknown")

Contents:
- workflows/: n8n workflows and configurations
- redis_dump.rdb: Redis cache data
- uploads/: User uploaded files
- config/: Platform configuration files
- env_backup: Environment variables (sensitive)
- docker-compose.yml: Service definitions

Restore Instructions:
1. Stop platform: docker-compose down
2. Copy workflows to ./workflows/
3. Restore uploaded files to backend/uploads/
4. Restore configuration files
5. Start platform: ./deploy.sh
EOF

# Compress backup
log "🗜️  Compressing backup..."
cd backups
tar -czf "$(basename $BACKUP_DIR).tar.gz" "$(basename $BACKUP_DIR)"
rm -rf "$(basename $BACKUP_DIR)"
cd ..

# Cleanup old backups (keep last 7 days)
log "🧹 Cleaning up old backups..."
find ./backups -name "backup-*.tar.gz" -mtime +7 -delete 2>/dev/null || true

FINAL_BACKUP="./backups/$(basename $BACKUP_DIR).tar.gz"
BACKUP_SIZE=$(du -h "$FINAL_BACKUP" | cut -f1)

log "✅ Backup completed successfully!"
log "📦 Backup file: $FINAL_BACKUP"
log "📊 Backup size: $BACKUP_SIZE"

echo -e "${BLUE}💾 Backup ready for secure storage!${NC}"
