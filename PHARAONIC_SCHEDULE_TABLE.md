# Pharaonic Schedule & Rates Table Implementation

## Overview

This implementation provides a beautifully styled, fully editable schedule and rates table for the Dahabiya Nile Cruise website, matching the reference table design with a pharaonic theme.

## Features

### ✨ **Modern Pharaonic Design**
- Egyptian hieroglyphic symbols and decorative elements
- Rich blue and gold color scheme inspired by ancient Egypt
- Gradient backgrounds and elegant typography
- Responsive design that works on all devices

### 🔧 **Full Editability**
- **Inline Editing**: Click "Edit" to modify any field directly in the table
- **Real-time Updates**: Changes are reflected immediately in the UI
- **Data Persistence**: Edits are saved via API calls (when backend is implemented)
- **Validation**: Form validation ensures data integrity

### 📊 **Data Management**
- **Default Sample Data**: Pre-populated with sample schedule entries matching the reference table
- **Month Grouping**: Entries are automatically grouped and sorted by month/year
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **API Integration**: Ready for backend database integration

### 🎨 **Visual Elements**
- **Hieroglyphic Headers**: Each month section features Egyptian symbols
- **Color-Coded Fields**: Different colors for different data types (dates, locations, prices)
- **Hover Effects**: Interactive elements with smooth transitions
- **Professional Typography**: Clear, readable fonts with proper hierarchy

## File Structure

```
src/app/
├── schedule-and-rates/
│   └── page.tsx                 # Main schedule page component
└── api/
    └── schedule-entries/
        └── route.ts            # API endpoint for schedule data

```

## Implementation Details

### **Component Structure**
- **ScheduleEntry Interface**: TypeScript interface defining the data structure
- **MonthGroup Interface**: Groups entries by month for organized display
- **State Management**: React hooks for managing editable state
- **API Integration**: Fetch, update, and delete operations

### **Default Data**
The component includes comprehensive sample data matching the reference table:
- Multiple August 2025 entries
- September 2025 entries
- Different route combinations (Luxor-Aswan, Aswan-Luxor)
- Various night durations (3-4 nights)
- Realistic pricing ($705-$940 for double occupancy)

### **Styling Features**
- **Pharaonic Theme**: Egyptian-inspired colors and symbols
- **Responsive Grid**: 8-column layout that adapts to screen size
- **Visual Hierarchy**: Clear distinction between headers, data, and actions
- **Interactive Elements**: Buttons, forms, and hover states

## Usage

### **Viewing the Schedule**
1. Navigate to `/schedule-and-rates`
2. View the complete schedule organized by month
3. See all pricing and route information in a clear table format

### **Editing Entries**
1. Click the "Edit" button on any row
2. Modify fields using inline form inputs
3. Click "Save" to persist changes or "Cancel" to discard
4. Changes are immediately reflected in the table

### **Adding New Entries**
- API endpoint ready for POST operations
- Admin interface can be extended to add new schedule entries

### **Deleting Entries**
- Click the "×" button to remove entries
- Confirmation and API integration ready

## API Endpoints

### **GET /api/schedule-entries**
- Fetches all schedule entries from database
- Returns empty array to use fallback data if no entries exist
- Handles errors gracefully

### **POST /api/schedule-entries**
- Creates new schedule entry
- Validates required fields
- Requires admin authentication
- Returns created entry data

### **PUT /api/schedule-entries**
- Updates existing schedule entry
- Validates entry ID and data
- Requires admin authentication
- Returns updated entry data

### **DELETE /api/schedule-entries**
- Deletes schedule entry by ID
- Requires admin authentication
- Returns success confirmation

## Technical Features

### **TypeScript Support**
- Full type safety for all data structures
- Interface definitions for better development experience
- Compile-time error checking

### **Error Handling**
- Graceful fallback to default data
- Console error logging for debugging
- User-friendly error states

### **Performance Optimization**
- Efficient state management
- Minimal re-renders
- Optimized API calls

### **Accessibility**
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly

## Customization

### **Colors and Theming**
The pharaonic theme can be customized by modifying the Tailwind classes:
- Primary blue: `blue-600`, `blue-700`, `blue-800`
- Accent amber: `amber-100`, `amber-200`, `amber-500`
- Success green: `green-600`, `green-700`
- Warning colors: `red-600`, `purple-600`

### **Hieroglyphic Symbols**
Egyptian symbols can be changed or added:
- `𓇳` - Sun disk (main brand symbol)
- `𓊽` - Month dividers
- `𓀀` - Information sections
- `𓊨` - Contact sections

### **Data Fields**
Easy to add new columns by:
1. Updating the `ScheduleEntry` interface
2. Adding new table headers
3. Including form fields for editing
4. Updating API validation

## Integration Notes

### **Database Schema**
When implementing with a database, consider these fields:
```sql
CREATE TABLE schedule_entries (
  id VARCHAR PRIMARY KEY,
  month VARCHAR NOT NULL,
  year VARCHAR NOT NULL,
  start_date VARCHAR NOT NULL,
  end_date VARCHAR NOT NULL,
  nights INTEGER NOT NULL,
  start_point VARCHAR NOT NULL,
  end_point VARCHAR NOT NULL,
  double_price VARCHAR NOT NULL,
  single_supplement VARCHAR NOT NULL,
  detailed_itinerary TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 999,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Admin Panel Integration**
The schedule table can be integrated with the existing admin panel:
1. Add route to admin navigation
2. Include authentication checks
3. Provide batch operations for multiple entries
4. Add import/export functionality

## Future Enhancements

### **Planned Features**
- **Drag & Drop Reordering**: Visual reordering of schedule entries
- **Bulk Operations**: Select multiple entries for batch edits
- **Advanced Filtering**: Filter by month, route, price range
- **Export Functionality**: PDF/Excel export of schedule data
- **Calendar View**: Alternative calendar-based display
- **Booking Integration**: Direct booking from schedule entries

### **Advanced Styling**
- **Animations**: Smooth transitions and micro-interactions
- **Mobile Optimization**: Enhanced mobile editing experience
- **Print Styles**: Optimized printing layouts
- **Dark Mode**: Alternative dark theme option

## Support

For questions or issues with the pharaonic schedule table implementation, please refer to the main project documentation or contact the development team.

The implementation follows React and Next.js best practices and is fully compatible with the existing Dahabiya website architecture.
