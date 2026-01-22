# Calendar UI Redesign Plan - Google Calendar Style

## Analysis of Target Design

Based on the provided Google Calendar screenshot, here are the key differences:

### Layout Changes
1. **Full-width month view** - Calendar takes full width, not centered in a container
2. **Week-by-week layout** - Each week is a row spanning the full width
3. **Date position** - Date numbers in top-left corner of each cell
4. **Taller cells** - More vertical space for events (appears ~120-150px tall)
5. **Chinese day labels** - 周一, 周二, 周三, etc. instead of Sun, Mon, Tue

### Visual Style Changes
1. **Minimal borders** - Very subtle grid lines, lighter borders
2. **Current date styling** - Blue circle background for today's date number
3. **Event display** - Events shown as rounded pill-shaped badges stacked vertically
4. **Color scheme** - Softer, more muted colors
5. **Typography** - Cleaner, more modern font sizing
6. **Header bar** - Compact top navigation with icons

### Navigation Changes
1. **Today button** - Prominent "今天" (Today) button on left
2. **Month/Year display** - Centered, with arrows on sides
3. **View controls** - Right side buttons (search, help, settings, view options)

## Implementation Plan

### Phase 1: Layout Restructure
- [ ] Remove centered container, make calendar full-width
- [ ] Increase cell height for better event visibility
- [ ] Reposition date numbers to top-left corner
- [ ] Update week header to use Chinese characters or keep English
- [ ] Add proper spacing and padding for Google Calendar feel

### Phase 2: Visual Styling Updates
- [ ] Implement softer border colors and minimal grid
- [ ] Create blue circle style for current date
- [ ] Update event badges to pill shape with stacked layout
- [ ] Refine color palette to be more muted
- [ ] Update typography sizes and weights
- [ ] Add subtle hover effects

### Phase 3: Navigation Bar
- [ ] Add compact top navigation bar
- [ ] Implement "Today" button to jump to current date
- [ ] Add icon-based controls (optional: search, settings, etc.)
- [ ] Update month/year display styling

### Phase 4: Event Display
- [ ] Change event indicators from badges to full-width pills
- [ ] Stack events vertically within cells
- [ ] Add truncation for long event titles
- [ ] Improve event color contrast

### Phase 5: Polish
- [ ] Fine-tune spacing and proportions
- [ ] Test responsive behavior
- [ ] Ensure accessibility
- [ ] Update modal to match new design language

## Questions Before Starting

1. **Language**: Should I use Chinese labels (周一-周日) or keep English (Mon-Sun)?
2. **Navigation bar**: Do you want the full Google Calendar-style top bar with all icons, or just the essential navigation?
3. **Events per cell**: Should I limit how many events show per day before showing "+X more"?
4. **Mobile behavior**: Keep responsive design or optimize primarily for desktop?

## Estimated Scope

This redesign will primarily affect:
- `styles/calendar.css` - Major updates to calendar grid
- `styles/main.css` - Updates to container and base styles
- `scripts/calendar.js` - Minor updates to event rendering
- `index.html` - Possible header structure changes
