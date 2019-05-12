const Joi = require('@hapi/joi');

const { ValidationError } = require('../error-middleware');

/**
 * Returns a middleware function that continues on if all the
 * schemas validate successfully against the request body,
 * params, and query (if included in schemas).
 *
 * Example schemas looks like this:
 * const schemas = {
 *     body: Joi.object.keys({id: Joi.any().forbidden()}),
 *     params: Joi.object.keys({id: Joi.number().integer()})
 * }
 *
 * This example left out a schema for query, but it could just have
 * easily been included.
 *
 * @param {Object} schemas
 */
function validate(schemas) {
    return (req, res, next) => {
        if (!schemas) {
            return next();
        }

        // if there is validation schema for request body
        if (schemas.body) {
            const requestBody = req.body;
            Joi.validate(requestBody, schemas.body, (err) => {
                if (err) {
                    const validationError = new ValidationError(err.message);
                    return next(validationError);
                }
            });
        }

        // if there is a validation schema for request params
        if (schemas.params) {
            const requestParams = req.params;
            Joi.validate(requestParams, schemas.params, (err) => {
                if (err) {
                    const validationError = new ValidationError(err.message);
                    return next(validationError);
                }
            });
        }

        // if there is a validation schema for request query
        if (schemas.query) {
            const requestQuery = req.query;
            Joi.validate(requestQuery, schemas.query, (err) => {
                if (err) {
                    const validationError = new ValidationError(err.message);
                    return next(validationError);
                }
            });
        }

        next();
    };
}
module.exports = validate;
