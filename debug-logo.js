#!/usr/bin/env node

/**
 * Debug script to test logo functionality
 * Run this script to check if the logo API is working correctly
 * 
 * Usage: node debug-logo.js
 */

const BASE_URL = 'http://localhost:3000';

async function testLogoAPI() {
  console.log('🔍 Testing Logo API...\n');
  
  try {
    // Test GET /api/admin/logo
    console.log('1. Testing GET /api/admin/logo...');
    const response = await fetch(`${BASE_URL}/api/admin/logo`, {
      headers: {
        'Cache-Control': 'no-cache',
      }
    });
    
    if (response.ok) {
      const logos = await response.json();
      console.log('✅ Logo API Response:', JSON.stringify(logos, null, 2));
      
      if (logos.length === 0) {
        console.log('⚠️  No logos found in database. This might be the issue.');
      } else {
        logos.forEach(logo => {
          console.log(`   - ${logo.key}: ${logo.content || 'NO CONTENT'}`);
        });
      }
    } else {
      console.log(`❌ Logo API failed with status: ${response.status}`);
      const errorText = await response.text();
      console.log(`   Error: ${errorText}`);
    }
    
    // Test if default logo exists
    console.log('\n2. Testing default logo accessibility...');
    const defaultLogoResponse = await fetch(`${BASE_URL}/images/logo.png`);
    if (defaultLogoResponse.ok) {
      console.log('✅ Default logo (/images/logo.png) is accessible');
    } else {
      console.log('❌ Default logo (/images/logo.png) is NOT accessible');
    }
    
    // Test cache busting
    console.log('\n3. Testing cache busting...');
    const cacheBustResponse = await fetch(`${BASE_URL}/images/logo.png?t=${Date.now()}`);
    if (cacheBustResponse.ok) {
      console.log('✅ Cache busting works with default logo');
    } else {
      console.log('❌ Cache busting failed with default logo');
    }
    
  } catch (error) {
    console.error('❌ Error testing logo API:', error.message);
  }
}

async function main() {
  console.log('🧪 Logo Debug Tool\n');
  console.log('Testing logo functionality for the Dahabiyat Nile Cruise project...\n');
  
  await testLogoAPI();
  
  console.log('\n📋 Troubleshooting Tips:');
  console.log('1. Make sure the development server is running on http://localhost:3000');
  console.log('2. Check if the database contains logo entries in websiteContent table');
  console.log('3. Verify that /images/logo.png exists in the public directory');
  console.log('4. Check browser console for additional error messages');
  console.log('5. Try clearing browser cache and hard refresh (Ctrl+F5)');
}

if (require.main === module) {
  main().catch(console.error);
}
