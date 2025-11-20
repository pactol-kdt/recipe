import { NextResponse } from 'next/server';
import { auth } from '~/auth';
import pool from '~/lib/db';

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    // 📦 Fetch all expenses_update
    const expensesUpdatesResult = await client.query(
      `SELECT * FROM expenses_update ORDER BY id DESC`
    );
    const expensesUpdates = expensesUpdatesResult.rows;

    return NextResponse.json(expensesUpdates);
  } catch (error) {
    console.error('GET /expenses_update Error:', error);
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
  const expensesUpdate = await req.json();
  console.log('Received expenses update:', expensesUpdate);

  try {
    if (!Array.isArray(expensesUpdate) || expensesUpdate.length === 0) {
      return NextResponse.json({ error: 'Expenses must be a non-empty array' }, { status: 400 });
    }

    await client.query('BEGIN');

    for (const sales of expensesUpdate) {
      const { name, amount, date } = sales;

      if (!name || amount == null || date == null) {
        throw new Error('Missing required fields');
      }

      // Insert into expenses_update table
      await client.query(
        `INSERT INTO expenses_update (name, amount, date)
          VALUES ($1, $2, $3)
          RETURNING *`,
        [name, amount, date]
      );

      // Update daily_totals table
      await client.query(
        `
          INSERT INTO daily_totals (date, total_expenses)
          VALUES ($1, $2)
          ON CONFLICT (date)
          DO UPDATE SET total_expenses = daily_totals.total_expenses + EXCLUDED.total_expenses
        `,
        [date, amount]
      );
    }

    await client.query('COMMIT');

    return NextResponse.json({ message: 'Expenses update saved successfully' }, { status: 201 });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction failed:', err);
    return NextResponse.json({ error: 'Failed to insert expenses update' }, { status: 500 });
  } finally {
    client.release();
  }
});
