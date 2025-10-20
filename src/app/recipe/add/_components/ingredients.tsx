import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Ingredient = {
  name: string;
  quantity: string;
  unit: string;
};

const IngredientsSection = ({
  ingredients,
  setIngredients,
  isSubmit,
}: {
  ingredients: Ingredient[];
  setIngredients: (value: Ingredient[]) => void;
  isSubmit: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState(ingredients);

  useEffect(() => {
    setItems(ingredients);
  }, [ingredients]);

  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const hasEmpty = items.some(
      (item) => !item.name.trim() || !item.quantity.trim() || !item.unit.trim()
    );

    if (hasEmpty) return;

    setIngredients(items);
    setIsEditing(false);
    console.log(items);
  };

  const handleAdd = () => {
    setItems((prev) => [
      ...prev,
      {
        name: '',
        quantity: '',
        unit: 'g',
      },
    ]);
  };

  const handleChange = (index: number, field: keyof Ingredient, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const hasEmptyFields = items.some(
    (item) => !item.name.trim() || !item.quantity.trim() || !item.unit.trim()
  );

  return (
    <div className="rounded-2xl bg-white p-4">
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

      {items.length === 0 ? (
        <p
          className={`${isSubmit && ingredients.length === 0 ? 'text-red-400' : 'text-text-secondary'} text-center text-sm font-light`}
        >
          No ingredients yet. Tap <span className="font-bold">Edit</span> to add some.
        </p>
      ) : (
        // Content
        <div className="mt-4 grid grid-cols-12 gap-2">
          <div className="col-span-1"></div>
          <div className="col-span-5">Name</div>
          <div className="col-span-3">Quantity</div>
          <div className="col-span-3">Unit</div>

          {items.map((item, index) => (
            <div key={index} className="col-span-12 grid grid-cols-12 items-center gap-2">
              <span className="col-span-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                {index + 1}
              </span>
              <input
                type="text"
                name="ingredient-name"
                id="ingredient-name"
                placeholder="Bread"
                disabled={!isEditing}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
                className="border-border-base col-span-5 rounded-lg border bg-white p-2 text-sm font-light"
              />

              <input
                type="number"
                name="ingredient-quantity"
                id="ingredient-quantity"
                placeholder="200"
                disabled={!isEditing}
                onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                className="border-border-base col-span-3 rounded-lg border bg-white p-2 text-sm font-light"
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
  );
};

export default IngredientsSection;
