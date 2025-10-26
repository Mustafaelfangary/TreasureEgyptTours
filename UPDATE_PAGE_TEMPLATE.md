# Quick Page Update Template

## Copy-Paste Template for Any Page

### 1. Add Import at Top
```typescript
import { useLanguage } from '@/components/Navbar';
```

### 2. Add Hook in Component
```typescript
export default function YourPage() {
  const { t } = useLanguage();
  
  // ... rest of your code
}
```

### 3. Common Replacements

#### Navigation & Buttons
| Find | Replace With |
|------|--------------|
| `"Home"` | `{t('nav.home')}` |
| `"Contact"` | `{t('nav.contact')}` |
| `"Book Now"` | `{t('common.bookNow')}` |
| `"Learn More"` | `{t('common.learnMore')}` |
| `"View Details"` | `{t('common.viewDetails')}` |
| `"Read More"` | `{t('common.readMore')}` |
| `"Submit"` | `{t('common.submit')}` |
| `"Cancel"` | `{t('common.cancel')}` |
| `"Save"` | `{t('common.save')}` |
| `"Edit"` | `{t('common.edit')}` |
| `"Delete"` | `{t('common.delete')}` |
| `"Search"` | `{t('common.search')}` |
| `"Filter"` | `{t('common.filter')}` |
| `"Loading..."` | `{t('common.loading')}` |

#### Contact Form
| Find | Replace With |
|------|--------------|
| `"Contact Us"` | `{t('contact.title')}` |
| `"Name"` | `{t('contact.name')}` |
| `"Email"` | `{t('contact.email')}` |
| `"Phone"` | `{t('contact.phone')}` |
| `"Subject"` | `{t('contact.subject')}` |
| `"Message"` | `{t('contact.message')}` |
| `"Send Message"` | `{t('contact.sendMessage')}` |

#### Auth Pages
| Find | Replace With |
|------|--------------|
| `"Sign In"` | `{t('auth.signIn')}` |
| `"Sign Up"` | `{t('auth.signUp')}` |
| `"Email"` | `{t('auth.email')}` |
| `"Password"` | `{t('auth.password')}` |
| `"Confirm Password"` | `{t('auth.confirmPassword')}` |
| `"Forgot Password?"` | `{t('auth.forgotPassword')}` |
| `"Remember Me"` | `{t('auth.rememberMe')}` |
| `"First Name"` | `{t('auth.firstName')}` |
| `"Last Name"` | `{t('auth.lastName')}` |

#### Booking
| Find | Replace With |
|------|--------------|
| `"Check-in"` | `{t('booking.checkIn')}` |
| `"Check-out"` | `{t('booking.checkOut')}` |
| `"Guests"` | `{t('booking.guests')}` |
| `"Adults"` | `{t('booking.adults')}` |
| `"Children"` | `{t('booking.children')}` |
| `"Total Price"` | `{t('booking.totalPrice')}` |
| `"Confirm Booking"` | `{t('booking.confirmBooking')}` |

#### Error Messages
| Find | Replace With |
|------|--------------|
| `"This field is required"` | `{t('errors.requiredField')}` |
| `"Invalid email"` | `{t('errors.invalidEmail')}` |
| `"Passwords don't match"` | `{t('errors.passwordMismatch')}` |
| `"Page not found"` | `{t('errors.pageNotFound')}` |
| `"Something went wrong"` | `{t('errors.somethingWrong')}` |

#### Success Messages
| Find | Replace With |
|------|--------------|
| `"Booking successful!"` | `{t('success.bookingSuccess')}` |
| `"Payment successful!"` | `{t('success.paymentSuccess')}` |
| `"Message sent!"` | `{t('success.messageSent')}` |
| `"Profile updated!"` | `{t('success.profileUpdated')}` |

## Example: Contact Page

### Before:
```typescript
export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <p>Get in touch with our team</p>
      <form>
        <label>Name</label>
        <input placeholder="Enter your name" />
        
        <label>Email</label>
        <input placeholder="Enter your email" />
        
        <label>Message</label>
        <textarea placeholder="Your message"></textarea>
        
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

### After:
```typescript
'use client';
import { useLanguage } from '@/components/Navbar';

export default function ContactPage() {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('contact.title')}</h1>
      <p>{t('contact.subtitle')}</p>
      <form>
        <label>{t('contact.name')}</label>
        <input placeholder={t('contact.name')} />
        
        <label>{t('contact.email')}</label>
        <input placeholder={t('contact.email')} />
        
        <label>{t('contact.message')}</label>
        <textarea placeholder={t('contact.message')}></textarea>
        
        <button>{t('contact.sendMessage')}</button>
      </form>
    </div>
  );
}
```

## Quick Steps for Each Page

1. **Add 'use client' if not present** (required for hooks)
2. **Import useLanguage**
3. **Add `const { t } = useLanguage();`**
4. **Find & Replace hardcoded text**
5. **Test the page**
6. **Move to next page**

## Time Estimates

| Page Type | Estimated Time |
|-----------|----------------|
| Simple page (Contact, FAQ) | 10-15 min |
| Medium page (Dahabiyas, Packages) | 20-30 min |
| Complex page (Homepage, Booking) | 30-45 min |
| Detail page (Dynamic routes) | 15-20 min |

## Testing After Each Update

```bash
# 1. Start dev server
npm run dev

# 2. Open page in browser
# http://localhost:3000/your-page

# 3. Click flag icon in navbar
# 4. Select different languages
# 5. Verify text changes
# 6. Check for console errors
```

## Common Issues & Fixes

### Issue 1: "t is not defined"
**Fix**: Add `const { t } = useLanguage();`

### Issue 2: "useLanguage is not a function"
**Fix**: Add `import { useLanguage } from '@/components/Navbar';`

### Issue 3: "Cannot use hooks in server component"
**Fix**: Add `'use client';` at the top of the file

### Issue 4: Text doesn't change when switching languages
**Fix**: Make sure you're using `{t('key')}` not `"hardcoded text"`

### Issue 5: Translation key shows instead of text
**Fix**: Check if the key exists in translation files. Use correct key path (e.g., `contact.title` not `contactTitle`)

---

**Use this template to quickly update any page in your application!** 🚀
