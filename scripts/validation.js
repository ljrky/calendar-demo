// Validation module for form input validation

const Validation = {
    errors: {},

    // Validate event title
    validateTitle(title) {
        if (!title || title.trim().length === 0) {
            return {
                valid: false,
                message: 'Title is required'
            };
        }

        if (title.trim().length > 100) {
            return {
                valid: false,
                message: 'Title must be 100 characters or less'
            };
        }

        if (title.trim().length < title.length) {
            // Has leading/trailing whitespace
            return {
                valid: true,
                message: '',
                warning: 'Leading/trailing spaces will be removed'
            };
        }

        return {
            valid: true,
            message: ''
        };
    },

    // Validate event date
    validateDate(dateString) {
        if (!dateString) {
            return {
                valid: false,
                message: 'Date is required'
            };
        }

        // Check format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateString)) {
            return {
                valid: false,
                message: 'Invalid date format (use YYYY-MM-DD)'
            };
        }

        // Check if it's a valid date
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return {
                valid: false,
                message: 'Invalid date'
            };
        }

        // Check year range (1900-2100)
        const year = date.getFullYear();
        if (year < 1900 || year > 2100) {
            return {
                valid: false,
                message: 'Date must be between 1900 and 2100'
            };
        }

        return {
            valid: true,
            message: ''
        };
    },

    // Validate time format
    validateTimeFormat(timeString) {
        if (!timeString) {
            return {
                valid: true,
                message: ''
            };
        }

        // Check format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(timeString)) {
            return {
                valid: false,
                message: 'Invalid time format (use HH:MM)'
            };
        }

        return {
            valid: true,
            message: ''
        };
    },

    // Validate time range (end time must be after start time)
    validateTimeRange(startTime, endTime) {
        // If either is empty, skip validation
        if (!startTime || !endTime) {
            return {
                valid: true,
                message: ''
            };
        }

        // Validate formats first
        const startValidation = this.validateTimeFormat(startTime);
        if (!startValidation.valid) {
            return startValidation;
        }

        const endValidation = this.validateTimeFormat(endTime);
        if (!endValidation.valid) {
            return endValidation;
        }

        // Compare times
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;

        if (endMinutes <= startMinutes) {
            return {
                valid: false,
                message: 'End time must be after start time'
            };
        }

        return {
            valid: true,
            message: ''
        };
    },

    // Validate description
    validateDescription(description) {
        if (!description) {
            return {
                valid: true,
                message: ''
            };
        }

        if (description.length > 500) {
            return {
                valid: false,
                message: 'Description must be 500 characters or less'
            };
        }

        return {
            valid: true,
            message: ''
        };
    },

    // Validate color
    validateColor(color) {
        if (!color) {
            return {
                valid: true,
                message: '',
                default: '#3b82f6'
            };
        }

        // Check hex color format
        const hexRegex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
        if (!hexRegex.test(color)) {
            return {
                valid: false,
                message: 'Invalid color format (use #RRGGBB)'
            };
        }

        return {
            valid: true,
            message: ''
        };
    },

    // Validate entire form
    validateForm(formData) {
        this.errors = {};
        let isValid = true;

        // Validate title
        const titleValidation = this.validateTitle(formData.title);
        if (!titleValidation.valid) {
            this.errors.title = titleValidation.message;
            isValid = false;
        }

        // Validate date
        const dateValidation = this.validateDate(formData.date);
        if (!dateValidation.valid) {
            this.errors.date = dateValidation.message;
            isValid = false;
        }

        // Validate start time format
        const startTimeValidation = this.validateTimeFormat(formData.startTime);
        if (!startTimeValidation.valid) {
            this.errors.startTime = startTimeValidation.message;
            isValid = false;
        }

        // Validate end time format
        const endTimeValidation = this.validateTimeFormat(formData.endTime);
        if (!endTimeValidation.valid) {
            this.errors.endTime = endTimeValidation.message;
            isValid = false;
        }

        // Validate time range (only if both times are valid)
        if (startTimeValidation.valid && endTimeValidation.valid) {
            const timeRangeValidation = this.validateTimeRange(formData.startTime, formData.endTime);
            if (!timeRangeValidation.valid) {
                this.errors.endTime = timeRangeValidation.message;
                isValid = false;
            }
        }

        // Validate description
        const descriptionValidation = this.validateDescription(formData.description);
        if (!descriptionValidation.valid) {
            this.errors.description = descriptionValidation.message;
            isValid = false;
        }

        // Validate color
        const colorValidation = this.validateColor(formData.color);
        if (!colorValidation.valid) {
            this.errors.color = colorValidation.message;
            isValid = false;
        }

        return {
            valid: isValid,
            errors: this.errors
        };
    },

    // Get all current errors
    getErrors() {
        return this.errors;
    },

    // Clear all errors
    clearErrors() {
        this.errors = {};
    },

    // Show error message in UI
    showError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        const inputElement = document.getElementById(`event${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`);

        if (errorElement) {
            errorElement.textContent = message;
        }

        if (inputElement) {
            if (message) {
                // Add error styling with Tailwind classes
                inputElement.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20');
                inputElement.classList.remove('border-slate-300', 'dark:border-slate-500', 'focus:border-blue-500', 'focus:ring-blue-500/20', 'border-green-500');
            } else {
                // Remove error styling
                inputElement.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20');
                inputElement.classList.add('border-slate-300', 'dark:border-slate-500', 'focus:border-blue-500', 'focus:ring-blue-500/20');
            }
        }
    },

    // Clear error message in UI
    clearError(fieldName) {
        this.showError(fieldName, '');
    },

    // Show all validation errors in UI
    showErrors(errors) {
        // Clear all previous errors
        this.clearAllErrors();

        // Show new errors
        Object.keys(errors).forEach(fieldName => {
            this.showError(fieldName, errors[fieldName]);
        });

        // Focus first error field
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
            const fieldElement = document.getElementById(`event${firstErrorField.charAt(0).toUpperCase() + firstErrorField.slice(1)}`);
            fieldElement?.focus();
        }
    },

    // Clear all error messages in UI
    clearAllErrors() {
        const errorFields = ['title', 'date', 'startTime', 'endTime', 'description'];
        errorFields.forEach(field => this.clearError(field));
    },

    // Sanitize user input
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;

        return input
            .trim()
            .replace(/[<>]/g, '') // Remove < and > to prevent XSS
            .substring(0, 1000); // Limit length
    }
};
