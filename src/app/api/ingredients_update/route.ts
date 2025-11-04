import { NextResponse } from 'next/server';
import { auth } from '~/auth';
import pool from '~/lib/db';

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    // 📦 Fetch all ingredients
    const ingredientsResult = await client.query(
      `SELECT * FROM ingredients_update ORDER BY id DESC`
    );
    const ingredients = ingredientsResult.rows;

    return NextResponse.json(ingredients);
  } catch (error) {
    console.error('GET /ingredients Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
});
