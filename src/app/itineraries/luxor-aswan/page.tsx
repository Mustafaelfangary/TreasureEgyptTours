import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Calendar, Users, Star, Camera, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Luxor to Aswan Cruise | Classic Downstream Journey | AltaVida Tours',
  description: 'Experience the classic downstream journey from Luxor to Aswan. Discover ancient temples, royal tombs, and the beauty of the Nile on this iconic cruise route.',
  keywords: 'Luxor to Aswan, downstream cruise, Nile cruise, Egypt temples, Valley of the Kings',
};

export default function LuxorToAswanPage() {
  const itinerary = [
    {
      day: 1,
      title: 'Luxor Arrival',
      activities: ['Arrive in Luxor', 'Visit Karnak Temple', 'Explore Luxor Temple', 'Welcome dinner'],
      highlights: ['Karnak Temple Complex', 'Luxor Temple', 'Nile sunset']
    },
    {
      day: 2,
      title: 'Valley of the Kings',
      activities: ['Visit Valley of the Kings', 'Explore Hatshepsut Temple', 'See Colossi of Memnon', 'Sail to Edfu'],
      highlights: ['Tutankhamun\'s Tomb', 'Hatshepsut Temple', 'Colossi of Memnon']
    },
    {
      day: 3,
      title: 'Edfu & Kom Ombo',
      activities: ['Visit Edfu Temple', 'Sail to Kom Ombo', 'Explore Kom Ombo Temple', 'Continue to Aswan'],
      highlights: ['Edfu Temple', 'Kom Ombo Temple', 'Crocodile Museum']
    },
    {
      day: 4,
      title: 'Aswan Exploration',
      activities: ['Visit Philae Temple', 'Explore Aswan High Dam', 'Sail to Elephantine Island', 'Farewell dinner'],
      highlights: ['Philae Temple', 'Aswan High Dam', 'Elephantine Island']
    }
  ];

  const highlights = [
    {
      icon: MapPin,
      title: 'Historic Route',
      description: 'Follow the ancient path of pharaohs and explorers'
    },
    {
      icon: Camera,
      title: 'Iconic Temples',
      description: 'Visit the most famous temples of ancient Egypt'
    },
    {
      icon: BookOpen,
      title: 'Rich History',
      description: 'Learn about 3,000 years of Egyptian civilization'
    },
    {
      icon: Star,
      title: 'Unforgettable',
      description: 'Create memories that will last a lifetime'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Luxor to Aswan</h1>
              <p className="text-gray-600 mt-2">Classic downstream journey through ancient Egypt</p>
            </div>
            <Link 
              href="/itineraries" 
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Itineraries</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-r from-amber-900 to-orange-700">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Classic Downstream Journey</h2>
            <p className="text-xl mb-6 max-w-2xl">
              Follow the ancient path from Luxor to Aswan, discovering the most magnificent temples 
              and tombs of ancient Egypt along the way.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Clock size={20} />
                <span>4 Days / 3 Nights</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={20} />
                <span>Luxor → Aswan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} />
                <span>Small Groups</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Journey Overview</h2>
              <p className="text-lg text-gray-700 mb-6">
                The Luxor to Aswan route is the most iconic Nile cruise journey, taking you through 
                the heart of ancient Egypt. This downstream journey follows the natural flow of the 
                Nile, allowing you to experience the most significant archaeological sites in comfort.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                From the magnificent temples of Luxor to the beautiful island temples of Aswan, 
                this journey offers an unparalleled opportunity to explore Egypt's rich history 
                while enjoying the comfort and luxury of our dahabiyas.
              </p>
            </section>

            {/* Daily Itinerary */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Daily Itinerary</h3>
              <div className="space-y-6">
                {itinerary.map((day, index) => (
                  <div key={day.day} className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{day.title}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">Activities:</h5>
                            <ul className="space-y-1">
                              {day.activities.map((activity, idx) => (
                                <li key={idx} className="text-gray-700 flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                  <span>{activity}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">Highlights:</h5>
                            <ul className="space-y-1">
                              {day.highlights.map((highlight, idx) => (
                                <li key={idx} className="text-gray-700 flex items-center space-x-2">
                                  <Star className="text-yellow-400" size={16} />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book This Journey</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>4 Days / 3 Nights</option>
                    <option>5 Days / 4 Nights</option>
                    <option>7 Days / 6 Nights</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dahabiya</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>Royal Cleopatra</option>
                    <option>Princess Cleopatra</option>
                    <option>Queen Cleopatra</option>
                    <option>AZHAR I</option>
                    <option>AZHAR II</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Check Availability
                </button>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Choose This Route</h3>
              <div className="space-y-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <highlight.icon className="text-blue-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-semibold text-gray-900">{highlight.title}</h4>
                      <p className="text-sm text-gray-600">{highlight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">4 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-semibold">Downstream</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Temples:</span>
                  <span className="font-semibold">6 Major Sites</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-semibold">Easy</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Time:</span>
                  <span className="font-semibold">Oct - Apr</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Classic Journey?</h2>
          <p className="text-xl mb-6">Book your Luxor to Aswan cruise and experience the magic of ancient Egypt</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Book Now
            </Link>
            <Link 
              href="/itineraries" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View All Itineraries
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
