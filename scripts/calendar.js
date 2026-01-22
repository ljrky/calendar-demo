// Calendar module for rendering the calendar grid

const Calendar = {
    currentDate: new Date(),
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(), // 0-11
    today: new Date(),

    monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ],

    // Initialize calendar
    init() {
        this.attachNavigationListeners();
        this.render();
    },

    // Attach navigation event listeners
    attachNavigationListeners() {
        const prevButton = document.getElementById('prevMonth');
        const nextButton = document.getElementById('nextMonth');
        const todayButton = document.getElementById('todayButton');

        prevButton?.addEventListener('click', () => {
            this.previousMonth();
        });

        nextButton?.addEventListener('click', () => {
            this.nextMonth();
        });

        todayButton?.addEventListener('click', () => {
            this.goToToday();
        });
    },

    // Go to previous month
    previousMonth() {
        this.currentMonth--;
        if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.render();
    },

    // Go to next month
    nextMonth() {
        this.currentMonth++;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        }
        this.render();
    },

    // Get number of days in a month
    getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    },

    // Get first day of month (0 = Sunday, 6 = Saturday)
    getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    },

    // Format date as YYYY-MM-DD
    formatDate(year, month, day) {
        const monthStr = (month + 1).toString().padStart(2, '0');
        const dayStr = day.toString().padStart(2, '0');
        return `${year}-${monthStr}-${dayStr}`;
    },

    // Check if date is today
    isToday(year, month, day) {
        return year === this.today.getFullYear() &&
               month === this.today.getMonth() &&
               day === this.today.getDate();
    },

    // Render calendar
    render() {
        this.updateMonthHeader();
        this.renderCalendarGrid();
    },

    // Update month header
    updateMonthHeader() {
        const monthHeader = document.getElementById('currentMonth');
        if (monthHeader) {
            monthHeader.textContent = `${this.monthNames[this.currentMonth]} ${this.currentYear}`;
        }
    },

    // Render calendar grid
    renderCalendarGrid() {
        const grid = document.getElementById('calendarGrid');
        if (!grid) return;

        // Clear existing grid
        grid.innerHTML = '';

        const daysInMonth = this.getDaysInMonth(this.currentYear, this.currentMonth);
        const firstDay = this.getFirstDayOfMonth(this.currentYear, this.currentMonth);

        // Add empty cells for days before the first day of month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = this.createEmptyCell();
            grid.appendChild(emptyCell);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = this.formatDate(this.currentYear, this.currentMonth, day);
            const dayCell = this.createDayCell(day, dateString);
            grid.appendChild(dayCell);
        }
    },

    // Create empty cell
    createEmptyCell() {
        const cell = document.createElement('div');
        cell.className = 'day-cell empty';
        return cell;
    },

    // Create day cell
    createDayCell(day, dateString) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';

        // Add today class if applicable
        if (this.isToday(this.currentYear, this.currentMonth, day)) {
            cell.classList.add('today');
        }

        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        cell.appendChild(dayNumber);

        // Get events for this date
        const events = Events.getEventsByDate(dateString);

        // Add event indicators
        if (events.length > 0) {
            const indicators = this.createEventIndicators(events);
            cell.appendChild(indicators);
        }

        // Click handler to add new event
        cell.addEventListener('click', (e) => {
            // Check if clicking on an event badge
            if (e.target.classList.contains('event-badge')) {
                const eventId = e.target.dataset.eventId;
                Modal.openEditMode(eventId);
            } else {
                // Open modal to add new event
                Modal.openAddMode(dateString);
            }
        });

        return cell;
    },

    // Create event indicators
    createEventIndicators(events) {
        const container = document.createElement('div');
        container.className = 'event-indicators';

        const maxVisible = 3;
        const visibleEvents = events.slice(0, maxVisible);
        const remainingCount = events.length - maxVisible;

        // Show up to 3 events
        visibleEvents.forEach(event => {
            const badge = this.createEventBadge(event);
            container.appendChild(badge);
        });

        // Show "+X more" for additional events
        if (remainingCount > 0) {
            const countBadge = this.createCountBadge(remainingCount);
            container.appendChild(countBadge);

            // Add click handler to show all events
            countBadge.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showEventsForDay(events);
            });
        }

        return container;
    },

    // Create event badge
    createEventBadge(event) {
        const badge = document.createElement('div');
        badge.className = 'event-badge';
        badge.dataset.color = event.color;
        badge.textContent = event.title;
        badge.dataset.eventId = event.id;
        badge.title = this.getEventTooltip(event);

        // Prevent event from bubbling to day cell
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            Modal.openEditMode(event.id);
        });

        return badge;
    },

    // Create count badge
    createCountBadge(count) {
        const badge = document.createElement('div');
        badge.className = 'event-count';
        badge.textContent = `+${count} more`;
        badge.title = `${count} more events on this day`;
        return badge;
    },

    // Get event tooltip text
    getEventTooltip(event) {
        let tooltip = event.title;

        if (event.startTime && event.endTime) {
            tooltip += `\n${event.startTime} - ${event.endTime}`;
        } else if (event.startTime) {
            tooltip += `\nStarts at ${event.startTime}`;
        }

        if (event.description) {
            const desc = event.description.length > 50
                ? event.description.substring(0, 50) + '...'
                : event.description;
            tooltip += `\n${desc}`;
        }

        return tooltip;
    },

    // Show events for a day (when clicking count badge)
    showEventsForDay(events) {
        // For now, just open the first event
        // In a more advanced version, you could show a list of all events
        if (events.length > 0) {
            Modal.openEditMode(events[0].id);
        }
    },

    // Go to today
    goToToday() {
        const today = new Date();
        this.currentYear = today.getFullYear();
        this.currentMonth = today.getMonth();
        this.render();
    },

    // Go to specific date
    goToDate(year, month) {
        this.currentYear = year;
        this.currentMonth = month;
        this.render();
    }
};
