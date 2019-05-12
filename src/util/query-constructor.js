const {ClientError} = require('../middlewares/error-middleware');

/**
 * Returns a component of a query string containing limit and offset values.
 *
 * Ex. sizeComponent(4, 6) = ' LIMIT 4 OFFSET 6'
 * Ex. sizeComponent(null, 2) = ' OFFSET 2'
 *
 * @param {Number} [limit]
 * @param {Number} [offset]
 * @returns {String}
 */
function sizeComponent(limit, offset) {
    let sizeStr = '';

    sizeStr += limit ? ` LIMIT ${limit}` : '';
    sizeStr += offset ? ` OFFSET ${offset}` : '';

    return sizeStr;
}
module.exports.sizeComponent = sizeComponent;

/**
 * Returns a component of a query string containing order values.
 *
 * Ex. orderComponent('weight') = ' ORDER BY weight ASC'
 * Ex. orderComponent('-weight') = ' ORDER BY weight DESC'
 * Ex. orderComponent(['weight', '-wingspan']) = ' ORDER BY weight ASC, wingspan DESC'
 *
 * @param {String|String[]} [orders]
 * @returns {String}
 */
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

/**
 * Returns an object with a component of a query string containing filter
 * placeholders and an array containing the corresponding values.
 *
 * Ex. filterComponent({weight: 2}) = {str: ' WHERE weight = $1', args: [2]}
 * Ex. filterComponent({weight: {lt: 2}}) = {str: ' WHERE weight < $1', args: [2]}
 *
 * Valid operators (apart from equality) are: lt, lte, gt, gte
 *
 * @param {Object} filters
 * @returns {Object}
 */
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

/**
 * Returns a component of a query string containing field values.
 *
 * Ex. fieldsComponent() = ' *'
 * Ex. fieldsComponent('weight') = ' weight'
 * Ex. fieldsComponent(['weight', 'wingspan']) = ' weight, wingspan'
 *
 * @param {String|String[]} [fields]
 * @returns {String}
 */
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

/**
 * Returns an object with a component of an update query containing placeholers
 * and an array of the updated values.
 *
 * Ex. updateComponent({weight: 4}) = {str: ' SET weight = $1', args: [4]}
 *
 * @param {Object} updates
 * @returns {String}
 */
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

/**
 * Returns a list of args constructed from a request body and a schema. Any
 * values in the schema not listed in body are set to null. The args order is
 * determined by the order of the keys in schema.
 *
 * Ex. argsFromSchema(
 *         {weight: 2},
 *         {weight: Joi.number().integer(), wingspan: Joi.number().integer()}
 *     ) = [2, null]
 *
 * @param {Object} body
 * @param {Object} schema
 * @returns {*[]}
 */
function argsFromSchema(body, schema) {
    const args = [];

    Object.keys(schema).forEach((key) => {
        const val = body[key];
        args.push(val ? val : null);
    });
    String;
    return args;
}
module.exports.argsFromSchema = argsFromSchema;

/**
 * Returns a component of an insert query containing all possible columns.
 *
 * Ex. columnsFromSchema(
 *         {weight: Joi.number().integer, wingspan: Joi.number().integer()}
 *     ) = '(weight, wingspan)'
 *
 * @param {Object} schema
 * @returns {String}
 */
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

/**
 * Returns a component of an insert query containing placeholders for each
 * table column.
 *
 * Ex. placeholdersFromSchema(
 *         {weight: Joi.number().integer, wingspan: Joi.number().integer()}
 *     ) = '($1, $2)'
 *
 * @param {Object} schema
 * @returns {String}
 */
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
