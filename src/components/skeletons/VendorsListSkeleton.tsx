"use client";

import Skeleton from "../common/Skeleton";

export default function VendorsListSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton width="300px" height="36px" />
        <div className="mt-2">
          <Skeleton width="400px" height="20px" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Skeleton width="100%" height="44px" />
          </div>
          <Skeleton width="100%" height="44px" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <Skeleton width="120px" height="16px" />
            <div className="mt-2">
              <Skeleton width="60px" height="32px" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <th key={i} className="px-6 py-3 text-left">
                    <Skeleton width="80px" height="16px" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                    <td key={col} className="px-6 py-4">
                      <Skeleton width="100px" height="16px" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

