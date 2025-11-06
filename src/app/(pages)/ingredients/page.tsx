'use client';

import { Box, Check, History, Pencil, RefreshCw, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '~/components/Header';
import HeartLoader from '~/components/Loader';
import { paths } from '~/meta';

export type IngredientList = {
  id: number;
  name: string;
  quantity: number;
  minimum_required: number;
  unit: string;
};

export default function IngredientsPage() {
  const router = useRouter();

  const [ingredients, setIngredients] = useState<IngredientList[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);

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

    fetchIngredients();
  }, []);

  const handleDelete = async () => {
    if (selectedIngredients.length === 0) return;

    try {
      const res = await fetch('/api/ingredients', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedIngredients }), // pass names array
      });

      if (res.ok) {
        // ✅ Remove deleted items from state
        setIngredients((prev) => prev.filter((ing) => !selectedIngredients.includes(ing.id)));

        // Clear selection
        setSelectedIngredients([]);
      } else {
        const data = await res.json();
        alert(`Delete failed: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting ingredients');
    }
  };

  if (loading) return <HeartLoader />;

  const toggleCheck = (id: number) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Sort Ingredients in ASC order
  const sortedIngredients = ingredients.sort((a, b) => a.name.localeCompare(b.name));
  const lowStocks = ingredients.filter((item) => item.quantity < item.minimum_required);
  return (
    <main className="bg-bg-muted flex min-h-[100vh] w-full flex-col items-center">
      {/* Header */}
      <Header
        title="Ingredients"
        menuButtons={[
          {
            icon: <Box />,
            label: 'Restock Ingredient',
            fn: () => router.push(`${paths.INGREDIENT}${paths.ADD}`),
          },
          {
            icon: <RefreshCw />,
            label: 'Update Ingredient',
            fn: () => router.push(`${paths.INGREDIENT}${paths.UPDATE}`),
          },
          {
            icon: isEditing ? <Check /> : <Pencil />,
            label: isEditing ? 'Done' : 'Edit',
            fn: () => setIsEditing(!isEditing),
          },
          {
            icon: <History />,
            label: 'Log',
            fn: () => router.push(`${paths.INGREDIENT}${paths.LOG}`),
          },
        ]}
        backButton={false}
      />

      {/* Content */}
      <section className="flex min-h-[calc(874px-74px)] w-full max-w-6xl flex-col items-center gap-8 p-4">
        <div className="w-full">
          <h2 className="mb-4 text-xl font-medium">Restock Needed</h2>

          {lowStocks.length ? (
            <div className="flex w-full flex-col gap-2 rounded-2xl">
              {lowStocks.map((item, idx) => (
                <div key={idx} className="flex justify-between rounded-md bg-white p-2">
                  <div>{item.name}</div>
                  <div className="text-text-secondary font-light">
                    {item.quantity} {item.unit}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-text-secondary">Nice! no ingredients need restocking.</div>
          )}
        </div>

        <div className="w-full">
          <h2 className="mb-4 text-xl font-medium">All ingredients</h2>
          <div className="rounded-2xlp-4 flex w-full flex-col gap-2">
            {ingredients.length ? (
              ingredients.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md bg-white p-2"
                >
                  <div className="flex items-center gap-2">
                    {/* Quantity indicator */}
                    {!isEditing && (
                      <div
                        className={`h-2 w-2 rounded-full ${
                          item.quantity >= item.minimum_required * 2
                            ? 'bg-green-500'
                            : item.quantity >= item.minimum_required
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                        }`}
                      ></div>
                    )}

                    {/* Ingredient name or checkbox */}
                    {isEditing ? (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedIngredients.includes(item.id)}
                          onChange={() => toggleCheck(item.id)}
                          className="h-4 w-4 accent-blue-500"
                        />
                        {item.name}
                      </label>
                    ) : (
                      <div>{item.name}</div>
                    )}
                  </div>

                  {/* Quantity display */}
                  {!isEditing && (
                    <div className="text-text-secondary font-light">
                      {item.quantity} {item.unit}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-text-secondary">
                No ingredients here yet. Add your first ingredients!
              </p>
            )}
          </div>

          {isEditing && (
            <button
              type="button"
              className="col-span-12 flex items-center justify-center gap-4 rounded-sm border border-red-500 p-2 text-red-500"
              onClick={handleDelete}
            >
              <Trash2 size={18} /> Delete
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
