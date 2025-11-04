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
    const ingredientsResult = await client.query(`SELECT * FROM ingredient_list ORDER BY id DESC`);
    const ingredients = ingredientsResult.rows;

    return NextResponse.json(ingredients);
  } catch (error) {
    console.error('GET /ingredients Error:', error);
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
            unit = EXCLUDED.unit,
            updated_at = now()
          RETURNING *`,
        [name, quantity, minimum_required, unit]
      );

      await client.query(
        `INSERT INTO ingredients_update (name, quantity)
          VALUES ($1, $2)
          RETURNING *`,
        [name, quantity]
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

export const PUT = auth(async function PUT(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const client = await pool.connect();
  const data = await req.json();

  try {
    await client.query('BEGIN');

    if (data.action === 'deductIngredients') {
      const { id, batchCount } = data;

      console.log('Updating ingredients for recipe id:', id, 'Batch count:', batchCount);
      // 🥣 1️⃣ Fetch ingredients used in the recipe
      const recipeIngredientsResult = await client.query(
        `SELECT name, quantity, unit
       FROM ingredients
       WHERE recipe_id = $1`,
        [id]
      );

      const recipeIngredients = recipeIngredientsResult.rows;
      if (recipeIngredients.length === 0) {
        throw new Error('No ingredients found for this recipe');
      }

      const updatedIngredients = [];

      // 🧮 2️⃣ Loop through each ingredient and subtract (quantity * batchCount)
      for (const ing of recipeIngredients) {
        const { name, quantity } = ing;
        const deductedQty = parseFloat(quantity) * batchCount;

        // ⚙️ 3️⃣ Subtract from ingredient_list
        const result = await client.query(
          `
        UPDATE ingredient_list
        SET quantity = quantity - $1, updated_at = now()
        WHERE name = $2
        RETURNING *;
        `,
          [deductedQty, name]
        );

        await client.query(
          `INSERT INTO ingredients_update (name, quantity)
          VALUES ($1, $2)
          RETURNING *`,
          [name, result.rows[0].quantity]
        );

        if (result.rows.length > 0) {
          updatedIngredients.push(result.rows[0]);
        }
      }
    } else if (data.action === 'restockIngredients') {
      const { items } = data;

      const updatedIngredients = [];

      // 🧮 2️⃣ Loop through each ingredient and subtract (quantity * batchCount)
      for (const ing of items) {
        const { name, quantity } = ing;

        // ⚙️ 3️⃣ Subtract from ingredient_list
        const result = await client.query(
          `
        UPDATE ingredient_list
        SET quantity = quantity + $1, updated_at = now()
        WHERE name = $2
        RETURNING *;
        `,
          [quantity, name]
        );

        await client.query(
          `INSERT INTO ingredients_update (name, quantity)
          VALUES ($1, $2)
          RETURNING *`,
          [name, result.rows[0].quantity]
        );

        if (result.rows.length > 0) {
          updatedIngredients.push(result.rows[0]);
        }
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({ message: 'Ingredients updated successfully' }, { status: 200 });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Update transaction failed:', err);
    return NextResponse.json({ error: 'Failed to update ingredients' }, { status: 500 });
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
