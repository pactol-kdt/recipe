import { NextResponse } from 'next/server';
import { auth } from '~/auth';
import pool from '~/lib/db';

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    // 📦 Fetch all recipes
    const recipeResult = await client.query(`SELECT * FROM ingredient_list ORDER BY id DESC`);
    const recipes = recipeResult.rows;

    return NextResponse.json(recipes);
  } catch (error) {
    console.error('GET /recipe Error:', error);
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
  const ingredients = await req.json();
  console.log('Received ingredients:', ingredients);
  try {
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: 'Ingredients must be a non-empty array' }, { status: 400 });
    }

    await client.query('BEGIN');

    const insertedIngredients = [];

    for (const ing of ingredients) {
      const { name, quantity, minimum_required, unit } = ing;

      if (!name || quantity == null || !unit || minimum_required == null) {
        throw new Error('Missing required fields');
      }

      const result = await client.query(
        `INSERT INTO ingredient_list (name, quantity, minimum_required, unit)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (name)
          DO UPDATE SET
            quantity = EXCLUDED.quantity,
            minimum_required = EXCLUDED.minimum_required,
            unit = EXCLUDED.unit
          RETURNING *`,
        [name, quantity, minimum_required, unit]
      );

      insertedIngredients.push(result.rows[0]);
    }

    await client.query('COMMIT');

    return NextResponse.json(
      { message: 'Ingredients saved successfully', ingredients: insertedIngredients },
      { status: 201 }
    );
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction failed:', err);
    return NextResponse.json({ error: 'Failed to insert ingredients' }, { status: 500 });
  } finally {
    client.release();
  }
});

export const DELETE = auth(async function DELETE(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  const client = await pool.connect();

  try {
    const { ids } = await req.json(); // array of ingredient names to delete

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No ingredient ids provided' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Use ANY($1) to delete multiple entries in one query
    const result = await client.query(
      'DELETE FROM ingredient_list WHERE id = ANY($1) RETURNING *',
      [ids]
    );

    await client.query('COMMIT');

    return NextResponse.json(
      {
        message: 'Ingredients deleted successfully',
        deleted: result.rows,
      },
      { status: 200 }
    );
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete failed:', err);
    return NextResponse.json({ error: 'Failed to delete ingredients' }, { status: 500 });
  } finally {
    client.release();
  }
});
