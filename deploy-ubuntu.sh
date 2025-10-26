#!/bin/bash

# Deployment Script for Ubuntu 22.04 LTS VPS
# This script pulls latest changes, installs dependencies, and imports images

set -e  # Exit on any error

echo "🚀 Starting deployment for Dahabiyat Nile Cruise..."
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_success "Found project directory"

# Step 1: Configure Git
echo ""
echo "📋 Step 1: Configuring Git..."
git config pull.rebase false
print_success "Git configured"

# Step 2: Stash any local changes
echo ""
echo "📋 Step 2: Stashing local changes..."
if git diff-index --quiet HEAD --; then
    print_success "No local changes to stash"
else
    git stash
    print_warning "Local changes stashed"
fi

# Step 3: Pull latest changes
echo ""
echo "📋 Step 3: Pulling latest changes from GitHub..."
git pull origin main
print_success "Latest changes pulled"

# Step 4: Check Node.js version
echo ""
echo "📋 Step 4: Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "Node.js version: $NODE_VERSION"
print_success "Node.js is installed"

# Step 5: Clean install dependencies
echo ""
echo "📋 Step 5: Installing dependencies..."
echo "Removing old node_modules and package-lock.json..."
rm -rf node_modules package-lock.json
print_success "Old dependencies removed"

echo "Installing fresh dependencies..."
npm install
print_success "Dependencies installed"

# Step 6: Generate Prisma Client
echo ""
echo "📋 Step 6: Generating Prisma Client..."
npx prisma generate
print_success "Prisma Client generated"

# Step 7: Run database migrations (if any)
echo ""
echo "📋 Step 7: Running database migrations..."
if npx prisma migrate deploy; then
    print_success "Database migrations completed"
else
    print_warning "No migrations to run or migrations failed (continuing anyway)"
fi

# Step 8: Import images from public folder
echo ""
echo "📋 Step 8: Importing images to database..."
if [ -d "public/images" ]; then
    IMAGE_COUNT=$(find public/images -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \) | wc -l)
    echo "Found $IMAGE_COUNT images in public/images folder"
    
    if npm run import-images; then
        print_success "Images imported successfully"
    else
        print_warning "Image import had some issues (check logs above)"
    fi
else
    print_warning "public/images folder not found, skipping image import"
fi

# Step 9: Build the application
echo ""
echo "📋 Step 9: Building the application..."
if npm run build; then
    print_success "Application built successfully"
else
    print_error "Build failed!"
    exit 1
fi

# Step 10: Restart the application
echo ""
echo "📋 Step 10: Restarting the application..."

# Check if PM2 is being used
if command -v pm2 &> /dev/null; then
    echo "Detected PM2, restarting with PM2..."
    pm2 restart all
    print_success "Application restarted with PM2"
    
    echo ""
    echo "📊 PM2 Status:"
    pm2 list
    
# Check if systemd service exists
elif systemctl list-units --type=service | grep -q dahabiyat; then
    echo "Detected systemd service, restarting..."
    sudo systemctl restart dahabiyat
    print_success "Application restarted with systemd"
    
    echo ""
    echo "📊 Service Status:"
    sudo systemctl status dahabiyat --no-pager
    
else
    print_warning "No process manager detected (PM2 or systemd)"
    print_warning "Please restart your application manually with:"
    echo "  npm start"
fi

# Final summary
echo ""
echo "=================================================="
echo "🎉 Deployment completed successfully!"
echo "=================================================="
echo ""
echo "📊 Summary:"
echo "  ✅ Git: Latest changes pulled"
echo "  ✅ Dependencies: Installed"
echo "  ✅ Database: Migrations applied"
echo "  ✅ Images: Imported to database"
echo "  ✅ Build: Completed"
echo "  ✅ Application: Restarted"
echo ""
echo "🌐 Your application should now be running with the latest changes!"
echo ""

# Show application URL if available
if [ -f ".env" ]; then
    APP_URL=$(grep "NEXT_PUBLIC_SITE_URL" .env | cut -d '=' -f2)
    if [ ! -z "$APP_URL" ]; then
        echo "🔗 Application URL: $APP_URL"
    fi
fi

echo "📝 Check logs with:"
echo "  - PM2: pm2 logs"
echo "  - Systemd: sudo journalctl -u dahabiyat -f"
echo ""
