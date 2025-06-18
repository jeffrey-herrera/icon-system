# Icon System Codebase Guide

This guide explains where to find different parts of the Braze Icon Library application in the codebase.

## 📁 Project Structure Overview

```
src/
├── components/          # React components
├── pages/              # Astro pages
├── utils/              # Utility functions and data processing
├── styles/             # Global styles
└── data/               # Static data files
```

## 🧩 Main Components & Where to Find Them

### **Header & Search**
- **File**: `src/components/Header.tsx`
- **Contains**: 
  - Braze logo
  - Main title and icon count
  - Search bar with suggestions
  - Keyboard shortcut hint (`/` key)

### **Search Suggestions**
- **File**: `src/components/SearchSuggestions.tsx`
- **Contains**:
  - Category suggestions
  - Popular search terms
  - Keyboard navigation (up/down arrows)
  - Auto-complete functionality

### **Category Filters**
- **File**: `src/components/CategoryFilters.tsx`
- **Contains**:
  - Horizontal category pills
  - Results summary ("Showing X of Y icons")
  - Category selection logic

### **Icon Grid**
- **File**: `src/components/IconGrid.tsx`
- **Contains**:
  - Category headers with counts
  - Responsive icon grid layout
  - Individual icon cards
  - Empty state handling
  - Mobile optimization (3 columns)

### **Empty States**
- **File**: `src/components/EmptyState.tsx`
- **Contains**:
  - Contextual empty states (search, filter, general)
  - Animated illustrations
  - Helpful suggestions and actions
  - Clear/reset buttons

### **Export Modal**
- **File**: `src/components/ExportModal.tsx`
- **Contains**:
  - Icon preview and details
  - Style selection (stroke, duocolor, solid)
  - Container style options
  - Color picker
  - Size selection
  - Download buttons (SVG, PNG, PDF)
  - Copy functionality

### **Navigation Buttons**
- **File**: `src/components/JumpToTop.tsx`
- **Contains**:
  - Jump to top button
  - Previous/Next section navigation
  - Smart section detection
  - Smooth scrolling with proper offset

### **Footer**
- **File**: `src/components/Footer.tsx`
- **Contains**:
  - Brand attribution message
  - Copyright information
  - Link to braze.com
  - Responsive layout (stacked on mobile, side-by-side on desktop)

### **Main Layout & Logic**
- **File**: `src/components/IconLibrary.tsx`
- **Contains**:
  - Main application state management
  - Search and filter logic
  - Keyboard navigation system
  - Modal state handling
  - Component orchestration

## 🎨 Styling & Design

### **Global Styles**
- **File**: `src/styles/global.css`
- **Contains**: Base styles and Tailwind imports

### **Tailwind Configuration**
- **File**: `tailwind.config.mjs`
- **Contains**: 
  - Custom Braze brand colors
  - Animation configurations
  - Responsive breakpoints

### **Brand Colors**
```css
braze-purple: #801ED7
braze-action: #801ED7  
braze-orange: #FFA524
braze-pink: #FFA4FB
```

## 🔧 Data & Utilities

### **Icon Processing**
- **File**: `src/utils/iconLoader.ts`
- **Contains**:
  - Icon data interfaces
  - SVG optimization functions
  - Container style generation
  - Color definitions
  - Category name mapping
  - Search and filter functions

### **Icon Data**
- **File**: `src/data/icons.json`
- **Contains**: Complete icon database with metadata

### **Build Scripts**
- **File**: `scripts/generateIconData.js`
- **Contains**: Script to process SVG files and generate icon data

## 📱 Pages & Routing

### **Main Page**
- **File**: `src/pages/index.astro`
- **Contains**: 
  - Page layout and meta tags
  - Icon data loading
  - Main IconLibrary component

## 🎯 Key Features & Their Locations

### **Search Functionality**
- **Logic**: `src/utils/iconLoader.ts` → `filterIcons()`
- **UI**: `src/components/Header.tsx`
- **Suggestions**: `src/components/SearchSuggestions.tsx`

### **Category Filtering**
- **Logic**: `src/components/IconLibrary.tsx` → `handleSelectCategory()`
- **UI**: `src/components/CategoryFilters.tsx`

### **Keyboard Navigation**
- **Logic**: `src/components/IconLibrary.tsx` → keyboard event handlers
- **Arrow key navigation through icons**
- **`/` to focus search**
- **`Esc` to close modals/clear search**

### **Icon Export System**
- **Modal**: `src/components/ExportModal.tsx`
- **SVG Generation**: `src/utils/iconLoader.ts` → `generateOptimizedSVG()`
- **Download Logic**: Built into ExportModal component

### **Responsive Design**
- **Mobile**: 3 columns, compact sizing
- **Tablet**: 3-4 columns, medium sizing  
- **Desktop**: 4-6 columns, full sizing
- **Implementation**: `src/components/IconGrid.tsx`

### **Container Styles**
- **Logic**: `src/utils/iconLoader.ts`
- **Colors**: White, Orange, Purple, Pink, Dark Purple
- **Gradient**: Pink to Orange (left to right) for white containers

## 🔍 Common Customization Points

### **To Change Colors**
1. Update `src/utils/iconLoader.ts` → `COLORS` and `CONTAINER_COLORS`
2. Update `tailwind.config.mjs` → theme colors
3. Update CSS classes throughout components

### **To Modify Layout**
- **Grid columns**: `src/components/IconGrid.tsx`
- **Spacing**: Tailwind classes in component files
- **Responsive breakpoints**: `tailwind.config.mjs`

### **To Add New Features**
- **New components**: Create in `src/components/`
- **New utilities**: Add to `src/utils/`
- **State management**: Extend `src/components/IconLibrary.tsx`

### **To Update Icon Data**
1. Add SVG files to appropriate category folders
2. Run `node scripts/generateIconData.js`
3. Rebuild the application

## 🚀 Development Workflow

### **Local Development**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### **Icon Processing**
```bash
node scripts/generateIconData.js    # Regenerate icon database
```

## 📊 Analytics & Tracking

### **Potential Integration Points**
- **Download tracking**: `src/components/ExportModal.tsx`
- **Search analytics**: `src/components/Header.tsx`
- **Category usage**: `src/components/CategoryFilters.tsx`
- **User journey**: `src/components/IconLibrary.tsx`

---

This guide should help you navigate the codebase and make targeted changes to specific features. Each component is designed to be modular and self-contained for easy maintenance and updates. 