'use client';

import {
  ArrowLeft,
  Check,
  Clock3,
  Heart,
  List,
  LoaderCircle,
  Microwave,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import HeartLoader from '~/components/Loader';
import { paths } from '~/meta';
import { Recipe } from '~/types/recipe';

export default function IngredientPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe>({} as Recipe);

  const [batchCount, setBatchCount] = useState(1);
  const [isMaking, setIsMaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'ingredients' | 'instruction'>('ingredients');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        const data = await res.json();
        setRecipe(data);

        console.log(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipes();
  }, [id]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert('Recipe deleted successfully');
        router.push(paths.RECIPE);
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting ingredients');
    }
  };

  const makeRecipe = async () => {
    console.log('Making recipe with batch count:', batchCount, id);
    setUpdateLoading(true);

    try {
      const ingredientsRes = await fetch(`/api/ingredients`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deductIngredients', batchCount, id }),
      });

      if (!ingredientsRes.ok) {
        throw new Error('Failed to update ingredients');
      }

      const ingredientsData = await ingredientsRes.json();

      setIsMaking(false);

      const recipeSalesRes = await fetch('/api/recipe_sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: recipe.name,
          batch_made: batchCount,
        }),
      });

      if (!recipeSalesRes.ok) {
        throw new Error('Failed to update recipe sales');
      }

      const recipeSalesData = await recipeSalesRes.json();

      return { ingredients: ingredientsData, recipeSales: recipeSalesData };
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!recipe) return;

    // Prepare the updated recipe data
    const updatedRecipe = {
      ...recipe,
      is_favorite: !recipe.is_favorite, // toggle favorite
    };

    try {
      // Update backend
      const res = await updateRecipe(id, updatedRecipe);

      // Update local state so UI re-renders
      setRecipe(updatedRecipe);

      console.log('Updated recipe:', res);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleTabs = (tabName: 'ingredients' | 'instruction') => {
    setTab(tabName);
  };

  const toggleMaking = () => {
    setIsMaking(!isMaking);
  };

  async function updateRecipe(id: number, data: Recipe) {
    const res = await fetch(`/api/recipes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error('Failed to update recipe');
    }

    return res.json();
  }

  if (loading) return <HeartLoader />;
  if (recipe.error) {
    router.push(paths.RECIPE);
    return null;
  }

  return (
    <main className="relative h-screen overflow-hidden">
      <div className="relative h-[328px] w-full">
        {/* Image */}
        <Image
          alt="Classic Ham Roll Cheese Bread"
          src="/classic-ham-roll.jpg"
          fill
          className="object-cover"
        />

        {/* Back Button */}
        <button
          type="button"
          className="absolute top-4 left-4 w-fit rounded-full bg-white p-2 active:scale-95"
          onClick={() => router.back()}
        >
          <ArrowLeft />
        </button>

        <div className="absolute top-4 right-4 flex gap-4">
          {/* Delete Button */}
          <button
            className="active:bg-bg-muted rounded-full bg-white p-2 active:scale-95"
            onClick={() => handleDelete(recipe.id)}
          >
            <Trash2 className="" color="red" />
          </button>

          {/* Favorite Button */}
          <button
            className="active:bg-bg-muted rounded-full bg-white p-2 active:scale-95"
            onClick={handleFavorite}
          >
            {recipe?.is_favorite ? (
              <Heart className="fill-accent" color="white" />
            ) : (
              <Heart className="" color="black" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="absolute top-[300px] left-0 h-[calc(100vh-300px-56px)] w-full overflow-y-auto rounded-t-2xl bg-gray-100 px-4 py-6">
        <div className="flex flex-col gap-4">
          <div className="mt-2">
            <h1 className="text-xl">{recipe.name}</h1>
            <p className="text-text-secondary mt-2 text-sm font-light">{recipe.description}</p>

            <div className="text-text-secondary mt-4 flex gap-4 font-light">
              <div className="flex gap-2">
                <Clock3 /> <span>{recipe.cook_time} min</span>
              </div>
            </div>
          </div>

          {/* Seperator */}
          <div className="bg-border-base h-[2px]"></div>

          <div className="flex items-center justify-between">
            {/* Batch Count */}
            <div className="flex items-center gap-4">
              <label htmlFor="batch-count">Batch Count</label>
              <input
                type="text"
                name="batch-count"
                id="batch-count"
                className="border-border-base w-16 rounded-lg border bg-white p-2 text-sm font-light"
                value={batchCount}
                onChange={(e) => setBatchCount(Number(e.target.value))}
              />
            </div>

            {/* Make */}
            {isMaking ? (
              <button
                type="button"
                className="text-accent flex cursor-pointer items-center justify-center gap-2 rounded-md bg-white p-2 outline-2 active:scale-95 active:border-none"
                onClick={makeRecipe}
              >
                {updateLoading ? <LoaderCircle className="animate-spin" /> : <Check />}
                Done
              </button>
            ) : (
              <button
                type="button"
                className="bg-accent flex cursor-pointer items-center justify-center gap-2 rounded-md p-2 text-white active:scale-95"
                onClick={toggleMaking}
              >
                {updateLoading ? <LoaderCircle className="animate-spin" /> : <Microwave />}
                Make
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="border-border-base flex w-full gap-2 rounded-4xl border bg-white p-1">
            <button
              type="button"
              className={`${tab === 'ingredients' ? 'bg-text-secondary text-white' : ''} flex w-1/2 justify-center gap-2 rounded-2xl py-1 transition-all duration-300`}
              onClick={() => handleTabs('ingredients')}
            >
              <List /> Ingredients
            </button>
            <button
              type="button"
              className={`${tab === 'instruction' ? 'bg-text-secondary text-white' : ''} flex w-1/2 justify-center gap-2 rounded-2xl py-1 transition-all duration-300`}
              onClick={() => handleTabs('instruction')}
            >
              <TrendingUp /> Instructions
            </button>
          </div>

          {/* Ingredients */}
          {tab === 'ingredients' && (
            <div className="flex flex-col gap-2 rounded-2xl bg-white p-4">
              {recipe.ingredients?.map((ingredient, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>{ingredient.name}</div>
                  <div className="text-text-secondary font-light">
                    {ingredient.quantity * batchCount} {ingredient.unit}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Instruction */}
          {tab === 'instruction' && (
            <div className="flex flex-col gap-6 rounded-2xl bg-white p-4">
              {recipe.instruction?.map((item, idx) => (
                <div key={idx} className="relative grid grid-cols-12 gap-4">
                  {/* Number with vertical line */}
                  <div className="relative col-span-1 flex justify-center">
                    <div className="relative flex flex-col items-center">
                      {/* Number */}
                      <div className="bg-accent z-10 flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium text-white">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </div>

                      {/* Vertical line (hidden for last item) */}
                      {idx !== recipe.instruction.length - 1 && (
                        <div className="bg-accent absolute top-6 h-full w-[2px]"></div>
                      )}
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="col-span-11">
                    <div className="font-semibold">{item.title}</div>
                    <ul className="text-text-secondary list-disc pl-6 font-light">
                      <li>{item.description}</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
