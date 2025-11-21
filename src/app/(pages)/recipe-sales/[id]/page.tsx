'use client';
import { Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ErrorLabel from '~/components/ErrorLabel';
import Header from '~/components/Header';
import HeartLoader from '~/components/Loader';
import { paths } from '~/meta';
import { RecipeSales } from '~/types/recipe-sales';

const EditRecipeSalesPage = () => {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const [recipeSales, setRecipeSales] = useState<RecipeSales>({} as RecipeSales);

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    const fetchRecipeSales = async () => {
      try {
        const res = await fetch(`/api/recipe_sales/${id}`);
        const data = await res.json();
        setRecipeSales(data);

        console.log('Fetched recipe sales:', data);
      } catch (error) {
        console.error('Error fetching recipe sales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeSales();
  }, [id]);

  const handleChange = (field: keyof RecipeSales, value: RecipeSales[keyof RecipeSales]) => {
    setRecipeSales((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveRecipeIncome = async () => {
    setIsSubmit(true);
    console.log(recipeSales.date === '', recipeSales.quantity == 0, recipeSales.sold_count == 0);

    if (recipeSales.date === '' || (recipeSales.quantity == 0 && recipeSales.sold_count == 0)) {
      setErrorMessage(
        'Please fill in all fields and add at least one ingredient and instruction, and save.'
      );
      return;
    }

    try {
      const response = await fetch(`/api/recipe_sales/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: recipeSales.name,
          batch_made: recipeSales.batch_made,
          quantity: recipeSales.quantity,
          sold_count: recipeSales.sold_count,
          date: recipeSales.date,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log('Recipe saved successfully:', result);

      router.push(`${paths.RECIPE_SALES}`);
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  if (loading) return <HeartLoader />;

  return (
    <main className="bg-bg-muted flex min-h-screen w-full flex-col items-center">
      {/* Header */}
      <Header title={`Edit Order #${id}`} menuButtons={[]} backButton={true} />

      {/* Content */}
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
                placeholder="Classic Ham Roll Cheese Bread"
                className={`border-border-base bg-bg-muted rounded-lg border p-2 text-sm font-light capitalize`}
                value={recipeSales.name || ''}
                disabled
              />
            </div>

            {/* Batch Made */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name">Batch Made</label>
              <input
                type="number"
                name="batch-made"
                id="batch-made"
                placeholder='e.g. "3"'
                className={`border-border-base bg-bg-muted rounded-lg border p-2 text-sm font-light`}
                value={recipeSales.batch_made || ''}
                disabled
              />
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                name="quantity"
                id="quantity"
                placeholder='e.g. "25"'
                className={`border-border-base rounded-lg border bg-white p-2 text-sm font-light`}
                onChange={(e) => handleChange('quantity', (e.target as HTMLInputElement).value)}
                value={recipeSales.quantity ?? ''}
              />
            </div>

            {/* Sold Count */}
            <div className="flex flex-col gap-1">
              <label htmlFor="sold-count">Sold Count</label>
              <input
                type="number"
                name="sold-count"
                id="sold-count"
                placeholder='e.g. "25"'
                className={`border-border-base rounded-lg border bg-white p-2 text-sm font-light`}
                onChange={(e) => handleChange('sold_count', (e.target as HTMLInputElement).value)}
                value={recipeSales.sold_count ?? ''}
              />
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                name="date"
                id="date"
                className={`${isSubmit && !recipeSales.date ? 'border-2 border-red-500' : 'border-border-base border'} rounded-lg bg-white p-2 text-sm font-light`}
                onChange={(e) => handleChange('date', e.target.value)}
                value={recipeSales.date ? recipeSales.date.split('T')[0] : ''}
              />

              {/* Error message */}
              <ErrorLabel
                message="Date is required."
                isSubmit={isSubmit}
                dataLength={recipeSales.date!.length}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex w-full flex-col justify-between gap-4">
          <button
            type="button"
            className="bg-accent flex items-center justify-center gap-2 rounded-2xl p-2 font-bold text-white active:scale-95"
            onClick={saveRecipeIncome}
          >
            <Save />
            Save Recipe Sales
          </button>
          <span className="text-light text-center text-red-400">{errorMessage}</span>
        </div>
      </section>
    </main>
  );
};

export default EditRecipeSalesPage;
