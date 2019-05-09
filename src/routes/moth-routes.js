const Joi = require('@hapi/joi');

const db = require('../db');
const {ClientError} = require('../middlewares/error-middleware');
const validate = require('../middlewares/validation-middleware');
const mothsSchema = require('../schemas/moths-schema');
const {
    argsFromSchema,
    columnsFromSchema,
    fieldsComponent,
    filterComponent,
    orderComponent,
    placeholdersFromSchema,
    sizeComponent,
    updateComponent
} = require('../util/query-constructor');

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
                    offset: Joi.number().integer(),
                    ...mothsSchema
                })
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
        validate(
            {
                body: Joi.object().keys({
                    id: Joi.any().forbidden(),
                    ...mothsSchema
                })
            }
        ),
        async (req, res, next) => {
            const body = req.body;
            const args = argsFromSchema(body, mothsSchema);

            try {
                await db.query(
                    `INSERT INTO moths ${columnsFromSchema(mothsSchema)} \
VALUES ${placeholdersFromSchema(mothsSchema)}`, args);
                res.status(204).send();
            } catch (error) {
                next(error);
            }
        });

    app.put('/moths/:id',
        validate(
            {
                params: Joi.object().keys({
                    id: Joi.string().uuid()
                }),
                body: Joi.object().keys({
                    id: Joi.any().forbidden(),
                    ...mothsSchema
                })
            }
        ),
        async (req, res, next) => {
            const id = req.params.id;
            const body = req.body;
            const args = argsFromSchema(body, mothsSchema);

            try {
                const moth = await db.query(
                    'SELECT id FROM moths WHERE id = $1', [id]);
                if (moth.rows.length === 0) {
                    throw new ClientError(
                        `moth with id ${id} does not exist`, 404);
                }

                await db.query(
                    'DELETE FROM moths WHERE id = $1', [req.params.id]);
                await db.query(
                    `INSERT INTO moths ${columnsFromSchema(mothsSchema)} \
VALUES ${placeholdersFromSchema(mothsSchema)}`, args);
                res.status(204).send();
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
                body: Joi.object().keys({
                    id: Joi.any().forbidden(),
                    ...mothsSchema
                })
            }
        ),
        async (req, res, next) => {
            const updateComp = updateComponent(req.body);
            const args = updateComp.args;
            try {
                if (args.length === 0) {
                    throw new ClientError('At least one field must be specified');
                }
                args.push(req.params.id);

                let queryString = 'UPDATE moths';
                queryString += updateComp.str;
                queryString += ` WHERE id = $${args.length}`;
                await db.query(queryString, args);
                res.status(204).send();
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
