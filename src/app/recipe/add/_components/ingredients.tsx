import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Ingredient = {
  id: number;
  name: string;
  quantity: string;
  unit: string;
};

const IngredientsSection = ({ ingredients }: { ingredients: Ingredient[] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState(ingredients);

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    setItems((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: '',
        quantity: '',
        unit: '',
      },
    ]);
  };

  return (
    <div className="rounded-2xl bg-white p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">INGREDIENTS</h2>

        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
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

      <div className="mt-4 grid grid-cols-12 gap-2">
        <div className="col-span-1"></div>
        <div className="col-span-5">Name</div>
        <div className="col-span-3">Quantity</div>
        <div className="col-span-3">Unit</div>

        {items.map((item, idx) => (
          <div key={item.id} className="col-span-12 grid grid-cols-12 items-center gap-2">
            <span className="col-span-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
              {item.id}
            </span>
            <input
              type="text"
              name="ingredient-name"
              id="ingredient-name"
              placeholder="Bread"
              className="border-border-base col-span-5 rounded-lg border bg-white p-2 text-sm font-light"
              defaultValue={item.name}
            />

            <input
              type="text"
              name="ingredient-quantity"
              id="ingredient-quantity"
              placeholder="200g"
              className="border-border-base col-span-3 rounded-lg border bg-white p-2 text-sm font-light"
              defaultValue={item.quantity}
            />

            <select
              name="ingredient-unit"
              id="ingredient-unit"
              className="border-border-base col-span-3 rounded-lg border bg-white p-2 text-sm font-light"
              defaultValue={item.unit}
            >
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="pc">pc</option>
            </select>

            {/* Delete Button (only when editing) */}
            {isEditing && (
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="flex items-center justify-center gap-4 rounded-sm border border-red-500 p-2 text-red-500"
              >
                <Trash2 size={18} /> Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <button
          type="button"
          onClick={handleAdd}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 py-2 text-sm text-gray-600 active:scale-95"
        >
          <Plus size={16} /> Add Step
        </button>
      )}
    </div>
  );
};

export default IngredientsSection;
