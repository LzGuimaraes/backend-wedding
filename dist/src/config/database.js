"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const isProduction = process.env.NODE_ENV === 'production';
const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ...(isProduction && {
        ssl: {
            rejectUnauthorized: false // Only disable in production (e.g., for Heroku)
        }
    })
};
const pool = new pg_1.Pool(poolConfig);
// Teste de conexão com o banco de dados
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client from pool', err.stack);
    }
    client?.query('SELECT NOW()', (err, result) => {
        release();
        if (err) {
            return console.error('Error executing test query', err.stack);
        }
        console.log('Database connection established:', result.rows[0].now);
    });
});
exports.default = pool;
//# sourceMappingURL=database.js.map