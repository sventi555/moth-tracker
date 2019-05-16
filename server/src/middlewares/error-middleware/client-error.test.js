const ClientError = require('./client-error');

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
