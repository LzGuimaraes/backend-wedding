import { Pool } from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: true } : false 
};

const pool = new Pool(poolConfig);

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

export default pool;