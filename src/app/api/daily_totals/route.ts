import { NextResponse } from 'next/server';
import { auth } from '~/auth';
import pool from '~/lib/db';

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    // Fetch all daily totals
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
            SELECT
                COALESCE(sales, 0.0) AS sales,
                COALESCE(expenses, 0.0) AS expenses,
                COALESCE(net_profit, 0.0) AS net_profit
            FROM monthly_totals
            WHERE month = date_trunc('month', current_date)
            UNION ALL
            SELECT 0, 0, 0
            WHERE NOT EXISTS (
                SELECT 1 FROM monthly_totals WHERE month = date_trunc('month', current_date)
            )
        ),
        last_month AS (
            SELECT
                COALESCE(sales, 0.0) AS sales,
                COALESCE(expenses, 0.0) AS expenses,
                COALESCE(net_profit, 0.0) AS net_profit
            FROM monthly_totals
            WHERE month = date_trunc('month', current_date) - interval '1 month'
            UNION ALL
            SELECT 0, 0, 0
            WHERE NOT EXISTS (
                SELECT 1 FROM monthly_totals WHERE month = date_trunc('month', current_date) - interval '1 month'
            )
        ),
        total_net_profit AS (
            SELECT COALESCE(SUM(net_profit), 0) AS cash FROM daily_totals
        )
        SELECT
            c.sales AS current_month_sales,
            ROUND(
                CASE WHEN l.sales = 0 THEN 0.0
                ELSE (c.sales - l.sales) * 100.0 / l.sales END
            ) AS sales_percentage_change,

            c.expenses AS current_month_expenses,
            ROUND(
                CASE WHEN l.expenses = 0 THEN 0.0
                ELSE (c.expenses - l.expenses) * 100.0 / l.expenses END
            ) AS expenses_percentage_change,

            c.net_profit AS current_month_net_profit,
            ROUND(
                CASE WHEN l.net_profit = 0 THEN 0.0
                ELSE (c.net_profit - l.net_profit) * 100.0 / l.net_profit END
            ) AS net_profit_percentage_change,

            t.cash AS total_net_profit
        FROM current_month c
        LEFT JOIN last_month l ON TRUE
        CROSS JOIN total_net_profit t
        LIMIT 1;
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
