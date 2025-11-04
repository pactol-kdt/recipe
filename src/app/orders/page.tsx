// 'use client';

// import { Heart, Plus } from 'lucide-react';
// import Image from 'next/image';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import Header from '~/components/Header';
// import HeartLoader from '~/components/Loader';
// import { paths } from '~/meta';
// import { Recipe } from '~/types/recipe';

// export default function OrdersPage() {
//   const router = useRouter();

//   const [recipes, setRecipes] = useState<Recipe[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRecipes = async () => {
//       try {
//         const res = await fetch('/api/recipes'); // GET route
//         const data = await res.json();
//         setRecipes(data);
//       } catch (error) {
//         console.error('Error fetching recipes:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecipes();
//   }, []);

//   if (loading) return <HeartLoader />;

//   const favorites = recipes.filter((item) => item.is_favorite);

//   return (
//     <main className="bg-bg-muted flex min-h-screen w-full flex-col items-center">
//       {/* Header */}
//       <Header
//         title="Orders"
//         menuButtons={[
//           {
//             icon: <Plus />,
//             label: 'Create Order',
//             fn: () => router.push(`${paths.ORDER}${paths.ADD}`),
//           },
//         ]}
//         backButton={false}
//       />

//       {/* Content */}
//       <section className="flex min-h-[calc(874px-74px)] max-w-6xl flex-col items-center gap-8 p-4">
//         {/* All */}
//         <div>
//           <h2 className="mb-4 text-xl font-medium">All</h2>
//           <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
//             {recipes.length ? (
//               recipes.map((item) => (
//                 <button
//                   key={item.id}
//                   type="button"
//                   className="relative h-[220px] w-[177px]"
//                   onClick={() => router.push(`/recipes/${item.id}`)}
//                 >
//                   {/* Image */}
//                   <Image
//                     alt="Classic Ham Roll Cheese Bread"
//                     src="/classic-ham-roll.jpg"
//                     fill
//                     className="rounded-lg object-cover"
//                   />

//                   {/* Favorite Button */}
//                   <div className="absolute top-2 right-2">
//                     {item.is_favorite ? (
//                       <Heart className="fill-accent" color="white" />
//                     ) : (
//                       <Heart className="fill-text-secondary" color="white" />
//                     )}
//                   </div>

//                   {/* Gradient BG */}
//                   <div className="absolute inset-0 rounded-lg bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]"></div>

//                   {/* Text */}
//                   <div className="absolute bottom-3 w-full p-2 text-center text-sm text-white">
//                     {item.name}
//                   </div>
//                 </button>
//               ))
//             ) : (
//               <p className="text-text-secondary">
//                 No tasty creations here yet. Add your first recipe!
//               </p>
//             )}
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
