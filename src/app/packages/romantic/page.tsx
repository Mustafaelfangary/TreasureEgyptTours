import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Heart, Star, Users, Calendar, MapPin, Camera, Utensils } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Romantic Getaways | Perfect Couples Retreat | AltaVida Tours',
  description: 'Create unforgettable memories with our romantic Nile cruise getaways. Perfect couples retreat with luxury amenities and intimate experiences.',
  keywords: 'romantic getaways, couples retreat, honeymoon cruise, romantic Nile cruise, Egypt honeymoon',
};

export default function RomanticGetawaysPage() {
  const packages = [
    {
      name: 'Honeymoon Paradise',
      duration: '7 Days',
      price: 'From $2,500',
      description: 'Ultimate romantic experience with private dinners and couples spa treatments',
      features: ['Private balcony dinners', 'Couples spa treatments', 'Sunset champagne', 'Romantic decorations'],
      image: '/images/packages/honeymoon.jpg'
    },
    {
      name: 'Anniversary Celebration',
      duration: '5 Days',
      price: 'From $1,800',
      description: 'Celebrate your love with special anniversary packages and romantic surprises',
      features: ['Anniversary dinner', 'Romantic room setup', 'Couples massage', 'Memory book'],
      image: '/images/packages/anniversary.jpg'
    },
    {
      name: 'Valentine\'s Special',
      duration: '4 Days',
      price: 'From $1,500',
      description: 'Perfect Valentine\'s Day escape with romantic activities and intimate moments',
      features: ['Valentine\'s dinner', 'Rose petal bath', 'Couples cooking class', 'Romantic gifts'],
      image: '/images/packages/valentine.jpg'
    }
  ];

  const romanticFeatures = [
    {
      icon: Heart,
      title: 'Private Dining',
      description: 'Intimate dinners under the stars with personalized menus'
    },
    {
      icon: Camera,
      title: 'Romantic Photography',
      description: 'Professional couple photos to capture your special moments'
    },
    {
      icon: Utensils,
      title: 'Couples Cooking',
      description: 'Learn to cook traditional Egyptian dishes together'
    },
    {
      icon: Star,
      title: 'Sunset Cruises',
      description: 'Private sunset sailing with champagne and canapés'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Romantic Getaways</h1>
              <p className="text-gray-600 mt-2">Perfect couples retreat on the Nile</p>
            </div>
            <Link 
              href="/packages" 
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Packages</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-r from-pink-900 to-rose-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Perfect Couples Retreat</h2>
            <p className="text-xl mb-6 max-w-2xl">
              Create unforgettable memories with our romantic Nile cruise getaways. 
              Experience intimate luxury, private dining, and magical moments together.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Heart size={20} />
                <span>Couples Only</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star size={20} />
                <span>Romantic Amenities</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>Private Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Romantic Packages */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Romantic Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
                  <Heart size={48} className="text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">{pkg.duration}</span>
                    <span className="text-lg font-bold text-pink-600">{pkg.price}</span>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-center space-x-2">
                          <Heart className="text-pink-500" size={14} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors font-semibold">
                    Book This Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Romantic Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Romantic Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {romanticFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon size={32} className="text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Romantic Getaways */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Romantic Getaways?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Intimate Experience</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Private cabins with romantic decorations</li>
                  <li>• Personal butler service for couples</li>
                  <li>• Intimate dining experiences</li>
                  <li>• Couples-only activities and excursions</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Special Touches</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Rose petal decorations</li>
                  <li>• Champagne and chocolate surprises</li>
                  <li>• Romantic music and ambiance</li>
                  <li>• Memory keepsakes and photos</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Information */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Ready to Create Magic Together?</h2>
            <p className="text-center mb-6">
              Book your romantic getaway and create unforgettable memories on the Nile
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Book Your Romantic Getaway
              </Link>
              <Link 
                href="/packages" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors"
              >
                View All Packages
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
