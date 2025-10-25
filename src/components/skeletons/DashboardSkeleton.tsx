'use client';

import Skeleton from '../common/Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Skeleton width="300px" height="36px" />
        <div className="mt-2">
          <Skeleton width="400px" height="20px" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <Skeleton width="80px" height="16px" />
            <div className="mt-2">
              <Skeleton width="100px" height="32px" />
            </div>
            <div className="mt-2">
              <Skeleton width="60px" height="14px" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <Skeleton width="150px" height="24px" />
            <div className="mt-4">
              <Skeleton width="100%" height="256px" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton width="150px" height="28px" />
          <Skeleton width="80px" height="20px" />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-gray-100 bg-gray-50 p-4">
            <div className="grid grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} width="80px" height="16px" />
              ))}
            </div>
          </div>
          {/* Table Rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-gray-100 p-4">
              <div className="grid grid-cols-6 gap-4">
                {[...Array(6)].map((_, j) => (
                  <Skeleton key={j} width="100%" height="20px" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

