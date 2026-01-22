// Main application initialization

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Calendar App initializing...');

    // Check for localStorage support
    if (!Storage.isAvailable()) {
        alert('This application requires localStorage support. Please use a modern browser.');
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
        console.log('Events loaded:', Events.getAll().length);

        // Initialize modal
        Modal.init();
        console.log('Modal initialized');

        // Initialize calendar
        Calendar.init();
        console.log('Calendar initialized');

        // Log app statistics
        logAppStats();

        console.log('Calendar App ready!');

    } catch (error) {
        console.error('Error initializing app:', error);
        alert('An error occurred while starting the application. Please refresh the page.');
    }
}

// Log application statistics
function logAppStats() {
    const stats = Events.getStats();
    console.log('App Statistics:', {
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
    // Show all events
    showAllEvents() {
        console.table(Events.getAll());
    },

    // Clear all events
    clearAll() {
        if (confirm('Delete all events?')) {
            Events.deleteAll();
            Calendar.render();
            console.log('All events deleted');
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
        console.log(`Added ${sampleEvents.length} sample events`);
    },

    // Get storage info
    storageInfo() {
        const info = Storage.getStorageInfo();
        console.log('Storage Information:', info);
        return info;
    },

    // Export events to JSON
    exportEvents() {
        const events = Events.getAll();
        const json = JSON.stringify(events, null, 2);
        console.log('Events JSON:', json);

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

    // Import events from JSON
    importEvents(jsonString) {
        try {
            const events = JSON.parse(jsonString);
            if (!Array.isArray(events)) {
                throw new Error('Invalid format: must be an array');
            }

            events.forEach(event => {
                Events.createEvent(event);
            });

            Calendar.render();
            console.log(`Imported ${events.length} events`);
        } catch (error) {
            console.error('Error importing events:', error);
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

// Log helpful debug commands
console.log('%cCalendar App Debug Commands:', 'color: #3b82f6; font-size: 14px; font-weight: bold;');
console.log('%c- debugApp.showAllEvents()', 'color: #64748b;');
console.log('%c- debugApp.addSampleEvents()', 'color: #64748b;');
console.log('%c- debugApp.clearAll()', 'color: #64748b;');
console.log('%c- debugApp.storageInfo()', 'color: #64748b;');
console.log('%c- debugApp.exportEvents()', 'color: #64748b;');
console.log('%c- debugApp.importEvents(jsonString)', 'color: #64748b;');
