# Logo System - Complete Guide

## Overview

The website now has a **fully dynamic logo system** that ensures logos uploaded in the admin panel are reflected **everywhere** on the website instantly.

## Features

✅ **Dynamic Logo Loading** - All logos load from database
✅ **Instant Updates** - Changes reflect immediately after upload
✅ **Auto-Refresh** - Checks for logo updates every 30 seconds
✅ **Cache Busting** - Prevents browser caching issues
✅ **Fallback System** - Uses default logo if database fails
✅ **Multi-Location Support** - Works across all pages and components

## Where Logos Appear

### 1. Main Navbar
- **Location**: Top of every page
- **Component**: `src/components/Navbar.tsx`
- **Updates**: Automatically on upload

### 2. Footer
- **Location**: Bottom of every page
- **Component**: `src/components/Footer.tsx`
- **Updates**: Automatically on upload

### 3. Mobile Navigation
- **Location**: Mobile menu
- **Component**: `src/components/mobile/MobileNavigation.tsx`
- **Updates**: Automatically on upload

### 4. Admin Header
- **Location**: Admin panel header
- **Component**: `src/components/admin/AdminHeader.tsx`
- **Updates**: Automatically on upload

### 5. Mobile Admin Layout
- **Location**: Mobile admin interface
- **Component**: `src/components/mobile/MobileAdminLayout.tsx`
- **Updates**: Automatically on upload

## How It Works

### 1. Logo Upload Flow

```
Admin uploads logo in Logo Manager
    ↓
Logo saved to database (WebsiteContent table)
    ↓
notifyLogoUpdate() called
    ↓
All components receive 'logo-updated' event
    ↓
Components fetch new logo with cache-busting timestamp
    ↓
Logo updates everywhere instantly
```

### 2. Auto-Refresh System

```
LogoAutoRefresh component runs every 30 seconds
    ↓
Checks /api/logo for timestamp
    ↓
Compares with last known timestamp
    ↓
If changed, triggers refreshAllLogos()
    ↓
All logo images update automatically
```

### 3. Cache Busting

Every logo URL includes a timestamp parameter:
```
/uploads/logo.png?t=1729012345678
```

This ensures browsers always fetch the latest version.

## Technical Implementation

### API Endpoint

**GET /api/logo**

Returns:
```json
{
  "logoUrl": "/uploads/logo.png",
  "key": "navbar_logo",
  "timestamp": 1729012345678
}
```

### Database Schema

Logos are stored in `WebsiteContent` table:
- **key**: `navbar_logo`, `footer_logo`, `site_logo`
- **content**: URL to logo image
- **contentType**: `IMAGE`
- **isActive**: `true`

### Components Using Dynamic Logo

1. **Navbar.tsx**
   - Fetches from `/api/logo`
   - Listens for `logo-updated` event
   - Cache-busting with timestamp

2. **Footer.tsx**
   - Uses `useContent` hook
   - Listens for `logo-updated` event
   - Fallback to default logo

3. **MobileNavigation.tsx**
   - Uses `useContent` hook
   - Auto-updates on change
   - Mobile-optimized sizing

4. **AdminHeader.tsx**
   - Uses `useContent` hook
   - Shows in admin panel
   - Compact display

5. **MobileAdminLayout.tsx**
   - Mobile admin interface
   - Dynamic logo loading
   - Touch-optimized

### Utility Functions

**src/lib/logo-refresh.ts**

```typescript
// Refresh all logos immediately
refreshAllLogos()

// Start auto-refresh (every 30 seconds)
startLogoAutoRefresh(30000)

// Notify after upload
notifyLogoUpdate()
```

## Usage

### For Admins

1. **Upload Logo**:
   - Go to Admin Panel → Logo Manager
   - Click "Upload" on any logo type
   - Select image file
   - Logo updates everywhere instantly

2. **Verify Update**:
   - Check main navbar
   - Check footer
   - Check mobile menu
   - Check admin header
   - All should show new logo

### For Developers

**Using Dynamic Logo in Components**:

```tsx
import { useContent } from '@/hooks/useContent';
import { useState, useEffect } from 'react';

function MyComponent() {
  const { getContent } = useContent({ page: 'global_media' });
  const [logoTimestamp, setLogoTimestamp] = useState(Date.now());

  useEffect(() => {
    const handleLogoUpdate = () => {
      setLogoTimestamp(Date.now());
    };
    
    window.addEventListener('logo-updated', handleLogoUpdate);
    return () => window.removeEventListener('logo-updated', handleLogoUpdate);
  }, []);

  const logoUrl = getContent('navbar_logo', '/images/logo.png');
  const cacheBustedUrl = `${logoUrl}?t=${logoTimestamp}`;

  return <img src={cacheBustedUrl} alt="Logo" />;
}
```

## Troubleshooting

### Logo Not Updating

1. **Clear Browser Cache**
   - Press Ctrl+Shift+R (hard refresh)
   - Or clear browser cache manually

2. **Check Database**
   ```sql
   SELECT * FROM WebsiteContent WHERE key LIKE '%logo%';
   ```

3. **Check API**
   - Visit: `https://yourdomain.com/api/logo`
   - Should return latest logo URL

4. **Check Console**
   - Open browser DevTools
   - Look for "Logo updated" messages
   - Check for errors

### Logo Shows Old Version

1. **Wait 30 seconds** - Auto-refresh will update it
2. **Refresh page** - Force immediate update
3. **Check timestamp** - Verify URL has `?t=` parameter

### Logo Not Showing at All

1. **Check file exists** - Verify upload succeeded
2. **Check permissions** - Ensure file is accessible
3. **Check fallback** - Should show `/images/logo.png`
4. **Check database** - Verify content is saved

## Best Practices

### Logo Upload

1. **File Format**: PNG or SVG recommended
2. **Size**: 200x200px minimum
3. **Transparent Background**: For best results
4. **File Size**: Under 500KB for fast loading

### Logo Types

- **navbar_logo**: Main navigation logo (horizontal)
- **footer_logo**: Footer logo (can be different)
- **site_logo**: General site logo (square)

### Performance

- Logos are cached with timestamps
- Auto-refresh runs every 30 seconds (configurable)
- Minimal API calls
- Efficient event system

## Deployment

After deploying logo system updates:

```bash
cd /var/Dahabiyat-Nile-Cruise
git pull origin main
npm run build
pm2 restart all
```

## Files Modified/Created

### New Files
- `src/lib/logo-refresh.ts` - Logo refresh utilities
- `src/components/LogoAutoRefresh.tsx` - Auto-refresh component
- `LOGO_SYSTEM_GUIDE.md` - This guide

### Modified Files
- `src/components/admin/LogoManager.tsx` - Added notifyLogoUpdate()
- `src/app/layout.tsx` - Added LogoAutoRefresh component

### Existing Files (Already Dynamic)
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/mobile/MobileNavigation.tsx`
- `src/components/admin/AdminHeader.tsx`
- `src/components/mobile/MobileAdminLayout.tsx`

## Testing

### Test Logo Update

1. Upload new logo in admin panel
2. Check these locations within 5 seconds:
   - Main navbar (top)
   - Footer (bottom)
   - Mobile menu (hamburger icon)
   - Admin header
3. All should show new logo

### Test Auto-Refresh

1. Upload logo in admin panel
2. Open website in another tab (don't refresh)
3. Wait 30 seconds
4. Logo should update automatically

### Test Cache Busting

1. Upload logo
2. Check image URL in DevTools
3. Should have `?t=1234567890` parameter
4. Parameter should change on each upload

## Support

If logos aren't updating:

1. Check browser console for errors
2. Verify `/api/logo` returns correct URL
3. Check database for logo entries
4. Ensure LogoAutoRefresh is running
5. Try hard refresh (Ctrl+Shift+R)

The system is designed to work automatically with no manual intervention needed!
