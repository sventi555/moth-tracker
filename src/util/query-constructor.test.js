const {
    sizeComponent,
    orderComponent,
    filterComponent,
    fieldsComponent,
    updateComponent
} = require('./query-constructor');

describe('given sizeComponent is being called', () => {
    describe('when limit and offset are undefined', () => {
        test('then empty string is returned', () => {
            expect(sizeComponent()).toEqual('');
        });
    });
    describe('when only limit is defined', () => {
        test('then string returned only contains limit', () => {
            expect(sizeComponent('10')).toEqual(' LIMIT 10');
        });
    });
    describe('when only offset is defined', () => {
        test('then string returned only contains offset', () => {
            expect(sizeComponent(null, '10')).toEqual(' OFFSET 10');
        });
    });
    describe('when both limit and offset are defined', () => {
        test('then string returned contains both', () => {
            expect(sizeComponent('10', '20')).toEqual(' LIMIT 10 OFFSET 20');
        });
    });
});

describe('given orderComponent is being called', () => {
    describe('when orders is undefined or empty', () => {
        test('then empty string is returned', () => {
            expect(orderComponent()).toEqual('');
            expect(orderComponent([])).toEqual('');
        });
    });
    describe('when orders is a string', () => {
        test('then component is formed properly', () => {
            expect(orderComponent('species')).toEqual(' ORDER BY species ASC');
        });
    });
    describe('when no direction is stated', () => {
        test('then default is ascending', () => {
            expect(orderComponent(['weight'])).toEqual(' ORDER BY weight ASC');
        });
    });
    describe('when direction is stated', () => {
        test('then positive maps to ascending', () => {
            expect(orderComponent(['+weight'])).toEqual(' ORDER BY weight ASC');
        });
        test('then negative maps to descending', () => {
            expect(orderComponent(['-weight'])).toEqual(' ORDER BY weight DESC');
        });
    });
    describe('when multiple orders are given', () => {
        test('then all given orders are applied', () => {
            expect(orderComponent(['+weight', '-wingspan']))
                .toEqual(' ORDER BY weight ASC, wingspan DESC');
        });
    });
});

describe('given filterComponent is being called', () => {
    describe('when filters is an empty object', () => {
        test('then empty string is returned', () => {
            const filterComp = filterComponent({});
            expect(filterComp.str).toEqual('');
            expect(filterComp.args).toEqual([]);
        });
    });
    describe('when filter is an equality', () => {
        test('then = operator is used', () => {
            const filterComp = filterComponent({species: 'big'});
            expect(filterComp.str).toEqual(' WHERE species = $1');
            expect(filterComp.args).toEqual(['big']);
        });
    });
    describe('when filter is a gt comparison', () => {
        test('then > operator is used', () => {
            const filterComp = filterComponent({weight: {gt: '3'}});
            expect(filterComp.str).toEqual(' WHERE weight > $1');
            expect(filterComp.args).toEqual(['3']);
        });
    });
    describe('when filter is a gte comparison', () => {
        test('then >= operator is used', () => {
            const filterComp = filterComponent({weight: {gte: '3'}});
            expect(filterComp.str).toEqual(' WHERE weight >= $1');
            expect(filterComp.args).toEqual(['3']);
        });
    });
    describe('when filter is a lt comparison', () => {
        test('then < operator is used', () => {
            const filterComp = filterComponent({weight: {lt: '3'}});
            expect(filterComp.str).toEqual(' WHERE weight < $1');
            expect(filterComp.args).toEqual(['3']);
        });
    });
    describe('when filter is a lte comparison', () => {
        test('then <= operator is used', () => {
            const filterComp = filterComponent({weight: {lte: '3'}});
            expect(filterComp.str).toEqual(' WHERE weight <= $1');
            expect(filterComp.args).toEqual(['3']);
        });
    });
    describe('when filter has multiple operators', () => {
        test('then all operators are applied', () => {
            const filterComp = filterComponent({weight: {gte: '3', lte: '8'}});
            expect(filterComp.str).toEqual(' WHERE weight >= $1 AND weight <= $2');
            expect(filterComp.args).toEqual(['3', '8']);
        });
    });
    describe('when multiple filters are passed', () => {
        test('then all filters are applied', () => {
            const filterComp = filterComponent({weight: '3', wingspan: '5'});
            expect(filterComp.str).toEqual(' WHERE weight = $1 AND wingspan = $2');
            expect(filterComp.args).toEqual(['3', '5']);
        });
    });
});

describe('given fieldsComponent is being called', () => {
    describe('when fields is undefined or empty', () => {
        test('then * is returned', () => {
            expect(fieldsComponent()).toEqual(' *');
            expect(fieldsComponent([])).toEqual(' *');
        });
    });
    describe('when fields is a string', () => {
        test('then component is formed properly', () => {
            expect(fieldsComponent('weight')).toEqual(' weight');
        });
    });
    describe('when fields is an array with one element', () => {
        test('then component is formed properly', () => {
            expect(fieldsComponent(['weight']))
                .toEqual(' weight');
        });
    });
    describe('when fields is an array with multiple elements', () => {
        test('then component is formed properly', () => {
            expect(fieldsComponent(['weight', 'wingspan', 'species']))
                .toEqual(' weight, wingspan, species');
        });
    });
});

describe('given updateComponent is being called', () => {
    describe('when updates is an empty object', () => {
        test('then str and args are empty', () => {
            const updateComp = updateComponent({});
            expect(updateComp.str).toEqual('');
            expect(updateComp.args).toEqual([]);
        });
    });
    describe('when one update is given', () => {
        test('then str contains the update and args contains the value', () => {
            const updateComp = updateComponent({weight: '12'});
            expect(updateComp.str).toEqual(' SET weight = $1');
            expect(updateComp.args).toEqual(['12']);
        });
    });
    describe('when multiple updates are given', () => {
        test('then str and args contain all updates in proper order', () => {
            const updateComp = updateComponent({weight: '12', wingspan: '14'});
            expect(updateComp.str).toEqual(' SET weight = $1, wingspan = $2');
            expect(updateComp.args).toEqual(['12', '14']);
        });
    });
});
