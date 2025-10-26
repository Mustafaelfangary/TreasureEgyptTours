/**
 * Translation Implementation Examples
 * 
 * This file contains practical examples of how to implement translations
 * in various types of components throughout the website.
 */

import { useState } from 'react';
import { useLanguage } from '@/components/Navbar';

// ============================================================================
// EXAMPLE 1: Simple Button Component
// ============================================================================

// ❌ BEFORE (Hardcoded text)
function BookButtonBefore() {
  return <button className="btn-primary">Book Now</button>;
}

// ✅ AFTER (Using translations)
function BookButtonAfter() {
  const { t } = useLanguage();
  return <button className="btn-primary">{t('common.bookNow')}</button>;
}

// ============================================================================
// EXAMPLE 2: Hero Section
// ============================================================================

// ❌ BEFORE
function HeroSectionBefore() {
  return (
    <section className="hero">
      <h1>Luxury Nile River Cruises</h1>
      <p>Experience the magic of ancient Egypt aboard our luxury dahabiyas</p>
      <button>Explore Our Fleet</button>
    </section>
  );
}

// ✅ AFTER
function HeroSectionAfter() {
  const { t } = useLanguage();
  return (
    <section className="hero">
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button>{t('hero.cta')}</button>
    </section>
  );
}

// ============================================================================
// EXAMPLE 3: Contact Form
// ============================================================================

// ❌ BEFORE
function ContactFormBefore() {
  return (
    <form>
      <label>Name</label>
      <input placeholder="Enter your name" />
      
      <label>Email</label>
      <input type="email" placeholder="Enter your email" />
      
      <label>Message</label>
      <textarea placeholder="Your message"></textarea>
      
      <button type="submit">Send Message</button>
    </form>
  );
}

// ✅ AFTER
function ContactFormAfter() {
  const { t } = useLanguage();
  return (
    <form>
      <label>{t('contact.name')}</label>
      <input placeholder={t('contact.name')} />
      
      <label>{t('contact.email')}</label>
      <input type="email" placeholder={t('contact.email')} />
      
      <label>{t('contact.message')}</label>
      <textarea placeholder={t('contact.message')}></textarea>
      
      <button type="submit">{t('contact.sendMessage')}</button>
    </form>
  );
}

// ============================================================================
// EXAMPLE 4: Error and Success Messages
// ============================================================================

// ❌ BEFORE
function BookingFormBefore({ error, success }: { error?: string; success?: boolean }) {
  return (
    <div>
      {error && <div className="error">Booking failed. Please try again.</div>}
      {success && <div className="success">Booking successful!</div>}
      <button>Confirm Booking</button>
    </div>
  );
}

// ✅ AFTER
function BookingFormAfter({ error, success }: { error?: string; success?: boolean }) {
  const { t } = useLanguage();
  return (
    <div>
      {error && <div className="error">{t('errors.bookingFailed')}</div>}
      {success && <div className="success">{t('success.bookingSuccess')}</div>}
      <button>{t('booking.confirmBooking')}</button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Navigation Menu
// ============================================================================

// ❌ BEFORE
function NavigationBefore() {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/dahabiyas">Dahabiyas</a>
      <a href="/packages">Packages</a>
      <a href="/contact">Contact</a>
    </nav>
  );
}

// ✅ AFTER
function NavigationAfter() {
  const { t } = useLanguage();
  return (
    <nav>
      <a href="/">{t('nav.home')}</a>
      <a href="/dahabiyas">{t('nav.dahabiyas')}</a>
      <a href="/packages">{t('nav.packages')}</a>
      <a href="/contact">{t('nav.contact')}</a>
    </nav>
  );
}

// ============================================================================
// EXAMPLE 6: Card Component with Multiple Translations
// ============================================================================

// ❌ BEFORE
function PackageCardBefore({ price, duration }: { price: number; duration: number }) {
  return (
    <div className="package-card">
      <h3>Luxury Package</h3>
      <p>Duration: {duration} days</p>
      <p>From ${price} per person</p>
      <button>View Details</button>
      <button>Book Now</button>
    </div>
  );
}

// ✅ AFTER
function PackageCardAfter({ price, duration }: { price: number; duration: number }) {
  const { t } = useLanguage();
  return (
    <div className="package-card">
      <h3>{t('packages.title')}</h3>
      <p>{t('packages.duration')}: {duration} {t('itineraries.days')}</p>
      <p>{t('packages.from')} ${price} {t('packages.perPerson')}</p>
      <button>{t('common.viewDetails')}</button>
      <button>{t('common.bookNow')}</button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Modal/Dialog Component
// ============================================================================

// ❌ BEFORE
function ConfirmDialogBefore({ onConfirm, onCancel }: any) {
  return (
    <div className="modal">
      <h2>Confirm Action</h2>
      <p>Are you sure you want to proceed?</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
}

// ✅ AFTER
function ConfirmDialogAfter({ onConfirm, onCancel }: any) {
  const { t } = useLanguage();
  return (
    <div className="modal">
      <h2>{t('common.confirm')}</h2>
      <p>{t('common.confirm')}?</p>
      <button onClick={onConfirm}>{t('common.yes')}</button>
      <button onClick={onCancel}>{t('common.no')}</button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 8: Loading State
// ============================================================================

// ❌ BEFORE
function LoadingStateBefore({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return <div>Content loaded</div>;
}

// ✅ AFTER
function LoadingStateAfter({ isLoading }: { isLoading: boolean }) {
  const { t } = useLanguage();
  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }
  return <div>{t('common.success')}</div>;
}

// ============================================================================
// EXAMPLE 9: Footer Component
// ============================================================================

// ❌ BEFORE
function FooterBefore() {
  return (
    <footer>
      <div>
        <h3>Quick Links</h3>
        <a href="/about">About Us</a>
        <a href="/contact">Contact</a>
      </div>
      <div>
        <h3>Follow Us</h3>
        <p>© 2024 Dahabiyat Nile Cruise. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ✅ AFTER
function FooterAfter() {
  const { t } = useLanguage();
  return (
    <footer>
      <div>
        <h3>{t('footer.quickLinks')}</h3>
        <a href="/about">{t('footer.about')}</a>
        <a href="/contact">{t('footer.contact')}</a>
      </div>
      <div>
        <h3>{t('footer.followUs')}</h3>
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}

// ============================================================================
// EXAMPLE 10: Dynamic Content with Fallback
// ============================================================================

// ✅ GOOD: Handle missing translations gracefully
function DynamicContentExample({ customKey }: { customKey?: string }) {
  const { t } = useLanguage();
  
  // Try to get translation, fallback to default
  const title = customKey ? (t(customKey) || 'Default Title') : t('hero.title');
  
  return <h1>{title}</h1>;
}

// ============================================================================
// EXAMPLE 11: Conditional Rendering Based on Language
// ============================================================================

function LanguageSpecificContent() {
  const { language } = useLanguage();
  
  return (
    <div>
      {language === 'ar' && (
        <div className="rtl-notice">
          {/* Special content for Arabic users */}
        </div>
      )}
      {/* Regular content */}
    </div>
  );
}

// ============================================================================
// EXAMPLE 12: Form Validation Messages
// ============================================================================

function FormWithValidation() {
  const { t } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validate = (email: string) => {
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = t('errors.requiredField');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('errors.invalidEmail');
    }
    
    setErrors(newErrors);
  };
  
  return (
    <form>
      <input type="email" />
      {errors.email && <span className="error">{errors.email}</span>}
      <button type="submit">{t('common.submit')}</button>
    </form>
  );
}

// ============================================================================
// EXAMPLE 13: Pluralization
// ============================================================================

function PluralExample({ count }: { count: number }) {
  const { t } = useLanguage();
  
  // Simple pluralization
  const daysLabel = count === 1 ? t('itineraries.day') : t('itineraries.days');
  
  return <p>{count} {daysLabel}</p>;
}

// ============================================================================
// EXAMPLE 14: Accessibility (ARIA Labels)
// ============================================================================

function AccessibleButton() {
  const { t } = useLanguage();
  
  return (
    <button
      aria-label={t('common.bookNow')}
      title={t('common.bookNow')}
    >
      {t('common.bookNow')}
    </button>
  );
}

// ============================================================================
// EXAMPLE 15: Search/Filter Component
// ============================================================================

function SearchComponent() {
  const { t } = useLanguage();
  
  return (
    <div className="search-bar">
      <input 
        type="search"
        placeholder={t('common.search')}
        aria-label={t('common.search')}
      />
      <button>{t('common.search')}</button>
      <button>{t('common.filter')}</button>
      <button>{t('common.reset')}</button>
    </div>
  );
}

// ============================================================================
// QUICK REFERENCE: Common Translation Keys
// ============================================================================

/*
NAVIGATION:
- nav.home, nav.dahabiyas, nav.packages, nav.itineraries
- nav.gallery, nav.about, nav.contact, nav.blogs, nav.faq

COMMON ACTIONS:
- common.bookNow, common.learnMore, common.viewDetails
- common.save, common.cancel, common.submit, common.edit, common.delete
- common.back, common.next, common.previous, common.close

BOOKING:
- booking.checkIn, booking.checkOut, booking.guests
- booking.confirmBooking, booking.cancelBooking

ERRORS:
- errors.requiredField, errors.invalidEmail
- errors.bookingFailed, errors.paymentFailed

SUCCESS:
- success.bookingSuccess, success.paymentSuccess
- success.messageSent, success.profileUpdated

CONTACT:
- contact.name, contact.email, contact.phone
- contact.message, contact.sendMessage
*/

export {};
