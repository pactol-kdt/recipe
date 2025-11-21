'use client';

import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '~/components/Header';
import HeartLoader from '~/components/Loader';
import { paths } from '~/meta';
import { Recipe } from '~/types/recipe';
import { SalesIncome } from '~/types/sales-income';

const AddSalesIncomePage = () => {
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<SalesIncome[]>([]);

  const today = new Date();
  const localDate = today.toISOString().slice(0, 10);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('/api/recipes');
        const data = await res.json();
        setRecipes(data);
        console.log('Fetched recipes:', data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const addSalesIncome = async () => {
    try {
      const response = await fetch('/api/sales-income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log('Sales transaction log successfully:', result);
      router.push(`${paths.SALES_INCOME}`);
    } catch (error) {
      console.error('Error saving sales transaction:', error);
    }
  };

  const handleAdd = () => {
    setItems((prev) => [
      ...prev,
      {
        name: '',
        amount: 0,
        date: localDate,
        note: '',
      },
    ]);
  };

  const handleChange = (index: number, field: keyof SalesIncome, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const hasEmpty = items?.some((item) => !item.name.trim());

    if (hasEmpty) return;

    setIsEditing(false);
    console.log(items);
  };

  const hasEmptyFields = items?.some((item) => !item.name.trim());

  if (loading) return <HeartLoader />;
  return (
    <main className="bg-bg-muted flex min-h-screen w-full flex-col items-center">
      {/* Header */}
      <Header title="Add Sales Income" menuButtons={[]} backButton={true} />

      <section className="flex h-[calc(100vh-74px-56px)] w-full max-w-6xl flex-col items-center gap-8 overflow-auto p-4">
        <div className="w-full rounded-2xl bg-white p-4">
          {/* Title */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">SALES INCOME</h2>

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
            <p className="text-text-secondary text-center text-sm font-light">
              No cash flow activity yet. Tap <span className="font-bold">Add</span> to log income or
              expenses.
            </p>
          ) : (
            // Content
            <div className="mt-4 grid grid-cols-12 gap-2">
              <label htmlFor="cash-name" className="col-span-4">
                Name
              </label>
              <label htmlFor="cash-quantity" className="col-span-3">
                Amount
              </label>
              <label htmlFor="cash-quantity" className="col-span-3">
                Date
              </label>
              <label htmlFor="cash-quantity" className="col-span-2">
                Note
              </label>

              {items.map((item, index) => (
                <div key={index} className="col-span-12 grid grid-cols-12 items-center gap-2">
                  {/* Name */}
                  <input
                    list="sales"
                    type="text"
                    name={`cash-name`}
                    id={`cash-name`}
                    placeholder="Select or type"
                    disabled={!isEditing}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    className="border-border-base col-span-4 rounded-lg border bg-white p-2 text-sm font-light capitalize"
                  />

                  <datalist id="sales">
                    {recipes.map((recipe, idx) => (
                      <option key={idx} value={recipe.name} />
                    ))}
                    <option value="Office Sales" />
                  </datalist>

                  {/* Amount */}
                  <input
                    type="number"
                    name={`cash-amount`}
                    id={`cash-amount`}
                    placeholder="200"
                    disabled={!isEditing}
                    onChange={(e) => handleChange(index, 'amount', e.target.value)}
                    className="border-border-base col-span-3 rounded-lg border bg-white p-2 text-sm font-light"
                  />

                  {/* Date */}
                  <input
                    type="date"
                    name={`cash-date`}
                    id={`cash-date`}
                    value={item.date}
                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                    className="border-border-base col-span-3 rounded-lg border p-2 text-sm font-light"
                  />

                  {/* Note */}
                  <input
                    type="text"
                    name={`cash-note`}
                    id={`cash-note`}
                    onChange={(e) => handleChange(index, 'note', e.target.value)}
                    placeholder="Note"
                    className="border-border-base col-span-2 rounded-lg border p-2 text-sm font-light"
                  />

                  {/* Editing mode */}
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

          {/* Add sales income */}
          {isEditing && (
            <button
              type="button"
              onClick={handleAdd}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 py-2 text-sm text-gray-600 active:scale-95"
            >
              <Plus size={16} /> Add Sales Income
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex w-full flex-col justify-between gap-4">
          <button
            type="button"
            className={`${items.length === 0 || isEditing ? 'opacity-50' : 'active:scale-95'} bg-accent flex items-center justify-center gap-2 rounded-2xl p-2 font-bold text-white`}
            onClick={addSalesIncome}
            disabled={items.length === 0 && isEditing}
          >
            <Plus />
            Restock Ingredients
          </button>
        </div>
      </section>
    </main>
  );
};

export default AddSalesIncomePage;
