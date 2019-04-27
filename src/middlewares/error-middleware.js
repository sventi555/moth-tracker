class ClientError extends Error {
    constructor(message, code=400) {
        super(message);

        this.code = code;
    }
}
module.exports.ClientError = ClientError;


function errorMiddleware(error, req, res, next) {
    // no need to process an error if there isn't one
    if (!error) {
        next();

    // if the error is a ClientError, just send back pretty much as is
    } else if (error instanceof ClientError) {
        res.status(error.code).json({error: error.message});

    // if I didn't catch it, it's a server error lol
    } else {
        res.status(500).json(
            {error: 'an internal server error has occurred'}
        );
    }
}
module.exports.errorMiddleware = errorMiddleware;
