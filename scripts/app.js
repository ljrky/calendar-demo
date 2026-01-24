// Main application initialization

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    Logger.log('Calendar App initializing...');

    // Check for localStorage support
    if (!Storage.isAvailable()) {
        Toast.error('This application requires localStorage support. Please use a modern browser.', 0);
        return;
    }

    // Initialize modules
    initializeApp();
});

// Initialize the application
function initializeApp() {
    try {
        // Load events from storage
        Events.init();
        Logger.log('Events loaded:', Events.getAll().length);

        // Initialize modal
        Modal.init();
        Logger.log('Modal initialized');

        // Initialize calendar
        Calendar.init();
        Logger.log('Calendar initialized');

        // Log app statistics
        logAppStats();

        Logger.log('Calendar App ready!');

    } catch (error) {
        console.error('Error initializing app:', error);
        Toast.error('An error occurred while starting the application. Please refresh the page.', 0);
    }
}

// Log application statistics
function logAppStats() {
    const stats = Events.getStats();
    Logger.log('App Statistics:', {
        totalEvents: stats.total,
        upcomingEvents: stats.upcoming,
        pastEvents: stats.past,
        todayEvents: stats.today,
        storageInfo: Storage.getStorageInfo()
    });
}

// Expose modules to window for debugging
window.Calendar = Calendar;
window.Events = Events;
window.Modal = Modal;
window.Storage = Storage;
window.Validation = Validation;

// Debug helper functions
window.debugApp = {
    // Enable debug logging
    enableLogs() {
        Logger.enable();
    },

    // Disable debug logging
    disableLogs() {
        Logger.disable();
    },

    // Show all events
    showAllEvents() {
        console.table(Events.getAll());
    },

    // Clear all events
    clearAll() {
        if (confirm('Delete all events?')) {
            Events.deleteAll();
            Calendar.render();
            Toast.success('All events deleted');
        }
    },

    // Add sample events
    addSampleEvents() {
        const today = new Date();
        const sampleEvents = [
            {
                title: 'Team Meeting',
                date: formatDate(today),
                startTime: '10:00',
                endTime: '11:00',
                description: 'Weekly team sync',
                color: '#3b82f6'
            },
            {
                title: 'Lunch Break',
                date: formatDate(today),
                startTime: '12:00',
                endTime: '13:00',
                description: 'Lunch with colleagues',
                color: '#10b981'
            },
            {
                title: 'Project Deadline',
                date: formatDate(addDays(today, 3)),
                startTime: '17:00',
                endTime: '18:00',
                description: 'Submit final deliverables',
                color: '#ef4444'
            },
            {
                title: 'Dentist Appointment',
                date: formatDate(addDays(today, 7)),
                startTime: '14:00',
                endTime: '15:00',
                description: 'Annual checkup',
                color: '#f59e0b'
            },
            {
                title: 'Birthday Party',
                date: formatDate(addDays(today, 14)),
                startTime: '19:00',
                endTime: '23:00',
                description: 'Friend\'s birthday celebration',
                color: '#ec4899'
            }
        ];

        sampleEvents.forEach(event => {
            Events.createEvent(event);
        });

        Calendar.render();
        Toast.success(`Added ${sampleEvents.length} sample events`);
    },

    // Get storage info
    storageInfo() {
        const info = Storage.getStorageInfo();
        console.table(info);
        return info;
    },

    // Export events to JSON
    exportEvents() {
        const events = Events.getAll();
        const json = JSON.stringify(events, null, 2);

        // Create downloadable file
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'calendar-events.json';
        a.click();
        URL.revokeObjectURL(url);

        return events;
    },

    // Import events from JSON (with validation)
    importEvents(jsonString) {
        const MAX_IMPORT_SIZE = 1024 * 1024; // 1MB limit
        const MAX_EVENTS_IMPORT = 1000; // Max events per import

        try {
            // Check size before parsing
            if (jsonString.length > MAX_IMPORT_SIZE) {
                throw new Error('Import data too large (max 1MB)');
            }

            const events = JSON.parse(jsonString);
            if (!Array.isArray(events)) {
                throw new Error('Invalid format: must be an array');
            }

            if (events.length > MAX_EVENTS_IMPORT) {
                throw new Error(`Too many events (max ${MAX_EVENTS_IMPORT})`);
            }

            let imported = 0;
            events.forEach((event, index) => {
                // Validate required fields and types
                if (typeof event.title !== 'string' || !event.title.trim()) {
                    console.warn(`Skipping event ${index}: missing or invalid title`);
                    return;
                }
                if (typeof event.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
                    console.warn(`Skipping event ${index}: invalid date format`);
                    return;
                }

                // Only pass validated and sanitized fields
                Events.createEvent({
                    title: event.title,
                    date: event.date,
                    startTime: typeof event.startTime === 'string' ? event.startTime : '',
                    endTime: typeof event.endTime === 'string' ? event.endTime : '',
                    description: typeof event.description === 'string' ? event.description : '',
                    color: typeof event.color === 'string' ? event.color : '#3b82f6'
                });
                imported++;
            });

            Calendar.render();
            Toast.success(`Imported ${imported} of ${events.length} events`);
        } catch (error) {
            Toast.error(`Import failed: ${error.message}`);
        }
    }
};

// Helper functions for sample events
function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Service Worker registration (for future PWA support)
if ('serviceWorker' in navigator) {
    // Uncomment when adding service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered'))
    //     .catch(err => console.log('Service Worker registration failed:', err));
}

// Log helpful debug commands (always shown)
console.log('%cCalendar App Debug Commands:', 'color: #3b82f6; font-size: 14px; font-weight: bold;');
console.log('%c- debugApp.enableLogs() / disableLogs()', 'color: #64748b;');
console.log('%c- debugApp.showAllEvents()', 'color: #64748b;');
console.log('%c- debugApp.addSampleEvents()', 'color: #64748b;');
console.log('%c- debugApp.clearAll()', 'color: #64748b;');
console.log('%c- debugApp.storageInfo()', 'color: #64748b;');
console.log('%c- debugApp.exportEvents()', 'color: #64748b;');
console.log('%c- debugApp.importEvents(jsonString)', 'color: #64748b;');
