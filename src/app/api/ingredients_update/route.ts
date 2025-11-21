import { NextResponse } from 'next/server';
import { auth } from '~/auth';
import pool from '~/lib/db';

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    // Fetch all ingredients_update
    const ingredientsUpdateResult = await client.query(`
      SELECT *,
            CASE 
              WHEN id = first_id THEN true
              ELSE false
            END AS is_new
      FROM (
        SELECT *,
              ROW_NUMBER() OVER (PARTITION BY name ORDER BY id DESC) AS rn,
              MIN(id) OVER (PARTITION BY name) AS first_id
        FROM ingredients_update
      ) sub
      WHERE rn <= 4
      ORDER BY name, id DESC;
    `);

    const ingredients = ingredientsUpdateResult.rows;

    return NextResponse.json(ingredients);
  } catch (error) {
    console.error('GET /ingredients_update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
});
