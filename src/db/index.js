const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_CONNECTION_URL,
    connectionTimeoutMillis: 30000
});

module.exports = pool;
