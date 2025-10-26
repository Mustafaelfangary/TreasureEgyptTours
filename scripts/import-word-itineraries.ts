import mammoth from 'mammoth';
import fs from 'fs-extra';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ParsedItinerary {
  name: string;
  description: string;
  shortDescription?: string;
  durationDays: number;
  price?: number;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  days: ParsedItineraryDay[];
  pricing?: ParsedPricing[];
}

interface ParsedItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  location?: string;
  activities: string[];
  meals: string[];
}

interface ParsedPricing {
  category: string;
  paxRange: string;
  price: number;
  singleSupplement?: number;
}

class ItineraryWordProcessor {
  
  /**
   * Convert Word document to HTML and extract text
   */
  async extractContentFromWord(filePath: string): Promise<string> {
    try {
      const buffer = await fs.readFile(filePath);
      const result = await mammoth.convertToHtml({ buffer });
      return result.value;
    } catch (error) {
      console.error(`Error processing Word file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Parse HTML content to extract itinerary information
   */
  parseItineraryContent(html: string, fileName: string): ParsedItinerary {
    // Remove HTML tags for easier processing
    const text = html.replace(/<[^>]+>/g, '\n').replace(/\n+/g, '\n').trim();
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const itinerary: ParsedItinerary = {
      name: this.extractTitle(lines, fileName),
      description: '',
      durationDays: this.extractDuration(lines),
      highlights: this.extractHighlights(lines),
      included: this.extractIncluded(lines),
      notIncluded: this.extractNotIncluded(lines),
      days: this.extractDays(lines),
      pricing: this.extractPricing(lines)
    };

    // Extract description (usually the first paragraph after title)
    itinerary.description = this.extractDescription(lines);
    itinerary.shortDescription = this.extractShortDescription(itinerary.description);

    return itinerary;
  }

  private extractTitle(lines: string[], fileName: string): string {
    // Look for title patterns
    const titlePatterns = [
      /^(.+?)\s*(?:itinerary|package|cruise|tour)$/i,
      /^(?:itinerary|package|cruise|tour):\s*(.+?)$/i,
      /^(.{10,}?)(?:\s*-\s*\d+\s*days?)?$/i
    ];

    for (const line of lines.slice(0, 5)) {
      for (const pattern of titlePatterns) {
        const match = line.match(pattern);
        if (match && match[1] && match[1].length > 5) {
          return match[1].trim();
        }
      }
    }

    // Fallback to filename
    return fileName.replace(/\.[^.]*$/, '').replace(/[-_]/g, ' ');
  }

  private extractDuration(lines: string[]): number {
    const durationPatterns = [
      /(\d+)\s*days?/i,
      /(\d+)\s*nights?\s*\/\s*(\d+)\s*days?/i,
      /(\d+)D\/(\d+)N/i
    ];

    for (const line of lines.slice(0, 10)) {
      for (const pattern of durationPatterns) {
        const match = line.match(pattern);
        if (match) {
          return parseInt(match[1]) || parseInt(match[2]) || 7;
        }
      }
    }

    return 7; // Default duration
  }

  private extractHighlights(lines: string[]): string[] {
    const highlights: string[] = [];
    let inHighlights = false;

    for (const line of lines) {
      if (/highlights?:?$/i.test(line) || /key features?:?$/i.test(line)) {
        inHighlights = true;
        continue;
      }

      if (inHighlights) {
        if (/^(included|not included|pricing|itinerary|day \d+)/i.test(line)) {
          break;
        }
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          highlights.push(line.replace(/^[•\-*]\s*/, ''));
        } else if (line.length > 10) {
          highlights.push(line);
        }
      }
    }

    return highlights.slice(0, 8); // Limit to 8 highlights
  }

  private extractIncluded(lines: string[]): string[] {
    return this.extractBulletSection(lines, ['included', 'includes', 'what\'s included']);
  }

  private extractNotIncluded(lines: string[]): string[] {
    return this.extractBulletSection(lines, ['not included', 'excludes', 'what\'s not included']);
  }

  private extractBulletSection(lines: string[], sectionTriggers: string[]): string[] {
    const items: string[] = [];
    let inSection = false;

    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      // Check if we're entering the section
      if (sectionTriggers.some(trigger => lowerLine.includes(trigger))) {
        inSection = true;
        continue;
      }

      if (inSection) {
        // Stop if we hit another section
        if (/^(not included|included|pricing|itinerary|day \d+|highlights)/i.test(line)) {
          if (!sectionTriggers.some(trigger => lowerLine.includes(trigger))) {
            break;
          }
        }
        
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          items.push(line.replace(/^[•\-*]\s*/, ''));
        } else if (line.length > 10 && !/^(day \d+|pricing)/i.test(line)) {
          items.push(line);
        }
      }
    }

    return items;
  }

  private extractDays(lines: string[]): ParsedItineraryDay[] {
    const days: ParsedItineraryDay[] = [];
    let currentDay: ParsedItineraryDay | null = null;
    let inItinerary = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const dayMatch = line.match(/^day\s*(\d+):?\s*(.*)$/i);

      if (dayMatch) {
        inItinerary = true;
        if (currentDay) {
          days.push(currentDay);
        }
        
        currentDay = {
          dayNumber: parseInt(dayMatch[1]),
          title: dayMatch[2] || `Day ${dayMatch[1]}`,
          description: '',
          activities: [],
          meals: []
        };
        continue;
      }

      if (currentDay && inItinerary) {
        // Stop if we hit pricing or other sections
        if (/^(pricing|cost|rates|notes|terms)/i.test(line)) {
          break;
        }

        // Detect location
        if (/^(location|destination|port):\s*(.+)/i.test(line)) {
          const locationMatch = line.match(/^(location|destination|port):\s*(.+)/i);
          if (locationMatch) {
            currentDay.location = locationMatch[2];
          }
          continue;
        }

        // Detect meals
        if (/\b(breakfast|lunch|dinner|meals?)\b/i.test(line)) {
          const mealMatches = line.match(/\b(breakfast|lunch|dinner)\b/gi);
          if (mealMatches) {
            currentDay.meals.push(...mealMatches.map(m => m.toUpperCase()));
          }
          continue;
        }

        // Add to description if it's substantial content
        if (line.length > 15 && !line.startsWith('Day ')) {
          if (currentDay.description) {
            currentDay.description += ' ';
          }
          currentDay.description += line;
          
          // Extract activities from the description
          const activityKeywords = ['visit', 'explore', 'see', 'enjoy', 'experience', 'discover'];
          if (activityKeywords.some(keyword => line.toLowerCase().includes(keyword))) {
            currentDay.activities.push(line);
          }
        }
      }
    }

    if (currentDay) {
      days.push(currentDay);
    }

    return days;
  }

  private extractPricing(lines: string[]): ParsedPricing[] {
    const pricing: ParsedPricing[] = [];
    let inPricing = false;

    for (const line of lines) {
      if (/^(pricing|rates?|costs?|price)/i.test(line)) {
        inPricing = true;
        continue;
      }

      if (inPricing) {
        // Look for pricing patterns like "2 pax: $2000" or "Single room: $1500"
        const priceMatch = line.match(/([^:]+):\s*\$?([0-9,]+(?:\.[0-9]{2})?)/i);
        if (priceMatch) {
          const category = priceMatch[1].trim();
          const price = parseFloat(priceMatch[2].replace(/,/g, ''));
          
          pricing.push({
            category,
            paxRange: this.extractPaxRange(category),
            price
          });
        }
      }
    }

    return pricing;
  }

  private extractPaxRange(category: string): string {
    const paxMatch = category.match(/(\d+)\s*(?:pax|people|persons?|guests?)/i);
    if (paxMatch) {
      return `${paxMatch[1]} pax`;
    }
    
    if (/single/i.test(category)) return '1 pax';
    if (/double|twin/i.test(category)) return '2 pax';
    if (/triple/i.test(category)) return '3 pax';
    
    return 'Standard';
  }

  private extractDescription(lines: string[]): string {
    // Look for the main description (usually after title, before sections)
    const descriptionLines: string[] = [];
    let foundTitle = false;
    
    for (const line of lines) {
      if (!foundTitle && line.length > 20) {
        foundTitle = true;
        continue;
      }
      
      if (foundTitle) {
        if (/^(highlights?|included|day \d+|pricing)/i.test(line)) {
          break;
        }
        if (line.length > 30) {
          descriptionLines.push(line);
        }
      }
    }
    
    return descriptionLines.join(' ').substring(0, 1000);
  }

  private extractShortDescription(description: string): string {
    return description.split('.')[0] + (description.includes('.') ? '.' : '');
  }

  /**
   * Transform parsed data to database format
   */
  transformToDbFormat(parsed: ParsedItinerary): any {
    const slug = parsed.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    return {
      name: parsed.name,
      slug,
      description: parsed.description,
      shortDescription: parsed.shortDescription,
      durationDays: parsed.durationDays,
      price: parsed.price || (parsed.pricing?.[0]?.price || null),
      highlights: parsed.highlights,
      included: parsed.included,
      notIncluded: parsed.notIncluded,
      isActive: true,
      featured: false,
      days: {
        create: parsed.days.map(day => ({
          dayNumber: day.dayNumber,
          title: day.title,
          description: day.description,
          location: day.location,
          activities: day.activities,
          meals: day.meals.map(meal => meal as any) // Convert to MealType enum
        }))
      },
      pricingTiers: parsed.pricing ? {
        create: parsed.pricing.map(pricing => ({
          category: pricing.category,
          paxRange: pricing.paxRange,
          price: pricing.price,
          singleSupplement: pricing.singleSupplement
        }))
      } : undefined
    };
  }

  /**
   * Process a single Word file and save to database
   */
  async processWordFile(filePath: string): Promise<void> {
    try {
      console.log(`Processing: ${filePath}`);
      
      const fileName = path.basename(filePath);
      const html = await this.extractContentFromWord(filePath);
      const parsed = this.parseItineraryContent(html, fileName);
      const dbData = this.transformToDbFormat(parsed);
      
      // Check if itinerary with this slug already exists
      const existing = await prisma.itinerary.findUnique({
        where: { slug: dbData.slug }
      });

      if (existing) {
        console.log(`Itinerary with slug '${dbData.slug}' already exists. Skipping...`);
        return;
      }

      // Create the itinerary in database
      const created = await prisma.itinerary.create({
        data: dbData
      });

      console.log(`✅ Successfully imported: ${created.name} (ID: ${created.id})`);
    } catch (error) {
      console.error(`❌ Failed to process ${filePath}:`, error);
    }
  }

  /**
   * Process all Word files in a directory
   */
  async processDirectory(directoryPath: string): Promise<void> {
    try {
      const files = await fs.readdir(directoryPath);
      const wordFiles = files.filter(file => 
        file.toLowerCase().endsWith('.docx') || file.toLowerCase().endsWith('.doc')
      );

      console.log(`Found ${wordFiles.length} Word files to process`);

      for (const file of wordFiles) {
        const fullPath = path.join(directoryPath, file);
        await this.processWordFile(fullPath);
      }

      console.log('\n🎉 Processing complete!');
    } catch (error) {
      console.error('Error processing directory:', error);
    }
  }
}

// CLI Usage
async function main() {
  const processor = new ItineraryWordProcessor();
  
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`
Usage: 
  tsx scripts/import-word-itineraries.ts <file-or-directory-path>

Examples:
  tsx scripts/import-word-itineraries.ts "./itineraries/Egypt-7-Days.docx"
  tsx scripts/import-word-itineraries.ts "./itineraries/"
    `);
    process.exit(1);
  }

  const inputPath = args[0];
  const stat = await fs.stat(inputPath);

  if (stat.isFile()) {
    await processor.processWordFile(inputPath);
  } else if (stat.isDirectory()) {
    await processor.processDirectory(inputPath);
  } else {
    console.error('Invalid path provided');
    process.exit(1);
  }

  await prisma.$disconnect();
}

if (require.main === module) {
  main().catch(console.error);
}

export { ItineraryWordProcessor };
