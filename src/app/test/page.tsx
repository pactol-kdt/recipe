'use client';
import { useState, useEffect } from 'react';

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<{ id: number; name: string }[]>([]);
  const [name, setName] = useState('');

  async function load() {
    const res = await fetch('/api/ingredients');
    setIngredients(await res.json());
  }

  async function addIngredient(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    await load();
  }

  async function deleteIngredient(id: number) {
    await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' });
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Ingredients</h1>

      <form onSubmit={addIngredient} className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ingredient name"
          className="rounded border p-2"
        />
        <button className="rounded bg-blue-600 px-3 py-2 text-white">Add</button>
      </form>

      <ul className="space-y-2">
        {ingredients?.map((i) => (
          <li key={i.id} className="flex justify-between border-b pb-1">
            <span>{i.name}</span>
            <button onClick={() => deleteIngredient(i.id)} className="text-red-500 hover:underline">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
