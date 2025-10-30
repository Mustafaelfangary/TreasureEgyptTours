'use client';

import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Script from 'next/script';

// Dynamically import the DahabiyaDetail component
const DahabiyaDetail = dynamic(
  () => import('@/components/dahabiyas/DahabiyaDetail'),
  { ssr: true }
);

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dahabiyatnilecruise.com';

// For now, we'll use a simple approach with client-side data fetching
// In a real app, you would fetch this data from an API route
export default function DahabiyaPage({ params }: { params: { slug: string } }) {
  // Mock data that matches the DahabiyaDetail component's expected props
  const mockDahabiya = {
    id: '1',
    name: 'Royal Cleopatra',
    slug: 'royal-cleopatra',
    description: 'Experience the ultimate luxury on the Nile with our flagship dahabiya, featuring elegant cabins, gourmet dining, and personalized service.',
    shortDescription: 'Luxury dahabiya with private balconies and panoramic views',
    pricePerDay: 1200,
    capacity: 12,
    cabins: 6,
    crew: 8,
    length: 50,
    width: 8,
    yearBuilt: 2020,
    mainImage: '/images/royal-cleopatra/main.jpg',
    gallery: [
      { id: '1', url: '/images/royal-cleopatra/gallery-1.jpg', alt: 'Luxury Cabin' },
      { id: '2', url: '/images/royal-cleopatra/gallery-2.jpg', alt: 'Sun Deck' },
      { id: '3', url: '/images/royal-cleopatra/gallery-3.jpg', alt: 'Dining Area' },
    ],
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

  // In a real app, you would fetch the dahabiya data here
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pale-green-50 to-pale-blue-50">
      <DahabiyaDetail dahabiya={mockDahabiya} />

      {/* Structured Data */}
      <Script
        id="dahabiya-breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
              { "@type": "ListItem", position: 2, name: "Dahabiyas", item: `${baseUrl}/dahabiyas` },
              { "@type": "ListItem", position: 3, name: mockDahabiya.name, item: `${baseUrl}/dahabiyas/${mockDahabiya.slug}` }
            ]
          })
        }}
      />
    </div>
  );
}

// For now, we'll return a single static path
// In a real app, you would fetch this from your database
export async function generateStaticParams() {
  return [
    { slug: 'royal-cleopatra' },
    { slug: 'princess-cleopatra' },
    { slug: 'queen-cleopatra' },
    { slug: 'azhar-i' },
    { slug: 'azhar-ii' }
  ];
}
