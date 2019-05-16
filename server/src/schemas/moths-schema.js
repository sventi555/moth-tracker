const Joi = require('@hapi/joi');

const schema = {
    species: Joi.string(),
    wingspan: Joi.number().positive(),
    weight: Joi.number().positive(),
    last_spotted: Joi.object().keys({
        lat: Joi.number().min(-90).max(90),
        lng: Joi.number().min(-180).max(180)
    })
};
module.exports = schema;
