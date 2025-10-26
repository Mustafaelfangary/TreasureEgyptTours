import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if partners already exist
    const existingPartners = await prisma.partner.count();
    
    if (existingPartners > 0) {
      return NextResponse.json({
        message: 'Partners already exist',
        count: existingPartners
      });
    }

    // Create default partners
    const partners = await prisma.partner.createMany({
      data: [
        {
          name: 'Alta Vida Tours',
          logoUrl: '/images/partners/altavida-logo.png',
          websiteUrl: 'https://www.altavidatours.com',
          description: 'Premium Egypt Tours & Travel Experiences',
          order: 0,
          isActive: true,
        },
        {
          name: 'Treasure Egypt Tours',
          logoUrl: '/images/partners/treasure-egypt-logo.png',
          websiteUrl: 'https://www.treasureegypttours.com',
          description: 'Discover the Treasures of Ancient Egypt',
          order: 1,
          isActive: true,
        },
      ],
    });

    return NextResponse.json({
      message: 'Partners seeded successfully',
      count: partners.count
    });
  } catch (error) {
    console.error('Error seeding partners:', error);
    return NextResponse.json(
      { error: 'Failed to seed partners' },
      { status: 500 }
    );
  }
}
