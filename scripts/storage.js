// Storage module for managing localStorage operations

const Storage = {
    STORAGE_KEY: 'calendar_events',

    // Check if localStorage is available
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.error('localStorage is not available:', e);
            return false;
        }
    },

    // Load all events from localStorage
    loadEvents() {
        if (!this.isAvailable()) {
            console.warn('localStorage not available, returning empty array');
            return [];
        }

        try {
            const data = localStorage.getItem(this.STORAGE_KEY);

            if (!data) {
                return [];
            }

            const events = JSON.parse(data);

            // Validate that it's an array
            if (!Array.isArray(events)) {
                console.error('Stored data is not an array, resetting to empty array');
                this.saveEvents([]);
                return [];
            }

            return events;
        } catch (error) {
            console.error('Error loading events from localStorage:', error);
            // If data is corrupted, reset to empty array
            this.saveEvents([]);
            return [];
        }
    },

    // Save events array to localStorage
    saveEvents(events) {
        if (!this.isAvailable()) {
            console.error('localStorage not available, cannot save events');
            return false;
        }

        // Validate input
        if (!Array.isArray(events)) {
            console.error('Invalid input: events must be an array');
            return false;
        }

        try {
            const data = JSON.stringify(events);
            localStorage.setItem(this.STORAGE_KEY, data);
            return true;
        } catch (error) {
            // Handle quota exceeded error
            if (error.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded');
                Toast.error('Storage limit reached. Please delete some events to continue.');
            } else {
                console.error('Error saving events to localStorage:', error);
                Toast.error('Failed to save events. Please try again.');
            }
            return false;
        }
    },

    // Clear all events from localStorage
    clearEvents() {
        if (!this.isAvailable()) {
            console.error('localStorage not available');
            return false;
        }

        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing events from localStorage:', error);
            return false;
        }
    },

    // Get storage usage information (for debugging)
    getStorageInfo() {
        if (!this.isAvailable()) {
            return {
                available: false,
                used: 0,
                total: 0,
                remaining: 0
            };
        }

        try {
            const data = localStorage.getItem(this.STORAGE_KEY) || '[]';
            const used = new Blob([data]).size;
            const total = 5 * 1024 * 1024; // Approximate 5MB limit
            const remaining = total - used;

            return {
                available: true,
                used: used,
                total: total,
                remaining: remaining,
                usedKB: (used / 1024).toFixed(2),
                remainingKB: (remaining / 1024).toFixed(2)
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return null;
        }
    }
};
