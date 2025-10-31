import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import type { PackageData } from '@/types/package.types';
import dynamic from 'next/dynamic';

// Create a new Prisma client instance
const prisma = new PrismaClient();

// Dynamically import the PackageDetail component to avoid SSR issues
const PackageDetail = dynamic<{ pkg: PackageData }>(
  () => import('@/components/package/PackageDetail').then((mod) => mod.PackageDetail),
  { 
    ssr: true,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export const revalidate = 3600; // Revalidate every hour

export default async function PackageDetailPage({ params }: PageProps) {
  try {
    // Fetch package data from the database
    const tour = await prisma['tour'].findUnique({
      where: { slug: params.slug },
      include: {
        itineraries: {
          include: {
            days: {
              orderBy: { dayNumber: 'asc' },
              include: {
                images: true
              }
            }
          },
          orderBy: {
            name: 'asc'
          }
        },
        reviews: {
          where: { 
            status: 'APPROVED',
            comment: { not: null },
          },
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });

    if (!tour) {
      return notFound();
    }

    // Transform the data to match the PackageData type
    const packageData: PackageData = {
      id: tour.id,
      name: tour.title,
      description: tour.description || '',
      shortDescription: tour.summary || null,
      price: tour.price ? Number(tour.price) : 0,
      duration: tour.duration || 0,
      durationDays: tour.duration || 0,
      maxPeople: tour.maxGroupSize || 0,
      mainImageUrl: tour.imageCover || '/images/default-package.jpg',
      isFeaturedOnHomepage: false,
      homepageOrder: 0,
      images: Array.isArray(tour.images) ? tour.images.map((url, index) => ({
        id: `img-${tour.id}-${index}`,
        url: url,
        alt: `${tour.title} - Image ${index + 1}`,
        order: index,
        isActive: true
      })) : [],
      itineraries: (tour.itineraries || []).flatMap(itinerary => 
        (itinerary.days || []).map(day => ({
          id: day.id,
          day: day.dayNumber || 1,
          title: day.title || `Day ${day.dayNumber || 1}`,
          description: day.description || '',
          isActive: true,
          activities: (Array.isArray(day.activities) ? day.activities : []).map((activity, index) => ({
            id: `act-${day.id}-${index}`,
            description: typeof activity === 'string' ? activity : (activity?.description || 'Activity'),
            time: typeof activity === 'string' ? 'TBD' : (activity?.time || 'TBD'),
            order: index
          }))
        }))
      ),
      reviews: (tour.reviews || []).map(review => ({
        id: review.id,
        author: review.user?.name || 'Anonymous',
        rating: review.rating || 5,
        content: review.comment || '',
        createdAt: review.createdAt || new Date(),
        isApproved: true
      })),
      highlights: [],
      inclusions: [],
      exclusions: [],
      category: 'STANDARD',
      rating: tour.ratingsAverage || 0,
      reviewCount: tour.ratingsQuantity || 0,
      createdAt: tour.createdAt || new Date(),
      updatedAt: tour.updatedAt || new Date()
    };

    return <PackageDetail pkg={packageData} />;
  } catch (error) {
    console.error('Error fetching package:', error);
    return notFound();
  }
}

export async function generateStaticParams() {
  try {
    const packages = await prisma['tour'].findMany({
      select: {
        slug: true
      },
      where: {
        // Only include published tours if status field exists
        // status: 'PUBLISHED'
      },
      take: 100 // Limit to 100 packages to avoid timeout during build
    });

    return packages.map((pkg) => ({
      slug: pkg.slug
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<{
  title: string;
  description: string;
  openGraph?: {
    title: string;
    description: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
  };
}> {
  try {
    const tour = await prisma['tour'].findUnique({
      where: { slug: params.slug },
      select: {
        title: true,
        summary: true,
        imageCover: true
      }
    });

    if (!tour) {
      return {
        title: 'Package Not Found',
        description: 'The requested package could not be found.'
      };
    }

    return {
      title: tour.title,
      description: tour.summary || '',
      openGraph: {
        title: tour.title,
        description: tour.summary || '',
        images: [
          {
            url: tour.imageCover || '/images/default-package.jpg',
            width: 1200,
            height: 630,
            alt: tour.title
          }
        ]
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Package Details',
      description: 'View package details'
    };
  }
}