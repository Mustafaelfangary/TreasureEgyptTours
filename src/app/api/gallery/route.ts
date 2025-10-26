import { prisma } from '@/lib/prisma';

// Public: GET /api/gallery
import { NextRequest, NextResponse } from 'next/server';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  category: string;
  itemName?: string;
  itemSlug?: string;
  location?: string;
  photographer?: string;
  likes: number;
  views: number;
}

export async function GET(request: NextRequest) {
  try {
    const allImages: GalleryImage[] = [];
    const categoryStats: Record<string, number> = {};

    // 1. Get images from gallery table (uploaded via admin panel)
    try {
      const galleryImages = await prisma.galleryImage.findMany({
        where: {
          isActive: true
        },
        include: {
          category: true
        },
        orderBy: {
          order: 'asc'
        }
      });

      galleryImages.forEach(image => {
        const category = image.category.name.toLowerCase();
        allImages.push({
          id: `gallery-${image.id}`,
          url: image.url,
          alt: image.alt || image.title || 'Gallery Image',
          caption: image.title || '',
          category: category,
          itemName: image.title,
          itemSlug: image.category.slug,
          location: image.location || 'Egypt',
          photographer: image.photographer,
          likes: image.likes,
          views: image.views,
        });
        categoryStats[category] = (categoryStats[category] || 0) + 1;
      });
    } catch (err) {
      console.log('Gallery images not available:', err);
    }

    // 2. Get all media library images (if Media model exists)
    // Note: Media model may not exist in schema, skip for now
    // This can be added later if needed

    // 3. Get images from dahabiyas
    try {
      const dahabiyas = await prisma.dahabiya.findMany({
        where: {
          isActive: true
        },
        select: {
          id: true,
          name: true,
          slug: true,
          mainImage: true,
          gallery: true
        }
      });

      dahabiyas.forEach(dahabiya => {
        // Add main image
        if (dahabiya.mainImage) {
          allImages.push({
            id: `dahabiya-main-${dahabiya.id}`,
            url: dahabiya.mainImage,
            alt: `${dahabiya.name} - Main Image`,
            caption: `${dahabiya.name} Dahabiya`,
            category: 'dahabiya',
            itemName: dahabiya.name,
            itemSlug: dahabiya.slug || dahabiya.id,
            location: 'Nile River, Egypt',
            likes: 0,
            views: 0,
          });
          categoryStats['dahabiya'] = (categoryStats['dahabiya'] || 0) + 1;
        }

        // Add gallery images
        if (Array.isArray(dahabiya.gallery)) {
          dahabiya.gallery.forEach((imgUrl, idx) => {
            if (imgUrl) {
              allImages.push({
                id: `dahabiya-gallery-${dahabiya.id}-${idx}`,
                url: imgUrl,
                alt: `${dahabiya.name} - Gallery Image ${idx + 1}`,
                caption: `${dahabiya.name} - Image ${idx + 1}`,
                category: 'dahabiya',
                itemName: dahabiya.name,
                itemSlug: dahabiya.slug || dahabiya.id,
                location: 'Nile River, Egypt',
                likes: 0,
                views: 0,
              });
              categoryStats['dahabiya'] = (categoryStats['dahabiya'] || 0) + 1;
            }
          });
        }
      });
    } catch (err) {
      console.log('Dahabiyas not available:', err);
    }

    // 4. Get images from packages
    try {
      const packages = await prisma.package.findMany({
        select: {
          id: true,
          name: true,
          mainImageUrl: true,
          itineraryDays: {
            include: {
              images: true
            }
          }
        }
      });

      packages.forEach(pkg => {
        // Add main image
        if (pkg.mainImageUrl) {
          allImages.push({
            id: `package-main-${pkg.id}`,
            url: pkg.mainImageUrl,
            alt: `${pkg.name} - Main Image`,
            caption: `${pkg.name} Package`,
            category: 'package',
            itemName: pkg.name,
            itemSlug: pkg.id,
            location: 'Egypt',
            likes: 0,
            views: 0,
          });
          categoryStats['package'] = (categoryStats['package'] || 0) + 1;
        }

        // Add images from itinerary days
        pkg.itineraryDays.forEach(day => {
          day.images.forEach((img, idx) => {
            if (img.url) {
              allImages.push({
                id: `package-day-${day.id}-${img.id}`,
                url: img.url,
                alt: img.alt || `${pkg.name} - ${day.title}`,
                caption: `${pkg.name} - ${day.title}`,
                category: 'package',
                itemName: pkg.name,
                itemSlug: pkg.id,
                location: 'Egypt',
                likes: 0,
                views: 0,
              });
              categoryStats['package'] = (categoryStats['package'] || 0) + 1;
            }
          });
        });
      });
    } catch (err) {
      console.log('Packages not available:', err);
    }

    // 5. Get images from itineraries
    try {
      const itineraries = await prisma.itinerary.findMany({
        where: {
          isActive: true
        },
        select: {
          id: true,
          name: true,
          slug: true,
          mainImageUrl: true,
          image: true
        }
      });

      itineraries.forEach(itinerary => {
        // Add main image
        if (itinerary.mainImageUrl) {
          allImages.push({
            id: `itinerary-main-${itinerary.id}`,
            url: itinerary.mainImageUrl,
            alt: `${itinerary.name} - Main Image`,
            caption: `${itinerary.name} Itinerary`,
            category: 'itinerary',
            itemName: itinerary.name,
            itemSlug: itinerary.slug || itinerary.id,
            location: 'Egypt',
            likes: 0,
            views: 0,
          });
          categoryStats['itinerary'] = (categoryStats['itinerary'] || 0) + 1;
        }

        // Add itinerary image (single image relation)
        if (itinerary.image && itinerary.image.url) {
          allImages.push({
            id: `itinerary-img-${itinerary.id}`,
            url: itinerary.image.url,
            alt: itinerary.image.alt || `${itinerary.name} Image`,
            caption: `${itinerary.name}`,
            category: 'itinerary',
            itemName: itinerary.name,
            itemSlug: itinerary.slug || itinerary.id,
            location: 'Egypt',
            likes: 0,
            views: 0,
          });
          categoryStats['itinerary'] = (categoryStats['itinerary'] || 0) + 1;
        }
      });
    } catch (err) {
      console.log('Itineraries not available:', err);
    }

    // Remove duplicates based on URL
    const uniqueImages = Array.from(
      new Map(allImages.map(img => [img.url, img])).values()
    );

    console.log(`✅ Gallery API: Found ${uniqueImages.length} unique images`);
    console.log(`📊 Categories:`, categoryStats);

    return NextResponse.json({
      images: uniqueImages,
      total: uniqueImages.length,
      categories: categoryStats
    });

  } catch (error) {
    console.error('Error fetching gallery:', error);
    
    // Return mock data if database fails - using existing images
    const mockImages = [
      {
        id: 'mock-1',
        url: '/images/1.jpg',
        alt: 'Luxury Dahabiya',
        caption: 'Princess Cleopatra sailing on the Nile',
        category: 'dahabiya',
        itemName: 'Princess Cleopatra',
        itemSlug: 'princess-cleopatra',
        location: 'Nile River, Egypt',
        photographer: 'Dahabiyat Team',
        likes: 45,
        views: 1250
      },
      {
        id: 'mock-2',
        url: '/images/destinations/karnak-temple.jpg',
        alt: 'Ancient Temple',
        caption: 'Karnak Temple Complex',
        category: 'destination',
        location: 'Luxor, Egypt',
        photographer: 'Ahmed Hassan',
        likes: 67,
        views: 2100
      },
      {
        id: 'mock-3',
        url: '/images/experiences/sunset-sailing.jpg',
        alt: 'Nile Sunset',
        caption: 'Magical sunset on the Nile',
        category: 'experience',
        location: 'Nile River, Egypt',
        photographer: 'Sarah Johnson',
        likes: 89,
        views: 1800
      },
      {
        id: 'mock-4',
        url: '/images/11i.jpg',
        alt: 'Dahabiya Experience',
        caption: 'Authentic Nile experience aboard our dahabiyas',
        category: 'package',
        itemName: 'Nile Experience',
        itemSlug: 'nile-experience',
        location: 'Egypt',
        photographer: 'Dahabiyat Team',
        likes: 34,
        views: 950
      },
      {
        id: 'mock-5',
        url: '/images/13i.jpg',
        alt: 'Dahabiya Interior',
        caption: 'Elegant interior of our luxury dahabiyas',
        category: 'dahabiya',
        itemName: 'Luxury Suite',
        itemSlug: 'luxury-suite',
        location: 'Nile River, Egypt',
        photographer: 'Dahabiyat Team',
        likes: 78,
        views: 1650
      },
      {
        id: 'mock-6',
        url: '/images/Corridor/corridor-claeopatra.jpg',
        alt: 'Dahabiya Corridor',
        caption: 'Elegant corridor aboard our dahabiyas',
        category: 'dahabiya',
        itemName: 'Cleopatra Corridor',
        itemSlug: 'cleopatra-corridor',
        location: 'Nile River, Egypt',
        photographer: 'Dahabiyat Team',
        likes: 52,
        views: 1420
      }
    ];

    return NextResponse.json({
      images: mockImages,
      total: mockImages.length,
      categories: {
        dahabiya: 3,
        package: 1,
        destination: 1,
        experience: 1,
      }
    });
  }
}
