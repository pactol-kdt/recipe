import { NextResponse } from 'next/server';
import { auth } from '~/auth';
import pool from '~/lib/db';

export const GET = auth(async function GET(req) {
  if (!req.auth) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const client = await pool.connect();

  try {
    // Fetch all recipe_sales
    const recipeSalesResult = await client.query(`
        WITH weekly_totals AS (
            SELECT
                date_trunc('week', date) AS week_start,
                SUM(sold_count) AS total_sold,
                SUM(batch_made) AS total_batch_made
            FROM recipe_sales
            WHERE date >= date_trunc('week', current_date) - interval '1 week'
            GROUP BY 1
        ),
        current_week AS (
            SELECT * FROM weekly_totals
            WHERE week_start = date_trunc('week', current_date)
        ),
        last_week AS (
            SELECT * FROM weekly_totals
            WHERE week_start = date_trunc('week', current_date) - interval '1 week'
        )
        SELECT
            -- Current week values
            COALESCE(c.total_sold, 0) AS current_week_sold,
            COALESCE(c.total_batch_made, 0) AS current_week_batch_made,

            -- Percentage change (still compared to last week)
            ROUND(
                CASE WHEN COALESCE(l.total_sold, 0) = 0 THEN 0
                    ELSE (c.total_sold - l.total_sold) * 100.0 / l.total_sold END,
                2
            ) AS sold_percentage_change,

            ROUND(
                CASE WHEN COALESCE(l.total_batch_made, 0) = 0 THEN 0
                    ELSE (c.total_batch_made - l.total_batch_made) * 100.0 / l.total_batch_made END,
                2
            ) AS batch_made_percentage_change

        FROM current_week c
        LEFT JOIN last_week l ON TRUE;
    `);

    // Fetch latest ingredients update
    const ingredientsUpdateResult = await client.query(`
        SELECT created_at FROM ingredients_update
        ORDER BY id DESC LIMIT 1
    `);

    // Fetch low stock ingredients count
    const ingredientsListResult = await client.query(`
        SELECT COUNT(*) AS low_stock_count
        FROM public.ingredient_list
        WHERE quantity < minimum_required;
    `);

    // Fetch total cash
    const cashResult = await client.query(`
        SELECT SUM(net_profit) AS cash FROM daily_totals
    `);

    // Fetch pending sales count
    const pendingSalesResult = await client.query(`
        SELECT COUNT(*) AS pending_count
        FROM public.recipe_sales
        WHERE date >= date_trunc('week', current_date) - interval '2 weeks'
        AND (quantity = 0 OR sold_count = 0);
    `);

    const recipeSales = recipeSalesResult.rows[0];
    const ingredientsLastUpdate = ingredientsUpdateResult.rows[0].created_at;
    const lowStockCount = +ingredientsListResult.rows[0].low_stock_count;
    const cash = cashResult.rows[0].cash;
    const pendingSalesCount = +pendingSalesResult.rows[0].pending_count;

    return NextResponse.json({
      recipeSales,
      ingredientsLastUpdate,
      lowStockCount,
      cash,
      pendingSalesCount,
    });
  } catch (error) {
    console.error('GET /recipe_sales Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
});
