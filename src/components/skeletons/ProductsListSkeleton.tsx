'use client';

import Skeleton from '../common/Skeleton';

export default function ProductsListSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Skeleton width="300px" height="36px" />
        <div className="mt-2">
          <Skeleton width="400px" height="20px" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Skeleton width="100%" height="40px" />
          </div>
          <Skeleton width="100%" height="40px" />
          <Skeleton width="100%" height="40px" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <Skeleton width="80px" height="16px" />
            <div className="mt-2">
              <Skeleton width="60px" height="32px" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="border-b border-gray-100 bg-gray-50 p-4">
          <div className="grid grid-cols-9 gap-4">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} width="80px" height="16px" />
            ))}
          </div>
        </div>
        {/* Table Rows */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border-b border-gray-100 p-4">
            <div className="grid grid-cols-9 gap-4">
              {[...Array(9)].map((_, j) => (
                <Skeleton key={j} width="100%" height="20px" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

