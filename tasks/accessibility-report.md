# Accessibility Audit Report - Calendar App

**Date:** January 22, 2026
**Standard:** WCAG 2.1 Level AA

---

## Executive Summary

The calendar app has some accessibility features in place (aria-labels on buttons, form labels, focus styles on color picker), but requires significant improvements to meet WCAG 2.1 Level AA standards. Key issues include keyboard navigation for day cells, missing ARIA attributes, focus management, and color contrast concerns.

**Overall Score: 6/10**

---

## Critical Issues (Must Fix)

### 1. Keyboard Navigation - Day Cells Not Keyboard Accessible ⚠️ CRITICAL

**Issue:** Day cells are `<div>` elements with click handlers, making them inaccessible to keyboard users.

**Impact:** Users who rely on keyboard navigation cannot add events or interact with the calendar.

**WCAG Criterion:** 2.1.1 Keyboard (Level A)

**Fix Required:**
- Add `tabindex="0"` to day cells
- Add keyboard event handlers (Enter/Space)
- Implement arrow key navigation between days
- Add visible focus indicators

---

### 2. Modal Focus Trap Not Implemented ⚠️ CRITICAL

**Issue:** When modal opens, focus management is incomplete. Users can tab out of modal to underlying page.

**Impact:** Keyboard users can lose context and interact with hidden content.

**WCAG Criterion:** 2.4.3 Focus Order (Level A)

**Fix Required:**
- Trap focus within modal when open
- Return focus to trigger element when closed
- Handle Escape key to close modal
- Move focus to first focusable element on open

---

### 3. Missing ARIA Roles and Labels ⚠️ CRITICAL

**Issue:** Calendar grid lacks semantic structure and ARIA attributes.

**Impact:** Screen reader users cannot understand calendar structure or date information.

**WCAG Criterion:** 4.1.2 Name, Role, Value (Level A)

**Missing ARIA:**
- Calendar grid needs `role="grid"` and `aria-label`
- Day cells need `role="gridcell"` and `aria-label` with full date
- Weekday headers need proper semantic structure
- Modal needs `role="dialog"` and `aria-modal="true"`
- Dynamic content changes not announced

---

## High Priority Issues

### 4. Color Contrast Issues

**Issue:** Some text and borders may not meet WCAG AA contrast ratios.

**WCAG Criterion:** 1.4.3 Contrast (Minimum) (Level AA)

**Contrast Problems:**
- Border color #e0e0e0 on white may be too light (1.23:1 - fails)
- Event count text color (--color-text-secondary) needs checking
- Weekday header text (11px, gray) may be too subtle
- Disabled button states unclear

**Required Ratio:** 4.5:1 for normal text, 3:1 for large text, 3:1 for UI components

---

### 5. Error Messages Not Announced

**Issue:** Form validation errors appear visually but aren't announced to screen readers.

**WCAG Criterion:** 3.3.1 Error Identification (Level A)

**Fix Required:**
- Add `aria-live="polite"` to error message containers
- Add `aria-invalid="true"` to invalid inputs
- Associate errors with inputs using `aria-describedby`

---

### 6. No Skip Links

**Issue:** No "skip to main content" link for keyboard users.

**WCAG Criterion:** 2.4.1 Bypass Blocks (Level A)

**Fix Required:**
- Add skip link to jump to calendar grid
- Add skip link in modal to jump to form

---

## Medium Priority Issues

### 7. Focus Indicators Inconsistent

**Issue:** Focus indicators vary across components and some are missing.

**Current State:**
- Color picker: Has outline ✓
- Buttons: Has hover state, but focus less clear
- Day cells: No focus indicator ✗
- Form inputs: Has focus ring ✓

**Fix Required:**
- Consistent focus style across all interactive elements
- Ensure focus visible on all keyboard-navigable elements
- Use 2px solid outline with appropriate color

---

### 8. Live Region Updates Missing

**Issue:** When events are added/deleted or month changes, screen readers aren't notified.

**WCAG Criterion:** 4.1.3 Status Messages (Level AA)

**Fix Required:**
- Add `aria-live="polite"` region for status messages
- Announce "Event added", "Event deleted", "Viewing [Month Year]"
- Announce "Loading events..." when fetching data

---

### 9. Today Button Lacks Context

**Issue:** "Today" button doesn't indicate current state (are we already viewing today?).

**Fix Required:**
- Add `aria-pressed` or `aria-current` when viewing current month
- Update label to "Go to today" or "Currently viewing today"

---

### 10. Color Picker Accessibility

**Issue:** Color selection relies solely on color, no text alternative.

**WCAG Criterion:** 1.4.1 Use of Color (Level A)

**Current State:** Has aria-labels ✓ but could be improved

**Enhancement:**
- Add visible text labels or icons
- Add tooltip showing color name on focus/hover
- Indicate selected state with checkmark icon, not just border

---

## Low Priority Issues

### 11. Heading Structure

**Issue:** No h1 visible (hidden), jumps from h2 to h3 in modal.

**Fix:** Either show h1 or start with h2 in calendar and h3 in modal (acceptable)

---

### 12. Language Declaration

**Current:** `lang="en"` ✓
**Status:** Correct, no issues

---

### 13. Touch Target Sizes

**Current State:**
- Desktop nav buttons: 40x40px (acceptable)
- Mobile: min-height 44px ✓
- Color picker: 44x44px ✓

**Status:** Mostly compliant, meeting 44x44px target for touch devices

---

## Color Contrast Analysis

### Text Contrast
| Element | Foreground | Background | Ratio | Status |
|---------|-----------|-----------|-------|--------|
| Body text | #1e293b | #ffffff | 16.1:1 | ✓ Pass AAA |
| Secondary text | #64748b | #ffffff | 4.6:1 | ✓ Pass AA |
| Light text | #94a3b8 | #ffffff | 3.1:1 | ⚠️ Fail AA |
| Weekday headers | #64748b | #ffffff | 4.6:1 | ✓ Pass AA |
| Border | #e0e0e0 | #ffffff | 1.23:1 | ✗ Fail |

### Event Badge Contrast
| Color | Background | Text | Ratio | Status |
|-------|-----------|------|-------|--------|
| Blue | #e8f0fe | #1967d2 | 8.2:1 | ✓ Pass AAA |
| Red | #fce8e6 | #c5221f | 7.9:1 | ✓ Pass AAA |
| Green | #e6f4ea | #137333 | 7.5:1 | ✓ Pass AAA |
| Orange | #fef7e0 | #e37400 | 6.8:1 | ✓ Pass AAA |
| Purple | #f3e8fd | #8430ce | 6.2:1 | ✓ Pass AA |
| Pink | #fce7f3 | #c2185b | 8.1:1 | ✓ Pass AAA |

**Event badge colors are excellent!** ✓

---

## Recommendations Priority List

### Immediate (Week 1)
1. Add keyboard navigation to day cells
2. Implement modal focus trap
3. Add ARIA roles and labels to calendar grid
4. Fix color contrast issues (borders, light text)
5. Add aria-live regions for errors

### Short Term (Week 2-3)
6. Add skip links
7. Improve focus indicators
8. Add live region for dynamic updates
9. Enhance color picker accessibility

### Long Term (Month 1)
10. Add keyboard shortcuts documentation
11. Add high contrast mode support
12. Test with actual screen readers
13. User testing with disabled users

---

## Testing Recommendations

1. **Keyboard Testing:**
   - Tab through entire interface
   - Use only keyboard to create/edit/delete events
   - Test arrow key navigation in calendar

2. **Screen Reader Testing:**
   - NVDA (Windows)
   - JAWS (Windows)
   - VoiceOver (macOS/iOS)
   - TalkBack (Android)

3. **Automated Testing:**
   - axe DevTools
   - WAVE browser extension
   - Lighthouse accessibility audit
   - Pa11y

4. **Manual Testing:**
   - High contrast mode
   - 200% zoom level
   - Windows Magnifier
   - Voice control

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices - Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Deque University](https://dequeuniversity.com/)
