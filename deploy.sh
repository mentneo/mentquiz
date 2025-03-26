#!/bin/bash

echo "=== DEPLOYING TO VERCEL ==="

# Ensure we're using the right Node version
echo "Node version: $(node -v)"

# Clean installation
echo "Installing dependencies..."
npm ci || npm install

# Deploy to Vercel
echo "Deploying to Vercel..."
npx vercel --prod

echo "=== DEPLOYMENT ATTEMPT COMPLETED ==="
echo "Check the logs above for the deployment URL or any errors"
