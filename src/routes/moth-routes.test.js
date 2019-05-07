jest.mock('../db');

const express = require('express');
const supertest = require('supertest');

const mothRoutes = require('./moth-routes');
const {errorMiddleware} = require('../middlewares/error-middleware');
const db = require('../db');

describe('testing moth routes', () => {
    const app = express();
    app.use(express.json());
    mothRoutes(app);
    app.use(errorMiddleware);

    const MOTH_ID = '6d70b787-8cd2-4cc4-b441-498093add3a7';
    const MOCK_ROWS = [{a: 'moth'}];
    beforeAll(() => {
        db.query.mockImplementation(async () => {
            return {rows: MOCK_ROWS};
        });
    });

    describe('given request method is get', () => {
        describe('when invalid params are sent', () => {
            test('then a validation error is sent back', async () => {
                await supertest(app)
                    .get('/moths/bad-id')
                    .expect(400);
            });
        });
        describe('when no id is sent', () => {
            test('then query is made against all moths', async () => {
                await supertest(app)
                    .get('/moths')
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith('SELECT * FROM moths', []);
            });
        });
        describe('when id is sent', () => {
            test('then query is made against specified moth', async () => {
                const response = await supertest(app)
                    .get(`/moths/${MOTH_ID}`)
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith(
                    'SELECT * FROM moths WHERE id = $1', [MOTH_ID]
                );
                expect(response.body).toEqual(MOCK_ROWS[0]);
            });
        });
        describe('when one field is requested', () => {
            test('then that field is included in the query', async () => {
                await supertest(app)
                    .get('/moths')
                    .query({fields: 'weight'})
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith(
                    'SELECT weight FROM moths', []
                );
            });
        });
        describe('when multiple fields are requested', () => {
            test('then those fields are included in the query', async () => {
                await supertest(app)
                    .get('/moths')
                    .query({fields: ['weight', 'species']})
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith(
                    'SELECT weight, species FROM moths', []
                );
            });
        });
        describe('when one equality filter is included', () => {
            test('then that filter is applied', async () => {
                await supertest(app)
                    .get('/moths')
                    .query({weight: 4})
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith(
                    'SELECT * FROM moths WHERE weight = $1', ['4']
                );
            });
        });
        describe('when any valid operator is used in the filter', () => {
            test('then the operators map to their correct symbol', async () => {
                await supertest(app)
                    .get('/moths')
                    .query({wingspan: {gt: 4, lt: 6}, weight: {gte: 3, lte: 7}})
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith(
                    'SELECT * FROM moths WHERE wingspan > $1 AND wingspan < $2 \
AND weight >= $3 AND weight <= $4', ['4', '6', '3', '7']
                );
            });
        });
        describe('when an invalid operator is used in the filter', () => {
            test('then a validation error is sent back', async () => {
                const response = await supertest(app)
                    .get('/moths')
                    .query({weight: {tim: 3}})
                    .expect(400);

                expect(response.body.error).
                    toEqual('Invalid filter operator for weight');
            });
        });
        describe('when a single order is specified', () => {
            test('then order is inserted into query correctly', async () => {
                await supertest(app)
                    .get('/moths')
                    .query({sort: 'species'})
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith(
                    'SELECT * FROM moths ORDER BY species ASC', []
                );
            });
        });
        describe('when multiple orders are specified', () => {
            test('then orders are inserted into query correctly', async () => {
                await supertest(app)
                    .get('/moths')
                    .query({sort: ['species', '-weight', 'wingspan']})
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith(
                    'SELECT * FROM moths ORDER BY species ASC, weight DESC, \
wingspan ASC', []
                );
            });
        });
        describe('when a limit is specified', () => {
            test('then limit is inserted into query correctly', async () => {
                await supertest(app)
                    .get('/moths')
                    .query({limit: 5})
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith(
                    'SELECT * FROM moths LIMIT 5', []
                );
            });
        });
        describe('when an offset is specified', () => {
            test('then offset is inserted into query correctly', async () => {
                await supertest(app)
                    .get('/moths')
                    .query({offset: 10})
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith(
                    'SELECT * FROM moths OFFSET 10', []
                );
            });
        });
    });
    describe('given request method is post', () => {

    });
    describe('given request method is put', () => {

    });
    describe('given request method is patch', () => {

    });
    describe('given request method is delete', () => {

    });
});
