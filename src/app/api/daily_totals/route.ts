import { NextResponse } from 'next/server';
import { auth } from '~/auth';
import pool from '~/lib/db';

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    // 📦 Fetch all daily totals
    const result = await client.query(`
        WITH monthly_totals AS (
            SELECT
            date_trunc('month', date) AS month,
            SUM(total_sales) AS sales,
            SUM(total_expenses) AS expenses,
            SUM(net_profit) AS net_profit
            FROM daily_totals
            WHERE date >= date_trunc('month', current_date) - interval '1 month'
            GROUP BY 1
        ),
        current_month AS (
            SELECT * FROM monthly_totals
            WHERE month = date_trunc('month', current_date)
        ),
        last_month AS (
            SELECT * FROM monthly_totals
            WHERE month = date_trunc('month', current_date) - interval '1 month'
        )
        SELECT
            c.sales AS current_month_sales,
            l.sales AS last_month_sales,
            ROUND(
            CASE WHEN l.sales = 0 THEN NULL
                ELSE (c.sales - l.sales) * 100.0 / l.sales END,
            2
            ) AS sales_percentage_change,

            c.expenses AS current_month_expenses,
            l.expenses AS last_month_expenses,
            ROUND(
            CASE WHEN l.expenses = 0 THEN NULL
                ELSE (c.expenses - l.expenses) * 100.0 / l.expenses END,
            2
            ) AS expenses_percentage_change,

            c.net_profit AS current_month_net_profit,
            l.net_profit AS last_month_net_profit,
            ROUND(
            CASE WHEN l.net_profit = 0 THEN NULL
                ELSE (c.net_profit - l.net_profit) * 100.0 / l.net_profit END,
            2
            ) AS net_profit_percentage_change
        FROM current_month c
        CROSS JOIN last_month l;
    `);

    console.log(result.rows[0]);
    const salesIncomes = result.rows[0];

    return NextResponse.json(salesIncomes);
  } catch (error) {
    console.error('GET /sales-income Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
});
