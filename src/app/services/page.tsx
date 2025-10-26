'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Calendar, Users, ArrowRight, Compass, Sparkles, Heart, Mountain } from 'lucide-react';
import UnifiedHero from '@/components/ui/UnifiedHero';
import { AnimatedSection } from '@/components/ui/animated-section';

const serviceCategories = [
  {
    id: 'adventure-tours',
    name: 'Adventure Tours',
    icon: '🏔️',
    description: 'Experience heart-pumping adventures from mountain climbing to desert expeditions and extreme sports.',
    image: '/images/Royal Cleopatra/DSC_8750.jpg',
    services: ['Mountain Climbing', 'Desert Safari', 'Extreme Sports', 'Wildlife Expeditions'],
    highlights: ['Adrenaline Rush', 'Expert Guides', 'Safety First', 'Unique Experiences'],
    color: 'orange',
    pricing: 'From $800'
  },
  {
    id: 'cultural-experiences',
    name: 'Cultural Experiences',
    icon: '🏛️',
    description: 'Immerse yourself in local cultures, traditions, and historic sites with expert cultural guides.',
    image: '/images/destinations/karnak-temple.jpg',
    services: ['Historical Tours', 'Local Immersion', 'Art & Museums', 'Traditional Workshops'],
    highlights: ['Authentic Culture', 'Local Experts', 'Educational', 'Heritage Sites'],
    color: 'blue',
    pricing: 'From $600'
  },
  {
    id: 'luxury-travel',
    name: 'Luxury Travel',
    icon: '✨',
    description: 'Indulge in premium accommodations, fine dining, and exclusive experiences tailored for discerning travelers.',
    image: '/images/Royal Cleopatra/DSC_8502.jpg',
    services: ['5-Star Hotels', 'Private Jets', 'Exclusive Access', 'Personal Concierge'],
    highlights: ['Ultimate Comfort', 'Premium Service', 'Exclusive Access', 'Personalized'],
    color: 'amber',
    pricing: 'From $2,500'
  },
  {
    id: 'family-vacations',
    name: 'Family Vacations',
    icon: '👨‍👩‍👧‍👦',
    description: 'Create lasting memories with family-friendly activities, accommodations, and experiences for all ages.',
    image: '/images/Royal Cleopatra/DSC_8625.jpg',
    services: ['Kids Activities', 'Family Hotels', 'Educational Tours', 'Safe Adventures'],
    highlights: ['All Ages Fun', 'Safe Environment', 'Educational', 'Memory Making'],
    color: 'pink',
    pricing: 'From $400'
  }
];

export default function ServicesPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getColorClasses = (color: string) => {
    const colors = {
      orange: { bg: 'from-orange-500 to-orange-600', border: 'border-orange-200', text: 'text-orange-600', button: 'bg-orange-600 hover:bg-orange-700' },
      blue: { bg: 'from-blue-500 to-blue-600', border: 'border-blue-200', text: 'text-blue-600', button: 'bg-blue-600 hover:bg-blue-700' },
      amber: { bg: 'from-amber-500 to-amber-600', border: 'border-amber-200', text: 'text-amber-600', button: 'bg-amber-600 hover:bg-amber-700' },
      pink: { bg: 'from-pink-500 to-pink-600', border: 'border-pink-200', text: 'text-pink-600', button: 'bg-pink-600 hover:bg-pink-700' }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-blue-50">
      <UnifiedHero
        imageSrc="/images/Royal Cleopatra/DSC_8568.jpg"
        title="Travel Services"
        subtitle="Comprehensive Travel Solutions Tailored to Your Perfect Journey"
        hieroglyphicTitle={false}
        showEgyptianElements={true}
        overlayOpacity="medium"
        textColor="dark"
        minHeight="80vh"
      >
        <div className="text-center max-w-4xl mx-auto text-gray-900">
          <div className="flex justify-center mb-6">
            <Compass className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-lg sm:text-xl mb-8 leading-relaxed px-4 sm:px-0">
            From adventure seekers to luxury travelers, families to cultural enthusiasts - discover our 
            comprehensive range of travel services designed to create unforgettable experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Explore Services
            </Button>
            <Button variant="outline" className="border-blue-600 text-blue-800 hover:bg-blue-50 px-6 py-3 rounded-lg">
              <Users className="w-5 h-5 mr-2" />
              Custom Planning
            </Button>
          </div>
        </div>
      </UnifiedHero>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Travel <span className="text-blue-600">Services</span>
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Choose from our specialized travel services, each designed to cater to different travel styles and preferences.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {serviceCategories.map((service, index) => {
              const colors = getColorClasses(service.color);
              return (
                <AnimatedSection key={service.id} delay={index * 100}>
                  <Card 
                    className={`overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${colors.border} cursor-pointer`}
                    onMouseEnter={() => setHoveredCard(service.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="relative h-64">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover transition-transform duration-500"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${colors.bg} opacity-70`}></div>
                      <div className="absolute top-4 left-4 text-4xl">
                        {service.icon}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                        <p className="text-sm opacity-90">{service.pricing}</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {service.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Our Services:</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.services.map((item, idx) => (
                            <span key={idx} className={`${colors.text} text-xs px-3 py-1 rounded-full border ${colors.border} bg-gray-50`}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
                        <div className="flex flex-wrap gap-1">
                          {service.highlights.map((highlight, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <Link href={`/services/${service.id}`}>
                        <Button 
                          className={`w-full ${colors.button} text-white transition-all duration-300 ${
                            hoveredCard === service.id ? 'transform scale-105' : ''
                          }`}
                        >
                          <span>Explore {service.name}</span>
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Plan Your Perfect Trip?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Let our travel experts help you choose the perfect services for your dream vacation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Start Planning
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg">
                <Users className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
