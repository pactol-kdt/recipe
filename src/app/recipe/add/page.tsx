'use client';

import Header from '~/components/Header';
import InstructionSection from './_components/instruction';
import { Save } from 'lucide-react';
import IngredientsSection from './_components/ingredients';

export default function AddNewRecipePage() {
  const ingredients = [
    { id: 1, name: 'Bread', quantity: '200', unit: 'g' },
    { id: 2, name: 'Milk', quantity: '200', unit: 'ml' },
    { id: 3, name: 'Egg', quantity: '3', unit: 'pc' },
    { id: 4, name: 'Ham', quantity: '200', unit: 'g' },
  ];

  const instructions = [
    {
      id: 1,
      title: 'Prepare dry ingredients',
      description: 'Combine flour, sugar, salt, and yeast in a large bowl.',
    },
    {
      id: 2,
      title: 'Prepare wet ingredients',
      description: 'Combine warm milk, eggs, and melted butter in a separate bowl.',
    },
    {
      id: 3,
      title: 'Mix ingredients',
      description:
        'Gradually add the wet ingredients to the dry ingredients, mixing until a dough forms.',
    },
    {
      id: 4,
      title: 'Bake in the oven',
      description:
        'Preheat the oven to 350°F (175°C). Place the rolls on a baking sheet and bake for 20-25 minutes, or until golden brown.',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <Header title="Add New Recipe" menuButton={false} backButton={true} />

      {/* Content */}
      <section className="bg-bg-muted border-border-base flex min-h-[calc(874px-74px)] flex-col gap-4 border-t p-4 pb-8">
        {/* Details */}
        <div className="rounded-2xl bg-white p-4">
          <h2 className="font-bold">DETAILS</h2>

          <div className="mt-4 flex flex-col gap-2">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder='e.g. "Classic Ham Roll Cheese Bread"'
                className="border-border-base rounded-lg border bg-white p-2 text-sm font-light"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                placeholder='e.g. "A delightful bread filled with ham and cheese, perfect for any occasion."'
                className="border-border-base rounded-lg border bg-white p-2 text-sm font-light"
                rows={3}
              />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                name="category"
                id="category"
                placeholder='e.g. "Bread"'
                className="border-border-base rounded-lg border bg-white p-2 text-sm font-light"
              />
            </div>

            {/* Cook time */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name">
                Cook Time <span className="text-text-secondary">(min)</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder='e.g. "25"'
                className="border-border-base rounded-lg border bg-white p-2 text-sm font-light"
              />
            </div>
          </div>
        </div>

        {/* INGREDIENTS */}
        <IngredientsSection ingredients={ingredients} />

        {/* INSTRUCTION */}
        <InstructionSection instructions={instructions} />

        {/* Submit Button */}
        <button
          type="button"
          className="bg-accent flex items-center justify-center gap-2 rounded-2xl p-2 font-bold text-white active:scale-95"
        >
          <Save />
          Save Recipe
        </button>
      </section>
    </main>
  );
}
