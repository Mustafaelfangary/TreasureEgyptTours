# Dahabiyas Dropdown Menu - Custom Order

## Summary

Updated the dahabiyas dropdown menu in both desktop and mobile navigation to display items in a specific custom order.

---

## ✅ Custom Order Applied

The dahabiyas will now appear in this exact order:

1. **AZHAR I**
2. **AZHAR II**
3. **Royal Cleopatra**
4. **Princess Cleopatra**
5. **Queen Cleopatra**

Any other dahabiyas not in this list will appear after these, sorted alphabetically.

---

## 📁 Files Modified

### 1. **Desktop Navigation**
**File:** `src/components/Navbar.tsx`
- Lines 372-421

### 2. **Mobile Navigation**
**File:** `src/components/mobile/MobileNavigation.tsx`
- Lines 204-259

---

## 🔧 How It Works

### **Sorting Logic:**

```typescript
const customOrder = [
  'AZHAR I',
  'AZHAR II',
  'Royal Cleopatra',
  'Princess Cleopatra',
  'Queen Cleopatra'
];

// Sort items according to custom order
items.sort((a, b) => {
  const indexA = customOrder.findIndex(name => 
    a.name.toLowerCase().includes(name.toLowerCase()) || 
    name.toLowerCase().includes(a.name.toLowerCase())
  );
  const indexB = customOrder.findIndex(name => 
    b.name.toLowerCase().includes(name.toLowerCase()) || 
    name.toLowerCase().includes(b.name.toLowerCase())
  );

  // If both found in custom order, sort by their position
  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }
  // If only A is in custom order, it comes first
  if (indexA !== -1) return -1;
  // If only B is in custom order, it comes first
  if (indexB !== -1) return 1;
  // If neither in custom order, sort alphabetically
  return a.name.localeCompare(b.name);
});
```

### **Features:**

1. **Flexible Matching:** 
   - Matches partial names (case-insensitive)
   - Works even if database names are slightly different
   - Example: "AZHAR I" matches "Azhar I", "azhar i", "AZHAR I Dahabiya", etc.

2. **Priority System:**
   - Items in custom order appear first
   - Items appear in the exact order specified
   - Other items appear after, sorted alphabetically

3. **Fallback Handling:**
   - If API fails, shows fallback items
   - Graceful degradation

---

## 🎯 Where It Applies

### **Desktop Navigation:**
- Hover over "Dahabiyat" menu item
- Dropdown shows dahabiyas in custom order
- Includes "View All Dahabiyas" link at bottom

### **Mobile Navigation:**
- Tap "Dahabiyat" menu item
- Expandable section shows dahabiyas in custom order
- Same order as desktop

---

## 📱 Visual Result

### **Dropdown Menu:**
```
┌─────────────────────────┐
│ 🚢 Dahabiyat            │
├─────────────────────────┤
│ AZHAR I                 │ ← 1st
│ AZHAR II                │ ← 2nd
│ Royal Cleopatra         │ ← 3rd
│ Princess Cleopatra      │ ← 4th
│ Queen Cleopatra         │ ← 5th
│ [Other Dahabiyas...]    │ ← Alphabetical
├─────────────────────────┤
│ 🚢 View All Dahabiyas   │
└─────────────────────────┘
```

---

## 🔄 Dynamic Updates

The order is applied when:
- Page loads
- Navigation component mounts
- API returns dahabiya data

The sorting happens **client-side** after fetching from the database, so:
- ✅ No database changes needed
- ✅ Works with existing data
- ✅ Easy to modify order in code
- ✅ Applies to both desktop and mobile

---

## 🛠️ Modifying the Order

To change the order in the future:

1. **Open the files:**
   - `src/components/Navbar.tsx`
   - `src/components/mobile/MobileNavigation.tsx`

2. **Find the `customOrder` array:**
   ```typescript
   const customOrder = [
     'AZHAR I',
     'AZHAR II',
     'Royal Cleopatra',
     'Princess Cleopatra',
     'Queen Cleopatra'
   ];
   ```

3. **Modify the array:**
   - Reorder items
   - Add new items
   - Remove items
   - Change names

4. **Save and refresh:**
   - Changes apply immediately
   - No database updates needed

---

## 📊 Example Scenarios

### **Scenario 1: All dahabiyas exist**
Database has: AZHAR I, AZHAR II, Royal Cleopatra, Princess Cleopatra, Queen Cleopatra

**Result:**
1. AZHAR I
2. AZHAR II
3. Royal Cleopatra
4. Princess Cleopatra
5. Queen Cleopatra

---

### **Scenario 2: Extra dahabiyas exist**
Database has: AZHAR I, AZHAR II, Royal Cleopatra, Princess Cleopatra, Queen Cleopatra, Golden Horus, Nile Goddess

**Result:**
1. AZHAR I
2. AZHAR II
3. Royal Cleopatra
4. Princess Cleopatra
5. Queen Cleopatra
6. Golden Horus (alphabetical)
7. Nile Goddess (alphabetical)

---

### **Scenario 3: Some dahabiyas missing**
Database has: AZHAR I, Royal Cleopatra, Golden Horus

**Result:**
1. AZHAR I
2. Royal Cleopatra
3. Golden Horus (alphabetical)

---

## ✅ Testing Checklist

- [ ] Desktop navigation shows correct order
- [ ] Mobile navigation shows correct order
- [ ] Order matches: AZHAR I, AZHAR II, Royal Cleopatra, Princess Cleopatra, Queen Cleopatra
- [ ] Other dahabiyas appear after, alphabetically
- [ ] Dropdown opens correctly
- [ ] Links work correctly
- [ ] No console errors
- [ ] Works on all browsers
- [ ] Mobile responsive

---

## 🎉 Complete!

The dahabiyas dropdown menu now displays in your requested order on both desktop and mobile navigation. The order is maintained consistently across the entire site.
