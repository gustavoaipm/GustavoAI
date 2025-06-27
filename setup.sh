#!/bin/bash

echo "🚀 Setting up GustavoAI Property Manager with Supabase..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: AI and integrations
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
EOF
    echo "⚠️  Please edit .env.local with your Supabase configuration"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Copy your project URL and anon key"
echo "3. Update .env.local with your Supabase credentials"
echo "4. Run the SQL schema in your Supabase SQL Editor:"
echo "   - Copy the contents of supabase/schema.sql"
echo "   - Paste and run in Supabase SQL Editor"
echo "5. Start the development server: npm run dev"
echo ""
echo "Frontend will be available at: http://localhost:3000"
echo ""
echo "Happy coding! 🚀" 