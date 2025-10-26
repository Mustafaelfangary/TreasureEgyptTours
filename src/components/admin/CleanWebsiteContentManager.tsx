'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import ResponsiveMediaPicker from './ResponsiveMediaPicker';
import {
  Home, Users, Phone, Package, Settings, MapPin, FileText, 
  Edit2, Save, X, RefreshCw, Image, Calendar, Ship, Globe, Video
} from 'lucide-react';

interface ContentField {
  key: string;
  title: string;
  content: string;
  contentType: 'TEXT' | 'TEXTAREA' | 'IMAGE' | 'VIDEO' | 'URL';
  description?: string;
}

interface PageContent {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: {
    [sectionName: string]: {
      label: string;
      fields: ContentField[];
    };
  };
}

// CLEAN ORGANIZED CONTENT STRUCTURE - ONLY ACTUAL FIELDS USED IN THE WEBSITE
const WEBSITE_CONTENT_STRUCTURE: PageContent[] = [
  {
    id: 'homepage',
    label: 'Homepage',
    icon: Home,
    sections: {
      hero: {
        label: 'Hero Video Section',
        fields: [
          { key: 'hero_video_url', title: 'Hero Video URL', content: '', contentType: 'VIDEO', description: 'Main hero video file' },
          { key: 'hero_video_poster', title: 'Hero Video Poster', content: '', contentType: 'IMAGE', description: 'Video poster/thumbnail' },
          { key: 'hero_video_title', title: 'Hero Title', content: '', contentType: 'TEXT', description: 'Main hero heading' },
          { key: 'hero_video_subtitle', title: 'Hero Subtitle', content: '', contentType: 'TEXT', description: 'Hero subheading' },
          { key: 'hero_video_cta_text', title: 'Hero CTA Button', content: '', contentType: 'TEXT', description: 'Call-to-action button text' },
          { key: 'hero_scroll_text', title: 'Scroll Indicator Text', content: '', contentType: 'TEXT', description: 'Scroll down indicator' }
        ]
      },
      hero_side_boxes: {
        label: 'Hero Side Boxes',
        fields: [
          { key: 'hero_side_left_title', title: 'Left Box Title', content: '', contentType: 'TEXT', description: 'Headline shown in the left card beside the hero video' },
          { key: 'hero_side_left_image', title: 'Left Box Image', content: '', contentType: 'IMAGE', description: 'Image used inside the left card' },
          { key: 'hero_side_right_title', title: 'Right Box Title', content: '', contentType: 'TEXT', description: 'Headline shown in the right card beside the hero video' },
          { key: 'hero_side_right_image', title: 'Right Box Image', content: '', contentType: 'IMAGE', description: 'Image used inside the right card' }
        ]
      },
      dahabiyas: {
        label: 'Dahabiyas Section',
        fields: [
          { key: 'dahabiyat_section_title', title: 'Section Title', content: '', contentType: 'TEXT' },
          { key: 'dahabiyat_section_subtitle', title: 'Section Subtitle', content: '', contentType: 'TEXT' },
          { key: 'dahabiyat_view_all_text', title: 'View All Button', content: '', contentType: 'TEXT' }
        ]
      },
      packages: {
        label: 'Packages Section',
        fields: [
          { key: 'packages_section_title', title: 'Section Title', content: '', contentType: 'TEXT' },
          { key: 'packages_section_subtitle', title: 'Section Subtitle', content: '', contentType: 'TEXT' },
          { key: 'packages_view_all_text', title: 'View All Button', content: '', contentType: 'TEXT' },
          { key: 'days_label', title: 'Days Label', content: '', contentType: 'TEXT' },
          { key: 'view_details_text', title: 'View Details Button', content: '', contentType: 'TEXT' }
        ]
      },
      about_sections: {
        label: 'About Sections',
        fields: [
          { key: 'what_is_dahabiya_title', title: 'What is Dahabiya Title', content: '', contentType: 'TEXT' },
          { key: 'what_is_dahabiya_content', title: 'What is Dahabiya Content', content: '', contentType: 'TEXTAREA' },
          { key: 'what_is_dahabiya_image_1', title: 'Image 1', content: '', contentType: 'IMAGE' },
          { key: 'what_is_dahabiya_image_2', title: 'Image 2', content: '', contentType: 'IMAGE' },
          { key: 'what_is_dahabiya_image_3', title: 'Image 3', content: '', contentType: 'IMAGE' },
          { key: 'why_different_title', title: 'Why Different Title', content: '', contentType: 'TEXT' },
          { key: 'why_different_content', title: 'Why Different Content', content: '', contentType: 'TEXTAREA' },
          { key: 'why_different_image_1', title: 'Why Different Image 1', content: '', contentType: 'IMAGE' },
          { key: 'why_different_image_2', title: 'Why Different Image 2', content: '', contentType: 'IMAGE' },
          { key: 'why_different_image_3', title: 'Why Different Image 3', content: '', contentType: 'IMAGE' }
        ]
      },
      story: {
        label: 'Our Story Section',
        fields: [
          { key: 'our_story_title', title: 'Story Title', content: '', contentType: 'TEXT' },
          { key: 'our_story_content', title: 'Story Content', content: '', contentType: 'TEXTAREA' },
          { key: 'our_story_paragraph_2', title: 'Story Paragraph 2', content: '', contentType: 'TEXTAREA' },
          { key: 'our_story_paragraph_3', title: 'Story Paragraph 3', content: '', contentType: 'TEXTAREA' },
          { key: 'our_story_paragraph_4', title: 'Story Paragraph 4', content: '', contentType: 'TEXTAREA' },
          { key: 'founder_name', title: 'Founder Name', content: '', contentType: 'TEXT' },
          { key: 'founder_title', title: 'Founder Title', content: '', contentType: 'TEXT' },
          { key: 'founder_quote', title: 'Founder Quote', content: '', contentType: 'TEXTAREA' },
          { key: 'founder_image', title: 'Founder Image', content: '', contentType: 'IMAGE' }
        ]
      },
      memories: {
        label: 'Share Memories Section',
        fields: [
          { key: 'share_memories_title', title: 'Section Title', content: '', contentType: 'TEXT' },
          { key: 'share_memories_content', title: 'Section Content', content: '', contentType: 'TEXTAREA' },
          { key: 'share_memories_image_1', title: 'Memory Image 1', content: '', contentType: 'IMAGE' },
          { key: 'share_memories_image_2', title: 'Memory Image 2', content: '', contentType: 'IMAGE' },
          { key: 'share_memories_image_3', title: 'Memory Image 3', content: '', contentType: 'IMAGE' }
        ]
      },
      gallery: {
        label: 'Gallery Section',
        fields: [
          { key: 'gallery_section_title', title: 'Gallery Title', content: '', contentType: 'TEXT' },
          { key: 'gallery_section_subtitle', title: 'Gallery Subtitle', content: '', contentType: 'TEXT' },
          { key: 'gallery_view_all_text', title: 'View All Button', content: '', contentType: 'TEXT' }
        ]
      },
      blog: {
        label: 'Blog Section',
        fields: [
          { key: 'blog_section_title', title: 'Blog Title', content: '', contentType: 'TEXT' },
          { key: 'blog_section_subtitle', title: 'Blog Subtitle', content: '', contentType: 'TEXT' },
          { key: 'blog_view_all_text', title: 'View All Button', content: '', contentType: 'TEXT' }
        ]
      },
      safety: {
        label: 'Safety Section',
        fields: [
          { key: 'safety_title', title: 'Safety Title', content: '', contentType: 'TEXT' },
          { key: 'safety_subtitle', title: 'Safety Subtitle', content: '', contentType: 'TEXT' }
        ]
      },
      cta: {
        label: 'Call to Action',
        fields: [
          { key: 'cta_title', title: 'CTA Title', content: '', contentType: 'TEXT' },
          { key: 'cta_description', title: 'CTA Description', content: '', contentType: 'TEXTAREA' },
          { key: 'cta_book_text', title: 'Book Button', content: '', contentType: 'TEXT' },
          { key: 'cta_contact_text', title: 'Contact Button', content: '', contentType: 'TEXT' }
        ]
      },
      general: {
        label: 'General Elements',
        fields: [
          { key: 'loading_text', title: 'Loading Text', content: '', contentType: 'TEXT' },
          { key: 'read_more_text', title: 'Read More Text', content: '', contentType: 'TEXT' },
          { key: 'read_less_text', title: 'Read Less Text', content: '', contentType: 'TEXT' }
        ]
      }
    }
  },
  {
    id: 'dahabiyas',
    label: 'Dahabiyas Page',
    icon: Ship,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'dahabiyas_hero_title', title: 'Hero Title', content: '', contentType: 'TEXT' },
          { key: 'dahabiyas_hero_subtitle', title: 'Hero Subtitle', content: '', contentType: 'TEXT' },
          { key: 'dahabiyas_hero_description', title: 'Hero Description', content: '', contentType: 'TEXTAREA' },
          { key: 'dahabiyas_description', title: 'Page Description', content: '', contentType: 'TEXTAREA' },
          { key: 'dahabiyas_hero_background_image', title: 'Hero Background Image', content: '', contentType: 'IMAGE' },
          { key: 'dahabiyas_hero_background_video', title: 'Hero Background Video', content: '', contentType: 'VIDEO' }
        ]
      },
      cta: {
        label: 'Call to Action',
        fields: [
          { key: 'dahabiyas_cta_title', title: 'CTA Title', content: '', contentType: 'TEXT' },
          { key: 'dahabiyas_cta_description', title: 'CTA Description', content: '', contentType: 'TEXTAREA' },
          { key: 'dahabiyas_cta_book_title', title: 'Book Button Title', content: '', contentType: 'TEXT' },
          { key: 'dahabiyas_cta_book_subtitle', title: 'Book Button Subtitle', content: '', contentType: 'TEXT' },
          { key: 'dahabiyas_cta_packages_title', title: 'Packages Button Title', content: '', contentType: 'TEXT' },
          { key: 'dahabiyas_cta_packages_subtitle', title: 'Packages Button Subtitle', content: '', contentType: 'TEXT' }
        ]
      },
      features: {
        label: 'Features Section',
        fields: [
          { key: 'dahabiyas_feature_1_title', title: 'Feature 1 Title', content: '', contentType: 'TEXT' },
          { key: 'dahabiyas_feature_1_description', title: 'Feature 1 Description', content: '', contentType: 'TEXTAREA' },
          { key: 'dahabiyas_feature_2_title', title: 'Feature 2 Title', content: '', contentType: 'TEXT' },
          { key: 'dahabiyas_feature_2_description', title: 'Feature 2 Description', content: '', contentType: 'TEXTAREA' },
          { key: 'dahabiyas_feature_3_title', title: 'Feature 3 Title', content: '', contentType: 'TEXT' },
          { key: 'dahabiyas_feature_3_description', title: 'Feature 3 Description', content: '', contentType: 'TEXTAREA' }
        ]
      }
    }
  },
  {
    id: 'packages',
    label: 'Packages Page',
    icon: Package,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'packages_hero_title', title: 'Hero Title', content: '', contentType: 'TEXT' },
          { key: 'packages_hero_subtitle', title: 'Hero Subtitle', content: '', contentType: 'TEXT' },
          { key: 'packages_hero_description', title: 'Hero Description', content: '', contentType: 'TEXTAREA' },
          { key: 'packages_hero_image', title: 'Hero Background Image', content: '', contentType: 'IMAGE' },
          { key: 'packages_hero_video', title: 'Hero Background Video', content: '', contentType: 'VIDEO' }
        ]
      },
      cta: {
        label: 'Call to Action',
        fields: [
          { key: 'packages_cta_title', title: 'CTA Title', content: '', contentType: 'TEXT' },
          { key: 'packages_cta_description', title: 'CTA Description', content: '', contentType: 'TEXTAREA' },
          { key: 'packages_cta_book_title', title: 'Book Button Title', content: '', contentType: 'TEXT' },
          { key: 'packages_cta_book_subtitle', title: 'Book Button Subtitle', content: '', contentType: 'TEXT' },
          { key: 'packages_cta_dahabiyas_title', title: 'Dahabiyas Button Title', content: '', contentType: 'TEXT' },
          { key: 'packages_cta_dahabiyas_subtitle', title: 'Dahabiyas Button Subtitle', content: '', contentType: 'TEXT' }
        ]
      }
    }
  },
  {
    id: 'schedule-and-rates',
    label: 'Schedule & Rates',
    icon: Calendar,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'page_title', title: 'Page Title', content: '', contentType: 'TEXT' },
          { key: 'page_subtitle', title: 'Page Subtitle', content: '', contentType: 'TEXT' },
          { key: 'hero_background_image', title: 'Hero Background', content: '', contentType: 'IMAGE' }
        ]
      },
      intro: {
        label: 'Introduction',
        fields: [
          { key: 'intro_section_title', title: 'Intro Title', content: '', contentType: 'TEXT' },
          { key: 'schedule_intro_text', title: 'Intro Text (Editable)', content: '', contentType: 'TEXTAREA', description: 'This field is editable by admins on the page' }
        ]
      },
      schedule: {
        label: 'Schedule Section',
        fields: [
          { key: 'schedule_title', title: 'Schedule Title', content: '', contentType: 'TEXT' },
          { key: 'schedule_subtitle', title: 'Schedule Subtitle', content: '', contentType: 'TEXT' }
        ]
      }
    }
  },
  {
    id: 'contact',
    label: 'Contact Page',
    icon: Phone,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'contact_hero_title', title: 'Hero Title', content: '', contentType: 'TEXT' },
          { key: 'contact_hero_subtitle', title: 'Hero Subtitle', content: '', contentType: 'TEXT' },
          { key: 'contact_hero_image', title: 'Hero Background Image', content: '', contentType: 'IMAGE' },
          { key: 'contact_hero_video', title: 'Hero Background Video', content: '', contentType: 'VIDEO' }
        ]
      },
      contact_info: {
        label: 'Contact Information',
        fields: [
          { key: 'contact_phone_title', title: 'Phone Section Title', content: '', contentType: 'TEXT' },
          { key: 'contact_phone', title: 'Phone Number', content: '', contentType: 'TEXT' },
          { key: 'contact_email_title', title: 'Email Section Title', content: '', contentType: 'TEXT' },
          { key: 'contact_email', title: 'Email Address', content: '', contentType: 'TEXT' },
          { key: 'contact_location_title', title: 'Location Section Title', content: '', contentType: 'TEXT' },
          { key: 'contact_address', title: 'Address', content: '', contentType: 'TEXTAREA' }
        ]
      },
      social_media: {
        label: 'Social Media Links',
        fields: [
          { key: 'contact_facebook', title: 'Facebook URL', content: '', contentType: 'URL' },
          { key: 'contact_instagram', title: 'Instagram URL', content: '', contentType: 'URL' },
          { key: 'contact_x', title: 'X (Twitter) URL', content: '', contentType: 'URL' },
          { key: 'contact_youtube', title: 'YouTube URL', content: '', contentType: 'URL' },
          { key: 'contact_tiktok', title: 'TikTok URL', content: '', contentType: 'URL' },
          { key: 'contact_pinterest', title: 'Pinterest URL', content: '', contentType: 'URL' },
          { key: 'contact_tripadvisor', title: 'TripAdvisor URL', content: '', contentType: 'URL' },
          { key: 'contact_whatsapp', title: 'WhatsApp URL', content: '', contentType: 'URL' },
          { key: 'contact_telegram', title: 'Telegram URL', content: '', contentType: 'URL' },
          { key: 'contact_wechat', title: 'WeChat ID', content: '', contentType: 'TEXT' },
          { key: 'contact_vk', title: 'VK URL', content: '', contentType: 'URL' }
        ]
      },
      general: {
        label: 'General',
        fields: [
          { key: 'contact_loading_text', title: 'Loading Text', content: '', contentType: 'TEXT' }
        ]
      }
    }
  },
  {
    id: 'about',
    label: 'About Page',
    icon: Users,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'about_hero_title', title: 'Hero Title', content: '', contentType: 'TEXT' },
          { key: 'about_hero_subtitle', title: 'Hero Subtitle', content: '', contentType: 'TEXT' },
          { key: 'about_hero_image', title: 'Hero Background', content: '', contentType: 'IMAGE' },
          { key: 'about_loading_text', title: 'Loading Text', content: '', contentType: 'TEXT' }
        ]
      },
      story: {
        label: 'Our Story',
        fields: [
          { key: 'about_story_title', title: 'Story Title', content: '', contentType: 'TEXT' },
          { key: 'about_story_content', title: 'Story Content', content: '', contentType: 'TEXTAREA' },
          { key: 'about_story_image', title: 'Story Image', content: '', contentType: 'IMAGE' }
        ]
      },
      mission_vision: {
        label: 'Mission & Vision',
        fields: [
          { key: 'about_mission_title', title: 'Mission Title', content: '', contentType: 'TEXT' },
          { key: 'about_mission_content', title: 'Mission Content', content: '', contentType: 'TEXTAREA' },
          { key: 'about_vision_title', title: 'Vision Title', content: '', contentType: 'TEXT' },
          { key: 'about_vision_content', title: 'Vision Content', content: '', contentType: 'TEXTAREA' }
        ]
      },
      values: {
        label: 'Values & Team',
        fields: [
          { key: 'about_values_title', title: 'Values Title', content: '', contentType: 'TEXT' },
          { key: 'about_values', title: 'Values Content', content: '', contentType: 'TEXTAREA' },
          { key: 'about_team_title', title: 'Team Title', content: '', contentType: 'TEXT' },
          { key: 'about_team_description', title: 'Team Description', content: '', contentType: 'TEXTAREA' }
        ]
      },
      stats: {
        label: 'Statistics',
        fields: [
          { key: 'about_stat_years', title: 'Years Count', content: '', contentType: 'TEXT' },
          { key: 'about_stat_years_label', title: 'Years Label', content: '', contentType: 'TEXT' },
          { key: 'about_stat_guests', title: 'Guests Count', content: '', contentType: 'TEXT' },
          { key: 'about_stat_guests_label', title: 'Guests Label', content: '', contentType: 'TEXT' },
          { key: 'about_stat_countries', title: 'Countries Count', content: '', contentType: 'TEXT' },
          { key: 'about_stat_countries_label', title: 'Countries Label', content: '', contentType: 'TEXT' },
          { key: 'about_stat_safety', title: 'Safety Rating', content: '', contentType: 'TEXT' },
          { key: 'about_stat_safety_label', title: 'Safety Label', content: '', contentType: 'TEXT' }
        ]
      },
      contact: {
        label: 'Contact Section',
        fields: [
          { key: 'about_contact_title', title: 'Contact Title', content: '', contentType: 'TEXT' },
          { key: 'about_contact_description', title: 'Contact Description', content: '', contentType: 'TEXTAREA' },
          { key: 'about_contact_phone', title: 'Contact Phone', content: '', contentType: 'TEXT' },
          { key: 'about_contact_email', title: 'Contact Email', content: '', contentType: 'TEXT' },
          { key: 'about_contact_address', title: 'Contact Address', content: '', contentType: 'TEXTAREA' },
          { key: 'about_egypt_label', title: 'Egypt Label', content: '', contentType: 'TEXT' }
        ]
      }
    }
  },
  {
    id: 'itineraries',
    label: 'Itineraries Page',
    icon: MapPin,
    sections: {
      hero: {
        label: 'Hero Section',
        fields: [
          { key: 'itineraries_hero_title', title: 'Hero Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_hero_subtitle', title: 'Hero Subtitle', content: '', contentType: 'TEXT' },
          { key: 'itineraries_hero_description', title: 'Hero Description', content: '', contentType: 'TEXTAREA' },
          { key: 'itineraries_hero_background_image', title: 'Hero Background Image', content: '', contentType: 'IMAGE' },
          { key: 'itineraries_hero_background_video', title: 'Hero Background Video', content: '', contentType: 'VIDEO' }
        ]
      },
      content: {
        label: 'Main Content',
        fields: [
          { key: 'itineraries_page_title', title: 'Page Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_page_subtitle', title: 'Page Subtitle', content: '', contentType: 'TEXT' },
          { key: 'itineraries_page_description', title: 'Page Description', content: '', contentType: 'TEXTAREA' },
          { key: 'itineraries_filter_all_text', title: 'Filter All Text', content: '', contentType: 'TEXT' },
          { key: 'itineraries_view_details_text', title: 'View Details Button', content: '', contentType: 'TEXT' },
          { key: 'itineraries_days_label', title: 'Days Label', content: '', contentType: 'TEXT' },
          { key: 'itineraries_from_label', title: 'From Price Label', content: '', contentType: 'TEXT' }
        ]
      },
      cta: {
        label: 'Call to Action',
        fields: [
          { key: 'itineraries_cta_title', title: 'CTA Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_cta_description', title: 'CTA Description', content: '', contentType: 'TEXTAREA' },
          { key: 'itineraries_cta_book_title', title: 'Book Button Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_cta_book_subtitle', title: 'Book Button Subtitle', content: '', contentType: 'TEXT' },
          { key: 'itineraries_cta_contact_title', title: 'Contact Button Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_cta_contact_subtitle', title: 'Contact Button Subtitle', content: '', contentType: 'TEXT' }
        ]
      },
      features: {
        label: 'Features Section',
        fields: [
          { key: 'itineraries_features_title', title: 'Features Section Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_feature_1_title', title: 'Feature 1 Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_feature_1_description', title: 'Feature 1 Description', content: '', contentType: 'TEXTAREA' },
          { key: 'itineraries_feature_2_title', title: 'Feature 2 Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_feature_2_description', title: 'Feature 2 Description', content: '', contentType: 'TEXTAREA' },
          { key: 'itineraries_feature_3_title', title: 'Feature 3 Title', content: '', contentType: 'TEXT' },
          { key: 'itineraries_feature_3_description', title: 'Feature 3 Description', content: '', contentType: 'TEXTAREA' }
        ]
      }
    }
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: Globe,
    sections: {
      company: {
        label: 'Company Info',
        fields: [
          { key: 'footer-title', title: 'Footer Title', content: '', contentType: 'TEXT' },
          { key: 'footer-company-name', title: 'Company Name', content: '', contentType: 'TEXT' },
          { key: 'footer-description', title: 'Description', content: '', contentType: 'TEXTAREA' },
          { key: 'footer-phone', title: 'Phone', content: '', contentType: 'TEXT' },
          { key: 'footer-email', title: 'Email', content: '', contentType: 'TEXT' },
          { key: 'footer-address', title: 'Address', content: '', contentType: 'TEXTAREA' }
        ]
      },
      navigation: {
        label: 'Quick Links',
        fields: [
          { key: 'footer_quick_links_title', title: 'Quick Links Title', content: '', contentType: 'TEXT' },
          { key: 'footer-link-home', title: 'Home Link', content: '', contentType: 'TEXT' },
          { key: 'footer-link-about', title: 'About Link', content: '', contentType: 'TEXT' },
          { key: 'footer-link-dahabiyat', title: 'Dahabiyat Link', content: '', contentType: 'TEXT' },
          { key: 'footer-link-packages', title: 'Packages Link', content: '', contentType: 'TEXT' },
          { key: 'footer-link-contact', title: 'Contact Link', content: '', contentType: 'TEXT' }
        ]
      },
      social: {
        label: 'Social Media',
        fields: [
          { key: 'footer_follow_us_title', title: 'Follow Us Title', content: '', contentType: 'TEXT' },
          { key: 'footer-facebook', title: 'Facebook URL', content: '', contentType: 'URL' },
          { key: 'footer-instagram', title: 'Instagram URL', content: '', contentType: 'URL' },
          { key: 'footer-twitter', title: 'Twitter URL', content: '', contentType: 'URL' }
        ]
      },
      newsletter: {
        label: 'Newsletter',
        fields: [
          { key: 'footer_newsletter_title', title: 'Newsletter Title', content: '', contentType: 'TEXT' },
          { key: 'footer-newsletter-text', title: 'Newsletter Text', content: '', contentType: 'TEXTAREA' },
          { key: 'footer_subscribe_button_text', title: 'Subscribe Button', content: '', contentType: 'TEXT' }
        ]
      },
      developer: {
        label: 'Developer Info',
        fields: [
          { key: 'footer_developer_logo', title: 'Developer Logo', content: '', contentType: 'IMAGE' },
          { key: 'footer_developer_contact_text', title: 'Developer Contact Text', content: '', contentType: 'TEXT' },
          { key: 'footer_developer_contact_url', title: 'Developer Contact URL', content: '', contentType: 'URL' },
          { key: 'footer_developer_phone', title: 'Developer Phone', content: '', contentType: 'TEXT' },
          { key: 'footer_developer_phone_url', title: 'Developer Phone URL', content: '', contentType: 'URL' },
          { key: 'footer_developer_contact_modal_title', title: 'Developer Contact Modal Title', content: '', contentType: 'TEXT' }
        ]
      },
      general: {
        label: 'General',
        fields: [
          { key: 'footer_loading_text', title: 'Loading Text', content: '', contentType: 'TEXT' }
        ]
      }
    }
  },
  {
    id: 'branding',
    label: 'Branding & Settings',
    icon: Settings,
    sections: {
      logos: {
        label: 'Logos & Branding',
        fields: [
          { key: 'site_name', title: 'Site Name', content: '', contentType: 'TEXT', description: 'Main website name' },
          { key: 'site_logo', title: 'Main Logo', content: '', contentType: 'IMAGE', description: 'Primary site logo' },
          { key: 'navbar_logo', title: 'Navbar Logo', content: '', contentType: 'IMAGE', description: 'Logo in navigation bar' },
          { key: 'footer_logo', title: 'Footer Logo', content: '', contentType: 'IMAGE', description: 'Logo in footer' },
          { key: 'site_favicon', title: 'Favicon', content: '', contentType: 'IMAGE', description: 'Browser tab icon' }
        ]
      }
    }
  }
];

export default function CleanWebsiteContentManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [content, setContent] = useState<Record<string, string>>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const contentMap: Record<string, string> = {};

      // Load content for each page
      for (const page of WEBSITE_CONTENT_STRUCTURE) {
        const pageId = page.id === 'branding' ? 'branding_settings' : page.id;
        
        try {
          const response = await fetch(`/api/website-content?page=${pageId}&t=${Date.now()}`);
          if (response.ok) {
            const data = await response.json();
            data.forEach((item: any) => {
              contentMap[item.key] = item.content || '';
            });
          }
        } catch (error) {
          console.error(`Error loading ${page.id}:`, error);
        }
      }

      setContent(contentMap);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (key: string, currentValue: string) => {
    setEditingField(key);
    setEditValue(currentValue);
  };

  const handleSave = async (key: string, field: ContentField, pageId: string) => {
    setSaving(key);
    try {
      const response = await fetch('/api/website-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          content: editValue,
          title: field.title,
          contentType: field.contentType,
          page: pageId === 'branding' ? 'branding_settings' : pageId,
          section: 'general'
        })
      });

      if (response.ok) {
        setContent(prev => ({ ...prev, [key]: editValue }));
        setEditingField(null);
        setEditValue('');
        toast.success('Content updated successfully');
        
        // Broadcast content update to all tabs/windows for immediate refresh
        try {
          const bc = new BroadcastChannel('content-updates');
          bc.postMessage({ 
            type: 'content-updated', 
            key,
            content: editValue,
            page: pageId === 'branding' ? 'branding_settings' : pageId,
            timestamp: Date.now()
          });
          bc.close();
        } catch (broadcastError) {
          console.log('Broadcast channel not supported:', broadcastError);
        }
        
        // Trigger storage event for same-tab updates
        try {
          localStorage.setItem('content-updated', Date.now().toString());
          localStorage.removeItem('content-updated');
        } catch (storageError) {
          console.log('Local storage not available:', storageError);
        }
        
        // Trigger window events for immediate updates
        window.dispatchEvent(new CustomEvent('content-updated', {
          detail: { key, content: editValue, page: pageId === 'branding' ? 'branding_settings' : pageId }
        }));
        
        // Special handling for logo updates
        if (key.includes('logo') || key.includes('favicon') || key.includes('site_name')) {
          window.dispatchEvent(new CustomEvent('logo-updated', {
            detail: { logoType: key, logoUrl: editValue, timestamp: Date.now() }
          }));
        }
        
        // Force a hard refresh of content across the application
        setTimeout(() => {
          // Dispatch content refresh event
          window.dispatchEvent(new CustomEvent('content-refresh', {
            detail: { key, content: editValue, timestamp: Date.now() }
          }));
          
          // Try to refresh any open tabs showing the website
          try {
            const bc = new BroadcastChannel('website-refresh');
            bc.postMessage({ 
              type: 'content-changed', 
              key,
              page: pageId === 'branding' ? 'branding_settings' : pageId,
              timestamp: Date.now()
            });
            bc.close();
          } catch (error) {
            console.log('Could not broadcast to other tabs:', error);
          }
        }, 100);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast.error('Failed to save content');
    } finally {
      setSaving(null);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const renderField = (field: ContentField, pageId: string) => {
    const currentValue = content[field.key] || '';
    const isEditing = editingField === field.key;
    const isSaving = saving === field.key;

    return (
      <div key={field.key} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{field.title}</h4>
            {field.description && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{field.description}</p>
            )}
          </div>
          <Badge variant="secondary" className="self-start sm:ml-2 flex-shrink-0 text-xs">
            {field.contentType}
          </Badge>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            {field.contentType === 'IMAGE' || field.contentType === 'VIDEO' ? (
              <ResponsiveMediaPicker
                label={field.title}
                value={editValue}
                onChange={setEditValue}
                accept={field.contentType === 'IMAGE' ? 'image/*' : 'video/*'}
                placeholder={`Select ${field.contentType.toLowerCase()} file...`}
                helperText={field.description}
                className="w-full"
              />
            ) : field.contentType === 'TEXTAREA' ? (
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Enter ${field.title.toLowerCase()}...`}
                rows={4}
                className="w-full"
              />
            ) : (
              <Input
                type={field.contentType === 'URL' ? 'url' : 'text'}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Enter ${field.title.toLowerCase()}...`}
                className="w-full"
              />
            )}
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                size="sm"
                onClick={() => handleSave(field.key, field, pageId)}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="ml-1 sm:ml-2">{isSaving ? 'Saving...' : 'Save'}</span>
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                <X className="w-4 h-4" />
                <span className="ml-1 sm:ml-2">Cancel</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {field.contentType === 'IMAGE' && currentValue ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded border text-sm">
                  <Image className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 break-all">{currentValue}</span>
                </div>
                <div className="border rounded-lg p-2 bg-white">
                  <img
                    src={currentValue}
                    alt={field.title}
                    className="max-w-full h-32 object-contain rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'flex items-center justify-center h-32 bg-gray-100 text-gray-500 text-sm rounded';
                      errorDiv.textContent = 'Failed to load image';
                      target.parentNode?.appendChild(errorDiv);
                    }}
                  />
                </div>
              </div>
            ) : field.contentType === 'VIDEO' && currentValue ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded border text-sm">
                  <Video className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 break-all">{currentValue}</span>
                </div>
                <div className="border rounded-lg p-2 bg-white">
                  <video
                    src={currentValue}
                    controls
                    className="max-w-full h-32 rounded"
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.style.display = 'none';
                      const errorDiv = document.createElement('div');
                      errorDiv.className = 'flex items-center justify-center h-32 bg-gray-100 text-gray-500 text-sm rounded';
                      errorDiv.textContent = 'Failed to load video';
                      target.parentNode?.appendChild(errorDiv);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="min-h-[2rem] p-2 bg-gray-100 rounded border text-sm">
                {currentValue ? (
                  <span className="text-gray-900 break-all">{currentValue}</span>
                ) : (
                  <span className="text-gray-400 italic">No content set</span>
                )}
              </div>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(field.key, currentValue)}
              className="w-full"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Website Content Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Manage all your website content in one place. Only actual fields used in your website are shown.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadContent} variant="outline" className="self-start sm:self-auto">
            <RefreshCw className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              console.log('Current content state:', content);
              console.log('Content keys:', Object.keys(content));
              toast.success(`Content state logged. Found ${Object.keys(content).length} items.`);
            }}
          >
            Debug
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={async () => {
              try {
                const response = await fetch('/api/admin/seed-test-content', { method: 'POST' });
                const data = await response.json();
                if (response.ok) {
                  toast.success(data.message);
                  loadContent(); // Reload content after seeding
                } else {
                  toast.error(data.error || 'Failed to seed content');
                }
              } catch (error) {
                toast.error('Failed to seed test content');
              }
            }}
          >
            Seed Test Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue={WEBSITE_CONTENT_STRUCTURE[0].id} className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-1 min-w-max w-full">
            {WEBSITE_CONTENT_STRUCTURE.map((page) => {
              const Icon = page.icon;
              return (
                <TabsTrigger key={page.id} value={page.id} className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 whitespace-nowrap">
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm hidden xs:inline">{page.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {WEBSITE_CONTENT_STRUCTURE.map((page) => (
          <TabsContent key={page.id} value={page.id}>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <page.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">{page.label}</h2>
              </div>

              {Object.entries(page.sections).map(([sectionKey, section]) => (
                <Card key={sectionKey}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {section.label}
                      <Badge variant="outline">{section.fields.length} fields</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
                      {section.fields.map((field) => renderField(field, page.id))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}