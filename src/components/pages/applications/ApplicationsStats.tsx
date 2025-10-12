"use client";

interface ApplicationsStatsProps {
  applications: any[];
  isLoading?: boolean;
}

import StatCardSkeleton from '../../common/StatCardSkeleton';

export default function ApplicationsStats({ applications, isLoading = false }: ApplicationsStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'PENDING').length,
    approved: applications.filter(app => app.status === 'APPROVED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Total Applications</p>
        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Pending</p>
        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Approved</p>
        <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Rejected</p>
        <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
      </div>
    </div>
  );
}

