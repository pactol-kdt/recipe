export default function StickyHeaderAndColumnTable() {
  return (
    <div className="max-h-[400px] w-[200px] overflow-auto rounded-md border border-gray-200">
      <table className="w-full min-w-[600px] border-collapse">
        <thead className="sticky top-0 z-20 bg-white shadow-sm">
          <tr className="text-left text-gray-700">
            <th className="sticky left-0 z-30 border-b bg-white px-4 py-2 shadow-sm">Name</th>
            <th className="border-b px-4 py-2">Quantity</th>
            <th className="border-b px-4 py-2">Unit</th>
            <th className="border-b px-4 py-2">Minimum Required</th>
            <th className="border-b px-4 py-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 30 }).map((_, i) => (
            <tr key={i} className="transition-colors odd:bg-gray-50 hover:bg-gray-100">
              <td className="sticky left-0 z-10 border-b bg-white px-4 py-2 font-medium">
                Item {i + 1}
              </td>
              <td className="border-b px-4 py-2">{Math.floor(Math.random() * 100)}</td>
              <td className="border-b px-4 py-2">kg</td>
              <td className="border-b px-4 py-2">{Math.floor(Math.random() * 20)}</td>
              <td className="cursor-pointer border-b px-4 py-2 text-right text-blue-600">Edit</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
