#!/bin/bash

# Setup script for Supabase integration

echo "Setting up Supabase integration for API Keys Management..."

# Install dependencies
echo "Installing required dependencies..."
npm install @supabase/supabase-js uuid
npm install --save-dev @types/uuid

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local file..."
  cp .env.local.example .env.local
  echo "Please edit .env.local and add your Supabase credentials"
else
  echo ".env.local already exists"
  echo "Please ensure it contains your Supabase credentials:"
  echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url"
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
fi

echo ""
echo "Setup complete!"
echo "Next steps:"
echo "1. Configure your Supabase database following the instructions in SUPABASE_SETUP.md"
echo "2. Make sure your .env.local contains the correct Supabase credentials"
echo "3. Start your application with 'npm run dev'"
echo "" 