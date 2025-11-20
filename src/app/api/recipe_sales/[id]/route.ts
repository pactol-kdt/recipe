import { NextResponse } from 'next/server';
import { auth } from '~/auth';
import pool from '~/lib/db';

export const GET = auth(async function GET(req, context: { params: Promise<{ id: string }> }) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    const { id } = await context.params;
    const recipeSalesId = Number(id);
    if (isNaN(recipeSalesId)) {
      return NextResponse.json({ error: 'Invalid recipe sales ID' }, { status: 400 });
    }

    // 🥘 Get the recipe
    const recipeSalesResult = await client.query(`SELECT * FROM recipe_sales WHERE id = $1`, [
      recipeSalesId,
    ]);

    if (recipeSalesResult.rows.length === 0) {
      return NextResponse.json({ error: 'Recipe sales not found' }, { status: 404 });
    }

    const recipe = recipeSalesResult.rows[0];

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('GET /recipe_sales/:id Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
});

export const PUT = auth(async function PUT(req, { params }: { params: Promise<{ id: string }> }) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params;
  const client = await pool.connect();

  try {
    const recipeId = Number(id);
    if (isNaN(recipeId)) {
      return NextResponse.json({ error: 'Invalid recipe sales ID' }, { status: 400 });
    }

    const body = await req.json();
    const { name, batch_made, sold_count, quantity, date } = body;

    await client.query('BEGIN');

    // Update main recipe
    await client.query(
      `UPDATE recipe_sales
       SET name = $1, batch_made = $2, sold_count = $3, quantity = $4, date = $5,updated_at = now()
       WHERE id = $6`,
      [name, batch_made, sold_count, quantity, date, recipeId]
    );

    await client.query('COMMIT');

    return NextResponse.json({ message: 'Recipe updated successfully!' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('PUT /recipe/[id] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
});

export const DELETE = auth(async function DELETE(
  req,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { id } = await params; // ✅ await params
  const client = await pool.connect();

  try {
    const recipeId = Number(id);

    if (isNaN(recipeId)) {
      return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Delete from related tables first
    await client.query('DELETE FROM ingredients WHERE recipe_id = $1', [recipeId]);
    await client.query('DELETE FROM instruction WHERE recipe_id = $1', [recipeId]);

    // Finally, delete the recipe itself
    const result = await client.query('DELETE FROM recipe WHERE id = $1 RETURNING *', [recipeId]);

    if (result.rowCount === 0) {
      throw new Error('Recipe not found');
    }

    await client.query('COMMIT');

    return NextResponse.json({
      message: 'Recipe and related data deleted successfully',
      deletedRecipe: result.rows[0],
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Delete failed:', err);
    return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
  } finally {
    client.release();
  }
});
