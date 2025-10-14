import { NextResponse } from 'next/server';
import { getDB } from '~/lib/db';
import type { ResultSetHeader } from 'mysql2';

/**
 * GET /api/ingredients
 * Returns all ingredients
 */
export async function GET() {
  try {
    const db = getDB();
    const [rows] = await db.query('SELECT * FROM ingredients ORDER BY id DESC');

    // ✅ Ensure rows is always an array
    const data = Array.isArray(rows) ? rows : [];

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Database GET error:', error);
    return NextResponse.json([], { status: 500 }); // return empty array on error
  }
}

/**
 * POST /api/ingredients
 * Adds a new ingredient (expects { name: string })
 */

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    const db = getDB();

    // ✅ Tell TypeScript what type of result MySQL returns
    const [result] = await db.query<ResultSetHeader>('INSERT INTO ingredients (name) VALUES (?)', [
      name,
    ]);

    return NextResponse.json({
      message: 'Ingredient added',
      insertId: result.insertId, // now fully typed
    });
  } catch (error) {
    console.error('❌ Database POST error:', error);
    return NextResponse.json({ error: 'Failed to add ingredient' }, { status: 500 });
  }
}

/**
 * DELETE /api/ingredients?id=123
 * Deletes an ingredient by ID
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const db = getDB();
    await db.query('DELETE FROM ingredients WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Ingredient deleted' });
  } catch (error) {
    console.error('❌ Database DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete ingredient' }, { status: 500 });
  }
}
