const Joi = require('@hapi/joi');

const validate = require('../middlewares/validation-middleware');
const db = require('../db');
const {ClientError} = require('../middlewares/error-middleware');

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
        validate({params: Joi.object().keys({
            id: Joi.string().uuid()
        })}),
        (req, res, next) => {

        });

    app.post('/moths', validate(SCHEMA),
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

    app.put('/moths/:id', validate(SCHEMA),
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
