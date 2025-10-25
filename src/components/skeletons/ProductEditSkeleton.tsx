"use client";

import Skeleton from "../common/Skeleton";

export default function ProductEditSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton width="40px" height="40px" />
          <div>
            <Skeleton width="200px" height="32px" />
            <div className="mt-2">
              <Skeleton width="260px" height="16px" />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton width="96px" height="40px" />
          <Skeleton width="128px" height="40px" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Skeleton width="160px" height="20px" />
            <div className="mt-4 space-y-4">
              <Skeleton width="100%" height="44px" />
              <Skeleton width="100%" height="120px" />
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Skeleton width="120px" height="20px" />
            <div className="mt-4 grid grid-cols-3 gap-3">
              <Skeleton width="100%" height="120px" />
              <Skeleton width="100%" height="120px" />
              <Skeleton width="100%" height="120px" />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Skeleton width="90px" height="20px" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Skeleton width="100%" height="44px" />
              <Skeleton width="100%" height="44px" />
            </div>
          </div>

          {/* Extra sections */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <Skeleton width="120px" height="20px" />
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Skeleton width="100%" height="44px" />
                <Skeleton width="100%" height="44px" />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
              <Skeleton width="120px" height="20px" />
              <div className="mt-4 space-y-3">
                <Skeleton width="100%" height="44px" />
                <Skeleton width="100%" height="44px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


