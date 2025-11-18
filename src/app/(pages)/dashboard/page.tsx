'use client';

import { useEffect, useState } from 'react';
import Header from '~/components/Header';
import HeartLoader from '~/components/Loader';
import { formatDate } from '~/lib/formatDate';

export type IngredientList = {
  id: number;
  name: string;
  quantity: number;
  minimum_required: number;
  unit: string;
};

export type IngredientUpdate = {
  id: number;
  name: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export default function DashboardPage() {
  const [ingredients, setIngredients] = useState<IngredientList[]>([]);
  const [ingredientsUpdate, setIngredientsUpdate] = useState<IngredientUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch('/api/ingredients'); // GET route
        const data = await res.json();
        setIngredients(data);
        console.log('Fetched ingredients:', data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchIngredientsUpdate = async () => {
      try {
        const res = await fetch('/api/ingredients_update'); // GET route
        const data = await res.json();
        setIngredientsUpdate(data);
        console.log('Fetched ingredients_update:', data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredientsUpdate();

    fetchIngredients();
  }, []);

  if (loading) return <HeartLoader />;

  const lowStocks = ingredients.filter((item) => item.quantity < item.minimum_required);
  const lastUpdate = formatDate(ingredientsUpdate[ingredientsUpdate.length - 1]?.created_at);

  return (
    <main className="bg-bg-muted flex min-h-[100vh] w-full flex-col items-center">
      {/* Header */}
      <Header title="Love, Cheewi Monitoring" menuButtons={[]} backButton={false} />

      {/* Content */}
      <section className="flex h-[calc(100vh-74px-56px)] w-full max-w-6xl flex-col items-center gap-4 overflow-auto p-4">
        {/* Cash */}
        <div className="flex w-full flex-col gap-4 rounded-2xl bg-[linear-gradient(to_bottom_right,#FF809E_0%,#FF99B1_100%)] p-4 text-white">
          <div className="text-sm font-bold">CASH</div>
          <div className="text-4xl">PHP 2000</div>
          <div className="text-light flex items-center gap-2">
            <div className="rounded-2xl bg-white px-2 py-[2px] text-green-600">+16%</div>
            <div>from the previous month</div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 rounded-2xl bg-white p-4">
          <div className="text-sm font-bold">RESTOCK INGREDIENTS</div>
          <div className="flex items-center justify-between gap-2">
            <div className="text-light text-sm text-gray-400">Update: {lastUpdate}</div>
            <div className="text-4xl text-red-600">{lowStocks.length}</div>
          </div>
        </div>

        <div className="flex w-full justify-between gap-4">
          <div className="flex w-full flex-col gap-4 rounded-2xl bg-white p-4">
            <div className="text-sm font-bold">SOLD COUNT</div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-light text-sm text-green-600">+16</div>
              <div className="text-4xl">4</div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 rounded-2xl bg-white p-4">
            <div className="text-sm font-bold">BATCH MAKE</div>
            <div className="flex items-center justify-between gap-2">
              <div className="text-light text-sm text-green-600">+16</div>
              <div className="text-4xl">4</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
