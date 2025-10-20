'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '~/components/Header';
import { Recipe } from '~/types/recipe';

export default function RecipePage() {
  const router = useRouter();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('/api/recipe'); // GET route
        const data = await res.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p>Loading recipes...</p>;

  const favorites = recipes.filter((item) => item.is_favorite);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <Header title="Recipes" menuButton={true} backButton={false} />

      {/* Content */}
      <section className="bg-bg-muted border-border-base min-h-[calc(874px-74px)] border-t p-4">
        {/* Favorites */}
        <h2 className="mb-4 text-xl font-medium">Favorites</h2>
        <div className="flex flex-wrap gap-4">
          {favorites.map((item) => (
            <button
              key={item.id}
              type="button"
              className="relative h-[220px] w-[177px]"
              onClick={() => router.push(`/recipe/${item.id}`)}
            >
              {/* Image */}
              <Image
                alt="Classic Ham Roll Cheese Bread"
                src="/classic-ham-roll.jpg"
                fill
                className="rounded-lg object-cover"
              />

              {/* Favorite Button */}
              <div className="absolute top-2 right-2">
                {item.is_favorite ? (
                  <Heart className="fill-accent" color="white" />
                ) : (
                  <Heart className="fill-text-secondary" color="white" />
                )}
              </div>

              {/* Gradient BG */}
              <div className="absolute inset-0 rounded-lg bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]"></div>

              {/* Text */}
              <div className="absolute bottom-3 w-full p-2 text-center text-sm text-white">
                {item.name}
              </div>
            </button>
          ))}
        </div>

        {/* All */}
        <h2 className="mt-8 mb-4 text-xl font-medium">All</h2>
        <div className="flex flex-wrap gap-4">
          {recipes.map((item) => (
            <button
              key={item.id}
              type="button"
              className="relative h-[220px] w-[177px]"
              onClick={() => router.push(`/recipe/${item.id}`)}
            >
              {/* Image */}
              <Image
                alt="Classic Ham Roll Cheese Bread"
                src="/classic-ham-roll.jpg"
                fill
                className="rounded-lg object-cover"
              />

              {/* Favorite Button */}
              <div className="absolute top-2 right-2">
                {item.is_favorite ? (
                  <Heart className="fill-accent" color="white" />
                ) : (
                  <Heart className="fill-text-secondary" color="white" />
                )}
              </div>

              {/* Gradient BG */}
              <div className="absolute inset-0 rounded-lg bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]"></div>

              {/* Text */}
              <div className="absolute bottom-3 w-full p-2 text-center text-sm text-white">
                {item.name}
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
