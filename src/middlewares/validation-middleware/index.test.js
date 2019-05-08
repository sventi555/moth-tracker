const express = require('express');
const Joi = require('@hapi/joi');
const supertest = require('supertest');

const validate = require('./index');
const {errorMiddleware} = require('../error-middleware');

const SCHEMA = Joi.object().keys({
    age: Joi.number().integer()
});

describe('given validate middleware is being called', () => {
    let app;
    describe('given schema applies to body', () => {
        beforeAll(() => {
            app = express();
            app.use(express.json());
            app.post('/', validate({body: SCHEMA}),
                (req, res) => {
                    res.status(200).send();
                });
            app.use(errorMiddleware);
        });
        test('then validation should fail with bad body', async () => {
            await supertest(app)
                .post('/')
                .send({age: 'very old'})
                .expect(400);
        });
        test('then validation should succeed with good body', async () => {
            await supertest(app)
                .post('/')
                .send({age: 10})
                .expect(200);
        });
    });
    describe('given schema applies to query', () => {
        beforeAll(() => {
            app = express();
            app.use(express.json());
            app.get('/', validate({query: SCHEMA}),
                (req, res) => {
                    res.status(200).send();
                });
            app.use(errorMiddleware);
        });
        test('then validation should fail with bad query', async () => {
            await supertest(app)
                .get('/')
                .query({age: 'very old'})
                .expect(400);
        });
        test('then validation should pass with good query', async () => {
            await supertest(app)
                .get('/')
                .query({age: 10})
                .expect(200);
        });
    });
    describe('given schema applies to params', () => {
        beforeAll(() => {
            app = express();
            app.use(express.json());
            app.get('/:age', validate({params: SCHEMA}),
                (req, res) => {
                    res.status(200).send();
                });
            app.use(errorMiddleware);
        });
        test('then validation should fail with bad params', async () => {
            await supertest(app)
                .get('/hi')
                .expect(400);
        });
        test('then validation should pass on good params', async () => {
            await supertest(app)
                .get('/14')
                .expect(200);
        });
    });
});
