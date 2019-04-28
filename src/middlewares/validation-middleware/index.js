const Joi = require('@hapi/joi');

const { ValidationError } = require('../error-middleware');

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
