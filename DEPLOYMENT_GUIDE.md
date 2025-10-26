# Deployment Guide for Ubuntu 22.04 LTS VPS

## Quick Deployment

### One-Command Deployment

On your Ubuntu VPS, run:

```bash
cd /var/Dahabiyat-Nile-Cruise
chmod +x deploy-ubuntu.sh
./deploy-ubuntu.sh
```

This will automatically:
1. ✅ Pull latest changes from GitHub
2. ✅ Install dependencies
3. ✅ Run database migrations
4. ✅ Import all images from public folder to database
5. ✅ Build the application
6. ✅ Restart the application

## First Time Setup

If this is your first deployment, you need to:

### 1. Clone the Repository

```bash
cd /var
git clone https://github.com/Mustafaelfangary/Dahabiyat-Nile-Cruise.git
cd Dahabiyat-Nile-Cruise
```

### 2. Create Environment File

```bash
cp .env.example .env
nano .env
```

Add your environment variables:
```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Database

```bash
npx prisma generate
npx prisma migrate deploy
```

### 5. Make Deployment Script Executable

```bash
chmod +x deploy-ubuntu.sh
```

### 6. Run First Deployment

```bash
./deploy-ubuntu.sh
```

## Subsequent Deployments

For all future deployments, just run:

```bash
cd /var/Dahabiyat-Nile-Cruise
./deploy-ubuntu.sh
```

## Manual Deployment Steps

If you prefer to run steps manually:

```bash
# 1. Navigate to project
cd /var/Dahabiyat-Nile-Cruise

# 2. Pull latest changes
git config pull.rebase false
git pull origin main

# 3. Clean install
rm -rf node_modules package-lock.json
npm install

# 4. Generate Prisma Client
npx prisma generate

# 5. Run migrations
npx prisma migrate deploy

# 6. Import images
npm run import-images

# 7. Build
npm run build

# 8. Restart (choose one)
pm2 restart all                    # If using PM2
sudo systemctl restart dahabiyat   # If using systemd
npm start                          # If running directly
```

## Process Managers

### Using PM2 (Recommended)

**Install PM2:**
```bash
sudo npm install -g pm2
```

**Start application:**
```bash
pm2 start npm --name "dahabiyat" -- start
pm2 save
pm2 startup
```

**Manage application:**
```bash
pm2 list           # List all processes
pm2 logs           # View logs
pm2 restart all    # Restart
pm2 stop all       # Stop
pm2 delete all     # Delete
```

### Using Systemd

**Create service file:**
```bash
sudo nano /etc/systemd/system/dahabiyat.service
```

**Add content:**
```ini
[Unit]
Description=Dahabiyat Nile Cruise
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/Dahabiyat-Nile-Cruise
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

**Enable and start:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable dahabiyat
sudo systemctl start dahabiyat
sudo systemctl status dahabiyat
```

## Nginx Configuration

If using Nginx as reverse proxy:

```bash
sudo nano /etc/nginx/sites-available/dahabiyat
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/dahabiyat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Troubleshooting

### Deployment Script Fails

**Check logs:**
```bash
cat /var/Dahabiyat-Nile-Cruise/npm-debug.log
```

**Check permissions:**
```bash
ls -la /var/Dahabiyat-Nile-Cruise
```

### Application Won't Start

**Check Node.js version:**
```bash
node -v  # Should be v18 or higher
```

**Check port availability:**
```bash
sudo lsof -i :3000
```

**Check environment variables:**
```bash
cat .env
```

### Database Connection Issues

**Test database connection:**
```bash
npx prisma db pull
```

**Check database URL:**
```bash
grep DATABASE_URL .env
```

### Images Not Showing

**Check public folder:**
```bash
ls -la public/images
find public/images -type f | wc -l
```

**Re-run import:**
```bash
npm run import-images
```

**Check database:**
```bash
npx prisma studio
```

## Monitoring

### View Application Logs

**PM2:**
```bash
pm2 logs
pm2 logs --lines 100
```

**Systemd:**
```bash
sudo journalctl -u dahabiyat -f
sudo journalctl -u dahabiyat --since "1 hour ago"
```

### Check Application Status

**PM2:**
```bash
pm2 status
pm2 monit
```

**Systemd:**
```bash
sudo systemctl status dahabiyat
```

### Check Resource Usage

```bash
htop
df -h
free -h
```

## Backup

### Database Backup

```bash
# Create backup directory
mkdir -p /var/backups/dahabiyat

# Backup database
npx prisma db pull > /var/backups/dahabiyat/schema-$(date +%Y%m%d).prisma

# Or use pg_dump for PostgreSQL
pg_dump -U username database_name > /var/backups/dahabiyat/db-$(date +%Y%m%d).sql
```

### Files Backup

```bash
# Backup uploads and images
tar -czf /var/backups/dahabiyat/files-$(date +%Y%m%d).tar.gz public/images
```

## Automated Deployments

### Setup Webhook (Optional)

You can set up GitHub webhooks to automatically deploy when you push to main:

1. Install webhook listener
2. Configure GitHub webhook
3. Create deployment script that runs on webhook trigger

## Security Checklist

- [ ] Environment variables are set correctly
- [ ] Database credentials are secure
- [ ] SSL certificate is installed
- [ ] Firewall is configured (UFW)
- [ ] SSH key authentication is enabled
- [ ] Root login is disabled
- [ ] Regular backups are scheduled
- [ ] Application is running as non-root user (recommended)

## Performance Optimization

### Enable Caching

```bash
# Install Redis for caching
sudo apt install redis-server
sudo systemctl enable redis-server
```

### Optimize Images

```bash
# Install image optimization tools
sudo apt install imagemagick webp
```

### Enable Compression

Already configured in Next.js, but ensure Nginx compression is enabled.

## Support

For issues or questions:
- Check logs first
- Review this guide
- Check GitHub issues
- Contact development team

## Changelog

Keep track of deployments:
```bash
echo "$(date): Deployed version X.X.X" >> /var/Dahabiyat-Nile-Cruise/deployment.log
```
