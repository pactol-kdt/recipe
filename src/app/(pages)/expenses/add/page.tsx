'use client';

import { Check, Pencil, PiggyBank, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '~/components/Header';
import { paths } from '~/meta';
import { ExpensesUpdate } from '~/types/expenses-update';

const AddExpensesUpdatePage = () => {
  const router = useRouter();

  const [items, setItems] = useState<ExpensesUpdate[]>([]);

  const [isEditing, setIsEditing] = useState(false);

  const today = new Date();
  const localDate = today.toISOString().slice(0, 10);

  const addExpensesUpdate = async () => {
    try {
      const response = await fetch('/api/expenses_update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log('Expenses transaction log successfully:', result);
      router.push(`${paths.SALES_INCOME}`);
    } catch (error) {
      console.error('Error saving expenses transaction:', error);
    }
  };

  const handleAdd = () => {
    setItems((prev) => [
      ...prev,
      {
        name: '',
        amount: 0,
        date: localDate,
      },
    ]);
  };

  const handleChange = (index: number, field: keyof ExpensesUpdate, value: string) => {
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

  return (
    <main className="bg-bg-muted flex min-h-screen w-full flex-col items-center">
      {/* Header */}
      <Header title="Add Expenses Update" menuButtons={[]} backButton={true} />

      <section className="flex h-[calc(100vh-74px-56px)] w-full max-w-6xl flex-col items-center gap-8 overflow-auto p-4">
        <div className="w-full rounded-2xl bg-white p-4">
          {/* Title */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">EXPENSES UPDATE</h2>

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
              No expenses update yet. Tap <span className="font-bold">Add</span> to log expenses.
            </p>
          ) : (
            // Content
            <div className="mt-4 grid grid-cols-12 gap-2">
              <label htmlFor="expenses-name" className="col-span-5">
                Name
              </label>
              <label htmlFor="expenses-quantity" className="col-span-3">
                Amount
              </label>
              <label htmlFor="expenses-quantity" className="col-span-4">
                Date
              </label>

              {/* Expenses List */}
              {items.map((item, index) => (
                <div key={index} className="col-span-12 grid grid-cols-12 items-center gap-2">
                  <input
                    list="sales"
                    type="text"
                    name={`expenses-name`}
                    id={`expenses-name`}
                    placeholder="Gas, Rent"
                    disabled={!isEditing}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    className="border-border-base col-span-5 rounded-lg border bg-white p-2 text-sm font-light capitalize"
                  />

                  <input
                    type="number"
                    name={`expenses-amount`}
                    id={`expenses-amount`}
                    placeholder="200"
                    disabled={!isEditing}
                    onChange={(e) => handleChange(index, 'amount', e.target.value)}
                    className="border-border-base col-span-3 rounded-lg border bg-white p-2 text-sm font-light"
                  />

                  <input
                    type="date"
                    name={`expenses-date`}
                    id={`expenses-date`}
                    value={item.date}
                    onChange={(e) => handleChange(index, 'date', e.target.value)}
                    className="border-border-base col-span-4 rounded-lg border p-2 text-sm font-light"
                  />

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

          {/* Add Expenses List */}
          {isEditing && (
            <button
              type="button"
              onClick={handleAdd}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 py-2 text-sm text-gray-600 active:scale-95"
            >
              <Plus size={16} /> Add Expenses Update
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex w-full flex-col justify-between gap-4">
          <button
            type="button"
            className="bg-accent flex items-center justify-center gap-2 rounded-2xl p-2 font-bold text-white active:scale-95"
            onClick={addExpensesUpdate}
          >
            <PiggyBank />
            Add Expenses Update
          </button>
        </div>
      </section>
    </main>
  );
};

export default AddExpensesUpdatePage;
