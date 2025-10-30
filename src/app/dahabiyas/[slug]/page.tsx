import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DahabiyaDetailWrapper from '@/components/dahabiyas/DahabiyaDetailWrapper';

interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  description: string;
  activities: Array<{
    id: string;
    description: string;
    time: string;
  }>;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  isApproved: boolean;
}

async function getDahabiyaData(slug: string) {
  const travelService = await prisma.travelService.findUnique({
    where: { slug },
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

  if (!travelService) return null;

  // Transform the data to match the expected format
  return {
    id: travelService.id,
    name: travelService.name,
    slug: travelService.slug,
    description: travelService.description || '',
    shortDescription: travelService.shortDescription || '',
    pricePerDay: travelService.pricePerDay ? Number(travelService.pricePerDay) : 0,
    capacity: travelService.capacity || 0,
    cabins: Math.ceil((travelService.capacity || 2) / 2),
    crew: 6,
    length: 45,
    width: 8,
    yearBuilt: 2020,
    mainImage: travelService.mainImage || '/images/default-dahabiya.jpg',
    gallery: (travelService.gallery || []).map((url: string, index: number) => ({
      id: `img-${index}`,
      url,
      alt: `${travelService.name} - Image ${index + 1}`
    })),
    features: travelService.highlights || [
      'Private balconies in all cabins',
      'Air conditioning',
      'En-suite bathrooms',
      'Panoramic windows',
      'Luxury linens',
      '24/7 room service'
    ],
    amenities: travelService.includes || [
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
    itineraries: travelService.serviceItineraries?.map(si => ({
      id: si.itinerary.id,
      day: si.itinerary.days?.[0]?.dayNumber || 1,
      title: si.itinerary.name,
      description: si.itinerary.description || '',
      activities: si.itinerary.days?.flatMap(day => 
        day.activities?.map((act, idx) => ({
          id: `${day.id}-${idx}`,
          description: act,
          time: '' // You might want to add time to your activities
        })) || []
      ) || []
    })) || [],
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
    isActive: travelService.isActive || true,
    videoUrl: 'https://www.youtube.com/watch?v=example',
    virtualTourUrl: 'https://example.com/virtual-tour',
    createdAt: travelService.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: travelService.updatedAt?.toISOString() || new Date().toISOString()
  };
}

export default async function DahabiyaPage({ params }: { params: { slug: string } }) {
  const dahabiyaData = await getDahabiyaData(params.slug);
  
  if (!dahabiyaData) {
    return notFound();
  }

  return <DahabiyaDetailWrapper dahabiya={dahabiyaData} />;
}

// Generate static params for all dahabiya slugs
export async function generateStaticParams() {
  const dahabiyas = await prisma.travelService.findMany({
    where: {
      isActive: true
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
