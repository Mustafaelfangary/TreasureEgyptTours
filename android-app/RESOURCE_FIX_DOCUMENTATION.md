# Android Resource Duplication Fix

## Problem
The Android app build was failing due to duplicate resource errors, specifically with `ic_launcher.xml` and `ic_launcher_round.xml` files across different mipmap directories.

## Root Cause
The issue was caused by having the same resource files (with different content) in both the density-specific mipmap directories (mipmap-hdpi, mipmap-mdpi, etc.) and in the mipmap-anydpi-v26 directory. This created conflicts during the resource merging process.

## Solution

1. **Removed duplicate XML files**:
   - Deleted `ic_launcher.xml` from all density-specific mipmap directories (mipmap-hdpi, mipmap-mdpi, mipmap-xhdpi, mipmap-xxhdpi, mipmap-xxxhdpi)
   - Deleted `ic_launcher_round.xml` from all density-specific mipmap directories
   - Kept only the adaptive icon XML files in the mipmap-anydpi-v26 directory

2. **Created missing drawable resources**:
   - Added `ic_launcher_background.xml` in the drawable directory
   - Added `cleopatra_logo.xml` in the drawable directory
   - Added `splash_logo.xml` in the drawable directory

## Best Practices for Android Resources

1. **Adaptive Icons (Android 8.0+)**:
   - Place adaptive icon XML files only in mipmap-anydpi-v26 directory
   - These files should reference drawable resources for background and foreground

2. **Legacy Icons (Pre-Android 8.0)**:
   - Place PNG files in the appropriate density-specific mipmap directories
   - Do not duplicate XML files across directories

3. **Vector Drawables**:
   - Place vector drawable XML files in the drawable directory, not in mipmap directories

4. **Resource Organization**:
   - Use appropriate directories for different resource types
   - Avoid duplicating resources with the same name across different directories

## Note
After fixing the resource duplication issues, there may still be other unrelated build errors that need to be addressed separately.