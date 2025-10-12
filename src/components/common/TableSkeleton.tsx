"use client";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 8, columns = 6 }: TableSkeletonProps) {
  const headerCells = Array.from({ length: columns });
  const bodyRows = Array.from({ length: rows });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
        {headerCells.map((_, idx) => (
          <div key={idx} className="col-span-2 h-4 bg-gray-200 rounded" />
        ))}
      </div>
      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {bodyRows.map((_, rIdx) => (
          <div key={rIdx} className="grid grid-cols-12 gap-4 px-6 py-4">
            {headerCells.map((__, cIdx) => (
              <div key={cIdx} className="col-span-2 h-3.5 bg-gray-200 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
