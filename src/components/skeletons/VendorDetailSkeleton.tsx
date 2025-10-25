"use client";

import Skeleton from "../common/Skeleton";

export default function VendorDetailSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton width="40px" height="40px" />
          <div>
            <Skeleton width="250px" height="36px" />
            <div className="mt-2">
              <Skeleton width="200px" height="20px" />
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton width="120px" height="44px" />
          <Skeleton width="120px" height="44px" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <Skeleton width="120px" height="16px" />
            <div className="mt-2">
              <Skeleton width="60px" height="32px" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Skeleton width="180px" height="24px" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i}>
                  <Skeleton width="100px" height="14px" />
                  <div className="mt-1">
                    <Skeleton width="150px" height="20px" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Skeleton width="140px" height="24px" />
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex gap-4">
                    <Skeleton width="80px" height="80px" />
                    <div className="flex-1">
                      <Skeleton width="200px" height="20px" />
                      <div className="mt-2">
                        <Skeleton width="100px" height="16px" />
                      </div>
                      <div className="mt-2">
                        <Skeleton width="80px" height="16px" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Skeleton width="140px" height="24px" />
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton width="80px" height="14px" />
                  <div className="mt-1">
                    <Skeleton width="180px" height="20px" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Skeleton width="100px" height="24px" />
            <div className="mt-4 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} width="100%" height="16px" />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Skeleton width="140px" height="24px" />
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton width="100px" height="14px" />
                  <div className="mt-1">
                    <Skeleton width="140px" height="20px" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

