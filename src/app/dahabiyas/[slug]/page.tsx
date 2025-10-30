import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DahabiyaDetailClient from '@/components/dahabiyas/DahabiyaDetailClient';

export default async function DahabiyaPage({ params }: { params: { slug: string } }) {
  // First, try to find a matching package with this slug
  const travelService = await prisma.travelService.findUnique({
    where: { slug: params.slug },
    include: {
      serviceItineraries: {
        include: {
          itinerary: {
            include: {
              days: {
                orderBy: { dayNumber: 'asc' },
                include: {
                  images: true
                }
              }
            }
          }
        },
        orderBy: {
          itinerary: {
            name: 'asc'
          }
        }
      },
    }
  });

  if (!travelService) {
    // If no package found, redirect to packages page
    return notFound();
  }

  // Transform the data to match the DahabiyaDetail component's expected props
  const dahabiyaData = {
    id: travelService.id,
    name: travelService.name,
    slug: travelService.slug,
    description: travelService.description || '',
    shortDescription: travelService.shortDescription || '',
    pricePerDay: travelService.pricePerDay ? Number(travelService.pricePerDay) : 0,
    capacity: travelService.capacity || 0,
    cabins: Math.ceil((travelService.capacity || 2) / 2), // Assuming 2 people per cabin
    crew: 6, // Default crew size
    length: 45, // Default length in meters
    width: 8, // Default width in meters
    yearBuilt: 2020, // Default year built
    mainImage: travelService.mainImage || '/images/default-dahabiya.jpg',
    gallery: (travelService.gallery || []).map((url: string, index: number) => ({
      id: `img-${index}`,
      url,
      alt: `${travelService.name} - Image ${index + 1}`
    })),
    features: travelService.highlights || [],
    amenities: travelService.includes || [],
    isActive: travelService.isActive || true,
    createdAt: travelService.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: travelService.updatedAt?.toISOString() || new Date().toISOString(),
    videoUrl: 'https://www.youtube.com/watch?v=example',
    virtualTourUrl: 'https://example.com/virtual-tour',
    features: [
      'Private balconies in all cabins',
      'Air conditioning',
      'En-suite bathrooms',
      'Panoramic windows',
      'Luxury linens',
      '24/7 room service'
    ],
    amenities: [
      'Sun deck with loungers',
      'Jacuzzi',
      'Bar',
      'Restaurant',
      'WiFi',
      'TV in cabins'
    ],
    activities: [
      'Guided tours',
      'Nile swimming',
      'Sunset felucca rides',
      'Cultural performances',
      'Cooking classes'
    ],
    diningOptions: [
      'Gourmet international cuisine',
      'Traditional Egyptian dishes',
      'Vegetarian/vegan options',
      '24-hour room service',
      'Private dining available'
    ],
    services: [
      'Private butler',
      'Laundry service',
      'Airport transfers',
      'Guided excursions',
      'Massage and spa services'
    ],
    routes: [
      'Luxor to Aswan (5 days/4 nights)',
      'Aswan to Luxor (4 days/3 nights)',
      'Extended Nile cruise (8 days/7 nights)'
    ],
    highlights: [
      'Luxury accommodation with private balconies',
      'Gourmet dining with local and international cuisine',
      'Personalized butler service',
      'Small group experience (max 12 guests)',
      'Expert Egyptologist guide',
      'All-inclusive experience'
    ],
    category: 'LUXURY' as const,
    rating: 4.8,
    reviewCount: 42,
    itineraries: [
      {
        id: '1',
        day: 1,
        title: 'Arrival in Luxor',
        description: 'Welcome aboard the Royal Cleopatra. After settling into your luxurious cabin, enjoy a welcome drink and safety briefing. In the evening, enjoy a gourmet dinner on deck as we prepare for our journey.',
        activities: [
          { id: '1-1', description: 'Airport transfer', time: '12:00 PM' },
          { id: '1-2', description: 'Welcome drink and safety briefing', time: '2:00 PM' },
          { id: '1-3', description: 'Dinner on board', time: '7:00 PM' }
        ]
      },
      {
        id: '2',
        day: 2,
        title: 'Luxor West Bank',
        description: 'Explore the wonders of the West Bank, including the Valley of the Kings, Temple of Hatshepsut, and the Colossi of Memnon.',
        activities: [
          { id: '2-1', description: 'Breakfast on board', time: '7:00 AM' },
          { id: '2-2', description: 'Guided tour of Valley of the Kings', time: '8:00 AM' },
          { id: '2-3', description: 'Visit Temple of Hatshepsut', time: '11:00 AM' },
          { id: '2-4', description: 'Lunch on board', time: '1:00 PM' },
          { id: '2-5', description: 'Visit Colossi of Memnon', time: '3:00 PM' },
          { id: '2-6', description: 'Dinner on board', time: '7:00 PM' }
        ]
      }
    ],
    reviews: [
      {
        id: '1',
        author: 'John D.',
        rating: 5,
        content: 'An unforgettable experience! The Royal Cleopatra exceeded all our expectations. The crew was exceptional, the food was delicious, and the cabins were incredibly comfortable.',
        date: '2023-10-15',
        isApproved: true
      },
      {
        id: '2',
        author: 'Sarah M.',
        rating: 4,
        content: 'Beautiful dahabiya with excellent service. The private balcony was the highlight of our trip. Would definitely recommend!',
        date: '2023-09-28',
        isApproved: true
      }
    ],
    isFeatured: true,
    isActive: true,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-10-20T00:00:00Z'
  };

  // Pass the dahabiya data to the client component
  return <DahabiyaDetailClient dahabiya={dahabiyaData} />;
}

// Generate static params for all dahabiya slugs
export async function generateStaticParams() {
  const dahabiyas = await prisma.travelService.findMany({
    where: {
      isActive: true
      // Removed category filter to avoid type errors
    },
    select: {
      slug: true
    },
    take: 100 // Limit to 100 dahabiyas to avoid timeout during build
  });

  return dahabiyas.map((dahabiya) => ({
    slug: dahabiya.slug
  }));
}
