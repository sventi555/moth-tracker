const Joi = require('@hapi/joi');

const validate = require('../middlewares/validation-middleware');
const db = require('../db');
const {ClientError, ValidationError} = require('../middlewares/error-middleware');
const {
    sizeComponent,
    orderComponent,
    filterComponent,
    fieldsComponent,
    updateComponent
} = require('../util/query-constructor');

const SCHEMA = Joi.object().keys({
    id: Joi.any().forbidden(),
    species: Joi.string(),
    wingspan: Joi.number().positive(),
    weight: Joi.number().positive(),
    lastSpotted: Joi.object().keys({
        lat: Joi.number().min(-90).max(90),
        lng: Joi.number().min(-180).max(180)
    })
});

function mothRoutes(app) {
    app.get('/moths/:id?',
        validate(
            {
                params: Joi.object().keys({
                    id: Joi.string().uuid()
                }),
                query: Joi.object().keys({
                    fields: Joi.alternatives().try([Joi.string(), Joi.array()]),
                    sort: Joi.alternatives().try([Joi.string(), Joi.array()]),
                    limit: Joi.number().integer(),
                    offset: Joi.number().integer()
                }).unknown()
            }
        ),
        async (req, res, next) => {
            const id = req.params.id;
            const {fields, sort, limit, offset, ...filters} = req.query;

            if (id) {
                filters.id = id;
            }

            try {
                const filterComp = filterComponent(filters);

                let queryString = 'SELECT';
                queryString += fieldsComponent(fields);
                queryString += ' FROM moths';
                queryString += filterComp.str;
                queryString += orderComponent(sort);
                queryString += sizeComponent(limit, offset);

                const moths = await db.query(queryString, filterComp.args);
                res.status(200).json(filters.id ? moths.rows[0] : moths.rows);
            } catch (error) {
                next(error);
            }
        });

    app.post('/moths',
        validate({body: SCHEMA}),
        async (req, res, next) => {
            const body = req.body;
            const species = body.species || null;
            const wingspan = body.wingspan || null;
            const weight = body.weight || null;
            const lastSpotted = body.lastSpotted || null;
            try {
                await db.query(
                    `INSERT INTO moths
                    (species, wingspan, weight, last_spotted)
                    VALUES
                    ($1, $2, $3, $3)`,
                    [species, wingspan, weight, lastSpotted]
                );
            } catch (error) {
                next(error);
            }
        });

    app.put('/moths/:id',
        validate(
            {
                params: Joi.object.keys({
                    id: Joi.string().uuid()
                }),
                body: SCHEMA
            }
        ),
        async (req, res, next) => {
            const id = req.params.id;

            const species = req.body.species || null;
            const wingspan = req.body.wingspan || null;
            const weight = req.body.weight || null;
            const lastSpotted = req.body.lastSpotted || null;
            try {
                const moth = db.query(
                    'SELECT id FROM moths WHERE id = $1', [id]);
                if (moth.rows.length === 0) {
                    throw new ClientError(
                        `moth with id ${id} does not exist`, 404);
                }

                await db.query(
                    'DELETE FROM moths WHERE id = $1', [req.params.id]);
                await db.query(
                    `INSERT INTO moths
                    (species, wingspan, weight, last_spotted)
                    VALUES
                    ($1, $2, $3, $3)`,
                    [species, wingspan, weight, lastSpotted]
                );
            } catch (error) {
                next(error);
            }
        });

    app.patch('/moths/:id',
        validate(
            {
                params: Joi.object().keys({
                    id: Joi.string().uuid()
                }),
                body: SCHEMA
            }
        ),
        async (req, res, next) => {
            const updateComp = updateComponent(req.body);
            const args = updateComp.args;
            try {
                if (args.length === 0) {
                    throw new ValidationError('At least one field must be specified');
                }
                args.push(req.params.id);

                let queryString = 'UPDATE moths';
                queryString += updateComp.str;
                queryString += ` WHERE id = $${args.length + 1}`;
                const moth = db.query(queryString, args);
                res.status(200).send(moth.rows);
            } catch (error) {
                next(error);
            }
        });

    app.delete('/moths/:id',
        validate({params: Joi.object().keys({
            id: Joi.string().uuid()
        })}),
        async (req, res, next) => {
            try {
                await db.query('DELETE FROM moths WHERE id = $1', [req.params.id]);
                res.status(204).send();
            } catch (err) {
                next(err);
            }
        });
}

module.exports = mothRoutes;
