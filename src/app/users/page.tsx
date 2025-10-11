"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import { UserPlus, Mail, Phone, Calendar, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import { getApolloClient } from '../../lib/apollo/client';
import { ADMIN_USERS_QUERY } from '../../lib/api/users';

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

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<Role | ''>('');
  const [filterStatus, setFilterStatus] = useState<'Active' | 'Inactive' | ''>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState<{ name: string; email: string; phone: string; role: Role }>({
    name: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
  });

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    {
      key: 'role',
      label: 'Role',
      render: (user: UserRow) => (
        <Badge variant={user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'info' : 'neutral'}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (user: UserRow) => (
        <Badge variant={user.is_active ? 'success' : 'warning'}>
          {user.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    { key: 'created_at', label: 'Joined', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (user: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewUser(user)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => handleEditUser(user)}
            className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role as Role,
    });
    setSelectedUser(user);
    setIsAddModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleSubmit = () => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, name: formData.name, email: formData.email, phone: formData.phone, role: formData.role } : u));
    } else {
      // Add new user
      const newUser: UserRow = {
        id: String(users.length + 1),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
    }
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', phone: '', role: 'CUSTOMER' });
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || (filterStatus === 'Active' ? user.is_active : !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const fetchUsers = async () => {
    const client = getApolloClient();
    const { data } = await client.query({
      query: ADMIN_USERS_QUERY,
      variables: {
        query: searchQuery || null,
        role: filterRole || null,
        status: filterStatus === '' ? null : filterStatus === 'Active',
      },
      fetchPolicy: 'network-only',
    });
    setUsers(data?.searchUsers ?? []);
  };

  useEffect(() => {
    // Debounce search slightly for better UX
    const t = setTimeout(fetchUsers, 250);
    return () => clearTimeout(t);
  }, [searchQuery, filterRole, filterStatus]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage all platform users and their permissions</p>
          </div>
          <Button icon={UserPlus} onClick={() => setIsAddModalOpen(true)}>
            Add User
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={setSearchQuery}
                icon={Search}
                fullWidth
              />
            </div>
            <Select
              placeholder="Filter by role"
              value={filterRole}
              onChange={(v) => setFilterRole(v as Role | '')}
              options={[
                { value: '', label: 'All Roles' },
                { value: 'ADMIN', label: 'ADMIN' },
                { value: 'SUPER_ADMIN', label: 'SUPER_ADMIN' },
                { value: 'CUSTOMER', label: 'CUSTOMER' },
                { value: 'RETAILER', label: 'RETAILER' },
                { value: 'WHOLESALER', label: 'WHOLESALER' },
                { value: 'SERVICE_PROVIDER', label: 'SERVICE_PROVIDER' },
              ]}
              fullWidth
            />
            <Select
              placeholder="Filter by status"
              value={filterStatus}
              onChange={(v) => setFilterStatus(v as 'Active' | 'Inactive' | '')}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
              fullWidth
            />
          </div>
        </div>

        {/* Stats */}
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

        {/* Users Table */}
        <DataTable
          columns={columns}
          data={filteredUsers}
          keyExtractor={(user) => user.id}
          emptyMessage="No users found"
        />

        {/* Add/Edit User Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setFormData({ name: '', email: '', phone: '', role: 'CUSTOMER' });
            setSelectedUser(null);
          }}
          title={selectedUser ? 'Edit User' : 'Add New User'}
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {selectedUser ? 'Update User' : 'Add User'}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter full name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              required
              fullWidth
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              icon={Mail}
              required
              fullWidth
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              icon={Phone}
              required
              fullWidth
            />
            <Select
              label="Role"
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value as Role })}
              options={[
                { value: 'CUSTOMER', label: 'CUSTOMER' },
                { value: 'RETAILER', label: 'RETAILER' },
                { value: 'WHOLESALER', label: 'WHOLESALER' },
                { value: 'SERVICE_PROVIDER', label: 'SERVICE_PROVIDER' },
                { value: 'ADMIN', label: 'ADMIN' },
                { value: 'SUPER_ADMIN', label: 'SUPER_ADMIN' },
              ]}
              required
              fullWidth
            />
          </div>
        </Modal>

        {/* View User Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedUser(null);
          }}
          title="User Details"
          size="lg"
        >
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-3xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={selectedUser.role === 'Vendor' ? 'info' : 'neutral'}>
                      {selectedUser.role}
                    </Badge>
                    <Badge variant={selectedUser.status === 'Active' ? 'success' : 'warning'}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Join Date</p>
                  <p className="font-medium text-gray-900">{selectedUser.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                  <p className="font-medium text-gray-900">{selectedUser.orders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="font-medium text-gray-900">{selectedUser.spent}</p>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}

