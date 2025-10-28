'use client';

import { useEffect, useState } from 'react';
import HeartLoader from '~/components/Loader';

interface Ingredient {
  id: number;
  name: string;
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all ingredients
  const fetchIngredients = async () => {
    const res = await fetch('/api/ingredients');
    const data = await res.json();
    setIngredients(data);
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  // ✅ Add new ingredient
  const handleAdd = async () => {
    if (!name.trim()) return alert('Please enter a name');

    setLoading(true);
    await fetch('/api/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    setName('');
    setLoading(false);
    fetchIngredients();
  };

  // ✅ Update ingredient
  const handleUpdate = async () => {
    if (!editing) return;
    if (!editing.name.trim()) return alert('Please enter a name');

    setLoading(true);
    await fetch('/api/ingredients', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editing.id, name: editing.name }),
    });
    setEditing(null);
    setLoading(false);
    fetchIngredients();
  };

  // ✅ Delete ingredient
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this ingredient?')) return;
    await fetch(`/api/ingredients?id=${id}`, { method: 'DELETE' });
    fetchIngredients();
  };

  if (loading) return <HeartLoader />;

  return (
    <div className="mx-auto mt-10 w-full max-w-md rounded-2xl border bg-white p-6 shadow">
      <h1 className="mb-6 text-center text-2xl font-bold">🥣 Ingredients Manager</h1>

      {/* Add new ingredient */}
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter ingredient name"
          className="flex-1 rounded-md border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          Add
        </button>
      </div>

      {/* Ingredient list */}
      <ul className="space-y-2">
        {ingredients.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-lg border p-2">
            {editing?.id === item.id ? (
              <>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="flex-1 rounded-md border p-1"
                />
                <button
                  onClick={handleUpdate}
                  className="ml-2 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="ml-2 rounded bg-gray-300 px-3 py-1 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{item.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(item)}
                    className="rounded bg-yellow-400 px-3 py-1 hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
