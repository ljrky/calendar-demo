# Tailwind CSS v4 Migration Plan

## Overview
Migrate the calendar app from custom CSS to Tailwind CSS v4 using the Play CDN approach (no build step required).

## Current State
- Custom CSS in 4 files: main.css, calendar.css, modal.css, responsive.css
- CSS variables for design tokens (colors, spacing, typography, etc.)
- Responsive design with media queries
- Modal with form, calendar grid, navigation

## Migration Approach
Using Tailwind CSS v4 Play CDN (`@tailwindcss/browser@4`) which allows:
- Immediate usage without build tools
- Custom theme configuration via `@theme` directive
- All Tailwind utility classes available

---

## Tasks

### Phase 1: Setup
- [x] Add Tailwind CSS v4 Play CDN script to index.html
- [x] Add custom theme configuration with existing design tokens
- [x] Test that Tailwind classes work

### Phase 2: Migrate HTML to Tailwind Classes
- [x] Migrate header and navigation styles
- [x] Migrate calendar grid and day cells
- [x] Migrate weekday headers
- [x] Migrate event badges and indicators
- [x] Migrate modal overlay and container
- [x] Migrate form elements (inputs, labels, buttons)
- [x] Migrate color picker
- [x] Migrate form actions

### Phase 3: Responsive Design
- [x] Add responsive classes for mobile (sm:, md:, lg:, xl:)
- [x] Handle modal full-screen on mobile
- [x] Ensure touch-friendly tap targets

### Phase 4: Cleanup
- [x] Remove old CSS files
- [x] Update JavaScript for Tailwind classes
- [x] Verify accessibility is maintained

### Phase 5: Dark Mode
- [x] Add dark: variants throughout
- [x] Update event badge colors for dark mode
- [x] Update scrollbar styling for dark mode

---

## Review Section

### Changes Made

1. **index.html**
   - Added Tailwind CSS v4 Play CDN (`@tailwindcss/browser@4`)
   - Added custom `@theme` configuration with color variables
   - Added custom CSS for animations (fadeIn, slideUp, spin)
   - Added custom scrollbar styling for light/dark modes
   - Added event badge color variations using `data-color` attribute
   - Converted all HTML elements to use Tailwind utility classes
   - Added dark mode support with `dark:` variants
   - Added responsive breakpoints (max-sm:, sm:, md:, lg:, xl:)
   - Added accessibility improvements (focus-ring, aria labels, keyboard nav)

2. **scripts/calendar.js**
   - Updated `createEmptyCell()` to use Tailwind classes
   - Updated `createDayCell()` to use Tailwind classes with responsive sizing
   - Updated `createEventIndicators()` to use Tailwind flex utilities
   - Updated `createEventBadge()` to use Tailwind classes
   - Updated `createCountBadge()` to use Tailwind classes
   - Added keyboard accessibility (tabindex, role, aria-label)

3. **scripts/modal.js**
   - Changed modal show/hide from `active` class to `hidden`/`flex`
   - Added `animate-fade-in` class on open

4. **scripts/validation.js**
   - Updated error state styling to use Tailwind border classes
   - Removed `has-error`/`has-success` class approach

5. **Deleted Files**
   - styles/main.css
   - styles/calendar.css
   - styles/modal.css
   - styles/responsive.css
   - styles/ directory

### Features Implemented

- **Responsive Design**: Mobile-first with breakpoints at sm (640px), md (768px), lg (1024px), xl (1280px)
- **Dark Mode**: Full dark mode support using Tailwind's `dark:` variant
- **Accessibility**: Focus rings, keyboard navigation, aria labels, reduced motion support
- **Animations**: Fade in, slide up, and spin animations
- **Print Styles**: `no-print` class for hiding navigation when printing

### Testing Recommendations

1. Open index.html in browser
2. Test dark mode by adding `class="dark"` to `<html>` element
3. Test responsive design at various screen sizes
4. Test keyboard navigation (Tab, Enter, Escape)
5. Test event creation, editing, and deletion
6. Test on mobile devices for touch interactions
