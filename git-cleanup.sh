#!/bin/bash
# Remove node_modules from Git tracking while keeping the files locally

# Remove the directory from Git's index
git rm -r --cached node_modules

# Commit the change
git commit -m "Remove node_modules from git tracking"

# Additional step to clean up history (optional but recommended)
echo "Next steps:"
echo "1. Push your changes: git push origin main"
echo "2. If that doesn't work, you may need a more aggressive approach."
echo "   Consider cloning a fresh repo and copying your code over,"
echo "   or using git filter-branch to completely remove node_modules from history."
