'use client';

import Header from '~/components/Header';
import { Save } from 'lucide-react';
import IngredientsSection from './_components/ingredients';
import { useEffect, useState } from 'react';
import InstructionsSection from './_components/instruction';
import ErrorLabel from '~/components/ErrorLabel';
import { useRouter } from 'next/navigation';
import { paths } from '~/meta';
import HeartLoader from '~/components/Loader';
import { IngredientList } from '~/types/ingredient-list';
import { Ingredient } from '~/types/ingredients';
import { Instruction } from '~/types/instruction';

export default function AddNewRecipePage() {
  const router = useRouter();

  const [ingredientsData, setIngredientsData] = useState<Ingredient[]>([]);
  const [ingredientList, setIngredientList] = useState<IngredientList[]>([]);
  const [instructionsData, setInstructionsData] = useState<Instruction[]>([]);

  const [cookTime, setCookTime] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch('/api/ingredients');
        const data = await res.json();
        setIngredientList(data);

        console.log('Fetched ingredients:', data);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const saveRecipe = async () => {
    setIsSubmit(true);

    if (
      name.trim() === '' ||
      description.trim() === '' ||
      cookTime.trim() === '' ||
      ingredientsData.length === 0 ||
      instructionsData.length === 0
    ) {
      setErrorMessage(
        'Please fill in all fields and add at least one ingredient and instruction, and save.'
      );
      return;
    }

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          cook_time: +cookTime,
          ingredients: ingredientsData,
          instructions: instructionsData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log('Recipe saved successfully:', result);
      router.push(`${paths.RECIPE}`);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  if (loading) return <HeartLoader />;

  return (
    <main className="bg-bg-muted flex min-h-screen w-full flex-col items-center">
      {/* Header */}
      <Header title="Add New Recipe" menuButtons={[]} backButton={true} />

      <section className="flex h-[calc(100vh-74px-56px)] w-full max-w-6xl flex-col items-center gap-8 overflow-auto p-4">
        <div className="w-full rounded-2xl bg-white p-4">
          {/* Title */}
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
                className={`${isSubmit && name.length === 0 ? 'border-2 border-red-500' : 'border-border-base border'} rounded-lg border bg-white p-2 text-sm font-light capitalize`}
                value={name}
                onChange={(e) => setName((e.target as HTMLInputElement).value)}
              />

              {/* Error message (shown only when empty on submit) */}
              <ErrorLabel
                message="Name is required."
                isSubmit={isSubmit}
                dataLength={name.length}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                placeholder='e.g. "A delightful bread filled with ham and cheese, perfect for any occasion."'
                className={`${isSubmit && description.length === 0 ? 'border-2 border-red-500' : 'border-border-base border'} rounded-lg bg-white p-2 text-sm font-light`}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Error message (shown only when empty on submit) */}
              <ErrorLabel
                message="Description is required."
                isSubmit={isSubmit}
                dataLength={description.length}
              />
            </div>

            {/* Cook time */}
            <div className="flex flex-col gap-1">
              <label htmlFor="cook-time">
                Cook Time <span className="text-text-secondary">(min)</span>
              </label>
              <input
                type="number"
                name="cook-time"
                id="cook-time"
                placeholder='e.g. "25"'
                className={`${isSubmit && cookTime.length === 0 ? 'border-2 border-red-500' : 'border-border-base border'} rounded-lg bg-white p-2 text-sm font-light`}
                value={cookTime}
                onChange={(e) => setCookTime((e.target as HTMLInputElement).value)}
              />

              {/* Error message (shown only when empty on submit) */}
              <ErrorLabel
                message="Cook Time is required."
                isSubmit={isSubmit}
                dataLength={cookTime.length}
              />
            </div>
          </div>
        </div>

        {/* INGREDIENTS */}
        <IngredientsSection
          ingredients={ingredientsData}
          setIngredients={setIngredientsData}
          isSubmit={isSubmit}
          ingredientList={ingredientList}
        />

        {/* INSTRUCTION */}
        <InstructionsSection
          instructions={instructionsData}
          setInstruction={setInstructionsData}
          isSubmit={isSubmit}
        />

        {/* Submit Button */}
        <div className="flex w-full flex-col justify-between gap-4">
          <button
            type="button"
            className="bg-accent flex items-center justify-center gap-2 rounded-2xl p-2 font-bold text-white active:scale-95"
            onClick={saveRecipe}
          >
            <Save />
            Save Recipe
          </button>
          <span className="text-light text-center text-red-400">{errorMessage}</span>
        </div>
      </section>
    </main>
  );
}
