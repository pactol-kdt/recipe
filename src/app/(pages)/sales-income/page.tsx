'use client';

import { BanknoteArrowDown, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '~/components/Header';
import HeartLoader from '~/components/Loader';
import { paths } from '~/meta';

type SalesIncome = {
  cash: number;
  current_month_expenses: number;
  current_month_sales: number;
  current_month_net_profit: number;
  last_month_expenses: number;
  last_month_sales: number;
  last_month_net_profit: number;
  sales_percentage_change: number;
  expenses_percentage_change: number;
  net_profit_percentage_change: number;
};

export default function SalesIncomePage() {
  const router = useRouter();

  const [summary, setSummary] = useState<SalesIncome>({} as SalesIncome);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyTotals = async () => {
      try {
        const res = await fetch('/api/daily_totals');
        const data = await res.json();
        setSummary(data);
        console.log('Fetched sales income:', data);
      } catch (error) {
        console.error('Error fetching sales income:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyTotals();
  }, []);

  if (loading) return <HeartLoader />;

  const cash = summary.current_month_sales - summary.current_month_expenses;
  return (
    <main className="bg-bg-muted flex h-[calc(100vh-74px-56px)] w-full flex-col items-center">
      {/* Header */}
      <Header
        title="Sales Income"
        menuButtons={[
          {
            icon: <Plus />,
            label: 'Add Sales Income',
            fn: () => router.push(`${paths.SALES_INCOME}${paths.ADD}`),
          },
          {
            icon: <BanknoteArrowDown />,
            label: 'Add Expenses',
            fn: () => router.push(`${paths.EXPENSES}${paths.ADD}`),
          },
        ]}
        backButton={false}
      />

      {/* Content */}
      <section className="flex min-h-[calc(100vh-74px-56px)] w-full max-w-6xl flex-col items-center gap-4 overflow-auto p-4">
        {/* Cash */}
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-[linear-gradient(to_bottom_right,#FF809E_0%,#FF99B1_100%)] p-4 pb-8 text-white">
          <div className="text-sm font-bold">REMAINING CASH</div>
          <div className="text-4xl">PHP {summary.cash}</div>
        </div>

        {/* Sales Income */}
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-gray-200 p-4 text-black/60">
          <div className="text-sm font-bold">SALES INCOME</div>
          <div className="text-4xl">PHP {summary?.current_month_sales}</div>
          <div className="text-light flex items-center gap-2">
            <div
              className={`${summary?.sales_percentage_change >= 0 ? 'text-green-700' : 'text-[#820309]'} rounded-2xl bg-gray-300 px-2 py-[2px] font-bold`}
            >
              {summary?.sales_percentage_change >= 0 ? '+' : ''}
              {summary?.sales_percentage_change}%
            </div>
            <div>from the previous month</div>
          </div>
        </div>

        {/* Restock Cost */}
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-gray-200 p-4 text-black/60">
          <div className="text-sm font-bold">EXPENSES</div>
          <div className="text-4xl">PHP {summary.current_month_expenses}</div>
          <div className="text-light flex items-center gap-2">
            <div
              className={`${summary?.expenses_percentage_change >= 0 ? 'text-[#820309]' : 'text-green-700'} rounded-2xl bg-gray-300 px-2 py-[2px] font-bold`}
            >
              {summary?.expenses_percentage_change >= 0 ? '+' : ''}
              {summary?.expenses_percentage_change ?? 0}%
            </div>
            <div>from the previous month</div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-gray-200 p-4 text-black/60">
          <div className="text-sm font-bold">NET PROFIT</div>
          <div className="text-4xl">PHP {summary.current_month_net_profit}</div>
          <div className="text-light flex items-center gap-2">
            <div
              className={`${summary?.net_profit_percentage_change >= 0 ? 'text-green-700' : 'text-[#820309]'} rounded-2xl bg-gray-300 px-2 py-[2px] font-bold`}
            >
              {summary?.net_profit_percentage_change >= 0 ? '+' : ''}
              {summary?.net_profit_percentage_change ?? 0}%
            </div>
            <div>from the previous month</div>
          </div>
        </div>
      </section>
    </main>
  );
}
