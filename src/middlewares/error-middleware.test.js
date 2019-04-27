const express = require('express');
const supertest = require('supertest');

const {ClientError, errorMiddleware} = require('./error-middleware');

describe('given a clientError is constructed', () => {
    test('then it should be of type ClientError, and Error', () => {
        const error = new ClientError();

        expect(error instanceof ClientError).toBeTruthy();
        expect(error instanceof Error).toBeTruthy();
    });
    describe('when no code is passed in', () => {
        test('then code defaults to 400', () => {
            const noCodeError = new ClientError('whoops');

            expect(noCodeError.code).toEqual(400);
        });
    });
    describe('when a code and message are passed in', () => {
        test('then properties are assigned', () => {
            const fullError = new ClientError('whoops', 401);

            expect(fullError.code).toEqual(401);
            expect(fullError.message).toEqual('whoops');
        });
    });
});

describe('given the error middleware is called', () => {
    let app;
    describe('when no error is passed in', () => {
        beforeAll(() => {
            app = express();
            app.get('/', (req, res, next) => {
                next();
            });
            app.use(errorMiddleware);
        });
        test('then request should fall through', async () => {
            await supertest(app)
                .get('/')
                .expect(404);
        });
    });
    describe('when a ClientError is passed in', () => {
        beforeAll(() => {
            app = express();
            app.get('/', (req, res, next) => {
                next(new ClientError('get out', 401));
            });
            app.use(errorMiddleware);
        });
        test('then corresponding error shoud be sent back', async () => {
            const response = await supertest(app)
                .get('/')
                .expect(401);

            expect(response.body.error).toEqual('get out');
        });
    });
    describe('when any other error is passed in', () => {
        beforeAll(() => {
            app = express();
            app.get('/', (req, res, next) => {
                next(new Error('oops all spider eggs'));
            });
            app.use(errorMiddleware);
        });
        test('then generic server error should be sent back', async () => {
            const response = await supertest(app)
                .get('/')
                .expect(500);

            expect(response.body.error).toEqual(
                'an internal server error has occurred'
            );
        });
    });
});
