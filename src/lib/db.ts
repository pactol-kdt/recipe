// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // from environment variable
});

export default pool;
