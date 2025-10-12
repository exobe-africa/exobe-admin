"use client";

export default function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-pulse">
      <div className="h-4 w-28 bg-gray-200 rounded mb-3" />
      <div className="h-7 w-10 bg-gray-200 rounded" />
    </div>
  );
}
