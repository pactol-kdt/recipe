import { useState } from 'react';
import { Pencil, Trash2, Check, Plus } from 'lucide-react';

interface InstructionItem {
  id: number;
  title: string;
  description: string;
}

const InstructionSection = ({ instructions }: { instructions: InstructionItem[] }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState(instructions);

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    setItems((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        title: '',
        description: '',
      },
    ]);
  };

  return (
    <div className="rounded-2xl bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">INSTRUCTION</h2>

        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 active:scale-95"
        >
          {isEditing ? (
            <>
              <Check size={16} /> Done
            </>
          ) : (
            <>
              <Pencil size={16} /> Edit
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item.id} className="relative flex flex-col gap-3 py-5 first:pt-0 last:pb-0">
            {/* Step Title Row */}
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                {item.id}
              </span>

              <input
                type="text"
                defaultValue={item.title}
                readOnly={!isEditing}
                placeholder='e.g. "Prepare dry ingredients"'
                className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none ${
                  isEditing
                    ? 'border-gray-300 bg-white focus:border-gray-400'
                    : 'border-transparent bg-transparent'
                }`}
              />
            </div>

            {/* Step Description */}
            <textarea
              defaultValue={item.description}
              readOnly={!isEditing}
              rows={3}
              placeholder='e.g. "Mix the dry ingredients in a large bowl."'
              className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none ${
                isEditing
                  ? 'border-gray-300 bg-gray-50 focus:border-gray-400 focus:bg-white'
                  : 'border-transparent bg-transparent'
              }`}
            />

            {/* Delete Button (only when editing) */}
            {isEditing && (
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="flex items-center justify-center gap-4 rounded-sm border border-red-500 p-2 text-red-500"
              >
                <Trash2 size={18} /> Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <button
          type="button"
          onClick={handleAdd}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 py-2 text-sm text-gray-600 active:scale-95"
        >
          <Plus size={16} /> Add Step
        </button>
      )}
    </div>
  );
};

export default InstructionSection;
