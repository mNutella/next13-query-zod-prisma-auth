export default function Loading() {
  return (
    <div
      role="status"
      className="max-w-md p-4 space-y-4 rounded animate-pulse md:p-6"
    >
      <div className="flex items-center justify-between">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-400 w-24 mb-2.5"></div>
      </div>
    </div>
  );
}
