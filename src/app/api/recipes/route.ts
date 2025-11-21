import { NextResponse } from 'next/server';
import { auth } from '~/auth';
import pool from '~/lib/db';
import { Ingredient } from '~/types/ingredients';
import { Instruction } from '~/types/instruction';

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    // Fetch all recipes
    const recipeResult = await client.query(`SELECT * FROM recipe ORDER BY id DESC`);
    const recipes = recipeResult.rows;

    // Fetch all ingredients
    const ingredientsResult = await client.query(`SELECT * FROM ingredients`);
    const ingredients = ingredientsResult.rows;

    // Fetch all instructions
    const instructionsResult = await client.query(`SELECT * FROM instruction`);
    const instructions = instructionsResult.rows;

    // Combine data into structured format
    const fullRecipes = recipes.map((recipe) => ({
      ...recipe,
      ingredients: ingredients.filter((ing) => ing.recipe_id === recipe.id),
      instructions: instructions.filter((inst) => inst.recipe_id === recipe.id),
    }));

    return NextResponse.json(fullRecipes);
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

  try {
    const { name, description, cook_time, ingredients, instructions } = await req.json();

    if (!name || !description || !cook_time) {
      return NextResponse.json({ error: 'Missing recipe fields' }, { status: 400 });
    }

    if (!Array.isArray(ingredients) || !Array.isArray(instructions)) {
      return NextResponse.json(
        { error: 'Ingredients and instructions must be arrays' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Insert into recipe table
    const recipeResult = await client.query(
      `INSERT INTO recipe (name, description, cook_time)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description, cook_time]
    );

    const recipe = recipeResult.rows[0];
    const recipeId = recipe.id;

    // Insert ingredients
    const insertedIngredients: Ingredient[] = [];
    for (const ingredient of ingredients) {
      const { name, quantity, unit } = ingredient;

      if (!name || !quantity || !unit) continue; // skip invalid

      const ingResult = await client.query(
        `INSERT INTO ingredients (name, quantity, unit, recipe_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, quantity, unit, recipeId]
      );

      insertedIngredients.push(ingResult.rows[0]);
    }

    // Insert instructions
    const insertedInstructions: Instruction[] = [];
    for (const instruction of instructions) {
      const { title, description } = instruction;

      if (!title || !description) continue;

      const instResult = await client.query(
        `INSERT INTO instruction (title, description, recipe_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [title, description, recipeId]
      );

      insertedInstructions.push(instResult.rows[0]);
    }

    await client.query('COMMIT');

    return NextResponse.json({
      recipe,
      ingredients: insertedIngredients,
      instructions: insertedInstructions,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('POST /recipe Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
});
