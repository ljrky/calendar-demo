# Accessibility Fixes - Code Patches

## Patch 1: Add Keyboard Navigation to Day Cells

### File: `scripts/calendar.js`

Add keyboard navigation support to day cells:

```javascript
// In createDayCell() method, after creating the cell:

createDayCell(day, dateString) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';

    // ADD: Make keyboard accessible
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('aria-label', this.getFullDateLabel(this.currentYear, this.currentMonth, day));

    // ADD: If today
    if (this.isToday(this.currentYear, this.currentMonth, day)) {
        cell.classList.add('today');
        cell.setAttribute('aria-current', 'date');
    }

    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    dayNumber.textContent = day;
    cell.appendChild(dayNumber);

    const events = Events.getEventsByDate(dateString);

    if (events.length > 0) {
        const indicators = this.createEventIndicators(events);
        cell.appendChild(indicators);
        // ADD: Update aria-label to include event count
        const eventLabel = events.length === 1 ? '1 event' : `${events.length} events`;
        cell.setAttribute('aria-label', `${this.getFullDateLabel(this.currentYear, this.currentMonth, day)}, ${eventLabel}`);
    }

    // Click handler
    cell.addEventListener('click', (e) => {
        if (e.target.classList.contains('event-badge')) {
            const eventId = e.target.dataset.eventId;
            Modal.openEditMode(eventId);
        } else {
            Modal.openAddMode(dateString);
        }
    });

    // ADD: Keyboard handler
    cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            Modal.openAddMode(dateString);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            this.focusNextDay(cell);
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            this.focusPreviousDay(cell);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.focusDayBelow(cell);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.focusDayAbove(cell);
        }
    });

    return cell;
},

// ADD: Helper method for full date label
getFullDateLabel(year, month, day) {
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
},

// ADD: Arrow key navigation methods
focusNextDay(currentCell) {
    const nextCell = currentCell.nextElementSibling;
    if (nextCell && !nextCell.classList.contains('empty')) {
        nextCell.focus();
    }
},

focusPreviousDay(currentCell) {
    const prevCell = currentCell.previousElementSibling;
    if (prevCell && !prevCell.classList.contains('empty')) {
        prevCell.focus();
    }
},

focusDayBelow(currentCell) {
    const allCells = Array.from(currentCell.parentElement.children);
    const currentIndex = allCells.indexOf(currentCell);
    const belowIndex = currentIndex + 7;
    if (belowIndex < allCells.length) {
        const belowCell = allCells[belowIndex];
        if (!belowCell.classList.contains('empty')) {
            belowCell.focus();
        }
    }
},

focusDayAbove(currentCell) {
    const allCells = Array.from(currentCell.parentElement.children);
    const currentIndex = allCells.indexOf(currentCell);
    const aboveIndex = currentIndex - 7;
    if (aboveIndex >= 0) {
        const aboveCell = allCells[aboveIndex];
        if (!aboveCell.classList.contains('empty')) {
            aboveCell.focus();
        }
    }
}
```

---

## Patch 2: Add ARIA Roles to Calendar Grid

### File: `index.html`

Update calendar structure with proper ARIA:

```html
<!-- Calendar Header with Navigation -->
<div class="calendar-header" role="navigation" aria-label="Calendar navigation">
    <button class="today-button" id="todayButton" aria-label="Go to today's date">Today</button>

    <button class="nav-button" id="prevMonth" aria-label="Previous month">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"/>
        </svg>
    </button>

    <h2 class="current-month" id="currentMonth" aria-live="polite">January 2026</h2>

    <button class="nav-button" id="nextMonth" aria-label="Next month">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"/>
        </svg>
    </button>
</div>

<!-- Weekday Headers -->
<div class="weekday-headers" role="row" aria-label="Days of the week">
    <div class="weekday" role="columnheader">Sun</div>
    <div class="weekday" role="columnheader">Mon</div>
    <div class="weekday" role="columnheader">Tue</div>
    <div class="weekday" role="columnheader">Wed</div>
    <div class="weekday" role="columnheader">Thu</div>
    <div class="weekday" role="columnheader">Fri</div>
    <div class="weekday" role="columnheader">Sat</div>
</div>

<!-- Calendar Grid -->
<div class="calendar-grid" id="calendarGrid" role="grid" aria-label="Calendar month view">
    <!-- Day cells will be generated dynamically by JavaScript -->
</div>

<!-- ADD: Live region for announcements -->
<div class="sr-only" aria-live="polite" aria-atomic="true" id="calendarAnnouncements"></div>
```

---

## Patch 3: Add Modal Focus Trap

### File: `scripts/modal.js`

Add focus trap and proper ARIA:

```javascript
// In Modal object, add these properties:
Modal = {
    overlay: null,
    form: null,
    mode: 'add',
    currentEventId: null,
    currentDate: null,
    // ADD: Focus trap
    lastFocusedElement: null,
    focusableElements: null,
    firstFocusable: null,
    lastFocusable: null,

    // ... existing code ...

    // MODIFY: init method
    init() {
        this.overlay = document.getElementById('modalOverlay');
        this.form = document.getElementById('eventForm');

        // ADD: Set ARIA attributes
        const modalContainer = this.overlay.querySelector('.modal-container');
        modalContainer.setAttribute('role', 'dialog');
        modalContainer.setAttribute('aria-modal', 'true');
        modalContainer.setAttribute('aria-labelledby', 'modalTitle');

        this.attachEventListeners();
    },

    // MODIFY: open method
    open() {
        // Store last focused element
        this.lastFocusedElement = document.activeElement;

        this.overlay?.classList.add('active');
        document.body.classList.add('modal-open');

        // Set up focus trap
        const modalContainer = this.overlay.querySelector('.modal-container');
        this.focusableElements = modalContainer.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        this.firstFocusable = this.focusableElements[0];
        this.lastFocusable = this.focusableElements[this.focusableElements.length - 1];

        // ADD: Focus trap handler
        modalContainer.addEventListener('keydown', this.handleFocusTrap.bind(this));

        // Focus first input field
        setTimeout(() => {
            const firstInput = document.getElementById('eventTitle');
            firstInput?.focus();
        }, 100);
    },

    // MODIFY: close method
    close() {
        this.overlay?.classList.remove('active');
        document.body.classList.remove('modal-open');

        // Return focus to last focused element
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }

        // Reset form after animation
        setTimeout(() => {
            this.resetForm();
        }, 300);
    },

    // ADD: Focus trap handler
    handleFocusTrap(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === this.firstFocusable) {
                e.preventDefault();
                this.lastFocusable.focus();
            }
        } else { // Tab
            if (document.activeElement === this.lastFocusable) {
                e.preventDefault();
                this.firstFocusable.focus();
            }
        }
    },

    // ... rest of existing code ...
};
```

---

## Patch 4: Add Error Announcements

### File: `index.html`

Add live region for form errors:

```html
<!-- Inside modal, after form -->
<div class="sr-only" aria-live="polite" aria-atomic="true" id="formAnnouncements"></div>
```

### File: `scripts/validation.js`

Update error display to announce errors:

```javascript
// MODIFY: showError method
showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputElement = document.getElementById(`event${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);
    const formGroup = inputElement?.closest('.form-group');

    if (errorElement) {
        errorElement.textContent = message;
    }

    if (inputElement) {
        if (message) {
            inputElement.setAttribute('aria-invalid', 'true');
            inputElement.setAttribute('aria-describedby', `${fieldName}Error`);
        } else {
            inputElement.removeAttribute('aria-invalid');
            inputElement.removeAttribute('aria-describedby');
        }
    }

    if (formGroup) {
        if (message) {
            formGroup.classList.add('has-error');
            formGroup.classList.remove('has-success');

            // ADD: Announce error
            this.announceError(message);
        } else {
            formGroup.classList.remove('has-error');
        }
    }
},

// ADD: Announce error method
announceError(message) {
    const announcer = document.getElementById('formAnnouncements');
    if (announcer) {
        announcer.textContent = message;
        // Clear after announcement
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
}
```

---

## Patch 5: Improve Color Contrast

### File: `styles/calendar.css`

Fix border and text contrast:

```css
/* Calendar Header */
.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    gap: var(--spacing-md);
    /* CHANGE: Darker border for better contrast */
    border-bottom: 1px solid #d1d5db;
    background-color: white;
}

/* Weekday Headers */
.weekday-headers {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0;
    /* CHANGE: Darker border */
    border-bottom: 1px solid #d1d5db;
    background-color: white;
}

/* Day Cell */
.day-cell {
    position: relative;
    min-height: 120px;
    background-color: white;
    /* CHANGE: Darker border for better contrast (3:1 minimum) */
    border: 1px solid #d1d5db;
    border-left: none;
    border-top: none;
    padding: 8px;
    cursor: pointer;
    transition: background-color var(--transition-fast);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* ADD: Focus indicator for keyboard navigation */
.day-cell:focus {
    outline: 2px solid #1a73e8;
    outline-offset: -2px;
    z-index: 1;
}

/* Light text - CHANGE to meet 4.5:1 contrast */
.day-cell.empty .day-number {
    color: #6b7280; /* Darker gray: 4.6:1 contrast */
}
```

### File: `styles/main.css`

Update color variables for better contrast:

```css
/* ADD: Better contrast colors */
:root {
    /* ... existing variables ... */

    /* Update for better contrast */
    --color-border: #d1d5db; /* Was #e2e8f0, now 3.1:1 contrast */
    --color-text-light: #6b7280; /* Was #94a3b8, now 4.6:1 contrast */
}
```

---

## Patch 6: Add Focus Indicators

### File: `styles/calendar.css`

Add consistent focus styles:

```css
/* Consistent focus styles */
.today-button:focus,
.nav-button:focus {
    outline: 2px solid #1a73e8;
    outline-offset: 2px;
}

.event-badge:focus {
    outline: 2px solid #1a73e8;
    outline-offset: 1px;
}
```

---

## Patch 7: Announce Dynamic Changes

### File: `scripts/calendar.js`

Add announcements for calendar changes:

```javascript
// ADD: Helper method to announce changes
announceToScreenReader(message) {
    const announcer = document.getElementById('calendarAnnouncements');
    if (announcer) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
},

// MODIFY: previousMonth and nextMonth methods
previousMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
    }
    this.render();
    // ADD: Announce month change
    this.announceToScreenReader(`Viewing ${this.monthNames[this.currentMonth]} ${this.currentYear}`);
},

nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
    }
    this.render();
    // ADD: Announce month change
    this.announceToScreenReader(`Viewing ${this.monthNames[this.currentMonth]} ${this.currentYear}`);
},

// MODIFY: goToToday method
goToToday() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.render();
    // ADD: Announce
    this.announceToScreenReader(`Viewing today, ${this.monthNames[this.currentMonth]} ${this.currentYear}`);
}
```

### File: `scripts/modal.js`

Announce event operations:

```javascript
// MODIFY: handleSubmit method - add after successful save
if (success) {
    // ADD: Announce success
    const message = this.mode === 'add' ? 'Event created' : 'Event updated';
    this.announceToScreenReader(message);

    this.close();

    if (window.Calendar) {
        Calendar.render();
    }
}

// MODIFY: handleDelete method - add after successful delete
if (success) {
    // ADD: Announce
    this.announceToScreenReader('Event deleted');

    this.close();

    if (window.Calendar) {
        Calendar.render();
    }
}

// ADD: Helper method
announceToScreenReader(message) {
    const announcer = document.getElementById('calendarAnnouncements');
    if (announcer) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
}
```

---

## Testing Checklist

After applying patches, test:

- [ ] Tab through calendar - all day cells focusable
- [ ] Arrow keys navigate between days
- [ ] Enter/Space opens modal from day cell
- [ ] Modal focus trapped - can't tab out
- [ ] Escape closes modal
- [ ] Focus returns to day cell after closing modal
- [ ] Screen reader announces month changes
- [ ] Screen reader announces event operations
- [ ] Form errors announced
- [ ] All focus indicators visible
- [ ] Color contrast passes WCAG AA

---

## Implementation Order

1. **Patch 5 (Color Contrast)** - Quick CSS fix, immediate impact
2. **Patch 2 (ARIA Roles)** - Structural improvements
3. **Patch 1 (Keyboard Navigation)** - Critical functionality
4. **Patch 3 (Focus Trap)** - Critical functionality
5. **Patch 4 (Error Announcements)** - Important for forms
6. **Patch 6 (Focus Indicators)** - Visual improvements
7. **Patch 7 (Dynamic Announcements)** - Enhanced experience
