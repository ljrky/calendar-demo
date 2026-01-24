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

---

# Code Review Fixes

Based on comprehensive code review (January 23, 2026).

**Overall Risk Level: Medium**

## Critical Priority

- [x] **Call Validation.sanitizeInput() on all user inputs in events.js**
  - File: `scripts/events.js` (lines 24-43)
  - Issue: XSS vulnerability - sanitizeInput exists but is never called
  - Fix: Wrap title, description fields with `Validation.sanitizeInput()`

- [x] **Replace Math.random() with crypto.getRandomValues() for ID generation**
  - File: `scripts/events.js` (lines 19-21)
  - Issue: Not cryptographically secure, uses deprecated `substr()`
  - Fix: Use `crypto.getRandomValues(new Uint32Array(2))`

- [x] **Add JSON structure and size validation for event imports**
  - File: `scripts/app.js` (lines 158-174)
  - Issue: No validation of imported data structure or size
  - Fix: Add schema validation and MAX_IMPORT_SIZE check

## High Priority

- [x] **Replace alert() calls with toast notification system**
  - Files: `scripts/app.js`, `scripts/storage.js`, `scripts/modal.js`
  - Issue: alert() blocks thread and provides poor UX
  - Fix: Create accessible toast/notification component

- [x] **Add event creation limits to prevent localStorage exhaustion**
  - File: `scripts/events.js`
  - Issue: No limit on events, potential DoS via storage exhaustion
  - Fix: Add MAX_EVENTS constant (e.g., 10000) with check in createEvent()

## Medium Priority

- [x] **Create environment-aware logging utility to replace console.log**
  - Files: `scripts/app.js`, `scripts/events.js`
  - Issue: Console logs expose internal state in production
  - Fix: Create Logger utility with DEBUG_MODE check

- [x] **Add error boundaries to calendar rendering**
  - File: `scripts/calendar.js` (lines 84-120)
  - Issue: Silent failure if rendering fails
  - Fix: Wrap render methods in try-catch with user feedback

## Low Priority

- [x] **Add keyboard navigation to event badges for accessibility**
  - File: `scripts/calendar.js` (lines 206-221)
  - Issue: Event badges only have click handlers
  - Fix: Add tabindex, role="button", and keydown handler

---

## Code Review - Review Section

### Summary
All 8 issues identified in the code review have been addressed. The calendar app now has improved security, better UX, and enhanced accessibility.

### Changes Made

#### New Files Created
1. **scripts/toast.js** - Accessible toast notification system with success, error, warning, info variants
2. **scripts/logger.js** - Environment-aware logging utility (debug mode off by default)

#### Files Modified

1. **index.html**
   - Added toast container with ARIA attributes
   - Added slide-in/slide-out animations for toasts
   - Added script references for logger.js and toast.js

2. **scripts/events.js**
   - Added `MAX_EVENTS: 10000` limit with check in `createEvent()`
   - Replaced `Math.random()` with `crypto.getRandomValues()` for secure ID generation
   - Added `Validation.sanitizeInput()` calls for title and description in `createEvent()` and `updateEvent()`
   - Replaced `console.log` with `Logger.log`

3. **scripts/app.js**
   - Replaced `alert()` calls with `Toast.error()`
   - Replaced `console.log` with `Logger.log`
   - Added import validation: size limit (1MB), event count limit (1000), schema validation
   - Added `debugApp.enableLogs()` and `debugApp.disableLogs()` commands

4. **scripts/storage.js**
   - Replaced `alert()` calls with `Toast.error()`

5. **scripts/modal.js**
   - Replaced `alert()` calls with `Toast.error()`
   - Added success toasts for event create/update/delete

6. **scripts/calendar.js**
   - Added `showRenderError()` method for error boundary UI
   - Wrapped `render()` in try-catch with error handling
   - Added keyboard accessibility to event badges (tabindex, role, aria-label, keydown handler)
   - Added keyboard accessibility to count badges

### Security Improvements
- Input sanitization prevents XSS attacks
- Cryptographically secure ID generation
- Import validation prevents malicious JSON payloads
- Event limits prevent localStorage exhaustion attacks

### UX Improvements
- Non-blocking toast notifications instead of alert()
- Success feedback for CRUD operations
- Better error messages with actionable recovery options

### Accessibility Improvements
- Event badges are now keyboard navigable (Tab, Enter, Space)
- Toast notifications have proper ARIA attributes
- Count badges have proper ARIA labels
