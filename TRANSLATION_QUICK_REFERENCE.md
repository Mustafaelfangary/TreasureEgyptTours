# Translation System - Quick Reference Guide

## 🌍 Available Languages

| Flag | Language | Code | Status |
|------|----------|------|--------|
| 🇺🇸 | English | `en` | ✅ Complete |
| 🇪🇬 | العربية (Arabic) | `ar` | ✅ Complete |
| 🇫🇷 | Français (French) | `fr` | ✅ Complete |
| 🇩🇪 | Deutsch (German) | `de` | ✅ Complete |
| 🇪🇸 | Español (Spanish) | `es` | ✅ Complete |
| 🇮🇹 | Italiano (Italian) | `it` | ✅ Complete |
| 🇷🇺 | Русский (Russian) | `ru` | ✅ Complete |
| 🇨🇳 | 中文 (Chinese) | `zh` | ✅ Complete |
| 🇯🇵 | 日本語 (Japanese) | `ja` | ✅ Complete |

## 🔑 Most Common Translation Keys

### Navigation
```typescript
t('nav.home')          // Home
t('nav.dahabiyas')     // Dahabiyas
t('nav.packages')      // Packages
t('nav.contact')       // Contact
t('nav.signin')        // Sign In
t('nav.logout')        // Logout
```

### Buttons & Actions
```typescript
t('common.bookNow')    // Book Now
t('common.learnMore')  // Learn More
t('common.viewDetails')// View Details
t('common.submit')     // Submit
t('common.cancel')     // Cancel
t('common.save')       // Save
t('common.edit')       // Edit
t('common.delete')     // Delete
t('common.confirm')    // Confirm
t('common.download')   // Download
```

### Forms
```typescript
t('contact.name')      // Name
t('contact.email')     // Email
t('contact.phone')     // Phone
t('contact.message')   // Message
t('auth.password')     // Password
t('auth.firstName')    // First Name
t('auth.lastName')     // Last Name
```

### Booking
```typescript
t('booking.checkIn')   // Check-in
t('booking.checkOut')  // Check-out
t('booking.guests')    // Guests
t('booking.adults')    // Adults
t('booking.children')  // Children
t('booking.confirmBooking') // Confirm Booking
```

### Messages
```typescript
t('common.loading')    // Loading...
t('common.success')    // Success
t('common.error')      // Error
t('errors.requiredField')    // This field is required
t('errors.invalidEmail')     // Invalid email address
t('success.bookingSuccess')  // Booking successful!
```

## 💡 Usage Examples

### Basic Usage
```typescript
import { useLanguage } from '@/components/Navbar';

function MyComponent() {
  const { t } = useLanguage();
  
  return <button>{t('common.bookNow')}</button>;
}
```

### With Variables
```typescript
const days = 5;
const price = 500;

return (
  <div>
    <p>{days} {t('itineraries.days')}</p>
    <p>{t('packages.from')} ${price} {t('packages.perPerson')}</p>
  </div>
);
```

### Form Example
```typescript
<form>
  <label>{t('contact.name')}</label>
  <input placeholder={t('contact.name')} />
  
  <label>{t('contact.email')}</label>
  <input type="email" placeholder={t('contact.email')} />
  
  <button type="submit">{t('contact.sendMessage')}</button>
</form>
```

### Error Handling
```typescript
{error && <span className="error">{t('errors.requiredField')}</span>}
{success && <span className="success">{t('success.messageSent')}</span>}
```

## 📂 Translation File Structure

```
src/locales/
├── en.json  ✅ English
├── ar.json  ✅ Arabic
├── fr.json  ✅ French
├── de.json  ✅ German
├── es.json  ✅ Spanish
├── it.json  ✅ Italian
├── ru.json  ✅ Russian
├── zh.json  ✅ Chinese
└── ja.json  ✅ Japanese
```

## 🎯 Translation Categories

1. **nav** - Navigation menu items
2. **common** - Common UI elements & buttons
3. **hero** - Hero section content
4. **dahabiyas** - Dahabiya-specific content
5. **packages** - Travel packages
6. **itineraries** - Route information
7. **booking** - Booking system
8. **contact** - Contact forms & info
9. **auth** - Authentication
10. **profile** - User profile
11. **gallery** - Photo gallery
12. **reviews** - Guest reviews
13. **faq** - FAQ section
14. **footer** - Footer content
15. **errors** - Error messages
16. **success** - Success messages
17. **schedule** - Schedule & rates
18. **tailorMade** - Custom trips
19. **blog** - Blog content

## 🔄 Language Switching

Users can switch languages by:
1. Clicking the flag icon in the navbar
2. Selecting from the dropdown menu
3. Language preference is saved in localStorage
4. Page content updates immediately

## 🌐 Special Language Features

### Arabic (ar)
- Automatic RTL (Right-to-Left) layout
- HTML `dir="rtl"` attribute set automatically
- Proper Arabic typography

### Chinese (zh)
- Simplified Chinese characters
- Culturally appropriate terminology

### Japanese (ja)
- Polite form (です/ます style)
- Proper Japanese expressions

### Russian (ru)
- Cyrillic script
- Formal language style

## 📝 Quick Tips

1. **Always use translation keys** - Never hardcode text
2. **Check for missing keys** - Use fallback: `t('key') || 'Default'`
3. **Test all languages** - Switch between languages to verify
4. **Keep keys descriptive** - Use `booking.confirmBooking` not `btn1`
5. **Group related keys** - Use sections like `booking.*`, `contact.*`

## 🚀 Getting Started

```typescript
// 1. Import the hook
import { useLanguage } from '@/components/Navbar';

// 2. Use in your component
function MyComponent() {
  const { t, language, setLanguage, dir } = useLanguage();
  
  // 3. Use translations
  return (
    <div dir={dir}>
      <h1>{t('hero.title')}</h1>
      <p>Current language: {language}</p>
    </div>
  );
}
```

## 📞 Need Help?

- Check `COMPREHENSIVE_TRANSLATION_SYSTEM.md` for full documentation
- See `TRANSLATION_EXAMPLES.tsx` for code examples
- Review `COMPLETE_TRANSLATION_FINAL.md` for implementation details

---

**All 9 languages are 100% complete with professional translations!**
