'use client';
import { useState, useEffect } from 'react';

interface Ingredient {
  id: number;
  name: string;
}

export default function IngredientList() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [name, setName] = useState('');

  // Fetch all ingredients
  useEffect(() => {
    fetch('/api/ingredients')
      .then((res) => res.json())
      .then((data: Ingredient[]) => setIngredients(data));
  }, []);

  // Add a new ingredient
  const addIngredient = async () => {
    const res = await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    const newItem: Ingredient = await res.json();
    setIngredients((prev) => [...prev, newItem]);
    setName('');
  };

  // Delete ingredient by ID
  const deleteIngredient = async (id: number) => {
    await fetch('/api/ingredients', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="mb-2 text-xl font-bold">Ingredients</h1>

      <div className="mb-4 flex gap-2">
        <input
          className="rounded border px-2 py-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingredient name"
        />
        <button className="rounded bg-blue-500 px-3 text-white" onClick={addIngredient}>
          Add
        </button>
      </div>

      <ul>
        {ingredients.map((i) => (
          <li key={i.id} className="flex justify-between border-b py-1">
            {i.name}
            <button className="text-red-500" onClick={() => deleteIngredient(i.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
