const ValidationError = require('./validation-error');

const errMessage = JSON.stringify([{
    'location': 'body',
    'msg': 'Invalid value',
    'param': 'username'
}]);

describe('given a ValidationError is constructed', () => {
    const error = new ValidationError(JSON.stringify(errMessage));
    test('then it should be of type ValidationError and Error', () => {
        expect(error instanceof ValidationError);
        expect(error instanceof Error);
    });
    test('then the code should be 400', () => {
        expect(error.code).toEqual(400);
    });
    test('then the message should be the error list passed in', () => {
        expect(error.message).toEqual(JSON.stringify(errMessage));
    });
});
