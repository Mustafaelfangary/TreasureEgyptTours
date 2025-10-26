import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { generateSEO } from '@/lib/seo';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  try {
    const { slug } = await params;
    const dahabiya = await prisma.dahabiya.findFirst({
      where: { OR: [{ slug }, { id: slug }] },
    });

    if (!dahabiya) {
      return generateSEO({
        title: 'Luxury Dahabiya',
        description: 'Explore our luxury dahabiyas for authentic Nile sailing with modern comforts.',
        url: '/dahabiyas',
        type: 'website',
      });
    }

    const image = dahabiya.mainImage || '/images/placeholder-dahabiya.jpg';
    const absImage = image.startsWith('http') ? image : `${baseUrl}${image}`;
    const url = `/dahabiyas/${dahabiya.slug || slug}`;

    const tags: string[] = Array.isArray(dahabiya.tags) ? dahabiya.tags : [];
    if (dahabiya.category) tags.push(dahabiya.category);

    return generateSEO({
      title: `${dahabiya.name} - Luxury Dahabiya`,
      description: dahabiya.metaDescription || dahabiya.shortDescription || dahabiya.description || `${dahabiya.name} - luxury dahabiya on the Nile`,
      image: absImage,
      url,
      type: 'website',
      tags,
    });
  } catch (e) {
    return generateSEO({
      title: 'Luxury Dahabiya',
      description: 'Explore our luxury dahabiyas for authentic Nile sailing with modern comforts.',
      url: '/dahabiyas',
      type: 'website',
    });
  }
}

export default function DahabiyaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
