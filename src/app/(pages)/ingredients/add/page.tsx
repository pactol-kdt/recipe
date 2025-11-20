'use client';

import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '~/components/Header';
import HeartLoader from '~/components/Loader';
import { capitalize } from '~/lib/capitalize';
import { paths } from '~/meta';
import { IngredientList } from '~/types/ingredient-list';

const AddIngredientsPage = () => {
  const router = useRouter();

  const [ingredients, setIngredients] = useState<IngredientList[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<IngredientList[]>([]);

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

  const addIngredients = async () => {
    console.log('Saving recipe...:', items);

    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
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
        minimum_required: 0,
        unit: 'g',
      },
    ]);
  };

  const handleChange = (index: number, field: keyof IngredientList, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: capitalize(value) } : item))
    );
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
    (item) => !item.name.trim() || !item.unit!.trim() || !item.quantity || !item.minimum_required
  );

  if (loading) return <HeartLoader />;
  ingredients.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="bg-bg-muted flex min-h-screen w-full flex-col items-center">
      {/* Header */}
      <Header title="Add Ingredients" menuButtons={[]} backButton={true} />

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
              <label htmlFor="ingredient-name" className="col-span-5">
                Name
              </label>
              <label htmlFor="ingredient-quantity" className="col-span-2">
                Qty
              </label>
              <label htmlFor="ingredient-minimum-quantity" className="col-span-2">
                Min
              </label>
              <label htmlFor="ingredient-unit" className="col-span-3">
                Unit
              </label>

              {items?.map((item, index) => (
                <div key={index} className="col-span-12 grid grid-cols-12 items-center gap-2">
                  <input
                    list="ingredients"
                    type="text"
                    name="ingredient-name"
                    id="ingredient-name"
                    placeholder="Bread"
                    disabled={!isEditing}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    className="border-border-base col-span-5 rounded-lg border bg-white p-2 text-sm font-light capitalize"
                  />

                  <datalist id="ingredients">
                    {ingredients.map((ingredient, idx) => (
                      <option key={idx} value={ingredient.name} />
                    ))}
                  </datalist>

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
                    name="ingredient-minimum-quantity"
                    id="ingredient-minimum-quantity"
                    placeholder="200"
                    disabled={!isEditing}
                    onChange={(e) => handleChange(index, 'minimum_required', e.target.value)}
                    className="border-border-base col-span-2 rounded-lg border bg-white p-2 text-sm font-light"
                  />

                  <select
                    name="ingredient-unit"
                    id="ingredient-unit"
                    disabled={!isEditing}
                    onChange={(e) => handleChange(index, 'unit', e.target.value)}
                    className="border-border-base col-span-3 rounded-lg border bg-white p-2 text-sm font-light"
                  >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="pc">pc</option>
                    <option value="tsp">tsp</option>
                  </select>

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
              ))}
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
            onClick={addIngredients}
            disabled={items.length === 0 && isEditing}
          >
            <Plus />
            Add Ingredients
          </button>
          {/* <span className="text-light text-center text-red-400">{errorMessage}</span> */}
        </div>
      </section>
    </main>
  );
};

export default AddIngredientsPage;
