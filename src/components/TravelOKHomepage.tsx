"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { packages } from '@/data/packages';
import { destinations } from '@/data/destinations';

export default function TravelOKHomepage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen sm:h-screen lg:h-screen bg-gradient-to-b from-blue-900 to-blue-700" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div className="absolute inset-0">
          <Image
            src="/images/images/Royal Cleopatra/DSC_8502.jpg"
            alt="Egyptian Nile Cruise"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            DISCOVER EGYPT
          </h1>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl mb-6 sm:mb-8 font-light leading-relaxed">
            Land of Pharaohs & Ancient Wonders
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-3xl leading-relaxed px-4 sm:px-0">
            Journey through 5,000 years of history. From the Great Pyramids to bustling bazaars, 
            experience the magic and mystery of Egypt with our expertly crafted tours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:px-0">
            <Link 
              href="/tours"
              className="bg-travelok-orange hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors text-center min-h-[48px] flex items-center justify-center"
            >
              EXPLORE TOURS
            </Link>
            <Link 
              href="/attractions"
              className="border-2 border-white text-white hover:bg-white hover:text-travelok-blue px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-colors text-center min-h-[48px] flex items-center justify-center"
            >
              VIEW ATTRACTIONS
            </Link>
          </div>
        </div>
      </div>

      {/* Things To Do Section */}
      <div className="bg-travelok-blue text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-4">
            <h2 className="text-2xl font-bold tracking-wider">THINGS TO DO</h2>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-travelok-blue-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 py-6">
            <Link 
              href="/attractions/pyramids" 
              className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-4 sm:p-6 text-center rounded-lg min-h-[100px] flex flex-col items-center justify-center"
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🔺</div>
              <div className="font-bold text-xs sm:text-sm">PYRAMIDS</div>
              <div className="font-bold text-xs sm:text-sm">& SPHINX</div>
            </Link>
            
            <Link 
              href="/attractions/temples" 
              className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">🏛️</div>
              <div className="font-bold text-sm">ANCIENT</div>
              <div className="font-bold text-sm">TEMPLES</div>
            </Link>
            
            <Link 
              href="/attractions/museums" 
              className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">🏺</div>
              <div className="font-bold text-sm">MUSEUMS</div>
              <div className="font-bold text-sm">& ARTIFACTS</div>
            </Link>
            
            <Link 
              href="/experiences/desert" 
              className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">🐪</div>
              <div className="font-bold text-sm">DESERT</div>
              <div className="font-bold text-sm">SAFARI</div>
            </Link>
            
            <Link 
              href="/experiences/diving" 
              className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">🤿</div>
              <div className="font-bold text-sm">RED SEA</div>
              <div className="font-bold text-sm">DIVING</div>
            </Link>
            
            <Link 
              href="/hotels/nile-cruises" 
              className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">⛵</div>
              <div className="font-bold text-sm">NILE</div>
              <div className="font-bold text-sm">CRUISES</div>
            </Link>
            
            <Link 
              href="/experiences/cultural" 
              className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">🎭</div>
              <div className="font-bold text-sm">CULTURAL</div>
              <div className="font-bold text-sm">TOURS</div>
            </Link>
            
            <Link 
              href="/experiences/food" 
              className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-6 text-center rounded-lg"
            >
              <div className="text-3xl mb-2">🍽️</div>
              <div className="font-bold text-sm">EGYPTIAN</div>
              <div className="font-bold text-sm">CUISINE</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Packages Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-travelok-blue mb-4">
              FEATURED <span className="border-b-4 border-travelok-orange px-2">TOUR</span> PACKAGES
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular Egypt tour packages, carefully crafted to give you the best experience of this magnificent country.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {packages.slice(0, 6).map((pkg, index) => {
              // Use available images from the Royal Cleopatra collection
              const packageImages = [
                '/images/packages-gallery-1.jpg',
                '/images/packages-gallery-2.jpg', 
                '/images/packages-gallery-3.jpg',
                '/images/Royal Cleopatra/DSC_8627.jpg',
                '/images/Royal Cleopatra/DSC_8733.jpg',
                '/images/Royal Cleopatra/DSC_8848.jpg'
              ];
              return (
              <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={packageImages[index] || pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = pkg.image;
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-travelok-orange text-white px-3 py-1 rounded-full text-sm font-bold">
                    {pkg.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-travelok-blue mb-2">{pkg.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{pkg.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">Highlights:</div>
                    <div className="flex flex-wrap gap-1">
                      {pkg.highlights.slice(0, 3).map((highlight, index) => (
                        <span key={index} className="bg-blue-100 text-travelok-blue px-2 py-1 rounded text-xs">
                          {highlight}
                        </span>
                      ))}
                      {pkg.highlights.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{pkg.highlights.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-travelok-orange">
                      From ${pkg.price.from}
                    </div>
                    <Link 
                      href={`/packages/${pkg.id}`}
                      className="bg-travelok-blue hover:bg-travelok-orange text-white px-4 py-2 rounded transition-colors text-sm font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/packages"
              className="bg-travelok-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-block"
            >
              View All Packages
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Article Section */}
      <div className="bg-travelok-orange text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-4">
            <h2 className="text-2xl font-bold tracking-wider">FEATURED EXPERIENCE</h2>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <Image
                src="/images/images/Royal Cleopatra/DSC_8568.jpg"
                alt="Luxury Dahabiya Cruise"
                width={600}
                height={400}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <h3 className="text-2xl font-bold text-travelok-blue mb-4">
                Egypt: The Ultimate Travel Destination
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                From the iconic Pyramids of Giza to the vibrant coral reefs of the Red Sea, 
                Egypt offers an incredible diversity of experiences. Explore ancient pharaonic 
                treasures, dive into crystal-clear waters, and immerse yourself in a culture 
                that spans millennia.
              </p>
              <Link 
                href="/tours/classic"
                className="inline-block bg-travelok-blue text-white px-6 py-3 rounded hover:bg-travelok-orange transition-colors font-semibold"
              >
                Explore Tours
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Discover Egypt Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-travelok-blue mb-4">
              DISCOVER <span className="border-b-4 border-travelok-orange px-2">ANCIENT</span> EGYPT
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {destinations.slice(0, 8).map((destination, index) => {
              // Use available destination images
              const destinationImages = [
                '/images/destinations/karnak-temple.jpg',
                '/images/Royal Cleopatra/DSC_8502.jpg',
                '/images/Royal Cleopatra/DSC_8568.jpg',
                '/images/experiences/sunset-sailing.jpg',
                '/images/Royal Cleopatra/DSC_8628.jpg',
                '/images/Royal Cleopatra/DSC_8735.jpg',
                '/images/Royal Cleopatra/DSC_8750.jpg',
                '/images/Royal Cleopatra/DSC_8848.jpg'
              ];
              return (
              <div key={destination.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <Image
                    src={destinationImages[index] || destination.image}
                    alt={destination.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = destination.image || '/images/placeholder-travel.jpg';
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-travelok-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {destination.region}
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded">
                    <div className="text-sm font-semibold">{destination.name}</div>
                    <div className="text-xs opacity-90 flex items-center gap-1">
                      📍 {destination.highlights[0]}
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/articles" 
              className="inline-block bg-travelok-blue text-white px-8 py-4 text-lg font-semibold rounded hover:bg-travelok-orange transition-colors"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </div>

      {/* State Parks Section */}
      <div className="bg-travelok-orange text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-3">
            <h2 className="text-xl font-bold tracking-wider">DESTINATIONS</h2>
          </div>
        </div>
      </div>

      <div className="bg-travelok-blue-dark py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            <Link href="/find-destination" className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-3 sm:p-4 text-center rounded min-h-[80px] flex flex-col items-center justify-center">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📍</div>
              <div className="text-xs font-bold leading-tight">FIND A</div>
              <div className="text-xs font-bold leading-tight">DESTINATION</div>
            </Link>
            
            <Link href="/book-hotel" className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-4 text-center rounded">
              <div className="text-2xl mb-2">🏨</div>
              <div className="text-xs font-bold">BOOK A HOTEL</div>
              <div className="text-xs font-bold">OR LODGE</div>
            </Link>
            
            <Link href="/book-event" className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-4 text-center rounded">
              <div className="text-2xl mb-2">🎪</div>
              <div className="text-xs font-bold">BOOK AN</div>
              <div className="text-xs font-bold">EVENT</div>
            </Link>
            
            <Link href="/book-cruise" className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-4 text-center rounded">
              <div className="text-2xl mb-2">🚢</div>
              <div className="text-xs font-bold">BOOK A</div>
              <div className="text-xs font-bold">CRUISE</div>
            </Link>
            
            <Link href="/events" className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-4 text-center rounded">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-xs font-bold">DESTINATION</div>
              <div className="text-xs font-bold">EVENTS</div>
            </Link>
            
            <Link href="/app" className="bg-travelok-blue hover:bg-travelok-orange transition-colors text-white p-4 text-center rounded">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-xs font-bold">ALTAVIDA APP</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Content */}
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <h3 className="text-2xl font-bold text-travelok-blue mb-6">
              Ancient Egyptian Heritage Sites
            </h3>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/images/images/destinations/karnak-temple.jpg"
                alt="Ancient Egyptian Heritage Sites"
                width={600}
                height={300}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder-landscape.jpg';
                }}
              />
              <div className="p-6">
                <div className="text-sm text-gray-600 mb-2">📍 Karnak Temple Complex, Luxor</div>
                <p className="text-gray-700">
                  Explore the magnificent ancient Egyptian temple complex, one of the largest religious buildings ever constructed.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-travelok-blue mb-6">
              Nile River Experiences
            </h3>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="/images/images/experiences/sunset-sailing.jpg"
                alt="Nile River Experiences"
                width={600}
                height={300}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder-fishing.jpg';
                }}
              />
              <div className="p-6">
                <p className="text-gray-700">
                  Experience the magic of the Nile River with sunset sailing, traditional felucca rides, and luxury dahabiya cruises.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
