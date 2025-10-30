import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import type { PackageData } from '@/types/package.types';
import PackageDetailClient from './PackageDetailClient';

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const revalidate = 3600; // Revalidate every hour

export default async function PackageDetailPage({ params }: PageProps) {
  try {
    // Fetch travel service data from the database with related itineraries
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

    // Fetch reviews separately
    const reviews = await prisma.review.findMany({
      where: { 
        status: 'APPROVED',
        comment: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!travelService) {
      notFound();
    }

    // Get the first itinerary (or handle multiple itineraries as needed)
    const mainItinerary = travelService?.serviceItineraries?.[0]?.itinerary;

    // Transform the data to match the expected PackageDetail props
    const packageData: PackageData = {
      id: travelService.id,
      name: travelService.name,
      description: travelService.description,
      shortDescription: travelService.shortDescription || null,
      price: travelService.pricePerDay ? Number(travelService.pricePerDay) : 0,
      duration: travelService.duration,
      durationDays: travelService.duration,
      maxPeople: travelService.capacity,
      mainImageUrl: travelService.mainImage || '/images/default-tour.jpg',
      isFeaturedOnHomepage: travelService.isFeatured,
      homepageOrder: 0,
      images: [
        ...(travelService.mainImage ? [{
          id: 'main',
          url: travelService.mainImage,
          alt: travelService.name,
          order: 0,
          isActive: true
        }] : []),
        ...(travelService.gallery || []).map((url: string, index: number) => ({
          id: `img-${index}`,
          url,
          alt: `${travelService.name} - Image ${index + 1}`,
          order: index + 1,
          isActive: true
        }))
      ],
      itineraries: (mainItinerary?.days || []).map(day => ({
        id: day.id,
        day: day.dayNumber || 1,
        title: day.title || `Day ${day.dayNumber || 1}`,
        description: day.description || '',
        isActive: true,
        activities: (Array.isArray(day.activities) ? day.activities : []).map((activity: any, index: number) => {
          if (typeof activity === 'string') {
            return {
              id: `act-${day.id}-${index}`,
              description: activity,
              time: 'TBD',
              order: index
            };
          }
          
          return {
            id: `act-${day.id}-${index}`,
            description: activity.description || 'Activity',
            time: activity.time || 'TBD',
            order: activity.order || index
          };
        })
      })),
      reviews: reviews.map(review => ({
        id: review.id,
        author: review.user?.name || 'Anonymous',
        rating: review.rating,
        content: review.comment,
        createdAt: review.createdAt,
        isApproved: review.status === 'APPROVED'
      })),
      highlights: travelService.highlights || [],
      inclusions: travelService.includes || [],
      exclusions: travelService.excludes || [],
      category: travelService.category,
      rating: travelService.rating ? Number(travelService.rating) : undefined,
      reviewCount: reviews.length,
      createdAt: travelService.createdAt,
      updatedAt: travelService.updatedAt
    };

    return <PackageDetailClient pkg={packageData} />;
  } catch (error) {
    console.error('Error fetching package:', error);
    notFound();
  }
}

export async function generateStaticParams() {
  const packages = await prisma.travelService.findMany({
    select: {
      slug: true
    },
    where: {
      isActive: true
    }
  });

  return packages.map((pkg) => ({
    slug: pkg.slug
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const travelService = await prisma.travelService.findUnique({
    where: { slug: params.slug }
  });

  if (!travelService) {
    return {
      title: 'Package Not Found',
      description: 'The requested package could not be found.'
    };
  }

  return {
    title: travelService.name,
    description: travelService.shortDescription || travelService.description.slice(0, 160),
    openGraph: {
      title: travelService.name,
      description: travelService.shortDescription || travelService.description.slice(0, 160),
      images: [
        {
          url: travelService.mainImage || '/images/default-tour.jpg',
          width: 1200,
          height: 630,
          alt: travelService.name
        }
      ]
    }
  };
}
