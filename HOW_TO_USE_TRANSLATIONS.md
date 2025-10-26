# How to Use Translations in Your Components

## ❌ Problem: Translations Not Working

The translation system is **fully set up** with all 9 languages, but components need to be updated to actually USE the translations.

## ✅ Solution: Update Components to Use `useLanguage` Hook

### Step 1: Import the Hook

```typescript
import { useLanguage } from '@/components/Navbar';
```

### Step 2: Use the Hook in Your Component

```typescript
function MyComponent() {
  const { t, language } = useLanguage();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <button>{t('common.bookNow')}</button>
    </div>
  );
}
```

## 📝 Example: Update Homepage

### Before (Hardcoded Text):
```typescript
// src/app/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>Luxury Nile River Cruises</h1>
      <p>Experience the magic of ancient Egypt</p>
      <button>Book Now</button>
      <button>Learn More</button>
    </div>
  );
}
```

### After (Using Translations):
```typescript
// src/app/page.tsx
'use client';

import { useLanguage } from '@/components/Navbar';

export default function HomePage() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>{t('hero.subtitle')}</p>
      <button>{t('common.bookNow')}</button>
      <button>{t('common.learnMore')}</button>
    </div>
  );
}
```

## 🎯 Common Components to Update

### 1. Navigation Links
```typescript
// Before
<a href="/dahabiyas">Dahabiyas</a>
<a href="/packages">Packages</a>
<a href="/contact">Contact</a>

// After
const { t } = useLanguage();
<a href="/dahabiyas">{t('nav.dahabiyas')}</a>
<a href="/packages">{t('nav.packages')}</a>
<a href="/contact">{t('nav.contact')}</a>
```

### 2. Buttons
```typescript
// Before
<button>Book Now</button>
<button>Learn More</button>
<button>View Details</button>

// After
const { t } = useLanguage();
<button>{t('common.bookNow')}</button>
<button>{t('common.learnMore')}</button>
<button>{t('common.viewDetails')}</button>
```

### 3. Form Labels
```typescript
// Before
<label>Name</label>
<input placeholder="Enter your name" />
<label>Email</label>
<input placeholder="Enter your email" />

// After
const { t } = useLanguage();
<label>{t('contact.name')}</label>
<input placeholder={t('contact.name')} />
<label>{t('contact.email')}</label>
<input placeholder={t('contact.email')} />
```

### 4. Error Messages
```typescript
// Before
{error && <span>This field is required</span>}
{emailError && <span>Invalid email address</span>}

// After
const { t } = useLanguage();
{error && <span>{t('errors.requiredField')}</span>}
{emailError && <span>{t('errors.invalidEmail')}</span>}
```

### 5. Success Messages
```typescript
// Before
{success && <div>Booking successful!</div>}

// After
const { t } = useLanguage();
{success && <div>{t('success.bookingSuccess')}</div>}
```

## 📂 Files That Need Updating

### Priority 1 (User-Facing):
1. `src/app/page.tsx` - Homepage
2. `src/app/dahabiyas/page.tsx` - Dahabiyas listing
3. `src/app/packages/page.tsx` - Packages listing
4. `src/app/contact/page.tsx` - Contact page
5. `src/app/booking/page.tsx` - Booking page

### Priority 2 (Navigation & UI):
6. Footer component
7. Hero sections
8. Card components
9. Modal dialogs
10. Form components

### Priority 3 (Admin & Auth):
11. Auth pages (signin, signup)
12. Profile pages
13. Admin pages

## 🚀 Quick Start: Update One Component

Let's update the **Contact Page** as an example:

### Current Contact Page (Hardcoded):
```typescript
// src/app/contact/page.tsx
export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <form>
        <label>Name</label>
        <input type="text" />
        
        <label>Email</label>
        <input type="email" />
        
        <label>Message</label>
        <textarea></textarea>
        
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

### Updated Contact Page (With Translations):
```typescript
// src/app/contact/page.tsx
'use client';

import { useLanguage } from '@/components/Navbar';

export default function ContactPage() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('contact.title')}</h1>
      <form>
        <label>{t('contact.name')}</label>
        <input type="text" placeholder={t('contact.name')} />
        
        <label>{t('contact.email')}</label>
        <input type="email" placeholder={t('contact.email')} />
        
        <label>{t('contact.message')}</label>
        <textarea placeholder={t('contact.message')}></textarea>
        
        <button>{t('contact.sendMessage')}</button>
      </form>
    </div>
  );
}
```

## 🔑 Available Translation Keys

### Navigation
- `nav.home`, `nav.dahabiyas`, `nav.packages`, `nav.contact`
- `nav.signin`, `nav.signup`, `nav.logout`

### Common Buttons
- `common.bookNow`, `common.learnMore`, `common.viewDetails`
- `common.submit`, `common.cancel`, `common.save`
- `common.edit`, `common.delete`, `common.confirm`

### Forms
- `contact.name`, `contact.email`, `contact.phone`
- `contact.message`, `contact.sendMessage`
- `auth.email`, `auth.password`, `auth.firstName`

### Messages
- `errors.requiredField`, `errors.invalidEmail`
- `success.bookingSuccess`, `success.messageSent`
- `common.loading`, `common.error`, `common.success`

### Booking
- `booking.checkIn`, `booking.checkOut`, `booking.guests`
- `booking.confirmBooking`, `booking.totalPrice`

**See `TRANSLATION_QUICK_REFERENCE.md` for complete list of all 200+ keys!**

## ✅ Testing Translations

1. **Start your dev server**: `npm run dev`
2. **Open the website** in your browser
3. **Click the flag icon** in the navbar
4. **Select a different language**
5. **Check if the text changes**

If text doesn't change, that component hasn't been updated to use translations yet.

## 🎯 Next Steps

1. **Start with one page** (e.g., Contact page)
2. **Add `useLanguage` hook**
3. **Replace hardcoded text** with `t('key')`
4. **Test the language switcher**
5. **Repeat for other pages**

## 💡 Pro Tips

1. **Always use 'use client'** directive for components using hooks
2. **Check the console** for any translation errors
3. **Use descriptive keys** (e.g., `booking.confirmBooking` not `btn1`)
4. **Test all languages** to ensure translations work
5. **Keep keys consistent** across similar components

## 🆘 Still Not Working?

If translations still don't work after updating components:

1. **Clear browser cache**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Check browser console** for errors
3. **Verify translation files** exist in `src/locales/`
4. **Restart dev server**: Stop and run `npm run dev` again
5. **Check localStorage**: Open DevTools > Application > Local Storage > Check for 'language' key

---

**The translation system is ready - you just need to update your components to use it!** 🚀
