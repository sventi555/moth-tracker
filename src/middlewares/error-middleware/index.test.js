const imports = require('./index');

test('expected exports should be defined', () => {
    expect(imports.ClientError).toBeDefined();
    expect(imports.ValidationError).toBeDefined();
    expect(imports.errorMiddleware).toBeDefined();
});
