export function Footer() {
  return (
    <div className="flex items-end justify-end border-t border-gray-200 bg-white px-4 py-2">
      <div className="flex items-end gap-2">
        <button className="rounded-md border border-gray-300 px-4 py-2 text-sm">Run Tests</button>
        <button className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white">Submit Code</button>
      </div>
    </div>
  );
}
