'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '~/components/Header';
import HeartLoader from '~/components/Loader';
import { formatDate } from '~/lib/formatDate';
import { paths } from '~/meta';
import { DashboardData } from '~/types/dashboard';

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({} as DashboardData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/dashboard'); // GET route
        const data = await res.json();
        setDashboardData(data);
        console.log('Fetched dashboard datas:', data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <HeartLoader />;

  return (
    <main className="bg-bg-muted flex min-h-[100vh] w-full flex-col items-center">
      {/* Header */}
      <Header title="Love, Cheewi Monitoring" menuButtons={[]} backButton={false} />

      {/* Content */}
      <section className="flex h-[calc(100vh-74px-56px)] w-full max-w-6xl flex-col items-center gap-4 overflow-auto p-4">
        {/* Cash */}
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-[linear-gradient(to_bottom_right,#FF809E_0%,#FF99B1_100%)] p-4 pb-8 text-white">
          <div className="text-sm font-bold">REMAINING CASH</div>
          <div className="text-4xl">PHP {dashboardData.cash}</div>
        </div>

        <Link
          href={`${paths.INGREDIENT}`}
          className="flex w-full flex-col gap-4 rounded-2xl bg-white p-4 active:scale-95"
        >
          <div className="flex items-center justify-between text-sm font-bold">
            <div>RESTOCK INGREDIENTS</div>
            <ChevronRight />
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="text-light text-sm text-gray-400">
              Update: {formatDate(dashboardData.ingredientsLastUpdate)}
            </div>
            <div
              className={`${dashboardData.lowStockCount != 0 ? 'text-red-600' : 'text-green-600'} text-4xl`}
            >
              {dashboardData.lowStockCount}
            </div>
          </div>
        </Link>

        <Link
          href={`${paths.RECIPE_SALES}`}
          className="flex w-full flex-col gap-4 rounded-2xl bg-white p-4 active:scale-95"
        >
          <div className="flex items-center justify-between text-sm font-bold">
            <div>PENDING ORDERS</div>
            <ChevronRight />
          </div>
          <div className="flex items-center justify-end gap-2">
            <div
              className={`${dashboardData.pendingSalesCount != 0 ? 'text-red-600' : 'text-green-600'} text-4xl`}
            >
              {dashboardData.pendingSalesCount}
            </div>
          </div>
        </Link>

        <div className="flex w-full justify-between gap-4">
          <div className="flex w-full flex-col gap-4 rounded-2xl bg-white p-4">
            <div className="text-sm font-bold">SOLD COUNT</div>
            <div className="flex items-center justify-between gap-2">
              <div
                className={`${dashboardData.recipeSales.sold_percentage_change >= 0 ? 'text-green-600' : 'text-red-600'} text-light text-sm`}
              >
                {dashboardData.recipeSales.sold_percentage_change >= 0 ? '+' : ''}
                {dashboardData.recipeSales.sold_percentage_change}
              </div>
              <div className="text-4xl">{dashboardData.recipeSales.current_week_sold}</div>
            </div>
          </div>

          <div className="flex w-full justify-between gap-4">
            <div className="flex w-full flex-col gap-4 rounded-2xl bg-white p-4">
              <div className="text-sm font-bold">BATCH MADE</div>
              <div className="flex items-center justify-between gap-2">
                <div
                  className={`${dashboardData.recipeSales.batch_made_percentage_change >= 0 ? 'text-green-600' : 'text-red-600'} text-light text-sm`}
                >
                  {dashboardData.recipeSales.batch_made_percentage_change >= 0 ? '+' : ''}
                  {dashboardData.recipeSales.batch_made_percentage_change}
                </div>
                <div className="text-4xl">{dashboardData.recipeSales.current_week_batch_made}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
