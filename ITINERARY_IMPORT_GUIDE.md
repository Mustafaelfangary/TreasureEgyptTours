# Itinerary Import Guide

This guide explains how to import Word document itineraries into your Dahabiyat Nile Cruise website.

## Quick Start

1. **Prepare your Word documents** (.docx or .doc files)
2. **Run the import command**:
   ```bash
   npm run import:itineraries "path/to/your/itineraries/folder"
   ```
   Or for a single file:
   ```bash
   npm run import:itineraries "path/to/your/file.docx"
   ```

## Word Document Structure

Your Word documents should follow this structure for best results:

### 1. Title
- Start with a clear title like "Egypt Nile Cruise - 7 Days" or "Aswan to Luxor Dahabiya Journey"

### 2. Description 
- A paragraph describing the overall journey
- This becomes the main description on your website

### 3. Highlights (Optional but recommended)
```
Highlights:
• Visit the magnificent temples of Karnak
• Explore the Valley of the Kings
• Enjoy traditional Egyptian cuisine
• Experience authentic Nubian culture
```

### 4. What's Included (Optional)
```
Included:
• All meals (breakfast, lunch, dinner)
• Professional Egyptologist guide
• All entrance fees
• Airport transfers
```

### 5. What's Not Included (Optional)
```
Not Included:
• International flights
• Personal expenses
• Gratuities
• Travel insurance
```

### 6. Day-by-Day Itinerary
```
Day 1: Arrival in Aswan
Arrive at Aswan airport where you will be met by our representative...

Day 2: Aswan Sightseeing
After breakfast, visit the magnificent Philae Temple...

Day 3: Sailing to Kom Ombo
Early morning sailing to Kom Ombo. Visit the unique temple...
```

### 7. Pricing (Optional)
```
Pricing:
2 pax: $2,500 per person
4 pax: $2,000 per person
6 pax: $1,800 per person
Single supplement: $400
```

## Features of the Import Tool

### Automatic Extraction
The tool automatically extracts:
- **Title** from the document header
- **Duration** from mentions like "7 days" or "5 nights/6 days"
- **Highlights** from bullet-pointed sections
- **Day-by-day activities** from "Day 1:", "Day 2:" sections
- **Pricing information** from structured pricing sections
- **Meals** mentioned in daily descriptions

### Data Validation
- Checks for duplicate itineraries (by slug)
- Validates day numbering
- Ensures required fields are present

### Database Integration
- Creates complete database records
- Links itinerary days properly
- Stores pricing tiers if available
- Sets up proper SEO-friendly URLs (slugs)

## Usage Examples

### Import a single file
```bash
npm run import:itineraries "C:\Documents\Egypt 7 Days.docx"
```

### Import all files in a folder
```bash
npm run import:itineraries "C:\Documents\Itineraries"
```

### Import from the current directory
```bash
npm run import:itineraries "./itineraries"
```

## After Import

1. **Check your admin panel** to see the imported itineraries
2. **Edit details** if needed (descriptions, images, pricing)
3. **Set featured status** for homepage display
4. **Add images** through the admin interface
5. **Publish** when ready

## Managing Imported Itineraries

### Admin Interface
Access your admin panel at `/admin` to:
- Edit itinerary details
- Add/manage images
- Set featured status for homepage
- Update pricing
- Manage availability

### Setting Featured Itineraries
1. Go to admin panel → Itineraries
2. Click "Edit" on an itinerary
3. Check "Featured" to show on homepage
4. Set homepage order if needed

## Troubleshooting

### Common Issues

**Import fails with "file not found"**
- Check the file path is correct
- Use forward slashes `/` or double backslashes `\\` in paths
- Enclose paths with spaces in quotes

**Itinerary already exists**
- The tool skips duplicates based on the title/slug
- Delete the existing itinerary from admin panel if you want to re-import

**Missing day information**
- Ensure your Word document uses "Day 1:", "Day 2:" format
- Check that each day has substantial content (not just a title)

**Pricing not imported**
- Use clear format: "2 pax: $2000" or "Single room: $1500"
- Include "Pricing:" or "Rates:" section header

### Getting Help

If you encounter issues:
1. Check the console output for error messages
2. Verify your Word document follows the expected structure
3. Test with a simpler document first
4. Contact support if problems persist

## Advanced Usage

### Custom Processing
The import script is located at `scripts/import-word-itineraries.ts` and can be customized for specific requirements.

### Batch Operations
You can run multiple import operations:
```bash
npm run import:itineraries "folder1"
npm run import:itineraries "folder2"
```

## Tips for Best Results

1. **Consistent formatting** - Use the same structure across all Word documents
2. **Clear section headers** - Use "Highlights:", "Day 1:", etc.
3. **Bullet points** - Use • or - for lists
4. **Descriptive titles** - Include destination and duration in titles
5. **Quality content** - Write detailed descriptions for better SEO

---

*This import tool makes it easy to migrate your existing Word document itineraries to your website database, maintaining all the important information while making it web-ready.*
