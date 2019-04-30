class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.code = 422;
    }
}
module.exports = ValidationError;
