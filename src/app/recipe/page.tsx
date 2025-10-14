'use client';

import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '~/components/Header';

export default function RecipePage() {
  const data = [
    {
      id: 1,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Classic Ham Roll Cheese Bread',
      description:
        'A soft, fluffy bread roll filled with savory ham and creamy melted cheese — a timeless bakery favorite.',
      isFavorite: true,
    },
    {
      id: 2,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Chocolate Chip Cookie',
      description:
        'Crispy on the edges, chewy in the center, and loaded with rich chocolate chips in every bite.',
      isFavorite: true,
    },
    {
      id: 3,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Fudgy Brownie Delight',
      description:
        'Dense and decadent chocolate brownie with a fudgy texture and a hint of espresso flavor.',
      isFavorite: true,
    },
    {
      id: 4,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Matcha Cream Bun',
      description:
        'A fluffy bun infused with premium Japanese matcha and filled with smooth matcha custard cream.',
      isFavorite: true,
    },
    {
      id: 5,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Buttery Croissant Supreme',
      description:
        'Flaky, golden-brown layers of pastry made with pure butter — perfect with your morning coffee.',
      isFavorite: false,
    },
    {
      id: 6,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Blueberry Burst Muffin',
      description:
        'A moist, bakery-style muffin bursting with real blueberries and topped with a sugary crumble.',
      isFavorite: false,
    },
    {
      id: 7,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Red Velvet Cream Cookie',
      description:
        'Soft red velvet cookies with a luscious cream cheese filling for a rich and tangy treat.',
      isFavorite: false,
    },
    {
      id: 8,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Moist Banana Loaf',
      description:
        'Classic banana bread made from ripe bananas and a touch of butter for the perfect moist crumb.',
      isFavorite: false,
    },
    {
      id: 9,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Oreo Crunch Brownie',
      description:
        'A chewy brownie base topped with crushed Oreos and drizzled with white chocolate.',
      isFavorite: false,
    },
    {
      id: 10,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Strawberry Danish Delight',
      description:
        'Flaky pastry filled with vanilla custard and topped with fresh strawberries and glaze.',
      isFavorite: false,
    },
  ];

  const router = useRouter();

  const favorites = data.filter((item) => item.isFavorite);

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
                {item.isFavorite ? (
                  <Heart className="fill-accent" color="white" />
                ) : (
                  <Heart className="fill-text-secondary" color="white" />
                )}
              </div>

              {/* Gradient BG */}
              <div className="absolute inset-0 rounded-lg bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]"></div>

              {/* Text */}
              <div className="absolute bottom-3 w-full p-2 text-center text-sm text-white">
                {item.title}
              </div>
            </button>
          ))}
        </div>

        {/* All */}
        <h2 className="mt-8 mb-4 text-xl font-medium">All</h2>
        <div className="flex flex-wrap gap-4">
          {data.map((item) => (
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
                {item.isFavorite ? (
                  <Heart className="fill-accent" color="white" />
                ) : (
                  <Heart className="fill-text-secondary" color="white" />
                )}
              </div>

              {/* Gradient BG */}
              <div className="absolute inset-0 rounded-lg bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]"></div>

              {/* Text */}
              <div className="absolute bottom-3 w-full p-2 text-center text-sm text-white">
                {item.title}
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
