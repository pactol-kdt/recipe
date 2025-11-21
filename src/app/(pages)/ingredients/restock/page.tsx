'use client';

import { Box, Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '~/components/Header';
import HeartLoader from '~/components/Loader';
import { paths } from '~/meta';
import { IngredientList } from '~/types/ingredient-list';

const AddIngredientsPage = () => {
  const router = useRouter();

  const [ingredients, setIngredients] = useState<IngredientList[]>([]);
  const [items, setItems] = useState<IngredientList[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch('/api/ingredients');
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

  const findValue = (name: string) => {
    return ingredients.find((ing) => ing.name === name)?.unit;
  };

  const restockIngredients = async () => {
    console.log('Restocking ingredients...:', items);

    try {
      const response = await fetch('/api/ingredients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restockIngredients', items }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log('Recipe saved successfully:', result);
      router.push(`${paths.INGREDIENT}`); // Redirect to recipe list
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const handleAdd = () => {
    setItems((prev) => [
      ...prev,
      {
        name: '',
        quantity: 0,
        cost: 0,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
  };

  const handleChange = (index: number, field: keyof IngredientList, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (hasEmptyFields) return;

    setIsEditing(false);
    console.log(items);
  };

  const hasEmptyFields = items?.some(
    (item) => !item.name.trim() || !item.quantity || !item.cost || !item.date!.trim
  );

  if (loading) return <HeartLoader />;
  return (
    <main className="bg-bg-muted flex min-h-screen w-full flex-col items-center">
      {/* Header */}
      <Header title="Restock Ingredients" menuButtons={[]} backButton={true} />

      <section className="flex h-[calc(100vh-74px-56px)] w-full max-w-6xl flex-col items-center gap-8 overflow-auto p-4">
        <div className="w-full rounded-2xl bg-white p-4">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">INGREDIENTS</h2>

            {/* Toggle Edit Mode */}
            <button
              type="button"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              disabled={isEditing && hasEmptyFields}
              className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 active:scale-95"
            >
              {isEditing ? (
                <>
                  <Check size={16} /> Done
                </>
              ) : (
                <>
                  <Pencil size={16} /> Edit
                </>
              )}
            </button>
          </div>

          {items?.length === 0 ? (
            <p className={`text-text-secondary text-center text-sm font-light`}>
              No ingredients yet. Tap <span className="font-bold">Edit</span> to add some.
            </p>
          ) : (
            // Content
            <div className="mt-4 grid grid-cols-12 gap-2">
              <label htmlFor="ingredient-name" className="col-span-4">
                Name
              </label>
              <label htmlFor="ingredient-quantity" className="col-span-2">
                Qty
              </label>
              <label htmlFor="ingredient-cost" className="col-span-2">
                Cost
              </label>
              <label htmlFor="ingredient-quantity" className="col-span-2">
                Unit
              </label>
              <label htmlFor="ingredient-quantity" className="col-span-2">
                Date
              </label>

              {items?.map((item, index) => {
                const selectedNames = items.map((i) => i.name);

                return (
                  <div key={index} className="col-span-12 grid grid-cols-12 items-center gap-2">
                    <select
                      name="ingredient-name"
                      id="ingredient-name"
                      disabled={!isEditing}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      className="border-border-base col-span-4 rounded-lg border bg-white p-2 text-sm font-light capitalize"
                    >
                      <option value="">Select ingredient</option>
                      {ingredients
                        .filter(
                          (ingredient) =>
                            // show ingredient if it's not selected anywhere else
                            !selectedNames.includes(ingredient.name) ||
                            ingredient.name === item.name // keep current selection visible
                        )
                        .map((ingredient, ingredientIdx) => (
                          <option key={ingredientIdx} value={ingredient.name}>
                            {ingredient.name}
                          </option>
                        ))}
                    </select>

                    <input
                      type="number"
                      name="ingredient-quantity"
                      id="ingredient-quantity"
                      placeholder="200"
                      disabled={!isEditing}
                      onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                      className="border-border-base col-span-2 rounded-lg border bg-white p-2 text-sm font-light"
                    />

                    <input
                      type="number"
                      name="ingredient-cost"
                      id="ingredient-cost"
                      placeholder="200"
                      disabled={!isEditing}
                      onChange={(e) => handleChange(index, 'cost', e.target.value)}
                      className="border-border-base col-span-2 rounded-lg border bg-white p-2 text-sm font-light"
                    />

                    <select
                      name="ingredient-unit"
                      id="ingredient-unit"
                      disabled
                      onChange={(e) => handleChange(index, 'unit', e.target.value)}
                      className="border-border-base bg-bg-muted col-span-2 rounded-lg border p-2 text-sm font-light"
                      value={findValue(item.name) || ''}
                    >
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="pc">pc</option>
                      <option value="tsp">tsp</option>
                    </select>

                    <input
                      type="date"
                      name={`cash-date`}
                      id={`cash-date`}
                      value={item.date}
                      onChange={(e) => handleChange(index, 'date', e.target.value)}
                      className="border-border-base col-span-2 rounded-lg border p-2 text-sm font-light"
                    />
                    {/* Delete Button (only when editing) */}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="col-span-12 flex items-center justify-center gap-4 rounded-sm border border-red-500 p-2 text-red-500"
                      >
                        <Trash2 size={18} /> Delete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ADD INGREDIENTS */}
          {isEditing && (
            <button
              type="button"
              onClick={handleAdd}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 py-2 text-sm text-gray-600 active:scale-95"
            >
              <Plus size={16} /> Add Ingredient
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex w-full flex-col justify-between gap-4">
          <button
            type="button"
            className={`${items.length === 0 || isEditing ? 'opacity-50' : 'active:scale-95'} bg-accent flex items-center justify-center gap-2 rounded-2xl p-2 font-bold text-white`}
            onClick={restockIngredients}
            disabled={items.length === 0 && isEditing}
          >
            <Box />
            Restock Ingredients
          </button>
          {/* <span className="text-light text-center text-red-400">{errorMessage}</span> */}
        </div>
      </section>
    </main>
  );
};

export default AddIngredientsPage;
