# Dahabiyat Nile Cruise - Admin Panel Guide

## Admin Dashboard Documentation

This guide is exclusively for administrators with authenticated admin accounts. It covers all administrative functions and management capabilities.

---

## Table of Contents

1. [Admin Access & Authentication](#admin-access--authentication)
2. [Dashboard Overview](#dashboard-overview)
3. [Content Management](#content-management)
4. [Dahabiya Management](#dahabiya-management)
5. [Itinerary Management](#itinerary-management)
6. [Package Management](#package-management)
7. [Booking Management](#booking-management)
8. [User Management](#user-management)
9. [Media Library](#media-library)
10. [Blog Management](#blog-management)
11. [Review Management](#review-management)
12. [WhatsApp Settings](#whatsapp-settings)
13. [Website Settings](#website-settings)
14. [Analytics & Reports](#analytics--reports)
15. [SEO Management](#seo-management)
16. [Security & Permissions](#security--permissions)

---

## Admin Access & Authentication

### How do I access the admin panel?
1. Navigate to `/admin` or click the Admin link (visible only to admin accounts)
2. If not logged in, you'll be redirected to the sign-in page
3. Enter your admin credentials
4. Upon successful authentication, you'll be redirected to the admin dashboard

### Who can access the admin panel?
Only users with the **ADMIN** role can access the admin panel. Regular users cannot access administrative functions even if they know the URL.

### How is admin access secured?
- **Role-based authentication**: Middleware checks user role on every admin route
- **Session management**: Secure session tokens with automatic expiration
- **Protected API routes**: All admin API endpoints verify admin role
- **Activity logging**: Admin actions are logged for security auditing

### What if I'm logged in as admin but see "Access Denied"?
1. Verify your account has ADMIN role (check with system administrator)
2. Clear browser cache and cookies
3. Log out and log back in
4. Check if your session has expired
5. Contact the system administrator if issues persist

### Can I have multiple admin accounts?
Yes, multiple users can have admin privileges. Each admin has their own credentials and actions are tracked individually.

### How do I change my admin password?
1. Go to **Profile** → **Settings**
2. Click **Change Password**
3. Enter current password
4. Enter new password (must meet security requirements)
5. Confirm new password
6. Save changes

---

## Dashboard Overview

### What does the admin dashboard show?
The main dashboard displays:
- **Key Metrics**: Total bookings, revenue, active users, pending reviews
- **Recent Activity**: Latest bookings, user registrations, reviews
- **Quick Actions**: Shortcuts to common tasks
- **Analytics Charts**: Booking trends, revenue graphs, user growth
- **Alerts & Notifications**: Pending approvals, low inventory, system messages

### How do I navigate the admin panel?
Use the left sidebar menu with sections:
- **Dashboard**: Overview and analytics
- **Content**: Website content management
- **Dahabiyat**: Vessel management
- **Itineraries**: Route management
- **Packages**: Package creation and editing
- **Bookings**: Reservation management
- **Users**: User account management
- **Media**: Image and file library
- **Blog**: Blog post management
- **Reviews**: Customer review moderation
- **Settings**: System configuration
- **Reports**: Analytics and exports

### Can I customize the dashboard?
Some dashboard widgets can be rearranged or hidden based on your preferences. Look for customization options in the dashboard settings.

---

## Content Management

### How do I edit website content?
1. Go to **Content** → **Website Content**
2. Select the page or section to edit:
   - Homepage content
   - About page
   - Contact information
   - Footer content
   - Global settings
3. Click **Edit** on any content field
4. Make changes in the editor
5. Preview changes
6. Click **Save** or **Publish**

### What types of content can I edit?
- **Text Content**: Headings, paragraphs, descriptions
- **Images**: Hero images, banners, logos
- **Links**: Navigation links, social media URLs
- **Contact Info**: Phone numbers, email addresses, physical address
- **SEO Meta**: Page titles, descriptions, keywords
- **Custom Fields**: Any dynamic content fields

### How do I use the rich text editor?
The editor supports:
- **Formatting**: Bold, italic, underline, headings
- **Lists**: Bulleted and numbered lists
- **Links**: Insert hyperlinks
- **Images**: Embed images from media library
- **Tables**: Create data tables
- **Code**: Add HTML/CSS if needed
- **Preview**: See how content will appear

### Can I schedule content updates?
Yes, use the **Publish Date** field to schedule content to go live at a specific date and time.

### How do I revert changes?
Most content sections have **Version History**:
1. Click **History** button
2. View previous versions
3. Select a version to preview
4. Click **Restore** to revert

---

## Dahabiya Management

### How do I add a new dahabiya?
1. Go to **Dahabiyat** → **Add New**
2. Fill in required information:
   - Name
   - Description
   - Specifications (length, capacity, cabins, crew)
   - Amenities and features
   - Pricing information
3. Upload images (main image and gallery)
4. Set availability calendar
5. Assign compatible itineraries
6. Click **Save** or **Publish**

### How do I edit an existing dahabiya?
1. Go to **Dahabiyat** → **All Dahabiyat**
2. Find the vessel in the list
3. Click **Edit**
4. Make changes
5. Click **Update**

### How do I manage dahabiya availability?
1. Edit the dahabiya
2. Go to **Availability** tab
3. Use the calendar to:
   - Block dates (maintenance, private bookings)
   - Set available dates
   - Mark peak/off-peak seasons
   - Set seasonal pricing
4. Save changes

### Can I duplicate a dahabiya?
Yes, when viewing a dahabiya, click **Duplicate** to create a copy with all settings. Useful for creating similar vessels.

### How do I delete a dahabiya?
1. Edit the dahabiya
2. Scroll to bottom
3. Click **Delete** button
4. Confirm deletion
5. **Note**: Cannot delete if active bookings exist

### How do I feature a dahabiya on the homepage?
1. Edit the dahabiya
2. Check **Featured** checkbox
3. Set **Feature Order** (determines display position)
4. Save changes

---

## Itinerary Management

### How do I create a new itinerary?
1. Go to **Itineraries** → **Add New**
2. Enter basic information:
   - Title
   - Duration (number of days)
   - Starting point
   - Ending point
   - Difficulty level
3. Add day-by-day breakdown:
   - Day number
   - Activities
   - Sites visited
   - Meals included
4. Upload route map and images
5. Set pricing
6. Assign compatible dahabiyas
7. Publish

### How do I edit itinerary details?
1. Go to **Itineraries** → **All Itineraries**
2. Click **Edit** on the itinerary
3. Modify any section
4. Update and save

### Can I create custom itineraries for specific bookings?
Yes, use **Tailor-Made** section:
1. Go to **Tailor-Made** → **Create Custom**
2. Build custom itinerary
3. Link to specific customer/booking
4. Set custom pricing

### How do I manage itinerary PDFs?
1. Edit the itinerary
2. Go to **Downloads** section
3. Upload PDF or auto-generate from content
4. Enable/disable download option for users
5. Update PDF when itinerary changes

---

## Package Management

### How do I create a package?
1. Go to **Packages** → **Add New**
2. Enter package details:
   - Name and description
   - Duration
   - Pricing (per person, per cabin)
3. Select included components:
   - Dahabiya
   - Itinerary
   - Meals
   - Excursions
   - Transfers
4. Set availability dates
5. Add terms and conditions
6. Upload package images
7. Publish

### How do I set package pricing?
Pricing options:
- **Per Person**: Price per individual traveler
- **Per Cabin**: Price per cabin (specify occupancy)
- **Seasonal Pricing**: Different rates for peak/off-peak
- **Group Discounts**: Automatic discounts for larger groups
- **Early Bird**: Discounts for advance bookings

### Can I create package bundles?
Yes, create multi-package deals:
1. Go to **Packages** → **Bundles**
2. Select packages to bundle
3. Set bundle discount
4. Create bundle description
5. Publish

### How do I feature packages?
1. Edit the package
2. Check **Featured** option
3. Set display priority
4. Choose homepage placement
5. Save

---

## Booking Management

### How do I view all bookings?
1. Go to **Bookings** → **All Bookings**
2. View list with filters:
   - Status (pending, confirmed, completed, cancelled)
   - Date range
   - Dahabiya
   - Customer name

### How do I manage a booking?
1. Click on any booking to view details
2. Available actions:
   - **Confirm**: Approve pending booking
   - **Modify**: Change dates, cabin, or details
   - **Cancel**: Cancel booking and process refund
   - **Send Confirmation**: Resend confirmation email
   - **Add Notes**: Internal notes for staff
   - **Contact Customer**: Quick email/phone link

### How do I process payments?
1. View booking details
2. Go to **Payment** tab
3. See payment status:
   - Pending
   - Partial (deposit paid)
   - Paid in full
   - Refunded
4. Record manual payments
5. Process refunds if needed

### Can I export booking data?
Yes:
1. Go to **Bookings** → **Export**
2. Select date range and filters
3. Choose format (CSV, Excel, PDF)
4. Click **Export**
5. Download file

### How do I handle booking modifications?
1. Open the booking
2. Click **Modify**
3. Change details (dates, cabin, guests)
4. System calculates price difference
5. Send modification confirmation to customer
6. Process additional payment or refund

### What about cancellations and refunds?
1. Open the booking
2. Click **Cancel**
3. Select cancellation reason
4. System calculates refund based on cancellation policy
5. Approve refund amount
6. Process refund through payment gateway
7. Send cancellation confirmation

---

## User Management

### How do I view all users?
1. Go to **Users** → **All Users**
2. View user list with:
   - Name and email
   - Registration date
   - Role (User, Admin, Guide)
   - Status (Active, Inactive, Suspended)
   - Total bookings

### How do I edit user information?
1. Click on a user
2. Edit fields:
   - Personal information
   - Contact details
   - Role assignment
   - Account status
3. Save changes

### How do I promote a user to admin?
1. Edit the user
2. Change **Role** to **ADMIN**
3. Save changes
4. User will have admin access on next login

### Can I suspend or ban users?
Yes:
1. Edit the user
2. Change **Status** to **Suspended** or **Banned**
3. Add reason (optional)
4. Save
5. User will be unable to log in

### How do I view user activity?
1. Open user profile
2. Go to **Activity** tab
3. View:
   - Booking history
   - Reviews posted
   - Wishlist items
   - Login history
   - Support tickets

### Can I send messages to users?
Yes:
1. Select user(s)
2. Click **Send Message**
3. Compose email
4. Send immediately or schedule

---

## Media Library

### How do I upload images?
1. Go to **Media** → **Upload**
2. Drag and drop files or click to browse
3. Select images (JPG, PNG, WebP supported)
4. Add metadata:
   - Title
   - Alt text (for SEO)
   - Description
   - Categories/tags
5. Upload

### How do I organize media files?
- **Folders**: Create folders for different categories
- **Tags**: Add tags for easy searching
- **Collections**: Group related images
- **Filters**: Filter by type, date, size

### Can I edit images in the media library?
Basic editing available:
- Crop and resize
- Rotate
- Adjust brightness/contrast
- Add watermarks
- Optimize for web

### How do I use media in content?
1. When editing content, click **Add Media**
2. Browse or search media library
3. Select image
4. Set display options (size, alignment, caption)
5. Insert into content

### What file types are supported?
- **Images**: JPG, PNG, GIF, WebP, SVG
- **Documents**: PDF, DOC, DOCX
- **Videos**: MP4, WebM (or embed from YouTube/Vimeo)

### How do I delete media files?
1. Select file(s) in media library
2. Click **Delete**
3. Confirm deletion
4. **Warning**: Check if file is used in content before deleting

---

## Blog Management

### How do I create a blog post?
1. Go to **Blog** → **Add New**
2. Enter title
3. Write content using rich text editor
4. Add featured image
5. Set categories and tags
6. Configure SEO settings
7. Choose publish status:
   - **Draft**: Save without publishing
   - **Scheduled**: Publish at specific date/time
   - **Published**: Make live immediately

### How do I edit existing posts?
1. Go to **Blog** → **All Posts**
2. Click **Edit** on any post
3. Make changes
4. Update

### Can I schedule blog posts?
Yes:
1. When creating/editing post
2. Set **Publish Date** to future date
3. Save as **Scheduled**
4. Post will automatically publish at that time

### How do I manage blog categories?
1. Go to **Blog** → **Categories**
2. Add new categories
3. Edit existing categories
4. Set category hierarchy (parent/child)
5. Assign posts to categories

### How do I optimize blog posts for SEO?
1. Edit the post
2. Go to **SEO** section
3. Set:
   - Meta title
   - Meta description
   - Focus keyword
   - Slug (URL)
   - Open Graph image (for social sharing)
4. Use SEO score indicator for optimization tips

---

## Review Management

### How do I view all reviews?
1. Go to **Reviews** → **All Reviews**
2. View reviews with filters:
   - Status (pending, approved, rejected)
   - Rating (1-5 stars)
   - Date range
   - Dahabiya/Package

### How do I moderate reviews?
1. Click on a review
2. Read content
3. Take action:
   - **Approve**: Make visible on website
   - **Reject**: Hide from public view
   - **Edit**: Modify content (use sparingly)
   - **Reply**: Post official response
   - **Flag**: Mark for further review

### Can I respond to reviews?
Yes:
1. Open the review
2. Click **Reply**
3. Write your response
4. Publish reply (appears below review)

### How do I handle inappropriate reviews?
1. Flag the review
2. Select reason (spam, offensive, fake)
3. Reject or delete
4. Consider contacting the user if needed

### Can I feature positive reviews?
Yes:
1. Open the review
2. Check **Featured** option
3. Featured reviews appear on homepage and relevant pages

---

## WhatsApp Settings

### How do I configure the WhatsApp button?
1. Go to **Settings** → **WhatsApp Settings**
2. Configure:
   - **Enable/Disable**: Toggle WhatsApp button
   - **Phone Number**: Enter WhatsApp business number (with country code)
   - **Default Message**: Pre-filled message when users click button
   - **Position**: Bottom-right or bottom-left
   - **Delay**: Seconds before button appears
   - **Business Hours**: Set when button is active
   - **Offline Message**: Message shown outside business hours

### How do I test WhatsApp integration?
1. Save settings
2. Open website in new tab
3. Click WhatsApp button
4. Verify it opens WhatsApp with correct number and message

### Can I customize the WhatsApp button appearance?
The button now uses the blue color scheme matching the 3D model. Position and size are automatically optimized for mobile and desktop.

---

## Website Settings

### How do I change site-wide settings?
1. Go to **Settings** → **General**
2. Configure:
   - **Site Name**: Website title
   - **Tagline**: Site description
   - **Logo**: Upload site logo
   - **Favicon**: Upload favicon
   - **Contact Information**: Email, phone, address
   - **Social Media**: Links to social profiles
   - **Currency**: Default currency for pricing
   - **Timezone**: Site timezone

### How do I manage navigation menus?
1. Go to **Settings** → **Menus**
2. Edit main navigation
3. Add/remove menu items
4. Drag to reorder
5. Create sub-menus
6. Save changes

### How do I configure email settings?
1. Go to **Settings** → **Email**
2. Set:
   - SMTP server details
   - Sender name and email
   - Email templates
   - Notification preferences

### Can I enable maintenance mode?
Yes:
1. Go to **Settings** → **Maintenance**
2. Enable maintenance mode
3. Set custom message
4. Admins can still access site
5. Regular users see maintenance page

---

## Analytics & Reports

### What analytics are available?
1. Go to **Reports** → **Analytics**
2. View metrics:
   - **Traffic**: Page views, unique visitors, bounce rate
   - **Bookings**: Conversion rates, revenue, popular packages
   - **Users**: Registrations, active users, demographics
   - **Performance**: Page load times, error rates

### How do I generate reports?
1. Go to **Reports** → **Generate Report**
2. Select report type:
   - Booking summary
   - Revenue report
   - User activity
   - Inventory status
3. Set date range
4. Choose format (PDF, Excel, CSV)
5. Generate and download

### Can I schedule automated reports?
Yes:
1. Go to **Reports** → **Scheduled Reports**
2. Create new schedule
3. Set frequency (daily, weekly, monthly)
4. Select recipients
5. Choose report types
6. Activate schedule

### How do I track marketing campaigns?
1. Use UTM parameters in marketing links
2. View campaign performance in **Analytics** → **Campaigns**
3. Track conversions and ROI

---

## SEO Management

### How do I optimize site SEO?
1. Go to **Settings** → **SEO**
2. Configure:
   - **Meta Tags**: Default title and description
   - **Keywords**: Site-wide keywords
   - **Schema Markup**: Structured data
   - **Sitemap**: Auto-generated XML sitemap
   - **Robots.txt**: Search engine directives

### How do I manage individual page SEO?
When editing any page/post:
1. Scroll to **SEO** section
2. Set page-specific:
   - Title tag
   - Meta description
   - Focus keyword
   - Canonical URL
   - Open Graph tags

### Can I submit sitemap to search engines?
Yes:
1. Go to **SEO** → **Sitemap**
2. View generated sitemap at `/sitemap.xml`
3. Copy sitemap URL
4. Submit to Google Search Console and Bing Webmaster Tools

### How do I check SEO performance?
1. Go to **SEO** → **Performance**
2. View:
   - Search rankings
   - Organic traffic
   - Top keywords
   - Backlinks
   - SEO score by page

---

## Security & Permissions

### How do I manage admin permissions?
1. Go to **Settings** → **Roles & Permissions**
2. View/edit roles:
   - **Super Admin**: Full access
   - **Admin**: Most features
   - **Editor**: Content management only
   - **Moderator**: Review management only
3. Customize permissions per role

### How do I view security logs?
1. Go to **Settings** → **Security**
2. View logs:
   - Login attempts
   - Failed authentications
   - Admin actions
   - Data exports
   - Permission changes

### Can I enable two-factor authentication?
Yes:
1. Go to **Profile** → **Security**
2. Enable 2FA
3. Scan QR code with authenticator app
4. Enter verification code
5. Save backup codes

### How do I handle security alerts?
1. Check **Dashboard** for security notifications
2. Review suspicious activity
3. Take action:
   - Reset passwords
   - Suspend accounts
   - Block IP addresses
   - Enable additional security measures

### What if I suspect a security breach?
1. Immediately change admin passwords
2. Review security logs
3. Check for unauthorized changes
4. Suspend suspicious accounts
5. Contact system administrator
6. Enable maintenance mode if necessary

---

## Best Practices for Admins

### Content Management
- Preview changes before publishing
- Use version control to track changes
- Optimize images before uploading
- Write descriptive alt text for accessibility
- Keep content fresh and updated

### Booking Management
- Respond to bookings within 24 hours
- Keep availability calendars updated
- Process refunds promptly
- Maintain clear communication with customers
- Document special requests

### User Management
- Regularly review user accounts
- Remove inactive accounts (with notice)
- Respond to user inquiries quickly
- Protect user privacy and data
- Monitor for fraudulent activity

### Security
- Use strong, unique passwords
- Enable two-factor authentication
- Log out when finished
- Don't share admin credentials
- Regularly review security logs
- Keep system updated

### Performance
- Optimize images before uploading
- Regularly clean up unused media
- Monitor site performance metrics
- Test on multiple devices and browsers
- Keep plugins and dependencies updated

---

## Troubleshooting

### I can't log in to admin panel
- Verify you have admin role
- Check if account is active
- Clear browser cache
- Try password reset
- Contact system administrator

### Changes aren't appearing on the website
- Clear cache (browser and server)
- Check if changes were saved
- Verify publish status
- Check if maintenance mode is enabled
- Hard refresh page (Ctrl+F5)

### Images aren't uploading
- Check file size (max 10MB typically)
- Verify file format is supported
- Check server storage space
- Try different browser
- Check upload permissions

### Emails aren't sending
- Verify SMTP settings
- Check spam folder
- Test email configuration
- Review email logs
- Contact hosting provider

### Performance is slow
- Check server resources
- Optimize database
- Clear old logs and cache
- Reduce image sizes
- Review active plugins

---

## Quick Reference

### Common Admin Tasks

| Task | Navigation Path |
|------|----------------|
| Add new dahabiya | Dahabiyat → Add New |
| Edit homepage | Content → Homepage |
| Approve booking | Bookings → Pending → Approve |
| Moderate review | Reviews → Pending → Approve/Reject |
| Upload images | Media → Upload |
| Create blog post | Blog → Add New |
| Change settings | Settings → General |
| View analytics | Reports → Analytics |
| Manage users | Users → All Users |
| Configure WhatsApp | Settings → WhatsApp Settings |

### Keyboard Shortcuts

- `Ctrl + S`: Save changes
- `Ctrl + P`: Preview
- `Ctrl + Z`: Undo
- `Ctrl + Y`: Redo
- `Esc`: Close modal/dialog

---

## Support for Admins

### Need Help?
- Check this documentation first
- Review video tutorials (if available)
- Contact system administrator
- Submit support ticket
- Check community forums

### Reporting Bugs
1. Document the issue (screenshots helpful)
2. Note steps to reproduce
3. Check if others have reported same issue
4. Submit bug report with details
5. Include browser/device information

---

**Admin Panel Version**: 1.0  
**Last Updated**: 2025-10-04

For technical support, contact the development team or system administrator.
