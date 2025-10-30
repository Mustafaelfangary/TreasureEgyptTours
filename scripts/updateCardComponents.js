const fs = require('fs');
const path = require('path');

// Configuration for each card component
const cardComponents = [
  {
    path: 'src/components/blog/BlogCard.tsx',
    importStatement: 'import { ViewDetailsButton } from \'@/components/ui/ViewDetailsButton\';',
    buttonPattern: /<Button[^>]*>\s*<Link[^>]*>\s*View Details[\s\S]*?<\/Link>\s*<\/Button>/g,
    buttonReplacement: '<ViewDetailsButton href={post.slug}>Read More</ViewDetailsButton>',
  },
  {
    path: 'src/components/cards/AttractionCard.tsx',
    importStatement: 'import { ViewDetailsButton } from \'@/components/ui/ViewDetailsButton\';',
    buttonPattern: /<Button[^>]*>\s*View Details\s*<\/Button>/g,
    buttonReplacement: '<ViewDetailsButton href={`/attractions/${attraction.id}`} />',
  },
  {
    path: 'src/components/cards/MuseumCard.tsx',
    importStatement: 'import { ViewDetailsButton } from \'@/components/ui/ViewDetailsButton\';',
    buttonPattern: /<Button[^>]*>\s*View Details\s*<\/Button>/g,
    buttonReplacement: '<ViewDetailsButton href={`/museums/${museum.id}`} />',
  },
  {
    path: 'src/components/dahabiyas/FeaturedDahabiyaCard.tsx',
    importStatement: 'import { ViewDetailsButton } from \'@/components/ui/ViewDetailsButton\';',
    buttonPattern: /<Button[^>]*>\s*View Details\s*<\/Button>/g,
    buttonReplacement: '<ViewDetailsButton href={`/dahabiyas/${dahabiya.slug}`} />',
  },
  {
    path: 'src/components/testimonials/ReviewCard.tsx',
    importStatement: 'import { ViewDetailsButton } from \'@/components/ui/ViewDetailsButton\';',
    buttonPattern: /<Button[^>]*>\s*Read Full Review\s*<\/Button>/g,
    buttonReplacement: '<ViewDetailsButton href={`/reviews/${review.id}`} variant="outline">Read Full Review</ViewDetailsButton>',
  }
];

// Process each card component
cardComponents.forEach(({ path: filePath, importStatement, buttonPattern, buttonReplacement }) => {
  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`Skipping non-existent file: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Add import if not already present
    if (!content.includes('ViewDetailsButton')) {
      const importReactIndex = content.indexOf("import React");
      if (importReactIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', importReactIndex) + 1;
        content = content.substring(0, nextLineIndex) + 
                 importStatement + '\n' + 
                 content.substring(nextLineIndex);
      }
    }
    
    // Replace button patterns
    const updatedContent = content.replace(buttonPattern, buttonReplacement);
    
    // Write changes back to file
    if (content !== updatedContent) {
      fs.writeFileSync(fullPath, updatedContent);
      console.log(`Updated: ${filePath}`);
    } else {
      console.log(`No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log('Card components update complete!');
