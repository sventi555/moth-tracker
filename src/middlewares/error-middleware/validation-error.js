class ValidationError extends Error {
    /**
     * Creates an instance of ValidationError.
     *
     * @param {String} message
     * @property {Number} code
     */
    constructor(message) {
        super(message);
        this.code = 400;
    }
}
module.exports = ValidationError;
