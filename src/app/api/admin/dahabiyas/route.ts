import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/admin/dahabiyas - Get all dahabiyas
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const dahabiyas = await prisma.dahabiya.findMany({
      include: {
        amenities: true,
        images: true,
        itineraries: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(dahabiyas);
  } catch (error) {
    console.error('Error fetching dahabiyas:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST /api/admin/dahabiyas - Create a new dahabiya
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();
    
    const dahabiya = await prisma.dahabiya.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        price: parseFloat(data.price),
        capacity: parseInt(data.capacity),
        length: data.length,
        width: data.width,
        cabins: parseInt(data.cabins),
        decks: parseInt(data.decks),
        isFeatured: data.isFeatured || false,
        isActive: data.isActive !== undefined ? data.isActive : true,
        amenities: {
          connect: data.amenities?.map((id: string) => ({ id })) || [],
        },
        images: {
          create: data.images?.map((url: string) => ({
            url,
            alt: data.name,
          })) || [],
        },
        itineraries: {
          create: data.itineraries?.map((itinerary: any) => ({
            day: itinerary.day,
            title: itinerary.title,
            description: itinerary.description,
          })) || [],
        },
      },
    });

    return NextResponse.json(dahabiya);
  } catch (error) {
    console.error('Error creating dahabiya:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
