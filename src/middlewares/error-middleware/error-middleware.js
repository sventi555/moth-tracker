const ClientError = require('./client-error');
const ValidationError = require('./validation-error');

/**
 * Middleware function to handle errors. Will return a response
 * depending on the error passed in.
 *
 * @param {Error} error
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function errorMiddleware(error, req, res, next) {
    // no need to process an error if there isn't one
    if (!error) {
        next();

    // if the error is a ValidationError, send validator generated errors
    } else if (error instanceof ValidationError) {
        res.status(error.code).json({error: error.message});

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
module.exports = errorMiddleware;
