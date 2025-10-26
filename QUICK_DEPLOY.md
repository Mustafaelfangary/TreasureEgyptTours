# Quick Deploy Reference

## On Your Ubuntu VPS

### One-Command Deployment
```bash
cd /var/Dahabiyat-Nile-Cruise && ./deploy-ubuntu.sh
```

### First Time Setup
```bash
cd /var/Dahabiyat-Nile-Cruise
git config pull.rebase false
git pull origin main
chmod +x deploy-ubuntu.sh
./deploy-ubuntu.sh
```

### Manual Steps (if script fails)
```bash
cd /var/Dahabiyat-Nile-Cruise
git pull origin main
rm -rf node_modules package-lock.json
npm install
npx prisma generate
npm run import-images
npm run build
pm2 restart all
```

## What Gets Deployed

✅ Latest code from GitHub
✅ All dependencies installed
✅ Database migrations applied
✅ 500+ images imported to database
✅ Application built and restarted

## Check Status

```bash
pm2 status              # If using PM2
pm2 logs                # View logs
sudo systemctl status dahabiyat  # If using systemd
```

## Troubleshooting

**If deployment fails:**
1. Check logs: `pm2 logs` or `sudo journalctl -u dahabiyat -f`
2. Check Node version: `node -v` (should be v18+)
3. Check database: `npx prisma studio`
4. Re-run: `./deploy-ubuntu.sh`

**If images don't show:**
```bash
npm run import-images
```

**If dependencies fail:**
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Quick Commands

| Task | Command |
|------|---------|
| Deploy | `./deploy-ubuntu.sh` |
| Import Images | `npm run import-images` |
| View Logs | `pm2 logs` |
| Restart | `pm2 restart all` |
| Status | `pm2 status` |
| Build | `npm run build` |
| Database Studio | `npx prisma studio` |

## Files Pushed to GitHub

1. ✅ `deploy-ubuntu.sh` - Automated deployment script
2. ✅ `DEPLOYMENT_GUIDE.md` - Complete documentation
3. ✅ `scripts/import-existing-images.js` - Image import script
4. ✅ `package.json` - Fixed nodemailer dependency
5. ✅ All fixes for navbar, badges, and media

## Next Steps

1. SSH into your VPS
2. Run: `cd /var/Dahabiyat-Nile-Cruise`
3. Run: `git pull origin main`
4. Run: `chmod +x deploy-ubuntu.sh`
5. Run: `./deploy-ubuntu.sh`
6. Done! 🎉
