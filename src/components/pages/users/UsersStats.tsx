"use client";

type Role = 'ADMIN' | 'SUPER_ADMIN' | 'CUSTOMER' | 'RETAILER' | 'WHOLESALER' | 'SERVICE_PROVIDER';

type UserRow = {
  id: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  role: Role;
  is_active: boolean;
  created_at: string;
};

interface UsersStatsProps {
  users: UserRow[];
}

export default function UsersStats({ users }: UsersStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Total Users</p>
        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Active Users</p>
        <p className="text-2xl font-bold text-green-600">
          {users.filter(u => u.is_active).length}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Vendors</p>
        <p className="text-2xl font-bold text-blue-600">
          {users.filter(u => u.role === 'RETAILER' || u.role === 'WHOLESALER' || u.role === 'SERVICE_PROVIDER').length}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <p className="text-sm text-gray-600 mb-1">Customers</p>
        <p className="text-2xl font-bold text-purple-600">
          {users.filter(u => u.role === 'CUSTOMER').length}
        </p>
      </div>
    </div>
  );
}

