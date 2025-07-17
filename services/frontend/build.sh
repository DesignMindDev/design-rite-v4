#!/bin/bash
echo "Installing dependencies..."
npm ci --production=false
echo "Building application..."
npm run build
echo "Build complete!"
