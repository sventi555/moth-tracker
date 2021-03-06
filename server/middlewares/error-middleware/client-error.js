class ClientError extends Error {
    /**
     * Creates an instance of ClientError.
     *
     * @param {String} [message]
     * @param {Number} [code=400]
     * @property {Number} code
     */
    constructor(message, code=400) {
        super(message);

        this.code = code;
    }
}
module.exports = ClientError;
