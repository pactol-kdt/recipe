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
    const recipeId = Number(id);
    if (isNaN(recipeId)) {
      return NextResponse.json({ error: 'Invalid recipe ID' }, { status: 400 });
    }

    // 🥘 Get the recipe
    const recipeResult = await client.query(`SELECT * FROM recipe WHERE id = $1`, [recipeId]);

    if (recipeResult.rows.length === 0) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    const recipe = recipeResult.rows[0];

    // 🧂 Get ingredients
    const ingredientsResult = await client.query(`SELECT * FROM ingredients WHERE recipe_id = $1`, [
      recipeId,
    ]);

    // 📜 Get instructions
    const instructionsResult = await client.query(
      `SELECT * FROM instruction WHERE recipe_id = $1`,
      [recipeId]
    );

    const data = {
      ...recipe,
      ingredients: ingredientsResult.rows,
      instruction: instructionsResult.rows,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('GET /recipe/:id Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
});

export const PUT = auth(async function PUT(req, { params }: { params: Promise<{ id: string }> }) {
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

    const body = await req.json();
    const { name, description, is_favorite, ingredients, instruction } = body;

    await client.query('BEGIN');

    // Update main recipe
    await client.query(
      `UPDATE recipe
       SET name = $1, description = $2, is_favorite = $3
       WHERE id = $4`,
      [name, description, is_favorite, recipeId]
    );

    // Delete old ingredients + instructions (optional if you want full overwrite)
    await client.query('DELETE FROM ingredients WHERE recipe_id = $1', [recipeId]);
    await client.query('DELETE FROM instruction WHERE recipe_id = $1', [recipeId]);

    // Insert new ingredients
    for (const ing of ingredients) {
      await client.query(
        `INSERT INTO ingredients (recipe_id, name, quantity, unit)
         VALUES ($1, $2, $3, $4)`,
        [recipeId, ing.name, ing.quantity, ing.unit]
      );
    }

    // Insert new instructions
    for (const step of instruction) {
      await client.query(
        `INSERT INTO instruction (recipe_id, title, description)
         VALUES ($1, $2, $3)`,
        [recipeId, step.title, step.description]
      );
    }

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
