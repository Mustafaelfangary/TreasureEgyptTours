"use client";

import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send, Heart, Star, Globe, X, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
  RoyalCrown,
  FloatingEgyptianElements,
  EgyptianPatternBackground,
  HieroglyphicDivider,
  PharaohCard,
  PharaohButton,
  EgyptHieroglyphic
} from '@/components/ui/pharaonic-elements';

import MediaPicker from '@/components/admin/MediaPicker';
import Partners from '@/components/Partners';

interface FooterSettings {
  [key: string]: string | number | boolean | null | undefined;
  'footer-title'?: string;
  'footer-description'?: string;
  'footer-address'?: string;
  'footer-phone'?: string;
  'footer-email'?: string;
  'footer-facebook'?: string;
  'footer-twitter'?: string;
  'footer-instagram'?: string;
  'footer-company-name'?: string;
  'footer_quick_links_title'?: string;
  'footer_follow_us_title'?: string;
  'footer_newsletter_title'?: string;
  'footer-newsletter-text'?: string;
  'footer_subscribe_button_text'?: string;
  'footer_developer_logo'?: string;
  'footer_developer_phone'?: string;
  'footer_developer_contact_text'?: string;
  'footer_developer_contact_modal_title'?: string;
  'footer_developer_contact_url'?: string;
  'footer_developer_phone_url'?: string;
  'footer_loading_text'?: string;
}

interface FooterProps {
  settings?: FooterSettings;
  footerSettings?: FooterSettings;
}

// Contact Developer Modal Component
function ContactDeveloperModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { getContent } = useContent({ page: 'global_media' });

  const get = (key: string, fallback = '') => {
    const contentValue = getContent(key, '');
    return contentValue || fallback;
  };



  // WhatsApp handler
  const handleWhatsApp = () => {
    const phone = get('footer_developer_phone', '+201234567890').replace(/\s+/g, '').replace('+', '');
    const message = encodeURIComponent('Hello! I would like to get in touch regarding your development services.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-egyptian-gold to-sunset-orange text-hieroglyph-brown text-xs rounded-full hover:from-egyptian-amber hover:to-navy-blue-600 transition-colors duration-300"
      >
        <Mail className="w-3 h-3 mr-1" />
        {get('footer_developer_contact_text', 'Contact Developer')}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.95) 0%, rgba(74, 20, 140, 0.9) 25%, rgba(139, 69, 19, 0.85) 50%, rgba(0, 128, 255, 0.9) 75%, rgba(51, 153, 255, 0.95) 100%)',
              backdropFilter: 'blur(25px)',
              border: '3px solid rgba(0, 128, 255, 0.4)',
              borderRadius: '24px',
              boxShadow: '0 25px 50px rgba(0, 128, 255, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3), 0 0 60px rgba(0, 128, 255, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                {get('footer_developer_contact_modal_title', 'Contact Developer')}
              </h3>

              <div className="space-y-3">
                <a
                  href={get('footer_developer_contact_url', 'mailto:developer@justx.com')}
                  className="flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #0080ff 0%, #3399ff 50%, #0066cc 100%)',
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    boxShadow: '0 8px 25px rgba(0, 128, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Mail className="w-5 h-5 mr-3" />
                  Send Email
                </a>

                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 50%, #075E54 100%)',
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <span className="w-5 h-5 mr-3 text-lg">💬</span>
                  WhatsApp
                </button>

                <a
                  href={get('footer_developer_phone_url', 'tel:+201234567890')}
                  className="flex items-center justify-center w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #4285F4 0%, #34A853 50%, #1A73E8 100%)',
                    color: '#FFFFFF',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    boxShadow: '0 8px 25px rgba(66, 133, 244, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Footer({ settings = {}, footerSettings = {} }: FooterProps) {
  const { getContent, loading: contentLoading } = useContent({ page: 'footer' });
  const { getContent: getGlobalContent } = useContent({ page: 'global_media' });
  const { getContent: getBrandingContent } = useContent({ page: 'branding_settings' });
  const { data: session } = useSession();
  const [footerLogoTimestamp, setFooterLogoTimestamp] = useState(Date.now());

  // Get dynamic footer logo with cache busting
  const getFooterLogo = () => {
    // Prefer branding settings, fallback to global media
    const logoUrl = getBrandingContent('footer_logo', '') || getGlobalContent('footer_logo', '/logos/treasureegypttours.svg');
    // Add cache-busting timestamp
    if (logoUrl.includes('?')) {
      return `${logoUrl}&t=${footerLogoTimestamp}`;
    }
    return `${logoUrl}?t=${footerLogoTimestamp}`;
  };

  // Helper to get a setting value with priority: footerSettings > content > settings > fallback
  const get = (key: string, fallback = '') => {
    // For developer-related keys, check global_media content first
    if (key.includes('developer')) {
      const globalContentValue = getGlobalContent(key, '');
      if (globalContentValue) return globalContentValue;
    }

    // Use content system for ALL other keys
    const contentValue = getContent(key, '');
    return footerSettings[key] || (contentValue || settings[key]) || fallback;
  };

  // Add event listeners for logo updates
  useEffect(() => {
    const handleLogoUpdate = () => {
      setFooterLogoTimestamp(Date.now());
    };
    
    window.addEventListener('content-updated', handleLogoUpdate);
    window.addEventListener('logo-updated', handleLogoUpdate);
    
    return () => {
      window.removeEventListener('content-updated', handleLogoUpdate);
      window.removeEventListener('logo-updated', handleLogoUpdate);
    };
  }, []);

  if (contentLoading) {
    return (
      <footer className="bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <EgyptHieroglyphic className="mx-auto mb-4" size="3rem" />
          <div className="text-egyptian-gold text-2xl mb-2">𓈖 𓂀 𓇳</div>
          <p className="text-hieroglyph-brown font-semibold">{get('footer_loading_text', 'Loading Royal Footer...')}</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50 to-blue-100 on-light">
      {/* Pale background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 0l15 15v-30l-15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Modern decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle floating elements */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 right-10 w-1 h-1 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <Container maxWidth="xl" className="relative z-10">
        <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6">
          {/* Modern Header - Mobile Optimized */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <Image
                src={getFooterLogo()}
                alt="Site Logo"
                width={120}
                height={120}
                className="h-20 sm:h-24 md:h-32 w-auto object-contain"
                unoptimized={true}
                key={`footer-logo-${footerLogoTimestamp}`}
              />
            </div>

            {/* Hieroglyphic Egypt Header */}
            <div className="mb-4 sm:mb-6">
              <EgyptHieroglyphic className="mx-auto mb-2 sm:mb-4" size="1.5rem sm:2rem md:2.5rem" />
              <HieroglyphicDivider />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              <span className="text-egyptian-gold mr-2 sm:mr-3">𓇳</span>
              {get('footer-title', 'Treasure Egypt Tours')}
              <span className="text-egyptian-gold ml-2 sm:ml-3">𓇳</span>
            </h2>
            <p className="text-gray-700 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4 font-medium">
              <span className="text-egyptian-gold mr-1 sm:mr-2">𓊪</span>
              {get('footer-description', 'Discover Egypt with Treasure Egypt Tours. Your trusted partner for unforgettable journeys across the land of the pharaohs.')}
              <span className="text-egyptian-gold ml-1 sm:ml-2">𓊪</span>
            </p>
          </div>

          {/* Modern Content Grid - Mobile Enhanced */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">

            {/* Navigation */}
            <div className="text-center sm:text-left">
              <h3 className="text-ocean-blue font-bold text-base sm:text-lg mb-3 sm:mb-4">
                <span className="text-egyptian-gold mr-1 sm:mr-2">𓊪</span>
                {get('footer_quick_links_title', 'Quick Links')}
                <span className="text-egyptian-gold ml-1 sm:ml-2">𓊪</span>
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { name: get('footer-link-home', 'Home'), href: '/' },
                  { name: get('footer-link-destinations', 'Destinations'), href: '/destinations' },
                  { name: get('footer-link-packages', 'Packages'), href: '/packages' },
                  { name: get('footer-link-about', 'About'), href: '/about' },
                  { name: get('footer-link-contact', 'Contact'), href: '/contact' }
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-900 hover:text-emerald-600 transition-colors duration-300 font-medium text-sm sm:text-base block py-1 px-2 rounded hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-400"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info - Mobile Enhanced */}
            <div className="text-center sm:text-left">
              <h3 className="text-ocean-blue font-bold text-base sm:text-lg mb-3 sm:mb-4">
                <span className="text-egyptian-gold mr-1 sm:mr-2">𓇳</span>
                Contact Info
                <span className="text-egyptian-gold ml-1 sm:ml-2">𓇳</span>
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  {
                    icon: MapPin,
                    text: get('footer-address', 'Luxor, Egypt')
                  },
                  {
                    icon: Phone,
                    text: get('footer-phone', '+20 123 456 789')
                  },
                  {
                    icon: Mail,
                    text: get('footer-email', 'info@treasureegypttours.com')
                  }
                ].map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <div key={index} className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3 py-1">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-900 font-medium text-sm sm:text-base break-all sm:break-normal">
                        {contact.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Social Media - Mobile Enhanced */}
            <div className="text-center sm:text-left">
              <h3 className="text-ocean-blue font-bold text-base sm:text-lg mb-3 sm:mb-4">
                <span className="text-egyptian-gold mr-1 sm:mr-2">𓈖</span>
                {get('footer_follow_us_title', 'Follow Us')}
                <span className="text-egyptian-gold ml-1 sm:ml-2">𓈖</span>
              </h3>
              <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4">
                {[
                  { icon: Facebook, href: get('footer-facebook', '#'), label: 'Facebook' },
                  { icon: Twitter, href: get('footer-twitter', '#'), label: 'Twitter' },
                  { icon: Instagram, href: get('footer-instagram', '#'), label: 'Instagram' }
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={String(social.href || '#')}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center hover:bg-emerald-100 hover:scale-110 transition-all duration-300 group focus-visible:outline-2 focus-visible:outline-emerald-400"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 sm:w-6 sm:h-6 text-ocean-blue group-hover:text-emerald-700" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter - Mobile Enhanced */}
            <div className="text-center sm:text-left">
              <h3 className="text-ocean-blue font-bold text-base sm:text-lg mb-3 sm:mb-4">
                <span className="text-egyptian-gold mr-1 sm:mr-2">𓂀</span>
                {get('footer_newsletter_title', 'Newsletter')}
                <span className="text-egyptian-gold ml-1 sm:ml-2">𓂀</span>
              </h3>
              <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base font-medium px-2 sm:px-0">
                {get('footer-newsletter-text', 'Subscribe to get updates on our latest offers and journeys.')}
              </p>

              <div className="space-y-2 sm:space-y-3 px-2 sm:px-0">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 text-gray-900 placeholder-gray-600 text-sm sm:text-base"
                />

                <button className="w-full bg-gradient-to-r from-egyptian-gold to-sunset-orange text-deep-blue font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-egyptian-amber hover:to-egyptian-gold hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base shadow-lg focus-visible:outline-2 focus-visible:outline-emerald-400">
                  <Send className="w-4 h-4" />
                  <span className="mr-1">𓇳</span>
                  <span>{get('footer_subscribe_button_text', 'Subscribe')}</span>
                  <span className="ml-1">𓇳</span>
                </button>
              </div>
            </div>
          </div>

          {/* Our Partners Section */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <Partners variant="footer" />
          </div>

          {/* Admin Access - Only visible to admin users */}
          {session?.user?.role === 'ADMIN' && (
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border border-purple-200">
              <div className="text-center">
                <h4 className="text-purple-800 font-bold text-sm mb-2">
                  <span className="text-purple-600 mr-2">👑</span>
                  Admin Access
                  <span className="text-purple-600 ml-2">👑</span>
                </h4>
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </div>
            </div>
          )}

          {/* Hieroglyphic Divider */}
          <div className="my-8">
            <HieroglyphicDivider />
          </div>

          {/* Developer Contact Section - Mobile Enhanced */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4">
            {/* Developer Logo */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white shadow-lg flex-shrink-0">
              <Image
                src={String(get('footer_developer_logo', '/images/logo-white.png') || '/images/logo-white.png')}
                alt="Developer Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contact Developer Button */}
            <div className="mt-2 sm:mt-0">
              <ContactDeveloperModal />
            </div>
          </div>

          {/* Modern Bottom Section - Enhanced Contrast */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-gray-700 font-medium text-sm md:text-base text-center md:text-left">
                © {new Date().getFullYear()} {get('footer-company-name', 'Treasure Egypt Tours')}. All Rights Reserved.
              </p>

              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 md:space-x-6">
                <Link
                  href="/privacy"
                  className="text-gray-900 hover:text-emerald-700 transition-colors duration-300 font-medium text-sm md:text-base px-2 py-1 rounded hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-400"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-900 hover:text-emerald-700 transition-colors duration-300 font-medium text-sm md:text-base px-2 py-1 rounded hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-emerald-400"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
