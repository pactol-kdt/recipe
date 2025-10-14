'use client';

import { ArrowLeft, Clock3, Flame, Heart, List, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function IngredientPage() {
  const data = [
    {
      id: 1,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Classic Ham Roll Cheese Bread',
      description:
        'A soft, fluffy bread roll filled with savory ham and creamy melted cheese — a timeless bakery favorite.',
      isFavorite: true,
      ingredients: [
        { title: 'Bread Flour', quantity: 250, unit: 'g' },
        { title: 'Ham Slices', quantity: 3, unit: 'pc' },
        { title: 'Cheese', quantity: 50, unit: 'g' },
        { title: 'Milk', quantity: 120, unit: 'ml' },
        { title: 'Butter', quantity: 30, unit: 'g' },
      ],
      instructions: [
        {
          title: 'Prepare the Dough',
          subtasks: [
            'Mix bread flour, milk, and butter to form dough.',
            'Knead until smooth and elastic.',
            'Let rise for 1 hour or until doubled in size.',
          ],
        },
        {
          title: 'Assemble the Rolls',
          subtasks: [
            'Flatten the dough and place ham and cheese inside.',
            'Roll tightly and place on a baking tray.',
            'Let rise again for 30 minutes.',
          ],
        },
        {
          title: 'Bake',
          subtasks: ['Bake at 180°C for 20 minutes until golden brown.'],
        },
      ],
    },
    {
      id: 2,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Chocolate Chip Cookie',
      description:
        'Crispy on the edges, chewy in the center, and loaded with rich chocolate chips in every bite.',
      isFavorite: true,
      ingredients: [
        { title: 'All-purpose Flour', quantity: 200, unit: 'g' },
        { title: 'Brown Sugar', quantity: 100, unit: 'g' },
        { title: 'Butter', quantity: 100, unit: 'g' },
        { title: 'Chocolate Chips', quantity: 80, unit: 'g' },
        { title: 'Egg', quantity: 1, unit: 'pc' },
      ],
      instructions: [
        {
          title: 'Make the Dough',
          subtasks: [
            'Cream butter and brown sugar until fluffy.',
            'Add egg and mix until combined.',
            'Stir in flour until smooth dough forms.',
          ],
        },
        {
          title: 'Add Chocolate',
          subtasks: ['Fold in chocolate chips evenly throughout the dough.'],
        },
        {
          title: 'Bake',
          subtasks: [
            'Scoop dough onto baking tray.',
            'Bake at 175°C for 12 minutes or until edges are golden.',
          ],
        },
      ],
    },
    {
      id: 3,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Fudgy Brownie Delight',
      description:
        'Dense and decadent chocolate brownie with a fudgy texture and a hint of espresso flavor.',
      isFavorite: true,
      ingredients: [
        { title: 'Dark Chocolate', quantity: 120, unit: 'g' },
        { title: 'Butter', quantity: 80, unit: 'g' },
        { title: 'Sugar', quantity: 150, unit: 'g' },
        { title: 'Flour', quantity: 60, unit: 'g' },
        { title: 'Eggs', quantity: 2, unit: 'pc' },
      ],
      instructions: [
        {
          title: 'Melt the Base',
          subtasks: [
            'Melt dark chocolate and butter together over low heat.',
            'Stir until smooth and glossy.',
          ],
        },
        {
          title: 'Prepare the Batter',
          subtasks: ['Whisk in sugar and eggs until well mixed.', 'Fold in flour until combined.'],
        },
        {
          title: 'Bake',
          subtasks: [
            'Pour batter into a lined baking pan.',
            'Bake at 180°C for 25 minutes for a fudgy center.',
          ],
        },
      ],
    },
    {
      id: 4,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Matcha Cream Bun',
      description:
        'A fluffy bun infused with premium Japanese matcha and filled with smooth matcha custard cream.',
      isFavorite: true,
      ingredients: [
        { title: 'Bread Flour', quantity: 250, unit: 'g' },
        { title: 'Matcha Powder', quantity: 10, unit: 'g' },
        { title: 'Milk', quantity: 150, unit: 'ml' },
        { title: 'Butter', quantity: 30, unit: 'g' },
        { title: 'Custard Filling', quantity: 80, unit: 'g' },
      ],
      instructions: [
        {
          title: 'Make the Dough',
          subtasks: [
            'Mix bread flour, matcha powder, milk, and butter.',
            'Knead until smooth.',
            'Let rise for 1 hour.',
          ],
        },
        {
          title: 'Fill the Buns',
          subtasks: [
            'Shape dough into balls.',
            'Fill with matcha custard filling.',
            'Let rest for 20 minutes.',
          ],
        },
        {
          title: 'Bake',
          subtasks: ['Bake at 170°C for 18–20 minutes until light golden.'],
        },
      ],
    },
    {
      id: 5,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Buttery Croissant Supreme',
      description:
        'Flaky, golden-brown layers of pastry made with pure butter — perfect with your morning coffee.',
      isFavorite: false,
      ingredients: [
        { title: 'Bread Flour', quantity: 280, unit: 'g' },
        { title: 'Butter', quantity: 150, unit: 'g' },
        { title: 'Sugar', quantity: 30, unit: 'g' },
        { title: 'Yeast', quantity: 7, unit: 'g' },
        { title: 'Milk', quantity: 120, unit: 'ml' },
      ],
      instructions: [
        {
          title: 'Prepare the Dough',
          subtasks: ['Mix flour, sugar, yeast, and milk to form dough.', 'Rest for 30 minutes.'],
        },
        {
          title: 'Layer the Butter',
          subtasks: [
            'Roll out dough and layer butter inside.',
            'Fold and roll multiple times, chilling between folds.',
          ],
        },
        {
          title: 'Shape and Bake',
          subtasks: [
            'Cut and roll dough into croissant shapes.',
            'Proof for 1 hour.',
            'Bake at 200°C for 15–18 minutes until golden.',
          ],
        },
      ],
    },
    {
      id: 6,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Blueberry Burst Muffin',
      description:
        'A moist, bakery-style muffin bursting with real blueberries and topped with a sugary crumble.',
      isFavorite: false,
      ingredients: [
        { title: 'All-purpose Flour', quantity: 200, unit: 'g' },
        { title: 'Sugar', quantity: 100, unit: 'g' },
        { title: 'Butter', quantity: 80, unit: 'g' },
        { title: 'Milk', quantity: 100, unit: 'ml' },
        { title: 'Blueberries', quantity: 60, unit: 'g' },
      ],
      instructions: [
        {
          title: 'Mix the Batter',
          subtasks: [
            'Cream butter and sugar together.',
            'Add milk and stir until smooth.',
            'Fold in flour and mix gently.',
          ],
        },
        {
          title: 'Add Blueberries',
          subtasks: ['Fold in blueberries evenly.'],
        },
        {
          title: 'Bake',
          subtasks: ['Scoop into muffin cups.', 'Bake at 180°C for 20–25 minutes until golden.'],
        },
      ],
    },
    {
      id: 7,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Red Velvet Cream Cookie',
      description:
        'Soft red velvet cookies with a luscious cream cheese filling for a rich and tangy treat.',
      isFavorite: false,
      ingredients: [
        { title: 'Flour', quantity: 220, unit: 'g' },
        { title: 'Butter', quantity: 90, unit: 'g' },
        { title: 'Sugar', quantity: 100, unit: 'g' },
        { title: 'Cocoa Powder', quantity: 15, unit: 'g' },
        { title: 'Cream Cheese', quantity: 50, unit: 'g' },
      ],
      instructions: [
        {
          title: 'Prepare the Dough',
          subtasks: [
            'Cream butter and sugar until light.',
            'Add cocoa powder and red coloring.',
            'Fold in flour to form dough.',
          ],
        },
        {
          title: 'Add Filling',
          subtasks: [
            'Flatten dough balls and fill with cream cheese.',
            'Seal and shape into cookies.',
          ],
        },
        {
          title: 'Bake',
          subtasks: ['Bake at 170°C for 12–15 minutes.'],
        },
      ],
    },
    {
      id: 8,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Moist Banana Loaf',
      description:
        'Classic banana bread made from ripe bananas and a touch of butter for the perfect moist crumb.',
      isFavorite: false,
      ingredients: [
        { title: 'All-purpose Flour', quantity: 200, unit: 'g' },
        { title: 'Mashed Bananas', quantity: 3, unit: 'pc' },
        { title: 'Butter', quantity: 100, unit: 'g' },
        { title: 'Sugar', quantity: 120, unit: 'g' },
        { title: 'Eggs', quantity: 2, unit: 'pc' },
      ],
      instructions: [
        {
          title: 'Mix Wet Ingredients',
          subtasks: [
            'Mash bananas and mix with butter and sugar.',
            'Add eggs and stir until smooth.',
          ],
        },
        {
          title: 'Add Dry Ingredients',
          subtasks: ['Fold in flour gently until combined.'],
        },
        {
          title: 'Bake',
          subtasks: ['Pour into a greased loaf pan.', 'Bake at 175°C for 45 minutes.'],
        },
      ],
    },
    {
      id: 9,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Oreo Crunch Brownie',
      description:
        'A chewy brownie base topped with crushed Oreos and drizzled with white chocolate.',
      isFavorite: false,
      ingredients: [
        { title: 'Dark Chocolate', quantity: 100, unit: 'g' },
        { title: 'Butter', quantity: 80, unit: 'g' },
        { title: 'Sugar', quantity: 120, unit: 'g' },
        { title: 'Oreo Cookies', quantity: 4, unit: 'pc' },
        { title: 'Flour', quantity: 70, unit: 'g' },
      ],
      instructions: [
        {
          title: 'Prepare Batter',
          subtasks: [
            'Melt chocolate and butter together.',
            'Whisk in sugar until smooth.',
            'Add flour and mix well.',
          ],
        },
        {
          title: 'Add Toppings',
          subtasks: ['Top with crushed Oreos and drizzle white chocolate.'],
        },
        {
          title: 'Bake',
          subtasks: ['Bake at 180°C for 25 minutes.'],
        },
      ],
    },
    {
      id: 10,
      imageUrl: '/classic-ham-roll.jpg',
      title: 'Strawberry Danish Delight',
      description:
        'Flaky pastry filled with vanilla custard and topped with fresh strawberries and glaze.',
      isFavorite: false,
      ingredients: [
        { title: 'Pastry Dough', quantity: 250, unit: 'g' },
        { title: 'Vanilla Custard', quantity: 80, unit: 'g' },
        { title: 'Strawberries', quantity: 4, unit: 'pc' },
        { title: 'Butter', quantity: 30, unit: 'g' },
        { title: 'Sugar Glaze', quantity: 20, unit: 'g' },
      ],
      instructions: [
        {
          title: 'Prepare the Pastry',
          subtasks: ['Roll out pastry dough and cut into squares.'],
        },
        {
          title: 'Assemble',
          subtasks: [
            'Add custard in the center.',
            'Top with sliced strawberries.',
            'Brush edges with butter and glaze.',
          ],
        },
        {
          title: 'Bake',
          subtasks: ['Bake at 190°C for 20 minutes until golden.'],
        },
      ],
    },
  ];

  const params = useParams();
  const id = Number(params.id); // convert to number for safety
  const item = data.find((d) => d.id === id); // safer than data[id - 1]

  const [tab, setTab] = useState<'ingredients' | 'instruction'>('ingredients');
  const [batchCount, setBatchCount] = useState(1);
  const [isFavorite, setIsFavorite] = useState(item?.isFavorite);

  const router = useRouter();

  if (!item) {
    return <p>Item not found</p>;
  }

  const handleTabs = (tabName: 'ingredients' | 'instruction') => {
    setTab(tabName);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    console.log(isFavorite);
  };

  return (
    <main>
      {/* IMAGE */}
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

        {/* Favorite Button */}
        <button
          className="absolute top-4 right-4 rounded-full bg-white p-2 active:scale-95"
          onClick={handleFavorite}
        >
          {isFavorite ? (
            <Heart className="fill-accent" color="white" />
          ) : (
            <Heart className="" color="black" />
          )}
        </button>
      </div>

      {/* CONTENT */}
      <div className="bg-bg-muted absolute top-[300px] left-0 min-h-[calc(100vh-300px)] w-full rounded-t-2xl px-4 py-6">
        <div className="flex flex-col gap-4">
          <div className="mt-2">
            <h1 className="text-xl">{item.title}</h1>
            <p className="text-text-secondary mt-2 text-sm font-light">{item.description}</p>

            <div className="text-text-secondary mt-4 flex gap-4 font-light">
              <div className="flex gap-2">
                <Clock3 /> <span>45 min</span>
              </div>
              <div className="flex gap-2">
                <Flame /> <span>12 pcs</span>
              </div>
            </div>
          </div>

          {/* SEPERATOR */}
          <div className="bg-border-base h-[2px]"></div>

          {/* BATCH COUNT */}
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

          {/* TABS */}
          <div className="border-border-base flex w-full gap-2 rounded-4xl border bg-white p-1">
            <button
              type="button"
              className={`${tab === 'ingredients' ? 'bg-accent text-white' : ''} flex w-1/2 justify-center gap-2 rounded-2xl py-1 transition-all duration-300`}
              onClick={() => handleTabs('ingredients')}
            >
              <List /> Ingredients
            </button>
            <button
              type="button"
              className={`${tab === 'instruction' ? 'bg-accent text-white' : ''} flex w-1/2 justify-center gap-2 rounded-2xl py-1 transition-all duration-300`}
              onClick={() => handleTabs('instruction')}
            >
              <TrendingUp /> Instructions
            </button>
          </div>

          {/* INGREDIENTS */}
          {tab === 'ingredients' && (
            <div className="flex flex-col gap-2 rounded-2xl bg-white p-4">
              {item.ingredients.map((ingredient, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>{ingredient.title}</div>
                  <div className="text-text-secondary font-light">
                    {ingredient.quantity * batchCount} {ingredient.unit}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* INSTRUCTION */}
          {tab === 'instruction' && (
            <div className="flex flex-col gap-6 rounded-2xl bg-white p-4">
              {item.instructions.map((instruction, idx) => (
                <div key={idx} className="relative grid grid-cols-12 gap-4">
                  {/* Number with vertical line */}
                  <div className="relative col-span-1 flex justify-center">
                    <div className="relative flex flex-col items-center">
                      {/* Number */}
                      <div className="bg-accent z-10 flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium text-white">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </div>

                      {/* Vertical line (hidden for last item) */}
                      {idx !== item.instructions.length - 1 && (
                        <div className="bg-accent absolute top-6 h-full w-[2px]"></div>
                      )}
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="col-span-11">
                    <div className="font-semibold">{instruction.title}</div>
                    <ul className="text-text-secondary list-disc pl-6 font-light">
                      {instruction.subtasks.map((subtask, subIdx) => (
                        <li key={subIdx}>{subtask}</li>
                      ))}
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
