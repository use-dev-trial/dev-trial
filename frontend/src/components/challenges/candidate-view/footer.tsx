export function Footer() {
  return (
    <div className="flex items-end justify-end border-t border-gray-200 px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-end gap-2">
        <button className="rounded-md border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
          Run Tests
        </button>
        <button className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
          Submit Code
        </button>
      </div>
    </div>
  );
}
