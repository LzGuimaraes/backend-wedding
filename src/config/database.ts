// src/config/database.ts
import { Pool } from "pg";

const isProduction = process.env.NODE_ENV === "production";

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false },
};

const pool = new Pool(poolConfig);

export default pool;
