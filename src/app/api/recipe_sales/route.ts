import { NextResponse } from 'next/server';
import { auth } from '~/auth';
import pool from '~/lib/db';
import { RecipeSales } from '~/types/recipe-sales';

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    // Fetch all recipe_sales
    const recipeSalesUpdate = await client.query(`SELECT * FROM recipe_sales ORDER BY id ASC`);
    const recipeSales = recipeSalesUpdate.rows;

    return NextResponse.json(recipeSales);
  } catch (error) {
    console.error('GET /recipe_sales Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
});

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const client = await pool.connect();
  const recipeSales: RecipeSales = await req.json();
  console.log('Received recipe sales:', recipeSales);

  try {
    const { name, batch_made } = recipeSales;

    if (!name || batch_made == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Insert into recipe_sales table
    await client.query(
      ` INSERT INTO recipe_sales (name, batch_made, date)
        VALUES ($1, $2, CURRENT_DATE)
        ON CONFLICT (name, date)
        DO UPDATE SET batch_made = recipe_sales.batch_made + EXCLUDED.batch_made
        RETURNING *`,
      [name, batch_made]
    );

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Recipe sales saved successfully' }, { status: 201 });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction failed:', err);
    return NextResponse.json({ error: 'Failed to insert recipe sales' }, { status: 500 });
  } finally {
    client.release();
  }
});
