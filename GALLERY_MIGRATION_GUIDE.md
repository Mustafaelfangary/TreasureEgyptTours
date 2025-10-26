# Gallery Enhancement Migration Guide

## Quick Start Guide

### Step 1: Run Database Migration

```bash
# Navigate to project directory
cd c:\Users\X\Documents\GitHub\Dahabiyat-Nile-Cruise

# Generate and run migration
npx prisma migrate dev --name add_gallery_photographer_location

# Generate Prisma Client
npx prisma generate
```

### Step 2: Verify Migration

Check that the migration was successful:

```bash
# Open Prisma Studio to verify
npx prisma studio
```

Navigate to `GalleryImage` table and verify these new columns exist:
- `photographer` (String, nullable)
- `location` (String, nullable)
- `views` (Int, default: 0)
- `likes` (Int, default: 0)

### Step 3: Test Admin Gallery

1. Start development server:
```bash
npm run dev
```

2. Navigate to: `http://localhost:3000/admin/gallery`

3. Click "Add Image" button

4. Verify new fields appear:
   - Photographer (text input)
   - Location (text input)

5. Upload a test image with photographer and location

6. Verify the image card shows:
   - 📷 Photographer name (blue text)
   - 📍 Location (gray text)

### Step 4: Test Public Gallery

1. Navigate to: `http://localhost:3000/gallery`

2. Verify image captions have:
   - Dark background (black/gray gradient)
   - White text
   - Photographer credit at bottom
   - Location at bottom

3. Click an image to open modal

4. Verify modal shows:
   - Photographer: "📷 Photo by [name]"
   - Location: "📍 [location]"

### Step 5: Test Package Page

1. Navigate to: `http://localhost:3000/packages`

2. Verify page loads without errors

3. Check that packages display correctly

4. Verify minimum height maintained during loading

---

## Troubleshooting

### Migration Fails

**Error: "Column already exists"**
```bash
# Reset database (DEVELOPMENT ONLY!)
npx prisma migrate reset

# Then run migration again
npx prisma migrate dev --name add_gallery_photographer_location
```

**Error: "Cannot connect to database"**
- Check `.env` file has correct `DATABASE_URL`
- Verify database server is running
- Test connection: `npx prisma db pull`

### Admin Gallery Issues

**Photographer field not showing**
- Clear browser cache (Ctrl+Shift+R)
- Verify file saved: `src/app/admin/gallery/page.tsx`
- Check console for errors (F12)

**Upload fails**
- Check API route updated: `src/app/api/admin/gallery/images/route.ts`
- Verify Prisma Client regenerated: `npx prisma generate`
- Check server logs for errors

### Caption Contrast Issues

**Captions still light colored**
- Clear browser cache
- Verify `src/app/globals.css` saved
- Hard refresh: Ctrl+Shift+R
- Check CSS loaded in DevTools

**Photographer not showing**
- Verify image has photographer data in database
- Check API returns photographer field
- Inspect element to see if data present

---

## Production Deployment

### Before Deploying

1. **Backup Database**
```bash
# Export current data
npx prisma db pull
```

2. **Test Migration Locally**
```bash
# Run all tests
npm run test

# Build production
npm run build

# Test production build
npm run start
```

3. **Review Changes**
- Check all modified files
- Verify no console errors
- Test all gallery functions

### Deploy to Production

**Option 1: Vercel/Netlify (Recommended)**
```bash
# Commit changes
git add .
git commit -m "feat: Add photographer and location to gallery with enhanced captions"
git push origin main

# Deployment triggers automatically
# Monitor deployment logs
```

**Option 2: Manual Server**
```bash
# SSH into server
ssh user@your-server.com

# Pull latest code
cd /var/www/your-project
git pull origin main

# Install dependencies
npm install

# Run migration
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Build application
npm run build

# Restart application
pm2 restart your-app
```

### Post-Deployment Verification

1. **Check Database**
   - Verify migration applied
   - Check new columns exist
   - Test data integrity

2. **Test Admin Gallery**
   - Upload new image
   - Add photographer
   - Add location
   - Verify display

3. **Test Public Gallery**
   - View gallery page
   - Check caption contrast
   - Verify photographer shows
   - Verify location shows

4. **Monitor Errors**
   - Check server logs
   - Monitor error tracking (Sentry, etc.)
   - Watch for API errors

---

## Rollback Plan

If issues arise, rollback using:

```bash
# Revert code changes
git revert HEAD

# Rollback database migration
npx prisma migrate resolve --rolled-back [migration-name]

# Regenerate Prisma Client
npx prisma generate

# Rebuild and restart
npm run build
pm2 restart your-app
```

---

## Quick Reference

### New Database Fields
- `photographer`: String (optional)
- `location`: String (optional)
- `views`: Int (default: 0)
- `likes`: Int (default: 0)

### New CSS Classes
- `.image-caption` - Dark caption
- `.caption-light` - Light caption
- `.image-overlay-caption` - Overlay caption
- `.photographer-credit` - Photographer styling
- `.location-badge` - Location badge

### Modified Files
1. `prisma/schema.prisma`
2. `src/app/admin/gallery/page.tsx`
3. `src/app/gallery/page.tsx`
4. `src/app/globals.css`
5. `src/app/packages/page.tsx`

---

## Support

For issues or questions:
1. Check `GALLERY_AND_PACKAGES_FIXES_SUMMARY.md`
2. Review error logs
3. Test in development first
4. Contact development team

---

**Migration Checklist:**
- [ ] Database migration run
- [ ] Prisma Client generated
- [ ] Admin gallery tested
- [ ] Public gallery tested
- [ ] Package page tested
- [ ] Caption contrast verified
- [ ] Production deployed
- [ ] Post-deployment verified

**Status**: Ready for Migration ✅
