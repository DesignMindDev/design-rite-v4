#!/bin/bash
# Design-Rite Platform - Production Deployment Script
# One-click deployment for complete AI security assessment platform

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Banner
echo -e "${BLUE}"
cat << "EOF"
╔══════════════════════════════════════════════════════════════════╗
║                        DESIGN-RITE™                             ║
║                   AI Security Platform                          ║
║                  Production Deployment                          ║
║                                                                  ║
║              "Bulletproof and Easy to Deploy"                   ║
╚══════════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Pre-deployment checks
log "🔍 Running pre-deployment checks..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    error "Docker is not running. Please start Docker Desktop first."
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    if ! docker compose version &> /dev/null; then
        error "Docker Compose is not available. Please install Docker Compose."
    else
        DOCKER_COMPOSE="docker compose"
    fi
else
    DOCKER_COMPOSE="docker-compose"
fi

log "✅ Docker is running and Compose is available"

# Check for .env file
if [ ! -f .env ]; then
    warn ".env file not found. Creating from template..."
    
    if [ ! -f .env.template ]; then
        error ".env.template not found. Please ensure all files are present."
    fi
    
    cp .env.template .env
    warn "📝 Please edit .env file with your API keys before continuing."
    warn "   Required: CLAUDE_API_KEY, OPENAI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY"
    
    read -p "Press Enter after you've configured .env, or Ctrl+C to exit..."
fi

# Validate critical environment variables
log "🔐 Validating environment configuration..."

source .env

if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your_very_long_random_jwt_secret_here" ]; then
    error "Please set a secure JWT_SECRET in .env file"
fi

if [ -z "$CLAUDE_API_KEY" ] || [ "$CLAUDE_API_KEY" = "your_claude_api_key_here" ]; then
    warn "CLAUDE_API_KEY not set - AI features will not work"
fi

if [ -z "$SUPABASE_URL" ] || [ "$SUPABASE_URL" = "your_supabase_url_here" ]; then
    warn "SUPABASE_URL not set - database features will not work"
fi

log "✅ Environment validation complete"

# Create necessary directories
log "📁 Creating required directories..."
mkdir -p backend/uploads
mkdir -p config/ssl
mkdir -p logs
mkdir -p backups
chmod 755 backend/uploads logs backups

# Pull latest images
log "📦 Pulling latest Docker images..."
$DOCKER_COMPOSE pull

# Build custom images
log "🔨 Building application images..."
$DOCKER_COMPOSE build --no-cache

# Start core services first
log "🚀 Starting core services..."
$DOCKER_COMPOSE up -d redis

# Start main application services
log "🚀 Starting application services..."
$DOCKER_COMPOSE up -d frontend backend

# Start automation services
log "🚀 Starting automation services..."
$DOCKER_COMPOSE up -d n8n

# Wait for services to be ready
log "⏳ Waiting for all services to be healthy..."
sleep 30

# Health checks
log "🔍 Running health checks..."

services=("frontend:3000" "backend:8000" "n8n:5678")
all_healthy=true

for service in "${services[@]}"; do
    name=${service%:*}
    port=${service#*:}
    
    if curl -f -s "http://localhost:$port/health" > /dev/null 2>&1 || 
       curl -f -s "http://localhost:$port/healthz" > /dev/null 2>&1 || 
       curl -f -s "http://localhost:$port" > /dev/null 2>&1; then
        log "✅ $name is healthy"
    else
        warn "❌ $name health check failed"
        all_healthy=false
    fi
done

# Show service status
log "📊 Service Status:"
$DOCKER_COMPOSE ps

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Check if environment variables are set
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Copy from .env.local.example"
    echo "📝 Creating .env.local from example..."
    cp .env.local.example .env.local
    echo "✅ Please edit .env.local with your actual values before deploying"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run type checking
echo "🔍 Running type checks..."
npm run type-check

# Run linting
echo "🧹 Running linter..."
npm run lint

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod
else
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    vercel --prod
fi

echo "✅ Design-Rite V3 deployed successfully!"
echo "🌐 Your platform is now live!"

# Final deployment summary
echo -e "\n${GREEN}╔══════════════════════════════════════════════════════════════════╗"
echo -e "║                    DEPLOYMENT COMPLETE!                         ║"
echo -e "╚══════════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${BLUE}🌐 Platform Access URLs:${NC}"
echo -e "   • Frontend:      http://localhost:3000"
echo -e "   • API Backend:   http://localhost:8000"
echo -e "   • n8n Admin:     http://localhost:5678"
echo -e "   • Admin Panel:   http://localhost:3000/admin"

echo -e "\n${BLUE}🔐 Default Credentials:${NC}"
echo -e "   • n8n Admin:     ${N8N_BASIC_AUTH_USER:-admin} / [check .env for password]"

echo -e "\n${BLUE}📋 Next Steps:${NC}"
echo -e "   1. Visit http://localhost:3000 to access the platform"
echo -e "   2. Configure n8n workflows at http://localhost:5678"
echo -e "   3. Test with sample security assessment"
echo -e "   4. Review logs: ${DOCKER_COMPOSE} logs -f"

echo -e "\n${BLUE}🛠️  Management Commands:${NC}"
echo -e "   • View logs:     ${DOCKER_COMPOSE} logs -f"
echo -e "   • Stop platform: ${DOCKER_COMPOSE} down"
echo -e "   • Update:        ./update.sh"
echo -e "   • Backup:        ./backup.sh"

if [ "$all_healthy" = true ]; then
    echo -e "\n${GREEN}🎉 All services are healthy and ready to use!${NC}"
else
    echo -e "\n${YELLOW}⚠️  Some services may need attention. Check logs for details.${NC}"
    echo -e "   Run: ${DOCKER_COMPOSE} logs [service-name]"
fi

echo -e "\n${BLUE}Design-Rite™ Platform - Ready for Business! 🚀${NC}"
