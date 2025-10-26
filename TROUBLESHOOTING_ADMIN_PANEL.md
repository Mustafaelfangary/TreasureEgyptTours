# Troubleshooting Admin Panel Changes

## Issue: Changes show for a moment then revert

This is typically caused by browser caching or Next.js build cache. Follow these steps:

## Solution 1: Clear Browser Cache (Quickest)

### Chrome/Edge
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. **OR** Hard refresh: `Ctrl + Shift + R` or `Ctrl + F5`

### Firefox
1. Press `Ctrl + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"
4. **OR** Hard refresh: `Ctrl + Shift + R`

## Solution 2: Clear Next.js Cache

### Option A: Use the PowerShell Script
```powershell
# Run this in PowerShell from project root
.\clear-cache.ps1
```

### Option B: Manual Steps
```powershell
# 1. Stop the dev server (Ctrl+C)

# 2. Delete .next folder
Remove-Item -Recurse -Force .next

# 3. Delete node_modules cache
Remove-Item -Recurse -Force node_modules\.cache

# 4. Start dev server
npm run dev
```

## Solution 3: Force Rebuild

```bash
# Stop dev server
# Then run:
npm run build
npm run dev
```

## Solution 4: Check for Running Processes

Sometimes old Node processes keep running:

```powershell
# Kill all node processes
Get-Process -Name node | Stop-Process -Force

# Then restart
npm run dev
```

## Solution 5: Verify Changes Were Applied

Check these files to confirm changes are saved:

### 1. Admin Page Layout
**File**: `src/app/admin/page.tsx`

Look for line 130:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
```

Should be `md:grid-cols-3` (not `lg:grid-cols-4`)

### 2. All Grid Sections
Search for all grids in the file:
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
```

All should be `md:grid-cols-3`

### 3. AdminDataOverview Component
**File**: `src/components/admin/AdminDataOverview.tsx`

Should exist and be imported in admin page:
```tsx
import AdminDataOverview from '@/components/admin/AdminDataOverview';
```

## Solution 6: Check Console for Errors

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any red errors
4. Common issues:
   - API endpoint errors
   - Component import errors
   - TypeScript errors

## Solution 7: Verify API Endpoint

Test the overview API directly:

1. Open: `http://localhost:3000/api/admin/overview`
2. Should return JSON data
3. If 401/403: Authentication issue
4. If 500: Check server console

## Solution 8: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for:
   - Failed requests (red)
   - Cached responses (from cache)
   - 304 responses (not modified)

## Solution 9: Disable Service Worker

Service workers can cache old versions:

1. Open DevTools (F12)
2. Go to Application tab
3. Click "Service Workers"
4. Click "Unregister"
5. Refresh page

## Solution 10: Incognito/Private Mode

Test in incognito mode to rule out cache:

1. Press `Ctrl + Shift + N` (Chrome/Edge)
2. Navigate to admin panel
3. If it works here, it's a cache issue

## Expected Behavior

After clearing cache, you should see:

### Stats Grid
- **3 cards per row** on desktop (Bookings, Users, Packages)
- Revenue card wraps to second row
- Grid: `grid-cols-1 md:grid-cols-3`

### Admin Data Overview Section
- Real-time activity metrics (4 cards)
- Recent activity cards (6 cards in 3 columns)
- Recent user logins grid

### All Management Sections
- **3 boxes per line** on desktop
- Core Management: 3 boxes
- Content Management: 3 boxes
- Operations: 3 boxes
- System & Settings: 3 boxes

## Still Not Working?

### Check File Timestamps
Ensure files were actually saved:

```powershell
# Check when files were last modified
Get-ChildItem -Path "src/app/admin/page.tsx" | Select-Object Name, LastWriteTime
Get-ChildItem -Path "src/components/admin/AdminDataOverview.tsx" | Select-Object Name, LastWriteTime
```

### Verify Git Status
```bash
git status
git diff src/app/admin/page.tsx
```

### Check for Multiple Instances
Only one dev server should be running:

```powershell
# List all node processes
Get-Process -Name node

# Should only see one or two node processes
```

### Nuclear Option: Fresh Start
```bash
# 1. Stop all servers
# 2. Delete everything
Remove-Item -Recurse -Force .next, node_modules\.cache

# 3. Reinstall (if needed)
npm install

# 4. Start fresh
npm run dev
```

## Common Mistakes

❌ **Wrong**: `lg:grid-cols-4` (old value)
✅ **Correct**: `md:grid-cols-3` (new value)

❌ **Wrong**: Browser cache not cleared
✅ **Correct**: Hard refresh (Ctrl+Shift+R)

❌ **Wrong**: Old dev server still running
✅ **Correct**: Kill all node processes first

❌ **Wrong**: Changes not saved
✅ **Correct**: Verify file timestamps

## Quick Checklist

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Clear .next folder
- [ ] Restart dev server
- [ ] Check console for errors
- [ ] Verify files are saved
- [ ] Test in incognito mode
- [ ] Check API endpoint works
- [ ] Only one dev server running

## Need More Help?

1. Check browser console for errors
2. Check terminal for build errors
3. Verify all files exist
4. Check file permissions
5. Try different browser

---

**Last Updated**: January 2025
