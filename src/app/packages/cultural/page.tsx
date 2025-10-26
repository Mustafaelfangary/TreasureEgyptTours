'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Calendar, Star, Scroll, Landmark, Camera, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

interface CulturalPackage {
  id: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  price: number;
  durationDays: number;
  maxGuests?: number;
  highlights: string[];
  mainImageUrl?: string;
  featured: boolean;
  category: string;
}

const culturalGalleryImages = [
  {
    src: '/images/destinations/karnak-temple.jpg',
    alt: 'Ancient Egyptian Temple',
    title: 'Temple Explorations'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8559.jpg',
    alt: 'Hieroglyphic Studies',
    title: 'Ancient Scripts'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8569.jpg',
    alt: 'Archaeological Site',
    title: 'Historical Sites'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8581.jpg',
    alt: 'Egyptian Museum Tour',
    title: 'Museum Collections'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8593.jpg',
    alt: 'Traditional Crafts',
    title: 'Local Artisans'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8608.jpg',
    alt: 'Cultural Performance',
    title: 'Folk Traditions'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8614.jpg',
    alt: 'Ancient Architecture',
    title: 'Architectural Marvels'
  },
  {
    src: '/images/Royal Cleopatra/DSC_8623.jpg',
    alt: 'Cultural Workshop',
    title: 'Learning Experiences'
  }
];

export default function CulturalPackagesPage() {
  const [packages, setPackages] = useState<CulturalPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    const fetchCulturalPackages = async () => {
      try {
        const response = await fetch('/api/packages?category=cultural&featured=true');
        if (response.ok) {
          const data = await response.json();
          setPackages(data.packages || []);
        }
      } catch (error) {
        console.error('Error fetching cultural packages:', error);
        // Fallback cultural packages
        const fallbackPackages: CulturalPackage[] = [
          {
            id: '1',
            name: 'Pharaohs & Civilization',
            description: 'Comprehensive cultural immersion exploring ancient Egyptian civilization through temples, museums, and archaeological sites with expert Egyptologists.',
            price: 2450,
            durationDays: 9,
            maxGuests: 12,
            highlights: ['Expert Egyptologists', 'Museum Access', 'Archaeological Sites', 'Hieroglyph Workshops', 'Traditional Crafts'],
            mainImageUrl: '/images/destinations/karnak-temple.jpg',
            featured: true,
            category: 'cultural'
          },
          {
            id: '2',
            name: 'Living Heritage Journey',
            description: 'Deep dive into Egyptian culture through local communities, traditional crafts, folk music, and authentic cultural exchanges.',
            price: 1950,
            durationDays: 7,
            maxGuests: 10,
            highlights: ['Community Visits', 'Traditional Crafts', 'Folk Music', 'Cooking Classes', 'Language Lessons'],
            mainImageUrl: '/images/Royal Cleopatra/DSC_8593.jpg',
            featured: true,
            category: 'cultural'
          },
          {
            id: '3',
            name: 'Archaeological Discovery',
            description: 'Educational journey focusing on ongoing archaeological discoveries, excavation techniques, and ancient preservation methods.',
            price: 2750,
            durationDays: 10,
            maxGuests: 8,
            highlights: ['Excavation Sites', 'Conservation Labs', 'Research Centers', 'Artifact Studies', 'Digital Archaeology'],
            mainImageUrl: '/images/Royal Cleopatra/DSC_8569.jpg',
            featured: true,
            category: 'cultural'
          }
        ];
        setPackages(fallbackPackages);
      } finally {
        setLoading(false);
      }
    };

    fetchCulturalPackages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
          <div className="text-blue-800 text-xl font-bold">Loading Cultural Experiences...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <UnifiedHero
        imageSrc="/images/destinations/karnak-temple.jpg"
        title="Cultural Packages"
        subtitle="Immerse Yourself in Ancient Egyptian Civilization & Living Heritage"
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        showRoyalCrown={false}
        showHieroglyphics={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
        mobileMinHeight="60vh"
      >
        <div className="text-center max-w-4xl mx-auto text-gray-900">
          <div className="flex justify-center mb-6">
            <BookOpen className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            Discover the rich tapestry of Egyptian civilization through immersive cultural experiences. From ancient 
            temples to living traditions, explore Egypt&apos;s heritage with expert guides and authentic encounters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg min-h-[48px]">
              <Scroll className="w-5 h-5 mr-2" />
              Explore Culture
            </Button>
            <Button variant="outline" className="border-blue-600 text-blue-800 hover:bg-blue-50 px-6 py-3 rounded-lg min-h-[48px]">
              <Globe className="w-5 h-5 mr-2" />
              Educational Tours
            </Button>
          </div>
        </div>
      </UnifiedHero>

      {/* Cultural Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Cultural <span className="text-blue-600">Immersion</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Engage with Egypt&apos;s living culture through authentic experiences that connect past and present.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
            {[
              { icon: Landmark, title: 'Historic Sites', desc: 'Visit temples, tombs, and monuments with expert guides' },
              { icon: Scroll, title: 'Ancient Knowledge', desc: 'Learn hieroglyphs, mythology, and Egyptian history' },
              { icon: Camera, title: 'Living Culture', desc: 'Experience traditional crafts, music, and customs' },
              { icon: Globe, title: 'Educational Focus', desc: 'University-level content with archaeological insights' }
            ].map((feature, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 border-blue-200">
                  <CardContent className="pt-6">
                    <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural Gallery Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Cultural <span className="text-blue-600">Gallery</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Explore the rich cultural heritage through temples, artifacts, and living traditions that define Egypt.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {culturalGalleryImages.map((image, index) => (
              <AnimatedSection key={index} delay={index * 50}>
                <div 
                  className="relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <BookOpen className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-semibold">{image.title}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Gallery Modal */}
          {selectedImage !== null && (
            <div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-4xl max-h-full">
                <Image
                  src={culturalGalleryImages[selectedImage].src}
                  alt={culturalGalleryImages[selectedImage].alt}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
                <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                  <h3 className="text-xl font-bold">{culturalGalleryImages[selectedImage].title}</h3>
                </div>
                <Button
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Cultural Packages Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Featured <span className="text-blue-600">Cultural Packages</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <AnimatedSection key={pkg.id} delay={index * 100}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-blue-200">
                  <div className="relative h-64">
                    <Image
                      src={pkg.mainImageUrl || '/images/placeholder-cultural.jpg'}
                      alt={pkg.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      <BookOpen className="w-4 h-4 inline mr-1" />
                      Cultural
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{pkg.description}</p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {pkg.durationDays} Days
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Up to {pkg.maxGuests} Guests
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        From ${pkg.price.toLocaleString()}
                      </div>
                      <Link href={`/packages/${pkg.slug || pkg.id}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
