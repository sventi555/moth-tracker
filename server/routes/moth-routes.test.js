jest.mock('../db');

const express = require('express');
const supertest = require('supertest');

const db = require('../db');
const {errorMiddleware} = require('../middlewares/error-middleware');
const mothRoutes = require('./moth-routes');

describe('given moth routes are being called', () => {
    const MOCK_MOTH = {id: '5f8b81be-7e6c-41f1-ba8f-c35d8d346509'};
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        mothRoutes(app);
        app.use(errorMiddleware);
    });

    describe('given request method is get', () => {
        beforeAll(() => {
            db.query.mockImplementation(async () => {
                return {rows: [MOCK_MOTH]};
            });
        });
        describe('when bad params are passed', () => {
            test('then a validation error is sent back', async () => {
                await supertest(app)
                    .get('/api/moths/doot')
                    .expect(400);
            });
        });
        describe('when no id is specified', () => {
            test('then all moths are sent back', async () => {
                const response = await supertest(app)
                    .get('/api/moths')
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith(
                    'SELECT * FROM moths', []
                );
                expect(response.body).toEqual([MOCK_MOTH]);
            });
        });
        describe('when an id is specified', () => {
            test('then the requested moth is sent back', async () => {
                const response = await supertest(app)
                    .get(`/api/moths/${MOCK_MOTH.id}`)
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith(
                    'SELECT * FROM moths WHERE id = $1', [MOCK_MOTH.id]
                );
                expect(response.body).toEqual(MOCK_MOTH);
            });
        });
        describe('when filters, fields, order, and size are included', () => {
            test('then query is constructed accordingly', async () => {
                await supertest(app)
                    .get('/api/moths')
                    .query({
                        fields: ['species', 'weight'],
                        species: 'big moth',
                        sort: 'weight',
                        limit: 10,
                        offset: 5
                    })
                    .expect(200);

                expect(db.query).toHaveBeenCalledWith(
                    'SELECT species, weight FROM moths WHERE species = $1 \
ORDER BY weight ASC LIMIT 10 OFFSET 5', ['big moth']
                );
            });
        });
    });

    describe('given request method is post', () => {
        describe('when bad params are given', () => {
            test('then validation error is sent back', async () => {
                await supertest(app)
                    .post('/api/moths')
                    .send({id: MOCK_MOTH.id})
                    .expect(400);
            });
        });
        describe('when valid parameters are passed in', () => {
            test('then query is executed accordingly', async () => {
                await supertest(app)
                    .post('/api/moths')
                    .send({species: 'big moth'})
                    .expect(204);

                expect(db.query).toHaveBeenCalled();
            });
        });
    });

    describe('given request method is put', () => {
        describe('when bad body is given', () => {
            test('then validation error is sent back', async () => {
                await supertest(app)
                    .put(`/api/moths/${MOCK_MOTH.id}`)
                    .send({id: MOCK_MOTH.id})
                    .expect(400);
            });
        });
        describe('when body is valid', () => {
            test('then query is executed accordingly', async () => {
                await supertest(app)
                    .put(`/api/moths/${MOCK_MOTH.id}`)
                    .send({species: 'small moth', wingspan: 12})
                    .expect(204);
            });
        });
    });

    describe('given request method is patch', () => {
        describe('when bad body is given', () => {
            test('then validation error is sent back', async () => {
                await supertest(app)
                    .patch(`/api/moths/${MOCK_MOTH.id}`)
                    .send({id: MOCK_MOTH.id})
                    .expect(400);
            });
        });
        describe('when good body is given', () => {
            test('then query is executed accordingly', async () => {
                await supertest(app)
                    .patch(`/api/moths/${MOCK_MOTH.id}`)
                    .send({species: 'small moth'})
                    .expect(204);

                expect(db.query).toHaveBeenCalled();
            });
        });
    });

    describe('given request method is delete', () => {
        describe('when bad params are given', () => {
            test('then validation error is sent back', async () => {
                await supertest(app)
                    .delete('/api/moths/stupid')
                    .expect(400);
            });
        });
        describe('when good params are given', () => {
            test('then successful response is sent', async () => {
                await supertest(app)
                    .delete(`/api/moths/${MOCK_MOTH.id}`)
                    .expect(204);
            });
        });
    });
});
