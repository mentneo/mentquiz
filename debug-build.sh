#!/bin/bash

echo "=== DEBUGGING BUILD PROCESS ==="
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory content:"
ls -la

echo "=== CHECKING PACKAGE.JSON ==="
if [ -f "package.json" ]; then
  echo "package.json exists"
  cat package.json
else
  echo "package.json is missing!"
  exit 1
fi

echo "=== CHECKING NODE_MODULES ==="
if [ -d "node_modules" ]; then
  echo "node_modules exists"
else
  echo "Installing dependencies..."
  npm install
fi

echo "=== TRYING BUILD WITH VERBOSE LOGGING ==="
npm run build --verbose

echo "=== BUILD PROCESS COMPLETE ==="
