"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import { UserPlus } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useUsersStore, Role, UserRow } from '../../../store/users';
import {
  UsersList,
  UsersStats,
  UsersFilters,
  AddEditUserModal,
  ViewUserModal,
  ResetPasswordModal,
} from '../../../components/pages/users';
import TableSkeleton from '../../../components/common/TableSkeleton';
import { getApolloClient } from '../../../lib/apollo/client';
import { ADMIN_RESET_USER_PASSWORD } from '../../../lib/api/users';

export default function StaffPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { showSuccess, showError } = useToast();

  const {
    users,
    filters: userFilters,
    isLoading: usersLoading,
    setFilters: setUserFilters,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    clearError: clearUsersError,
  } = useUsersStore();

  const [formData, setFormData] = useState<{ name: string; email: string; phone: string; role: Role }>({
    name: '',
    email: '',
    phone: '',
    role: 'ADMIN',
  });

  useEffect(() => {
    setUserFilters({ role: '' }); // Will filter on frontend to show ADMIN and SUPER_ADMIN
    fetchUsers().catch(err => {
      showError('Failed to load staff');
      console.error('Error fetching staff:', err);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers().catch(err => {
        console.error('Error fetching staff:', err);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [userFilters.searchQuery, userFilters.role, userFilters.status]);

  useEffect(() => {
    return () => {
      clearUsersError();
    };
  }, []);

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setFormData({
      name: user.name || '',
      email: user.email,
      phone: user.phone || '',
      role: user.role as Role,
    });
    setSelectedUser(user);
    setIsAddModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      deleteUser(userId);
      showSuccess('Staff member deleted successfully');
    }
  };

  const handleResetPassword = (user: UserRow) => {
    if (user.role === 'SUPER_ADMIN') {
      showError('Cannot reset password for SUPER_ADMIN users');
      return;
    }
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleResetPasswordSubmit = async (userId: string, newPassword: string, sendEmail: boolean) => {
    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: ADMIN_RESET_USER_PASSWORD,
        variables: {
          userId,
          newPassword,
          sendEmail,
        },
      });
      
      showSuccess(`Password reset successful${sendEmail ? ' - Email sent to user' : ''}`);
      setIsResetPasswordModalOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  };

  const handleSubmit = () => {
    if (selectedUser) {
      updateUser(selectedUser.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      });
      showSuccess('Staff member updated successfully');
    } else {
      const newUser: UserRow = {
        id: String(Date.now()),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      addUser(newUser);
      showSuccess('Staff member added successfully');
    }
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', phone: '', role: 'ADMIN' });
    setSelectedUser(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Filter to only show admin roles (ADMIN, SUPER_ADMIN)
  const staffUsers = users.filter(user => 
    user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
  );

  const filteredUsers = staffUsers.filter(user => {
    if (!userFilters.searchQuery) return true;
    const query = userFilters.searchQuery.toLowerCase();
    return (
      (user.name || '').toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff & Administrators</h1>
            <p className="text-gray-600">Manage platform administrators and staff members</p>
          </div>
          <Button icon={UserPlus} onClick={() => setIsAddModalOpen(true)}>
            Add Staff
          </Button>
        </div>

        <UsersFilters
          searchQuery={userFilters.searchQuery}
          filterRole={userFilters.role}
          filterStatus={userFilters.status}
          onSearchChange={(value) => setUserFilters({ searchQuery: value })}
          onRoleChange={(value) => setUserFilters({ role: value })}
          onStatusChange={(value) => setUserFilters({ status: value })}
        />

        <UsersStats users={staffUsers} isLoading={usersLoading} />

        {usersLoading ? (
          <TableSkeleton rows={8} columns={6} />
        ) : (
          <UsersList
            users={filteredUsers}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onResetPassword={handleResetPassword}
          />
        )}

        <AddEditUserModal
          isOpen={isAddModalOpen}
          isEditing={!!selectedUser}
          formData={formData}
          onClose={() => {
            setIsAddModalOpen(false);
            setFormData({ name: '', email: '', phone: '', role: 'ADMIN' });
            setSelectedUser(null);
          }}
          onSubmit={handleSubmit}
          onFormChange={handleFormChange}
        />

        {selectedUser && (
          <ViewUserModal
            isOpen={isViewModalOpen}
            user={selectedUser}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedUser(null);
            }}
          />
        )}

        <ResetPasswordModal
          isOpen={isResetPasswordModalOpen}
          user={selectedUser}
          onClose={() => {
            setIsResetPasswordModalOpen(false);
            setSelectedUser(null);
          }}
          onReset={handleResetPasswordSubmit}
        />
      </div>
    </DashboardLayout>
  );
}

