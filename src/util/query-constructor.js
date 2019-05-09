const {ClientError} = require('../middlewares/error-middleware');

function sizeComponent(limit, offset) {
    let sizeStr = '';

    sizeStr += limit ? ` LIMIT ${limit}` : '';
    sizeStr += offset ? ` OFFSET ${offset}` : '';

    return sizeStr;
}
module.exports.sizeComponent = sizeComponent;

function orderComponent(orders) {
    if (!orders || orders.length === 0) {
        return '';
    }

    if (!Array.isArray(orders)) {
        orders = [orders];
    }

    orders = orders.map((order) => {
        const dir = order.startsWith('-') ? 'DESC' : 'ASC';

        const signed = order.startsWith('-');
        const field = signed ? order.substring(1) : order;
        return {field: field, dir: dir};
    });

    let orderStr = '';
    orders.forEach((order, index) => {
        if (index !== 0) {
            orderStr += ', ';
        } else {
            orderStr += ' ORDER BY ';
        }
        orderStr += `${order.field} ${order.dir}`;
    });

    return orderStr;
}
module.exports.orderComponent = orderComponent;

function filterComponent(filters) {
    let filterStr = '';
    const filterValues = [];
    let argCounter = 1;
    Object.keys(filters).forEach((filterKey) => {

        let filterVal = filters[filterKey];
        if (typeof filterVal === 'string') {
            filterVal = {'=': filterVal};
        }
        Object.keys(filterVal).forEach((operator) => {
            if (argCounter !== 1) {
                filterStr += ' AND ';
            } else {
                filterStr += ' WHERE ';
            }

            filterStr += filterKey;
            switch(operator) {
            case '=':
                filterStr += ' = ';
                break;
            case 'gt':
                filterStr += ' > ';
                break;
            case 'gte':
                filterStr += ' >= ';
                break;
            case 'lt':
                filterStr += ' < ';
                break;
            case 'lte':
                filterStr += ' <= ';
                break;
            default:
                throw new ClientError(`Invalid filter operator for ${filterKey}`);
            }
            filterStr += `$${argCounter}`;
            filterValues.push(filterVal[operator]);
            argCounter++;
        });
    });

    return {str: filterStr, args: filterValues};
}
module.exports.filterComponent = filterComponent;

function fieldsComponent(fields) {
    if (!fields || fields.length === 0) {
        return ' *';
    }

    if (!Array.isArray(fields)) {
        fields = [fields];
    }

    return ' ' + fields.join(', ');
}
module.exports.fieldsComponent = fieldsComponent;

function updateComponent(updates) {
    let updateStr = '';
    const updateValues = [];
    let argCounter = 1;

    Object.keys(updates).forEach((updateKey) => {
        if (argCounter === 1) {
            updateStr += ' SET ';
        } else {
            updateStr += ', ';
        }
        const updateVal = updates[updateKey];
        updateStr += `${updateKey} = $${argCounter}`;
        updateValues.push(updateVal);

        argCounter++;
    });

    return {str: updateStr, args: updateValues};
}
module.exports.updateComponent = updateComponent;

function argsFromSchema(body, schema) {
    const args = [];

    Object.keys(schema).forEach((key) => {
        const val = body[key];
        args.push(val ? val : null);
    });

    return args;
}
module.exports.argsFromSchema = argsFromSchema;

function columnsFromSchema(schema) {
    let columnsString = '(';

    Object.keys(schema).forEach((key, index) => {
        if (index !== 0) {
            columnsString += ', ';
        }

        columnsString += key;
    });

    columnsString += ')';
    return columnsString;
}
module.exports.columnsFromSchema = columnsFromSchema;

function placeholdersFromSchema(schema) {
    let placeholdersString = '(';

    const len = Object.keys(schema).length;
    for (let i = 0; i < len; i++) {
        if (i !== 0) {
            placeholdersString += ', ';
        }
        placeholdersString += `$${i + 1}`;
    }

    placeholdersString += ')';
    return placeholdersString;
}
module.exports.placeholdersFromSchema = placeholdersFromSchema;
