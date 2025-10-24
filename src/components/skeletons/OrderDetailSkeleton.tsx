"use client";

import Skeleton, { SkeletonCircle } from '../common/Skeleton';

export default function OrderDetailSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="p-6 space-y-6">
              {/* Vendor Group */}
              {[1, 2].map((group) => (
                <div key={group}>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                    <SkeletonCircle className="w-10 h-10" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  {/* Product Item */}
                  {[1].map((item) => (
                    <div key={item} className="flex gap-4 mb-4">
                      <Skeleton className="w-20 h-20 rounded-lg" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-5 w-20 mb-2 ml-auto" />
                        <Skeleton className="h-4 w-16 mb-2 ml-auto" />
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((event) => (
                  <div key={event} className="flex gap-4">
                    <SkeletonCircle className="w-10 h-10" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-6 w-20 mb-2 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((line) => (
                <div key={line} className="flex justify-between">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-28" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-lg mt-4" />
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((field) => (
                <div key={field}>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <Skeleton className="h-6 w-36" />
            </div>
            <div className="p-6 space-y-2">
              {[1, 2, 3, 4].map((line) => (
                <Skeleton key={line} className="h-5 w-full" />
              ))}
            </div>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="p-6 space-y-2">
              {[1, 2, 3, 4].map((line) => (
                <Skeleton key={line} className="h-5 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

