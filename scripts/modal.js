// Modal module for managing event modal UI

const Modal = {
    overlay: null,
    form: null,
    mode: 'add', // 'add' or 'edit'
    currentEventId: null,
    currentDate: null,

    // Initialize modal
    init() {
        this.overlay = document.getElementById('modalOverlay');
        this.form = document.getElementById('eventForm');

        this.attachEventListeners();
    },

    // Attach event listeners
    attachEventListeners() {
        // Close button
        const closeButton = document.getElementById('closeModal');
        closeButton?.addEventListener('click', () => this.close());

        // Cancel button
        const cancelButton = document.getElementById('cancelButton');
        cancelButton?.addEventListener('click', () => this.close());

        // Overlay click (close modal when clicking outside)
        this.overlay?.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.overlay?.classList.contains('hidden')) {
                this.close();
            }
        });

        // Form submit
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Delete button
        const deleteButton = document.getElementById('deleteButton');
        deleteButton?.addEventListener('click', () => this.handleDelete());

        // Character count for description
        const descriptionField = document.getElementById('eventDescription');
        const charCount = document.getElementById('charCount');
        descriptionField?.addEventListener('input', (e) => {
            const length = e.target.value.length;
            charCount.textContent = `${length} / 500`;
        });

        // Real-time validation on blur
        this.attachFieldValidation();
    },

    // Attach field-level validation
    attachFieldValidation() {
        const titleField = document.getElementById('eventTitle');
        titleField?.addEventListener('blur', () => {
            const validation = Validation.validateTitle(titleField.value);
            Validation.showError('title', validation.valid ? '' : validation.message);
        });

        const dateField = document.getElementById('eventDate');
        dateField?.addEventListener('blur', () => {
            const validation = Validation.validateDate(dateField.value);
            Validation.showError('date', validation.valid ? '' : validation.message);
        });

        const startTimeField = document.getElementById('eventStartTime');
        const endTimeField = document.getElementById('eventEndTime');

        startTimeField?.addEventListener('blur', () => {
            const validation = Validation.validateTimeFormat(startTimeField.value);
            Validation.showError('startTime', validation.valid ? '' : validation.message);

            // Re-validate time range if end time is filled
            if (endTimeField.value) {
                const rangeValidation = Validation.validateTimeRange(startTimeField.value, endTimeField.value);
                Validation.showError('endTime', rangeValidation.valid ? '' : rangeValidation.message);
            }
        });

        endTimeField?.addEventListener('blur', () => {
            const rangeValidation = Validation.validateTimeRange(startTimeField.value, endTimeField.value);
            Validation.showError('endTime', rangeValidation.valid ? '' : rangeValidation.message);
        });
    },

    // Open modal in add mode
    openAddMode(date) {
        this.mode = 'add';
        this.currentDate = date;
        this.currentEventId = null;

        // Update modal title
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = 'Add Event';

        // Update submit button text
        const submitButton = document.getElementById('submitButton');
        submitButton.textContent = 'Create Event';

        // Hide delete button
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.style.display = 'none';

        // Reset and pre-fill form
        this.resetForm();
        const dateField = document.getElementById('eventDate');
        dateField.value = date;

        this.open();
    },

    // Open modal in edit mode
    openEditMode(eventId) {
        this.mode = 'edit';
        this.currentEventId = eventId;

        const event = Events.getEventById(eventId);
        if (!event) {
            console.error('Event not found:', eventId);
            return;
        }

        // Update modal title
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = 'Edit Event';

        // Update submit button text
        const submitButton = document.getElementById('submitButton');
        submitButton.textContent = 'Update Event';

        // Show delete button
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.style.display = 'block';

        // Fill form with event data
        this.fillForm(event);

        this.open();
    },

    // Open modal
    open() {
        this.overlay?.classList.remove('hidden');
        this.overlay?.classList.add('flex', 'animate-fade-in');
        document.body.classList.add('modal-open');

        // Focus first input field
        const firstInput = document.getElementById('eventTitle');
        setTimeout(() => firstInput?.focus(), 100);
    },

    // Close modal
    close() {
        this.overlay?.classList.add('hidden');
        this.overlay?.classList.remove('flex', 'animate-fade-in');
        document.body.classList.remove('modal-open');

        // Reset form after animation
        setTimeout(() => {
            this.resetForm();
        }, 300);
    },

    // Reset form
    resetForm() {
        this.form?.reset();
        Validation.clearAllErrors();

        // Reset character count
        const charCount = document.getElementById('charCount');
        charCount.textContent = '0 / 500';

        // Reset to default color
        const defaultColor = document.getElementById('color1');
        if (defaultColor) {
            defaultColor.checked = true;
        }
    },

    // Fill form with event data
    fillForm(event) {
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventStartTime').value = event.startTime || '';
        document.getElementById('eventEndTime').value = event.endTime || '';
        document.getElementById('eventDescription').value = event.description || '';

        // Update character count
        const charCount = document.getElementById('charCount');
        charCount.textContent = `${(event.description || '').length} / 500`;

        // Set color
        const colorInputs = document.querySelectorAll('input[name="color"]');
        colorInputs.forEach(input => {
            if (input.value === event.color) {
                input.checked = true;
            }
        });
    },

    // Get form data
    getFormData() {
        return {
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            startTime: document.getElementById('eventStartTime').value,
            endTime: document.getElementById('eventEndTime').value,
            description: document.getElementById('eventDescription').value,
            color: document.querySelector('input[name="color"]:checked')?.value || '#3b82f6'
        };
    },

    // Handle form submission
    handleSubmit() {
        const formData = this.getFormData();

        // Validate form
        const validation = Validation.validateForm(formData);

        if (!validation.valid) {
            Validation.showErrors(validation.errors);
            return;
        }

        // Clear any previous errors
        Validation.clearAllErrors();

        // Create or update event
        let success = false;
        if (this.mode === 'add') {
            const newEvent = Events.createEvent(formData);
            success = newEvent !== null;
        } else if (this.mode === 'edit') {
            const updatedEvent = Events.updateEvent(this.currentEventId, formData);
            success = updatedEvent !== null;
        }

        if (success) {
            // Close modal
            this.close();

            // Re-render calendar
            if (window.Calendar) {
                Calendar.render();
            }

            Toast.success(this.currentEventId ? 'Event updated successfully' : 'Event created successfully');
        } else {
            Toast.error('Failed to save event. Please try again.');
        }
    },

    // Handle delete
    handleDelete() {
        if (!this.currentEventId) {
            return;
        }

        // Confirm deletion
        const event = Events.getEventById(this.currentEventId);
        const confirmed = confirm(`Are you sure you want to delete "${event.title}"?`);

        if (!confirmed) {
            return;
        }

        // Delete event
        const success = Events.deleteEvent(this.currentEventId);

        if (success) {
            // Close modal
            this.close();

            // Re-render calendar
            if (window.Calendar) {
                Calendar.render();
            }

            Toast.success('Event deleted successfully');
        } else {
            Toast.error('Failed to delete event. Please try again.');
        }
    }
};
