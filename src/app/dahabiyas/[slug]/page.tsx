import React from 'react';
import Script from 'next/script';
import { prisma } from '@/lib/prisma';
import { DahabiyaDetail } from '@/components/dahabiyas';

interface DahabiyaPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DahabiyaPage({ params }: DahabiyaPageProps) {
  const { slug } = await params;

  let dahabiya = null;
  try {
    dahabiya = await prisma.dahabiya.findFirst({
      where: {
        OR: [{ slug }, { id: slug }]
      }
    });
  } catch (error) {
    console.error('Error fetching dahabiya from database:', error);
    // Return error page instead of crashing
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Database Error</h1>
          <p className="text-gray-600 mb-4">Unable to connect to database</p>
          <p className="text-sm text-gray-500">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com';
  const image =
    dahabiya?.mainImage ||
    (Array.isArray(dahabiya?.gallery) ? dahabiya?.gallery[0] : undefined) ||
    '/images/placeholder-dahabiya.jpg';
  const absImage = image && (image.startsWith('http') ? image : `${baseUrl}${image}`);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pale-green-50 to-pale-blue-50 on-light">
      <DahabiyaDetail slug={slug} />

      {dahabiya && (
        <>
          <Script
            id="dahabiya-breadcrumb-json-ld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}` },
                  { "@type": "ListItem", position: 2, name: "Dahabiyas", item: `${baseUrl}/dahabiyas` },
                  { "@type": "ListItem", position: 3, name: dahabiya.name, item: `${baseUrl}/dahabiyas/${dahabiya.slug || slug}` }
                ]
              }),
            }}
          />
          <Script
            id="dahabiya-offer-json-ld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BoatTrip",
                name: dahabiya.name,
                description: dahabiya.shortDescription || dahabiya.description || '',
                image: absImage || undefined,
                url: `${baseUrl}/dahabiyas/${dahabiya.slug || slug}`,
                offers: {
                  "@type": "Offer",
                  price: dahabiya.pricePerDay,
                  priceCurrency: "USD",
                  availability: "https://schema.org/InStock",
                  url: `${baseUrl}/dahabiyas/${dahabiya.slug || slug}`,
                  seller: { "@type": "Organization", name: "Dahabiyat Nile Cruise" }
                },
                brand: { "@type": "Brand", name: "Dahabiyat Nile Cruise" },
                ...((dahabiya.rating && dahabiya.reviewCount) ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: dahabiya.rating,
                    reviewCount: dahabiya.reviewCount
                  }
                } : {})
              }),
            }}
          />
        </>
      )}
    </div>
  );
}
