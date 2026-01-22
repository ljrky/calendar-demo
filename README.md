# Calendar App

A simple, responsive calendar application built with vanilla HTML, CSS, and JavaScript. Create, edit, and delete events with local storage persistence.

---

## ⚡ Quick Start (Get Running in 60 Seconds)

**Just want to try it out? Here's the fastest way:**

1. **Download** - Click the green "Code" button on GitHub, then "Download ZIP"
2. **Unzip** - Find the downloaded ZIP file and extract it (double-click on Mac, right-click → "Extract All" on Windows)
3. **Open** - Find the `index.html` file inside the folder and double-click it
4. **Use** - Click any date on the calendar to create your first event!

That's it! No installation, no setup, no coding required.

---

## What You'll Need

**The good news: Almost nothing!**

- ✅ **A web browser** - Chrome, Firefox, Safari, or Edge (you probably already have one)
- ✅ **The app files** - Download from this page
- ❌ **No coding knowledge required**
- ❌ **No software to install**
- ❌ **No account to create**
- ❌ **No internet connection** (after downloading)

Your events are saved automatically in your browser's built-in storage (like a tiny database that lives in your browser). This means your events stay on your computer and are private to you.

---

## Features

- **Month View**: Display calendar grid showing the current month with all dates
- **Event Management**: Add, edit, and delete events with a user-friendly popup form
- **Automatic Saving**: All events are saved automatically in your browser (no account needed!)
- **Works Everywhere**: Looks great on desktop, tablet, and mobile devices
- **Color Coding**: Organize events with 6 color options
- **Form Validation**: Comprehensive validation for all event fields
- **Today Highlight**: Current date is visually highlighted
- **Event Indicators**: Visual badges show events on calendar dates

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or build tools required

### Installation

**Option A: Download (Easiest)**
1. Click the green **"Code"** button at the top of this page
2. Select **"Download ZIP"**
3. Find the ZIP file in your Downloads folder and unzip it:
   - **Mac**: Double-click the ZIP file
   - **Windows**: Right-click → "Extract All"
4. Open the unzipped folder and double-click **`index.html`**

**Option B: Clone with Git (For Developers)**
```bash
git clone https://github.com/your-username/calendar-demo.git
cd calendar-demo
open index.html   # Mac
start index.html  # Windows
```

That's it! The app runs entirely in your browser.

> 💡 **Having trouble?** If the app doesn't load properly, see the [Troubleshooting](#troubleshooting) section below for solutions including how to run a local server.

## Usage

### Viewing the Calendar

- The calendar displays the current month by default
- Use the left/right arrow buttons to navigate between months
- The current date is highlighted in blue

### Adding an Event

1. Click on any date in the calendar
2. A popup form will appear
3. Fill in the event details:
   - **Title** (required): Give your event a name
   - **Date** (required): Already filled with the date you clicked
   - **Start Time** (optional): When does it start?
   - **End Time** (optional): When does it end?
   - **Description** (optional): Add notes or details
   - **Color** (optional): Pick a color to help organize your events
4. Click "Create Event"

### Editing an Event

1. Click on an event (shown as a colored bar on the date)
2. The popup form opens with your event details already filled in
3. Change whatever you need
4. Click "Update Event"

### Deleting an Event

1. Click on the event you want to delete
2. In the popup form, click the red "Delete" button on the left
3. Confirm when asked

### Keyboard Shortcuts

- **ESC**: Close the popup form

## Project Structure

```
calendar-demo/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Global styles and variables
│   ├── calendar.css       # Calendar grid styles
│   ├── modal.css          # Popup form styles
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

## Where Are My Events Stored?

Your events are saved in your browser's "local storage" - a small database built into every modern web browser. This is the same technology many websites use to remember your preferences.

**What this means for you:**
- ✅ Your events are private (stored only on your computer)
- ✅ No account or login required
- ✅ Events persist even after closing your browser
- ⚠️ Events won't sync to other devices or browsers
- ⚠️ Clearing browser data will delete your events

**To view your stored events (advanced):**
1. Press `F12` to open browser developer tools
2. Go to **Application** tab (Chrome/Edge) or **Storage** tab (Firefox)
3. Click **Local Storage** in the sidebar
4. Look for `calendar_events`

**To delete all events:**
- Use the debug command: Open console (`F12` → Console tab) and type:
```javascript
localStorage.removeItem('calendar_events')
```
- Then refresh the page

## Known Limitations

**Things to keep in mind:**

1. **Your events stay on this device** - If you use the calendar on your laptop, those events won't appear on your phone or another computer. Each browser has its own separate storage.

2. **Storage limit** - Your browser can store roughly 5-10MB of data. That's enough for thousands of events, but the app will warn you if you somehow reach this limit.

3. **One event per day** - You can't create a single event that spans multiple days (like a 3-day conference). You'd need to create separate events for each day.

4. **No repeating events** - If you have a weekly meeting, you'll need to create it separately for each week.

5. **Times are local** - All event times use your computer's time zone. There's no support for events in different time zones.

6. **No built-in search** - To find an event, navigate to its month. (Tip: Use your browser's find feature with Ctrl+F / Cmd+F)

7. **Busy dates show a count** - If a date has 3+ events, you'll see a number instead of individual event titles. Click the date to see all events.

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

### The calendar isn't loading / shows a blank page

**Most common cause: Opening the file incorrectly**

When you double-click `index.html`, your browser opens it directly from your computer (you'll see `file://` in the address bar instead of `http://`). This usually works fine, but some browsers have security restrictions.

**Try these fixes:**

1. **Use a different browser** - Chrome and Firefox usually work best
2. **Check JavaScript is enabled** - Most browsers have this on by default, but some security extensions might block it
3. **Use a local server** (for developers) - See the "Using a Local Server" section below

### Events not saving

Your events are stored in your browser's "local storage" (think of it as a small database built into your browser). If events aren't saving:

- **Private/Incognito mode?** - Local storage is often disabled or cleared when you close private windows
- **Storage full?** - Browsers limit storage to about 5-10MB. Run `debugApp.storageInfo()` in the browser console to check
- **Different browser/computer?** - Events only exist in the specific browser where you created them

### The popup form won't open when I click a date

- Try refreshing the page (Ctrl+R or Cmd+R)
- Check if you're clicking directly on the date number
- If using an older browser, try updating it

### How to open the browser console (for advanced troubleshooting)

The console shows error messages that can help diagnose problems:

- **Chrome/Edge**: Press `F12`, then click the "Console" tab
- **Firefox**: Press `F12`, then click the "Console" tab
- **Safari**: Press `Cmd+Option+C` (you may need to enable Developer menu in Safari preferences first)
- **Mac shortcut** (most browsers): `Cmd+Option+J`
- **Windows shortcut** (most browsers): `Ctrl+Shift+J`

### Using a Local Server (Advanced)

If the file:// method doesn't work, you can run a simple web server. This requires having Python or Node.js installed:

```bash
# Navigate to the calendar-demo folder first, then:

# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js
npx http-server
```

Then open `http://localhost:8000` in your browser.

## Development

### File Organization

The codebase follows a modular pattern:

- **Storage Module** ([scripts/storage.js](scripts/storage.js)): Handles all localStorage operations
- **Events Module** ([scripts/events.js](scripts/events.js)): Manages event CRUD operations
- **Validation Module** ([scripts/validation.js](scripts/validation.js)): Validates form inputs
- **Modal Module** ([scripts/modal.js](scripts/modal.js)): Controls the popup form UI and handling
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
