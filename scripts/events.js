// Events module for managing event CRUD operations

const Events = {
    // In-memory cache of events
    events: [],

    // Initialize events from storage
    init() {
        this.events = Storage.loadEvents();
        return this.events;
    },

    // Get all events
    getAll() {
        return this.events;
    },

    // Generate unique ID for new event
    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    },

    // Create a new event
    createEvent(eventData) {
        // Validate required fields
        if (!eventData.title || !eventData.date) {
            console.error('Title and date are required');
            return null;
        }

        const now = new Date().toISOString();

        const newEvent = {
            id: this.generateId(),
            title: eventData.title.trim(),
            date: eventData.date,
            startTime: eventData.startTime || '',
            endTime: eventData.endTime || '',
            description: eventData.description ? eventData.description.trim() : '',
            color: eventData.color || '#3b82f6',
            createdAt: now,
            updatedAt: now
        };

        this.events.push(newEvent);

        // Save to storage
        if (Storage.saveEvents(this.events)) {
            console.log('Event created:', newEvent.id);
            return newEvent;
        } else {
            // Rollback if save failed
            this.events.pop();
            return null;
        }
    },

    // Get event by ID
    getEventById(id) {
        return this.events.find(event => event.id === id) || null;
    },

    // Get events by date (YYYY-MM-DD format)
    getEventsByDate(date) {
        return this.events.filter(event => event.date === date);
    },

    // Get events for a specific month (YYYY-MM format)
    getEventsByMonth(year, month) {
        // Pad month with leading zero if needed
        const monthStr = month.toString().padStart(2, '0');
        const datePrefix = `${year}-${monthStr}`;

        return this.events.filter(event => event.date.startsWith(datePrefix));
    },

    // Update an existing event
    updateEvent(id, eventData) {
        const index = this.events.findIndex(event => event.id === id);

        if (index === -1) {
            console.error('Event not found:', id);
            return null;
        }

        // Create backup for rollback
        const backup = { ...this.events[index] };

        // Update event fields
        const updatedEvent = {
            ...this.events[index],
            title: eventData.title ? eventData.title.trim() : this.events[index].title,
            date: eventData.date || this.events[index].date,
            startTime: eventData.startTime !== undefined ? eventData.startTime : this.events[index].startTime,
            endTime: eventData.endTime !== undefined ? eventData.endTime : this.events[index].endTime,
            description: eventData.description !== undefined ? eventData.description.trim() : this.events[index].description,
            color: eventData.color || this.events[index].color,
            updatedAt: new Date().toISOString()
        };

        this.events[index] = updatedEvent;

        // Save to storage
        if (Storage.saveEvents(this.events)) {
            console.log('Event updated:', id);
            return updatedEvent;
        } else {
            // Rollback if save failed
            this.events[index] = backup;
            return null;
        }
    },

    // Delete an event
    deleteEvent(id) {
        const index = this.events.findIndex(event => event.id === id);

        if (index === -1) {
            console.error('Event not found:', id);
            return false;
        }

        // Create backup for rollback
        const backup = [...this.events];

        // Remove event
        this.events.splice(index, 1);

        // Save to storage
        if (Storage.saveEvents(this.events)) {
            console.log('Event deleted:', id);
            return true;
        } else {
            // Rollback if save failed
            this.events = backup;
            return false;
        }
    },

    // Delete all events (for testing/debugging)
    deleteAll() {
        const backup = [...this.events];
        this.events = [];

        if (Storage.saveEvents(this.events)) {
            console.log('All events deleted');
            return true;
        } else {
            this.events = backup;
            return false;
        }
    },

    // Search events by title
    searchByTitle(query) {
        if (!query) return [];

        const lowerQuery = query.toLowerCase();
        return this.events.filter(event =>
            event.title.toLowerCase().includes(lowerQuery)
        );
    },

    // Get event count for a specific date
    getEventCount(date) {
        return this.events.filter(event => event.date === date).length;
    },

    // Get upcoming events (from today forward)
    getUpcomingEvents(limit = 10) {
        const today = new Date().toISOString().split('T')[0];

        return this.events
            .filter(event => event.date >= today)
            .sort((a, b) => {
                // Sort by date, then by start time
                if (a.date !== b.date) {
                    return a.date.localeCompare(b.date);
                }
                return (a.startTime || '').localeCompare(b.startTime || '');
            })
            .slice(0, limit);
    },

    // Get events statistics
    getStats() {
        const today = new Date().toISOString().split('T')[0];

        return {
            total: this.events.length,
            upcoming: this.events.filter(e => e.date >= today).length,
            past: this.events.filter(e => e.date < today).length,
            today: this.events.filter(e => e.date === today).length
        };
    }
};
