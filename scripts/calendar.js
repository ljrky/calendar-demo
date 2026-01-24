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

    // Render calendar with error boundary
    render() {
        try {
            this.updateMonthHeader();
            this.renderCalendarGrid();
        } catch (error) {
            console.error('Failed to render calendar:', error);
            this.showRenderError();
        }
    },

    // Show error message when rendering fails
    showRenderError() {
        const grid = document.getElementById('calendarGrid');
        if (!grid) return;

        grid.innerHTML = '';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'col-span-7 flex flex-col items-center justify-center p-8 text-center';
        errorDiv.innerHTML = `
            <svg class="w-12 h-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p class="text-slate-600 dark:text-slate-400 mb-4">Failed to load calendar. Please try refreshing the page.</p>
            <button onclick="location.reload()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Refresh Page
            </button>
        `;
        grid.appendChild(errorDiv);
        Toast.error('Failed to render calendar');
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
        cell.className = 'day-cell relative min-h-[70px] sm:min-h-[80px] md:min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 border-l-0 border-t-0 p-1 sm:p-2 flex flex-col overflow-hidden [&:nth-child(7n+1)]:border-l';
        return cell;
    },

    // Create day cell
    createDayCell(day, dateString) {
        const cell = document.createElement('div');
        cell.className = 'day-cell relative min-h-[70px] sm:min-h-[80px] md:min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 border-l-0 border-t-0 p-1 sm:p-2 cursor-pointer transition-colors duration-150 flex flex-col overflow-hidden hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset focus:z-10 [&:nth-child(7n+1)]:border-l';

        // Add tabindex for keyboard navigation
        cell.setAttribute('tabindex', '0');
        cell.setAttribute('role', 'button');
        cell.setAttribute('aria-label', `${this.monthNames[this.currentMonth]} ${day}, ${this.currentYear}`);

        // Day number
        const dayNumber = document.createElement('div');

        // Add today styling if applicable
        if (this.isToday(this.currentYear, this.currentMonth, day)) {
            dayNumber.className = 'day-number text-[11px] sm:text-xs font-medium mb-1 self-start flex items-center justify-center min-w-[22px] sm:min-w-[26px] h-[22px] sm:h-[26px] bg-blue-600 text-white rounded-full';
        } else {
            dayNumber.className = 'day-number text-[11px] sm:text-xs font-normal text-slate-800 dark:text-slate-200 mb-1 self-start flex items-center justify-center min-w-[22px] sm:min-w-[26px] h-[22px] sm:h-[26px]';
        }
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
        container.className = 'event-indicators flex flex-col gap-0.5 flex-1 overflow-hidden';

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

            // Add keyboard handler
            countBadge.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showEventsForDay(events);
                }
            });
        }

        return container;
    },

    // Create event badge
    createEventBadge(event) {
        const badge = document.createElement('div');
        badge.className = 'event-badge flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer transition-opacity duration-150 leading-tight hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1';
        badge.dataset.color = event.color;
        badge.textContent = event.title;
        badge.dataset.eventId = event.id;
        badge.title = this.getEventTooltip(event);

        // Keyboard accessibility
        badge.setAttribute('tabindex', '0');
        badge.setAttribute('role', 'button');
        badge.setAttribute('aria-label', `Edit event: ${event.title}`);

        // Click handler
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            Modal.openEditMode(event.id);
        });

        // Keyboard handler
        badge.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                Modal.openEditMode(event.id);
            }
        });

        return badge;
    },

    // Create count badge
    createCountBadge(count) {
        const badge = document.createElement('div');
        badge.className = 'event-count inline-flex items-center justify-center px-1.5 py-0.5 text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-medium cursor-pointer mt-0.5 hover:text-slate-800 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded';
        badge.textContent = `+${count} more`;
        badge.title = `${count} more events on this day`;

        // Keyboard accessibility
        badge.setAttribute('tabindex', '0');
        badge.setAttribute('role', 'button');
        badge.setAttribute('aria-label', `Show ${count} more events`);

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
