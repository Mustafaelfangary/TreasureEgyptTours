"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import OptimizedImage from './OptimizedImage';
import Portal from './Portal';
import { 
  ChevronDown, 
  User, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X,
  UserCircle,
  Globe,
  Ship,
  MapPin,
  Package,
  Calendar,
  Camera,
  BookOpen,
  Phone,
  Star,
  Clock,
  Users,
  Heart,
  ArrowRight
} from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';

const LANGUAGES = [
  { code: 'en', label: 'English', flagSvg: '/images/flags/us.svg', name: 'English' },
  { code: 'ar', label: 'العربية', flagSvg: '/images/flags/eg.svg', name: 'العربية' },
  { code: 'fr', label: 'Français', flagSvg: '/images/flags/fr.svg', name: 'Français' },
  { code: 'de', label: 'Deutsch', flagSvg: '/images/flags/de.svg', name: 'Deutsch' },
  { code: 'es', label: 'Español', flagSvg: '/images/flags/es.svg', name: 'Español' },
  { code: 'it', label: 'Italiano', flagSvg: '/images/flags/it.svg', name: 'Italiano' },
  { code: 'ru', label: 'Русский', flagSvg: '/images/flags/ru.svg', name: 'Русский' },
];

export default function TravelOKNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [openViaClick, setOpenViaClick] = useState<string | null>(null);
  const [expandedMobileSections, setExpandedMobileSections] = useState<Record<string, boolean>>({});
  const [logoUrl, setLogoUrl] = useState('/logos/treasureegypttours.svg');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { locale, setLocale } = useLanguage();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [panelPos, setPanelPos] = useState<Record<string, { top: number; left: number; width: number }>>({});
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Fetch logo
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/api/logo', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          const result = await response.json();
          if (result.logoUrl) {
            // Accept absolute URLs as-is; prefix relative filenames with /images/
            const normalizedUrl = result.logoUrl.startsWith('/')
              ? result.logoUrl
              : `/images/${result.logoUrl}`;
            setLogoUrl(normalizedUrl);
          }
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error);
        // Keep the default logo URL
      }
    };
    fetchLogo();
  }, []);

  // Fetch dahabiyas and itineraries for dropdowns
  const [dahabiyasItems, setDahabiyasItems] = useState<Array<{href: string; label: string; description?: string; icon?: string}>>([]);
  const [itinerariesItems, setItinerariesItems] = useState<Array<{href: string; label: string; description?: string; icon?: string}>>([]);
  const [packagesItems, setPackagesItems] = useState<Array<{href: string; label: string; description?: string; icon?: string}>>([]);

  useEffect(() => {
    // Fetch dahabiyas
    fetch('/api/dahabiyas?limit=8&active=true')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.dahabiyas)) {
          const items = data.dahabiyas.map((d: any, index: number) => ({
            href: `/dahabiyas/${d.slug || d.id}`,
            label: d.name,
            description: d.description || `Experience luxury aboard ${d.name}`,
            icon: ['🛥️', '👑', '💎', '⭐', '🌟', '🏺', '🚢', '⛵'][index % 8]
          }));
          setDahabiyasItems(items);
        }
      })
      .catch(() => {});

    // Fetch itineraries
    fetch('/api/itineraries?limit=8')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          const items = data.map((i: any, index: number) => ({
            href: `/itineraries/${i.slug || i.id}`,
            label: i.name,
            description: i.description || `Discover ancient wonders on ${i.name}`,
            icon: ['🏛️', '🌅', '⛵', '🏺', '🕌', '🎭', '🌊', '🏖️'][index % 8]
          }));
          setItinerariesItems(items);
        }
      })
      .catch(() => {});

    // Fetch packages
    fetch('/api/packages?limit=10')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.packages)) {
          const items = data.packages.map((p: any, index: number) => ({
            href: `/packages/${p.slug || p.id}`,
            label: p.name,
            description: p.description || `Complete travel experience with ${p.name}`,
            icon: ['✨', '🏔️', '🏖️', '🏛️', '👨‍👩‍👧‍👦', '💕'][index % 6]
          }));
          setPackagesItems(items);
        }
      })
      .catch(() => {});
  }, []);

  // Enhanced navigation structure with mega dropdown data
  const mainNavItems = [
    {
      id: "dahabiyas",
      label: "DAHABIYAS",
      mainHref: "/dahabiyas",
      icon: Ship,
      description: "Luxury Nile Cruises",
      items: dahabiyasItems.length > 0 ? dahabiyasItems : [
        { label: "Royal Cleopatra", href: "/dahabiyas/royal-cleopatra", description: "Ultimate luxury experience", icon: "👑" },
        { label: "Princess Cleopatra", href: "/dahabiyas/princess-cleopatra", description: "Elegant comfort on the Nile", icon: "💎" },
        { label: "Queen Cleopatra", href: "/dahabiyas/queen-cleopatra", description: "Regal sailing experience", icon: "⭐" },
        { label: "AZHAR I", href: "/dahabiyas/azhar-i", description: "Traditional charm meets modern luxury", icon: "🌟" },
        { label: "AZHAR II", href: "/dahabiyas/azhar-ii", description: "Contemporary elegance on water", icon: "🛥️" },
      ],
      featured: [
        { label: "All Dahabiyas", href: "/dahabiyas", icon: Ship },
        { label: "Compare Vessels", href: "/dahabiyas/compare", icon: Users },
        { label: "Virtual Tours", href: "/dahabiyas/virtual-tours", icon: Camera }
      ]
    },
    {
      id: "itineraries",
      label: "ITINERARIES",
      mainHref: "/itineraries",
      icon: MapPin,
      description: "Nile Cruise Routes",
      items: itinerariesItems.length > 0 ? itinerariesItems : [
        { label: "Luxor to Aswan", href: "/itineraries/luxor-aswan", description: "Classic downstream journey", icon: "🏛️" },
        { label: "Aswan to Luxor", href: "/itineraries/aswan-luxor", description: "Upstream adventure", icon: "🌅" },
        { label: "3-Day Short Cruise", href: "/itineraries/short-cruise", description: "Perfect weekend getaway", icon: "⛵" },
        { label: "7-Day Extended Cruise", href: "/itineraries/extended-cruise", description: "Complete Nile experience", icon: "🏺" },
        { label: "Temples & Tombs Tour", href: "/itineraries/temples-tour", description: "Archaeological exploration", icon: "🕌" },
        { label: "Cultural Immersion", href: "/itineraries/cultural-immersion", description: "Authentic local experiences", icon: "🎭" },
      ],
      featured: [
        { label: "All Itineraries", href: "/itineraries", icon: MapPin },
        { label: "Route Map", href: "/itineraries/map", icon: Globe },
        { label: "Best Time to Travel", href: "/itineraries/best-time", icon: Calendar }
      ]
    },
    {
      id: "packages",
      label: "PACKAGES",
      mainHref: "/packages",
      icon: Package,
      description: "Complete Travel Solutions",
      items: packagesItems.length > 0 ? packagesItems : [
        { label: "Luxury Escapes", href: "/packages/luxury", description: "Premium all-inclusive experiences", icon: "✨" },
        { label: "Family Vacations", href: "/packages/family", description: "Fun-filled family adventures", icon: "👨‍👩‍👧‍👦" },
        { label: "Cultural Journeys", href: "/packages/cultural", description: "Deep dive into Egyptian culture", icon: "🏛️" },
        { label: "Adventure Tours", href: "/packages/adventure", description: "Thrilling exploration experiences", icon: "🏔️" },
        { label: "Romantic Getaways", href: "/packages/romantic", description: "Perfect couples retreat", icon: "💕" },
        { label: "Beach Extensions", href: "/packages/beach", description: "Red Sea relaxation", icon: "🏖️" },
      ],
      featured: [
        { label: "All Packages", href: "/packages", icon: Package },
        { label: "Custom Tours", href: "/custom-tours", icon: Heart },
        { label: "Group Bookings", href: "/packages/groups", icon: Users }
      ]
    }
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updatePanelPosition = (itemId: string) => {
    const btn = triggerRefs.current[itemId];
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const top = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;
    const width = rect.width;
    setPanelPos(prev => ({ ...prev, [itemId]: { top, left, width } }));
  };

  const openDropdown = (itemId: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    updatePanelPosition(itemId);
    setActiveDropdown(itemId);
  };

  const scheduleCloseDropdown = (delay = 250) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setOpenViaClick(null);
    }, delay);
  };

  const toggleDropdownClick = (itemId: string) => {
    if (activeDropdown === itemId && openViaClick === itemId) {
      setActiveDropdown(null);
      setOpenViaClick(null);
    } else {
      setActiveDropdown(itemId);
      setOpenViaClick(itemId);
    }
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const inNavbar = !!containerRef.current && containerRef.current.contains(target);
      const inPortal = !!portalRef.current && portalRef.current.contains(target);
      if (!inNavbar && !inPortal) {
        setActiveDropdown(null);
        setOpenViaClick(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (activeDropdown) updatePanelPosition(activeDropdown);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, { passive: true } as any);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize as any);
    };
  }, [activeDropdown]);

  const onKeyDownTopItem = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdownClick(itemId);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      openDropdown(itemId);
    } else if (e.key === 'Escape') {
      setActiveDropdown(null);
      setOpenViaClick(null);
    }
  };

  const toggleMobileSection = (id: string) => {
    setExpandedMobileSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {/* Modern Top Bar with Language Selector */}
      <div className={`bg-gradient-to-r from-blue-600 to-blue-700 text-white hidden lg:block transition-all duration-300 ${scrolled ? 'py-1' : 'py-1.5'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-[13px] font-medium hover:text-orange-300 transition-colors duration-200">
                  <Image
                    src={LANGUAGES.find(l => l.code === locale)?.flagSvg || '/images/flags/us.svg'}
                    alt="Language"
                    width={20}
                    height={14}
                    className="rounded-sm shadow-sm"
                  />
                  <span>{LANGUAGES.find(l => l.code === locale)?.label || 'English'}</span>
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 mt-2 bg-white text-gray-800 rounded-lg shadow-xl py-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLocale(lang.code as any)}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center space-x-3 transition-colors duration-150 text-[13px]"
                    >
                      <Image src={lang.flagSvg} alt={lang.name} width={20} height={14} className="rounded-sm" />
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="flex items-center space-x-5 text-[13px]">
                <Link href="/contact" className="hover:text-orange-300 transition-colors duration-200 font-medium">
                  Contact Us
                </Link>
                <Link href="/about" className="hover:text-orange-300 transition-colors duration-200 font-medium">
                  About Us
                </Link>
                <Link href="/blog" className="hover:text-orange-300 transition-colors duration-200 font-medium">
                  Travel Blog
                </Link>
              </div>
            </div>
            
            {/* Right side info */}
            <div className="flex items-center space-x-5 text-[13px]">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="font-medium">+20 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Main Navigation */}
      <nav className={`bg-white shadow-lg relative z-40 transition-all duration-300 ${scrolled ? 'shadow-xl' : 'shadow-md'}`} ref={containerRef} style={{ overflow: 'visible' }}>
        <div className="max-w-7xl mx-auto" style={{ overflow: 'visible' }}>
          <div className="flex items-center justify-between" style={{ overflow: 'visible' }}>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-4 text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Home Link */}
            <Link 
              href="/" 
              className="hidden lg:block px-5 py-3.5 text-[13px] font-bold text-blue-600 hover:bg-blue-50 transition-colors duration-200 border-r border-gray-200"
            >
              HOME
            </Link>

            {/* Navigation Items - Desktop */}
            <div className="hidden lg:flex items-center flex-1 justify-start overflow-x-auto whitespace-nowrap pr-2" style={{ overflow: 'visible' }}>
              {mainNavItems.map((item) => (
                <div 
                  key={item.id} 
                  className="relative dropdown-container"
                  style={{ overflow: 'visible' }}
                  onPointerEnter={() => openDropdown(item.id)}
                  onPointerLeave={(e) => {
                    if (openViaClick === item.id) return; // don't auto-close if opened via click
                    scheduleCloseDropdown(300);
                  }}
                >
                  <button
                    ref={(el) => { triggerRefs.current[item.id] = el; }}
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === item.id}
                    aria-controls={`mega-${item.id}`}
                    onClick={() => toggleDropdownClick(item.id)}
                    onKeyDown={(e) => onKeyDownTopItem(e, item.id)}
                    className={`px-5 py-3.5 text-[13px] font-bold transition-all duration-200 border-r border-gray-200 flex items-center space-x-2 ${
                      activeDropdown === item.id || isActive(item.mainHref)
                        ? 'bg-blue-600 text-white' 
                        : 'text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Enhanced Mega Dropdown Menu via Portal */}
                  {activeDropdown === item.id && item.items.length > 0 && panelPos[item.id] && (
                    <Portal>
                      <div ref={portalRef} className="pointer-events-auto" style={{ position: 'absolute', top: panelPos[item.id].top, left: panelPos[item.id].left, zIndex: 1000 }}
                        onPointerEnter={() => openDropdown(item.id)}
                        onPointerLeave={() => {
                          if (openViaClick === item.id) return;
                          scheduleCloseDropdown(300);
                        }}
                      >
                        {/* Hover bridge under trigger */}
                        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: panelPos[item.id].width, height: 10 }} />
                        <div 
                          id={`mega-${item.id}`}
                          role="menu"
                          className="bg-white border border-gray-200 shadow-2xl min-w-[800px] rounded-lg overflow-hidden"
                          style={{ position: 'absolute', top: 10, left: 0 }}
                        >
                          <div className="p-5">
                            {/* Header */}
                            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <item.icon size={24} className="text-blue-600" />
                              </div>
                              <div>
                                <h3 className="text-[15px] font-bold text-gray-900 leading-tight">{item.label}</h3>
                                <p className="text-[13px] text-gray-600">{item.description}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                              {/* Main Items */}
                              <div className="col-span-2">
                                <h4 className="text-[12px] font-semibold text-gray-900 mb-3 uppercase tracking-wide">Popular Options</h4>
                                <div className="space-y-2">
                                  {item.items.slice(0, 6).map((subItem, index) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                                      className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-200"
                            >
                                      <span className="text-lg mt-0.5">{subItem.icon}</span>
                                      <div className="flex-1">
                                        <div className="font-medium text-[14px] text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                              {subItem.label}
                                        </div>
                                        <div className="text-[13px] text-gray-600 mt-1">
                                          {subItem.description}
                                        </div>
                                      </div>
                                      <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors duration-200 mt-1" />
                                    </Link>
                                  ))}
                                </div>
                              </div>

                              {/* Featured Links */}
                              <div className="col-span-1">
                                <h4 className="text-[12px] font-semibold text-gray-900 mb-3 uppercase tracking-wide">Quick Access</h4>
                                <div className="space-y-2">
                                  {item.featured.map((featured, index) => (
                                    <Link
                                      key={featured.href}
                                      href={featured.href}
                                      className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-all duration-200"
                                    >
                                      <featured.icon size={18} className="text-orange-500" />
                                      <span className="font-medium text-[14px] text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                                        {featured.label}
                                      </span>
                            </Link>
                          ))}
                                </div>
                                
                                {/* View All Link */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                  <Link
                                    href={item.mainHref}
                                    className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-[13px]"
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      setOpenViaClick(null);
                                    }}
                                  >
                                    <span>View All {item.label}</span>
                                    <ArrowRight size={16} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Portal>
                  )}
                </div>
              ))}

              {/* Desktop search */}
              <form
                onSubmit={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(query.trim())}`); }}
                className="ml-4 mr-2 flex items-center bg-gray-100 rounded-md border border-gray-200 px-3 py-2"
                role="search"
                aria-label="Site search"
              >
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Search destinations, tours..."
                  className="bg-transparent outline-none text-[13px] placeholder:text-gray-400 w-56"
                />
              </form>

              {/* Additional Links */}
              <Link
                href="/gallery"
                className="px-5 py-3.5 text-[13px] font-bold text-blue-600 hover:bg-blue-50 transition-colors duration-200 border-r border-gray-200 flex items-center space-x-2"
              >
                <Camera size={16} />
                <span>GALLERY</span>
              </Link>
            </div>

            {/* Center Logo */}
            <div className="flex-shrink-0 px-6 lg:px-8 py-2 lg:border-x border-gray-200">
              <Link href="/" className="flex items-center">
                <OptimizedImage 
                  src={logoUrl} 
                  alt="Treasure Egypt Tours" 
                  width={140}
                  height={45}
                  className="h-10 lg:h-12 w-auto transition-all duration-300"
                  priority={true}
                  quality={90}
                />
              </Link>
            </div>

            {/* Right Side Links - Desktop */}
            <div className="hidden lg:flex items-center">
              <Link
                href="/blog"
                className="px-5 py-3.5 text-[13px] font-bold text-blue-600 hover:bg-blue-50 transition-colors duration-200 border-l border-gray-200 flex items-center space-x-2"
              >
                <BookOpen size={16} />
                <span>BLOG</span>
              </Link>
              <Link
                href="/contact"
                className="px-5 py-3.5 text-[13px] font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Phone size={16} />
                <span>CONTACT</span>
              </Link>

              {/* Auth Section */}
              {session ? (
                <div className="relative group px-4">
                  <button className="flex items-center space-x-2 text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
                    <UserCircle size={20} />
                    <span className="hidden xl:inline">{session.user?.name || 'Account'}</span>
                    <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link href="/profile" className="flex items-center space-x-2 px-4 py-2 text-[13px] text-gray-700 hover:bg-blue-50 transition-colors duration-150">
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    {session.user?.role === 'ADMIN' && (
                      <Link href="/admin" className="flex items-center space-x-2 px-4 py-2 text-[13px] text-gray-700 hover:bg-blue-50 transition-colors duration-150">
                        <LayoutDashboard size={16} />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-red-50 flex items-center space-x-2 transition-colors duration-150">
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="px-5 py-3.5 text-[13px] font-bold text-blue-600 hover:bg-blue-50 transition-colors duration-200 border-l border-gray-200 flex items-center space-x-2"
                >
                  <User size={18} />
                  <span>SIGN IN</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 w-full max-w-sm bg-white shadow-2xl h-full overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b bg-blue-600 text-white">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="py-2">
              <div className="px-4 pt-3 pb-2 border-b">
                <form
                  onSubmit={(e) => { e.preventDefault(); setMobileMenuOpen(false); router.push(`/search?q=${encodeURIComponent(query.trim())}`); }}
                  role="search"
                  aria-label="Site search"
                  className="flex items-center bg-gray-100 rounded-md border border-gray-200 px-3 py-2"
                >
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="search"
                    placeholder="Search destinations, tours..."
                    className="bg-transparent outline-none text-sm placeholder:text-gray-400 w-full"
                  />
                </form>
              </div>
              <Link href="/" className="block px-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                HOME
              </Link>
              {mainNavItems.map((item) => (
                <div key={item.id} className="border-b">
                  <button
                    className="w-full flex items-center justify-between px-6 py-3 font-bold text-blue-600 bg-gray-50"
                    onClick={() => toggleMobileSection(item.id)}
                  >
                    <span className="flex items-center space-x-2">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </span>
                    <ChevronDown size={18} className={`${expandedMobileSections[item.id] ? 'rotate-180' : ''} transition-transform`} />
                  </button>
                  {expandedMobileSections[item.id] && (
                    <div className="pb-2">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="flex items-center space-x-2 px-8 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span>{subItem.icon}</span>
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                      <Link
                        href={item.mainHref}
                        className="flex items-center space-x-2 px-8 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <ArrowRight size={16} />
                        <span>View All {item.label}</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
              {/* Mobile Auth Link */}
              <Link
                href="/auth/signin"
                className="block px-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                SIGN IN
              </Link>
              
              <Link href="/gallery" className="block px-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                GALLERY
              </Link>
              <Link href="/blog" className="block px-6 py-3 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors duration-200" onClick={() => setMobileMenuOpen(false)}>
                BLOG
              </Link>
              <Link href="/contact" className="block px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600" onClick={() => setMobileMenuOpen(false)}>
                CONTACT
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}