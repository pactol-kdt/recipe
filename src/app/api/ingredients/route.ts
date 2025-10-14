import { NextResponse } from 'next/server';
import pool from '~/lib/db';
import type { QueryResultRow } from 'pg';

// Define type for Ingredient rows
interface Ingredient extends QueryResultRow {
  id: number;
  name: string;
}

// ✅ GET - fetch all ingredients
export async function GET() {
  try {
    const result = await pool.query<Ingredient>('SELECT * FROM ingredients ORDER BY id ASC');
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch ingredients' }, { status: 500 });
  }
}

// ✅ POST - create a new ingredient
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = await pool.query<Ingredient>(
      'INSERT INTO ingredients (name) VALUES ($1) RETURNING *',
      [name]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Failed to create ingredient' }, { status: 500 });
  }
}

// ✅ PUT - update an ingredient
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'ID and Name are required' }, { status: 400 });
    }

    const result = await pool.query<Ingredient>(
      'UPDATE ingredients SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ingredient not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update ingredient' }, { status: 500 });
  }
}

// ✅ DELETE - delete an ingredient
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM ingredients WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Ingredient not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete ingredient' }, { status: 500 });
  }
}
