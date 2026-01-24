// Environment-aware logging utility

const Logger = {
    // Set to true to enable debug logging (can be toggled via debugApp.enableLogs())
    DEBUG_MODE: false,

    log(...args) {
        if (this.DEBUG_MODE) {
            console.log(...args);
        }
    },

    info(...args) {
        if (this.DEBUG_MODE) {
            console.info(...args);
        }
    },

    warn(...args) {
        // Warnings always shown
        console.warn(...args);
    },

    error(...args) {
        // Errors always shown
        console.error(...args);
    },

    table(...args) {
        if (this.DEBUG_MODE) {
            console.table(...args);
        }
    },

    // Styled log (for debug commands help)
    styled(message, style) {
        if (this.DEBUG_MODE) {
            console.log(`%c${message}`, style);
        }
    },

    // Enable/disable debug mode
    enable() {
        this.DEBUG_MODE = true;
        console.log('Debug logging enabled');
    },

    disable() {
        this.DEBUG_MODE = false;
        console.log('Debug logging disabled');
    }
};
