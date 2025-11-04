'use client';

import { useEffect, useState } from 'react';
import Header from '~/components/Header';
import HeartLoader from '~/components/Loader';

export type IngredientLog = {
  id: number;
  ingredient_id?: number;
  name: string;
  quantity: number;
  minimum_required: number;
  unit: string;
  created_at?: string;
  updated_at?: string;
};

export default function IngredientsLogPage() {
  const [ingredients, setIngredients] = useState<IngredientLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch logs
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch('/api/ingredients_update');
        const data = await res.json();
        // Sort by most recent update
        data.sort(
          (a: IngredientLog, b: IngredientLog) =>
            new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime()
        );
        setIngredients(data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  if (loading) return <HeartLoader />;

  // 🧮 Filter by name
  const filtered = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(search.toLowerCase())
  );

  // 🧱 Group by ingredient name
  const grouped = filtered.reduce(
    (acc, ing) => {
      if (!acc[ing.name]) acc[ing.name] = [];
      acc[ing.name].push(ing);
      return acc;
    },
    {} as Record<string, IngredientLog[]>
  );

  return (
    <main className="bg-bg-muted flex min-h-screen w-full flex-col items-center">
      <Header title="Log" menuButtons={[]} backButton={true} />

      <section className="flex w-full max-w-6xl flex-col items-center gap-8 p-4">
        <div className="w-full">
          <h2 className="mb-4 text-xl font-medium">Activity Log</h2>

          {/* 🔍 Search Input */}
          <input
            type="text"
            placeholder="Search ingredient name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full rounded-md border border-gray-300 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* 🧾 Log Display */}
          {Object.keys(grouped).length === 0 ? (
            <p className="text-gray-500">No logs found.</p>
          ) : (
            Object.entries(grouped)
              .sort()
              .map(([name, logs]) => (
                <div key={name} className="mb-6 flex-wrap rounded-md border bg-white p-4 shadow-sm">
                  <h3 className="mb-2 text-lg font-semibold text-blue-600 capitalize">{name}</h3>
                  <table className="w-full overflow-hidden rounded-lg border border-gray-200 text-sm">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="w-1/4 p-2 text-left font-medium">Quantity</th>
                        <th className="w-1/2 p-2 text-left font-medium">Description</th>
                        <th className="w-1/4 p-2 text-left font-medium">Updated At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log, idx) => {
                        const prevQuantity = idx < logs.length - 1 ? logs[idx + 1].quantity : null;
                        let description = '';

                        if (prevQuantity === null) {
                          description = 'New entry';
                        } else if (log.quantity > prevQuantity) {
                          description = `Restocked (+${log.quantity - prevQuantity})`;
                        } else if (log.quantity < prevQuantity) {
                          description = `Used (-${prevQuantity - log.quantity})`;
                        } else {
                          description = 'No change';
                        }

                        return (
                          <tr
                            key={idx}
                            className="transition-colors even:bg-gray-50 hover:bg-gray-100"
                          >
                            <td className="p-2 text-gray-800">{log.quantity}</td>
                            <td
                              className={`p-2 font-medium ${
                                description.includes('Restocked')
                                  ? 'text-green-600'
                                  : description.includes('Used')
                                    ? 'text-red-500'
                                    : 'text-gray-500'
                              }`}
                            >
                              {description}
                            </td>
                            <td className="p-2 text-gray-500">
                              {new Date(log.updated_at ?? '').toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))
          )}
        </div>
      </section>
    </main>
  );
}
