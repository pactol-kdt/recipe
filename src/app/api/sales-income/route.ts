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
    const salesIncomeResult = await client.query(`
      SELECT * FROM sales_income ORDER BY id ASC
    `);
    const salesIncomes = salesIncomeResult.rows;

    return NextResponse.json(salesIncomes);
  } catch (error) {
    console.error('GET /sales-income Error:', error);
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
  const salesIncomes = await req.json();
  console.log('Received sales income:', salesIncomes);

  try {
    if (!Array.isArray(salesIncomes) || salesIncomes.length === 0) {
      return NextResponse.json({ error: 'Ingredients must be a non-empty array' }, { status: 400 });
    }

    await client.query('BEGIN');

    for (const sales of salesIncomes) {
      const { name, amount, date, note } = sales;

      if (!name || amount == null || date == null) {
        throw new Error('Missing required fields');
      }

      // Insert into sales_income table
      await client.query(
        `INSERT INTO sales_income (name, amount, date, note)
          VALUES ($1, $2, $3, $4)
          RETURNING *`,
        [name, amount, date, note]
      );

      // Update daily_totals table
      await client.query(
        `
          INSERT INTO daily_totals (date, total_sales)
          VALUES ($1, $2)
          ON CONFLICT (date)
          DO UPDATE SET total_sales = daily_totals.total_sales + EXCLUDED.total_sales
        `,
        [date, amount]
      );
    }

    await client.query('COMMIT');

    return NextResponse.json({ message: 'Sales Income saved successfully' }, { status: 201 });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction failed:', err);
    return NextResponse.json({ error: 'Failed to insert sales income' }, { status: 500 });
  } finally {
    client.release();
  }
});
