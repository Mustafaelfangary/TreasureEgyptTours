// Script to test problematic images
const problematicImages = [
  '/videos/home_hero_video2.mp4',
  '/images/1757681758153-DSC_5633-HDR.jpg',
  '/images/1757681758117-DSC_5625-HDR__1_.jpg',
  '/images/1757681758144-DSC_5625-HDR.jpg',
  '/images/1757681758082-DSC_5617.jpg',
  '/images/1757681758095-DSC_5620.jpg',
  '/images/1757681758062-DSC_5614.jpg',
  '/images/1757681758052-DSC_5604.jpg',
  '/images/1757681758046-DSC_5594.jpg',
  '/images/1757681758039-DSC_5590-HDR.jpg',
  '/images/1757681758028-DSC_5576-HDR.jpg',
  '/images/1757681757999-DSC_5569-HDR.jpg',
  '/images/1757681757985-DSC_5560-HDR.jpg',
  '/images/1757681757971-DSC_5551-HDR.jpg',
  '/images/1757681757954-DSC_5544.jpg',
  '/images/1757681757940-DSC_5491-HDR__1_.jpg',
  '/images/1757681757930-DSC_5479-HDR.jpg',
  '/images/1757681757918-DSC_5478-HDR.jpg'
];

async function testImage(imagePath) {
  try {
    const response = await fetch(`http://localhost:3000/api/image-fallback?path=${encodeURIComponent(imagePath)}`);
    const result = await response.json();
    
    console.log(`\n${imagePath}:`);
    console.log(`  Exists: ${result.exists}`);
    console.log(`  Size: ${result.size || 'N/A'} bytes`);
    console.log(`  Valid Image: ${result.isValidImage}`);
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    console.error(`Failed to test ${imagePath}:`, error.message);
    return null;
  }
}

async function testAllImages() {
  console.log('Testing problematic images...\n');
  
  const results = [];
  for (const imagePath of problematicImages) {
    const result = await testImage(imagePath);
    if (result) {
      results.push({ path: imagePath, ...result });
    }
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n\n=== SUMMARY ===');
  const invalidImages = results.filter(r => r.exists && !r.isValidImage);
  const missingImages = results.filter(r => !r.exists);
  
  if (invalidImages.length > 0) {
    console.log('\nInvalid image files (need re-encoding):');
    invalidImages.forEach(img => {
      console.log(`  - ${img.path} (${img.size} bytes)`);
    });
  }
  
  if (missingImages.length > 0) {
    console.log('\nMissing image files:');
    missingImages.forEach(img => {
      console.log(`  - ${img.path}`);
    });
  }
  
  console.log(`\nTotal tested: ${results.length}`);
  console.log(`Invalid: ${invalidImages.length}`);
  console.log(`Missing: ${missingImages.length}`);
}

// Run the test
testAllImages().catch(console.error);
