# Batch Translation Update - Quick Commands

## ✅ Contact Page - DONE
Already updated with:
- `useLanguage` hook added
- Loading text translated
- Hero title and subtitle translated

## 🚀 Quick Update Commands for Remaining Pages

### Use VS Code Find & Replace (Ctrl+H) for each page:

---

## FAQ Page (`src/app/faq/page.tsx`)

**Step 1**: Add imports at top
```typescript
import { useLanguage } from '@/components/Navbar';
```

**Step 2**: Add hook after other hooks
```typescript
const { t } = useLanguage();
```

**Step 3**: Find & Replace:
| Find | Replace |
|------|---------|
| `"FAQ"` | `{t('faq.title')}` |
| `"Frequently Asked Questions"` | `{t('faq.title')}` |
| `"General"` | `{t('faq.general')}` |
| `"Booking"` | `{t('faq.booking')}` |
| `"Payment"` | `{t('faq.payment')}` |
| `"Cancellation"` | `{t('faq.cancellation')}` |
| `"Search FAQ"` | `{t('faq.searchFaq')}` |
| `"Still have questions?"` | `{t('faq.stillHaveQuestions')}` |
| `"Contact Support"` | `{t('faq.contactSupport')}` |

---

## Gallery Page (`src/app/gallery/page.tsx`)

**Step 1-2**: Same as above

**Step 3**: Find & Replace:
| Find | Replace |
|------|---------|
| `"Gallery"` | `{t('gallery.title')}` |
| `"Photo Gallery"` | `{t('gallery.title')}` |
| `"All Photos"` | `{t('gallery.allPhotos')}` |
| `"Categories"` | `{t('gallery.categories')}` |
| `"Dahabiyas"` | `{t('gallery.dahabiyas')}` |
| `"Destinations"` | `{t('gallery.destinations')}` |
| `"Experiences"` | `{t('gallery.experiences')}` |
| `"Cuisine"` | `{t('gallery.cuisine')}` |
| `"View Fullscreen"` | `{t('gallery.viewFullscreen')}` |
| `"Download"` | `{t('common.download')}` |
| `"Share"` | `{t('common.share')}` |

---

## Dahabiyas Page (`src/app/dahabiyas/page.tsx`)

**Step 1-2**: Same as above

**Step 3**: Find & Replace:
| Find | Replace |
|------|---------|
| `"Our Dahabiyas"` | `{t('dahabiyas.title')}` |
| `"Our Luxury Dahabiyas"` | `{t('dahabiyas.title')}` |
| `"Capacity"` | `{t('dahabiyas.capacity')}` |
| `"Cabins"` | `{t('dahabiyas.cabins')}` |
| `"Crew"` | `{t('dahabiyas.crew')}` |
| `"Amenities"` | `{t('dahabiyas.amenities')}` |
| `"Specifications"` | `{t('dahabiyas.specifications')}` |
| `"Features"` | `{t('dahabiyas.features')}` |
| `"Check Availability"` | `{t('dahabiyas.availability')}` |
| `"Book Now"` | `{t('common.bookNow')}` |
| `"View Details"` | `{t('common.viewDetails')}` |
| `"Learn More"` | `{t('common.learnMore')}` |

---

## Packages Page (`src/app/packages/page.tsx`)

**Step 1-2**: Same as above

**Step 3**: Find & Replace:
| Find | Replace |
|------|---------|
| `"Our Packages"` | `{t('packages.title')}` |
| `"Travel Packages"` | `{t('packages.title')}` |
| `"Duration"` | `{t('packages.duration')}` |
| `"Price"` | `{t('packages.price')}` |
| `"From"` | `{t('packages.from')}` |
| `"per person"` | `{t('packages.perPerson')}` |
| `"What's Included"` | `{t('packages.included')}` |
| `"What's Not Included"` | `{t('packages.excluded')}` |
| `"Itinerary"` | `{t('packages.itinerary')}` |
| `"Highlights"` | `{t('packages.highlights')}` |
| `"Book This Package"` | `{t('packages.bookPackage')}` |
| `"Days"` | `{t('itineraries.days')}` |
| `"Nights"` | `{t('itineraries.nights')}` |

---

## Booking Page (`src/app/booking/page.tsx`)

**Step 1-2**: Same as above

**Step 3**: Find & Replace:
| Find | Replace |
|------|---------|
| `"Book Your Journey"` | `{t('booking.title')}` |
| `"Select Dates"` | `{t('booking.selectDates')}` |
| `"Check-in"` | `{t('booking.checkIn')}` |
| `"Check-out"` | `{t('booking.checkOut')}` |
| `"Guests"` | `{t('booking.guests')}` |
| `"Adults"` | `{t('booking.adults')}` |
| `"Children"` | `{t('booking.children')}` |
| `"Infants"` | `{t('booking.infants')}` |
| `"Special Requests"` | `{t('booking.specialRequests')}` |
| `"Total Price"` | `{t('booking.totalPrice')}` |
| `"Deposit"` | `{t('booking.deposit')}` |
| `"Balance"` | `{t('booking.balance')}` |
| `"Confirm Booking"` | `{t('booking.confirmBooking')}` |
| `"Payment Method"` | `{t('booking.paymentMethod')}` |

---

## Auth Pages

### Sign In (`src/app/auth/signin/page.tsx`)

**Step 1-2**: Same as above

**Step 3**: Find & Replace:
| Find | Replace |
|------|---------|
| `"Sign In"` | `{t('auth.signIn')}` |
| `"Email"` | `{t('auth.email')}` |
| `"Password"` | `{t('auth.password')}` |
| `"Remember Me"` | `{t('auth.rememberMe')}` |
| `"Forgot Password?"` | `{t('auth.forgotPassword')}` |
| `"Don't have an account?"` | `{t('auth.noAccount')}` |
| `"Sign Up"` | `{t('auth.signUp')}` |

### Sign Up (`src/app/auth/signup/page.tsx`)

**Step 3**: Find & Replace:
| Find | Replace |
|------|---------|
| `"Sign Up"` | `{t('auth.signUp')}` |
| `"Create Account"` | `{t('auth.createAccount')}` |
| `"First Name"` | `{t('auth.firstName')}` |
| `"Last Name"` | `{t('auth.lastName')}` |
| `"Email"` | `{t('auth.email')}` |
| `"Password"` | `{t('auth.password')}` |
| `"Confirm Password"` | `{t('auth.confirmPassword')}` |
| `"Phone Number"` | `{t('auth.phoneNumber')}` |
| `"Already have an account?"` | `{t('auth.haveAccount')}` |

---

## Profile Page (`src/app/profile/page.tsx`)

**Step 1-2**: Same as above

**Step 3**: Find & Replace:
| Find | Replace |
|------|---------|
| `"My Profile"` | `{t('profile.title')}` |
| `"Personal Information"` | `{t('profile.personalInfo')}` |
| `"Contact Information"` | `{t('profile.contactInfo')}` |
| `"Booking History"` | `{t('profile.bookingHistory')}` |
| `"Wishlist"` | `{t('profile.wishlist')}` |
| `"My Reviews"` | `{t('profile.reviews')}` |
| `"Settings"` | `{t('profile.settings')}` |
| `"Change Password"` | `{t('profile.changePassword')}` |
| `"Language"` | `{t('profile.language')}` |
| `"Currency"` | `{t('profile.currency')}` |
| `"Save Changes"` | `{t('profile.saveChanges')}` |
| `"Edit Profile"` | `{t('profile.editProfile')}` |

---

## Common Replacements for ALL Pages

These can be done globally across multiple files:

| Find | Replace |
|------|---------|
| `"Loading..."` | `{t('common.loading')}` |
| `"Error"` | `{t('common.error')}` |
| `"Success"` | `{t('common.success')}` |
| `"Submit"` | `{t('common.submit')}` |
| `"Cancel"` | `{t('common.cancel')}` |
| `"Save"` | `{t('common.save')}` |
| `"Edit"` | `{t('common.edit')}` |
| `"Delete"` | `{t('common.delete')}` |
| `"Search"` | `{t('common.search')}` |
| `"Filter"` | `{t('common.filter')}` |
| `"Close"` | `{t('common.close')}` |
| `"Back"` | `{t('common.back')}` |
| `"Next"` | `{t('common.next')}` |
| `"Previous"` | `{t('common.previous')}` |
| `"Confirm"` | `{t('common.confirm')}` |
| `"Download"` | `{t('common.download')}` |
| `"Share"` | `{t('common.share')}` |
| `"View All"` | `{t('common.viewAll')}` |
| `"Show More"` | `{t('common.showMore')}` |
| `"Show Less"` | `{t('common.showLess')}` |

---

## ⚡ Pro Tips

### 1. Use Multi-Cursor Editing
- Hold `Alt` and click to add multiple cursors
- Edit multiple lines at once

### 2. Use Regex Find & Replace
Enable regex mode (Alt+R) for complex patterns:
```
Find: "([^"]+)"
Replace: {t('$1')}
```

### 3. Use File-Specific Search
- `Ctrl+Shift+F` for global search
- Limit to specific folders/files

### 4. Test After Each Page
```bash
npm run dev
# Test the page
# Switch languages
# Check for errors
```

### 5. Commit After Each Page
```bash
git add .
git commit -m "Add translations to [page name]"
```

---

## 📊 Progress Tracker

- [x] Homepage - 60% done
- [x] Contact Page - Basic done
- [ ] FAQ Page
- [ ] Gallery Page
- [ ] Dahabiyas Page
- [ ] Packages Page
- [ ] Booking Page
- [ ] Auth Pages (signin, signup)
- [ ] Profile Page
- [ ] Detail Pages
- [ ] Components

---

## 🎯 Estimated Time

- **FAQ**: 15 minutes
- **Gallery**: 10 minutes
- **Dahabiyas**: 30 minutes
- **Packages**: 30 minutes
- **Booking**: 45 minutes
- **Auth Pages**: 30 minutes
- **Profile**: 20 minutes

**Total**: ~3 hours of focused work

---

**Use this guide to systematically update all pages!** 🚀
