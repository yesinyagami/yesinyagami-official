#!/bin/bash

# Night God Tarot Production Deployment Script

set -e

echo "🌙 Starting Night God Tarot deployment..."

# Check if required environment variables are set
if [ -z "$MONICA_API_KEY" ]; then
    echo "❌ Error: MONICA_API_KEY is not set"
    exit 1
fi

# Build the application
echo "📦 Building application..."
npm ci --only=production
npm run build

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t night-god-tarot:latest .

# Tag image for registry
if [ ! -z "$DOCKER_REGISTRY" ]; then
    echo "🏷️  Tagging image for registry..."
    docker tag night-god-tarot:latest $DOCKER_REGISTRY/night-god-tarot:latest
    docker tag night-god-tarot:latest $DOCKER_REGISTRY/night-god-tarot:$(date +%Y%m%d-%H%M%S)
fi

# Deploy with Docker Compose
echo "🚀 Deploying with Docker Compose..."
docker-compose down || true
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check health endpoints
echo "🏥 Checking service health..."
curl -f http://localhost:3000/health || {
    echo "❌ Health check failed"
    docker-compose logs
    exit 1
}

echo "✅ Deployment completed successfully!"
echo "🌟 Night God Tarot is now running at http://localhost:3000"

# Optional: Run smoke tests
if [ "$RUN_SMOKE_TESTS" = "true" ]; then
    echo "🧪 Running smoke tests..."
    npm run test:e2e
fi

echo "🎉 Deployment complete! Divine wisdom is now flowing through AI-powered tarot readings."