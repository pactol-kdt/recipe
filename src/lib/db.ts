import mysql, { Pool } from 'mysql2/promise';

let pool: Pool | null = null;

export function getDB(): Pool {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('❌ DATABASE_URL is not set in environment variables');
    }

    pool = mysql.createPool({
      uri: process.env.DATABASE_URL,
      connectionLimit: 10,
    });
  }

  return pool;
}
