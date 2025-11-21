'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '~/components/Header';
import HeartLoader from '~/components/Loader';
import { formatDate } from '~/lib/formatDate';
import { paths } from '~/meta';
import { RecipeSales } from '~/types/recipe-sales';

export default function RecipeSalesPage() {
  const router = useRouter();

  const [recipeSales, setRecipes] = useState<RecipeSales[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeSales = async () => {
      try {
        const res = await fetch('/api/recipe_sales');
        const data = await res.json();
        setRecipes(data);

        console.log('Fetched recipe sales:', data);
      } catch (error) {
        console.error('Error fetching recipe sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeSales();
  }, []);

  if (loading) return <HeartLoader />;

  // Sort Recipe Sales in ASC order
  recipeSales.sort((a, b) => a.name.localeCompare(b.name));

  const pendingSales = recipeSales.filter((item) => item.quantity === 0 || item.sold_count === 0);

  return (
    <main className="bg-bg-muted flex w-full flex-col items-center">
      {/* Header */}
      <Header title="Recipe Sales" menuButtons={[]} backButton={true} />

      {/* Content */}
      <section className="flex h-[calc(100vh-74px-56px)] w-full max-w-6xl gap-8 overflow-auto p-4">
        {/* Pending Sales */}
        <div className="flex w-full flex-col">
          <h2 className="mb-4 text-xl font-medium">Pending Sales</h2>
          <div className="flex w-full flex-col gap-4">
            {pendingSales.length ? (
              pendingSales.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="border-border-muted bg-bg-secondary hover:bg-accent flex w-full flex-col items-center rounded-lg border p-4 transition-colors"
                  onClick={() => router.push(`${paths.RECIPE_SALES}/${item.id}`)}
                >
                  {/* Order info */}
                  <div className="text-accent-foreground mb-2 flex items-center gap-2 text-sm">
                    <span className="font-medium">Order #{item.id}</span>
                    <span className="text-light">{formatDate(item.date!)}</span>
                  </div>

                  {/* Recipe name */}
                  <div className="w-full truncate text-center text-lg font-semibold">
                    {item.name}
                  </div>
                </button>
              ))
            ) : (
              <p className="text-text-secondary">No pending orders. Go find a new one!</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
