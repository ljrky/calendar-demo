# Calendar App

A simple, responsive calendar application built with vanilla HTML, CSS, and JavaScript. Create, edit, and delete events with local storage persistence.

## Features

- **Month View**: Display calendar grid showing the current month with all dates
- **Event Management**: Add, edit, and delete events with a user-friendly modal interface
- **Local Storage**: All events are stored locally in your browser using localStorage
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Color Coding**: Organize events with 6 color options
- **Form Validation**: Comprehensive validation for all event fields
- **Today Highlight**: Current date is visually highlighted
- **Event Indicators**: Visual badges show events on calendar dates

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or build tools required

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser

That's it! The app runs entirely in your browser.

```bash
# If using a local server (optional)
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with http-server)
npx http-server
```

## Usage

### Viewing the Calendar

- The calendar displays the current month by default
- Use the left/right arrow buttons to navigate between months
- The current date is highlighted in blue

### Adding an Event

1. Click on any date in the calendar
2. A modal will open with a form
3. Fill in the event details:
   - **Title** (required): Event name (1-100 characters)
   - **Date** (required): Pre-filled with selected date
   - **Start Time** (optional): Event start time
   - **End Time** (optional): Event end time (must be after start time)
   - **Description** (optional): Event details (max 500 characters)
   - **Color** (optional): Choose from 6 colors
4. Click "Create Event"

### Editing an Event

1. Click on an event badge in the calendar
2. The modal opens with the event details pre-filled
3. Modify any fields
4. Click "Update Event"

### Deleting an Event

1. Click on an event badge to open the edit modal
2. Click the "Delete" button (red button on the left)
3. Confirm the deletion

### Keyboard Shortcuts

- **ESC**: Close the modal

## Project Structure

```
calendar-demo/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Global styles and variables
│   ├── calendar.css       # Calendar grid styles
│   ├── modal.css          # Modal popup styles
│   └── responsive.css     # Media queries for responsive design
├── scripts/
│   ├── app.js             # Application initialization
│   ├── calendar.js        # Calendar rendering logic
│   ├── events.js          # Event CRUD operations
│   ├── storage.js         # localStorage wrapper
│   ├── modal.js           # Modal UI logic
│   └── validation.js      # Form validation
├── tasks/
│   └── todo.md            # Implementation checklist
└── README.md              # This file
```

## Data Model

Events are stored in localStorage as JSON with the following structure:

```javascript
{
  id: "1706024400000abc123",        // Unique identifier
  title: "Team Meeting",            // Event name
  date: "2026-01-23",               // ISO date (YYYY-MM-DD)
  startTime: "14:00",               // 24-hour format (HH:MM)
  endTime: "15:00",                 // 24-hour format (HH:MM)
  description: "Weekly sync",       // Event description
  color: "#3b82f6",                 // Hex color code
  createdAt: "2026-01-22T10:30:00.000Z",  // ISO timestamp
  updatedAt: "2026-01-22T10:30:00.000Z"   // ISO timestamp
}
```

## Validation Rules

- **Title**: Required, 1-100 characters, cannot be only whitespace
- **Date**: Required, valid date format (YYYY-MM-DD), year range 1900-2100
- **Start Time**: Optional, format HH:MM (24-hour)
- **End Time**: Optional, format HH:MM, must be after start time if both provided
- **Description**: Optional, maximum 500 characters
- **Color**: Optional, valid hex color format, defaults to #3b82f6 (blue)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Debug Commands

Open the browser console and use these commands:

```javascript
// View all events in a table
debugApp.showAllEvents()

// Add sample events for testing
debugApp.addSampleEvents()

// Clear all events
debugApp.clearAll()

// Check storage usage
debugApp.storageInfo()

// Export events to JSON file
debugApp.exportEvents()

// Import events from JSON string
debugApp.importEvents(jsonString)
```

## localStorage Usage

Events are stored under the key `calendar_events`. To view or clear:

1. Open browser DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Select Local Storage
4. Find `calendar_events`

To manually clear all data:
```javascript
localStorage.removeItem('calendar_events')
```

## Known Limitations

1. **Local Storage Only**: Events are stored locally in your browser. They won't sync across devices or browsers.
2. **Storage Limit**: Browser localStorage typically has a 5-10MB limit. The app will alert you if this limit is reached.
3. **No Recurring Events**: Each event must be created individually.
4. **Single Day Events**: Events cannot span multiple days.
5. **No Time Zone Support**: All times are stored in the local time zone.
6. **No Search**: Currently no search functionality (use browser's find in page).
7. **Limited Event Display**: On dates with 3+ events, a count badge is shown instead of individual events.

## Future Enhancements

Potential features for future versions:

- Week and day views
- Recurring events
- Event search and filtering
- Export to iCal format
- Cloud sync
- Dark mode
- Drag-and-drop events
- Event reminders
- Multiple calendars
- Event categories/tags

## Troubleshooting

### Events not saving
- Check if localStorage is enabled in your browser
- Check browser console for errors
- Verify storage quota hasn't been exceeded: `debugApp.storageInfo()`

### Calendar not displaying correctly
- Clear browser cache and reload
- Check browser console for JavaScript errors
- Ensure all files are loaded correctly

### Modal not opening
- Check browser console for errors
- Verify JavaScript files are loaded in correct order

## Development

### File Organization

The codebase follows a modular pattern:

- **Storage Module** ([scripts/storage.js](scripts/storage.js)): Handles all localStorage operations
- **Events Module** ([scripts/events.js](scripts/events.js)): Manages event CRUD operations
- **Validation Module** ([scripts/validation.js](scripts/validation.js)): Validates form inputs
- **Modal Module** ([scripts/modal.js](scripts/modal.js)): Controls modal UI and form handling
- **Calendar Module** ([scripts/calendar.js](scripts/calendar.js)): Renders calendar grid
- **App Module** ([scripts/app.js](scripts/app.js)): Initializes and coordinates all modules

### Making Changes

1. All JavaScript modules are exposed on the `window` object for debugging
2. Use the debug commands to test functionality
3. Check browser console for errors and logs
4. The app automatically re-renders after any event changes

## License

This project is open source and available for personal and commercial use.

## Credits

Built with vanilla HTML, CSS, and JavaScript. No frameworks or external dependencies.

## Support

For issues or questions, please check:
1. Browser console for error messages
2. Known Limitations section above
3. Debug commands for troubleshooting

---

**Version**: 1.0.0
**Last Updated**: January 2026
