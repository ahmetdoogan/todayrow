#!/bin/bash

# TypeCheck
echo "Running TypeCheck..."
npm run typecheck

# Git operations
git add .
git commit -m "Fix: Update captchaToken type to match Supabase API requirements"
git push origin main

# Deploy function
echo "Deploying to Supabase Functions..."
cd supabase
supabase functions deploy check-plans

echo "Deployment completed successfully!"
