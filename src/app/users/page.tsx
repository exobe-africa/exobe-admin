"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import { UserPlus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useUsersStore, Role, UserRow } from '../../store/users';
import { useApplicationsStore } from '../../store/applications';
import {
  UsersList,
  ApplicationsList,
  UsersStats,
  ApplicationsStats,
  UsersFilters,
  ApplicationsFilters,
  AddEditUserModal,
  ViewUserModal,
  ApplicationDetailsModal,
} from '../../components/pages/users';

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'applications'>('users');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditingApplication, setIsEditingApplication] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [editedApplication, setEditedApplication] = useState<any>(null);
  const { showSuccess, showError } = useToast();

  // Users store
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

  // Applications store
  const {
    applications,
    filters: appFilters,
    isLoading: appsLoading,
    setFilters: setAppFilters,
    fetchApplications,
    approveApplication,
    rejectApplication,
    updateApplication,
    clearError: clearAppsError,
  } = useApplicationsStore();

  const [formData, setFormData] = useState<{ name: string; email: string; phone: string; role: Role }>({
    name: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
  });

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers().catch(err => {
        showError('Failed to load users');
        console.error('Error fetching users:', err);
      });
    } else {
      fetchApplications().catch(err => {
        showError('Failed to load applications');
        console.error('Error fetching applications:', err);
      });
    }
  }, [activeTab]);

  // Debounce search for users
  useEffect(() => {
    if (activeTab === 'users') {
      const timer = setTimeout(() => {
        fetchUsers().catch(err => {
          console.error('Error fetching users:', err);
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [userFilters.searchQuery, userFilters.role, userFilters.status, activeTab]);

  // Fetch applications when filters change
  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications().catch(err => {
        console.error('Error fetching applications:', err);
      });
    }
  }, [appFilters.status, activeTab]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      clearUsersError();
      clearAppsError();
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
    if (confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      showSuccess('User deleted successfully');
    }
  };

  const handleSubmit = () => {
    if (selectedUser) {
      // Update existing user
      updateUser(selectedUser.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      });
      showSuccess('User updated successfully');
    } else {
      // Add new user
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
      showSuccess('User added successfully');
    }
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', phone: '', role: 'CUSTOMER' });
    setSelectedUser(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const filteredUsers = users.filter(user => {
    if (!userFilters.searchQuery) return true;
    const query = userFilters.searchQuery.toLowerCase();
    return (
      (user.name || '').toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const handleApproveApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to approve this application? This will create a vendor account.')) {
      return;
    }

    try {
      await approveApplication(applicationId);
      showSuccess('Application approved successfully!');
    } catch (error) {
      showError('Failed to approve application');
      console.error('Error approving application:', error);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to reject this application?')) {
      return;
    }

    try {
      await rejectApplication(applicationId);
      showSuccess('Application rejected successfully!');
    } catch (error) {
      showError('Failed to reject application');
      console.error('Error rejecting application:', error);
    }
  };

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
    setEditedApplication({...application});
    setIsEditingApplication(false);
    setIsViewModalOpen(true);
  };

  const handleEditApplication = () => {
    setIsEditingApplication(true);
  };

  const handleCancelEditApplication = () => {
    setEditedApplication({...selectedApplication});
    setIsEditingApplication(false);
  };

  const handleApplicationFieldChange = (field: string, value: any) => {
    setEditedApplication({...editedApplication, [field]: value});
  };

  const handleSaveApplication = async () => {
    if (!editedApplication || !selectedApplication) return;

    try {
      await updateApplication(selectedApplication.id, {
        sellerRole: editedApplication.seller_role,
        businessType: editedApplication.business_type,
        applicantType: editedApplication.applicant_type,
        firstName: editedApplication.first_name,
        lastName: editedApplication.last_name,
        email: editedApplication.email,
        phone: editedApplication.phone,
        landline: editedApplication.landline || null,
        identificationType: editedApplication.identification_type,
        businessName: editedApplication.business_name,
        businessRegistration: editedApplication.business_registration || null,
        saIdNumber: editedApplication.sa_id_number || null,
        vatRegistered: editedApplication.vat_registered,
        vatNumber: editedApplication.vat_number || null,
        monthlyRevenue: editedApplication.monthly_revenue || null,
        physicalStores: editedApplication.physical_stores || null,
        numberOfStores: editedApplication.number_of_stores || null,
        supplierToRetailers: editedApplication.supplier_to_retailers || null,
        otherMarketplaces: editedApplication.other_marketplaces || null,
        address: editedApplication.address,
        city: editedApplication.city,
        province: editedApplication.province,
        postalCode: editedApplication.postal_code,
        uniqueProducts: editedApplication.unique_products || null,
        primaryCategory: editedApplication.primary_category,
        stockType: editedApplication.stock_type,
        productDescription: editedApplication.product_description,
        ownedBrands: editedApplication.owned_brands || null,
        resellerBrands: editedApplication.reseller_brands || null,
        website: editedApplication.website || null,
        socialMedia: editedApplication.social_media || null,
        businessSummary: editedApplication.business_summary,
        howDidYouHear: editedApplication.how_did_you_hear,
        agreeToTerms: editedApplication.agree_to_terms,
      });

      showSuccess('Application updated successfully!');
      setIsEditingApplication(false);
      setIsViewModalOpen(false);
    } catch (error) {
      showError('Failed to update application');
      console.error('Error updating application:', error);
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedUser(null);
    setSelectedApplication(null);
    setIsEditingApplication(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage all platform users and their permissions</p>
          </div>
          {activeTab === 'users' && (
            <Button icon={UserPlus} onClick={() => setIsAddModalOpen(true)}>
              Add User
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-1 border border-gray-100 inline-flex">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-[#C8102E] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'applications'
                ? 'bg-[#C8102E] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Applications
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'users' ? (
          <UsersFilters
            searchQuery={userFilters.searchQuery}
            filterRole={userFilters.role}
            filterStatus={userFilters.status}
            onSearchChange={(value) => setUserFilters({ searchQuery: value })}
            onRoleChange={(value) => setUserFilters({ role: value })}
            onStatusChange={(value) => setUserFilters({ status: value })}
          />
        ) : (
          <ApplicationsFilters
            searchQuery={appFilters.searchQuery}
            filterStatus={appFilters.status}
            onSearchChange={(value) => setAppFilters({ searchQuery: value })}
            onStatusChange={(value) => setAppFilters({ status: value })}
          />
        )}

        {/* Stats */}
        {activeTab === 'users' ? (
          <UsersStats users={users} />
        ) : (
          <ApplicationsStats applications={applications} />
        )}

        {/* Table */}
        {activeTab === 'users' ? (
          <UsersList
            users={filteredUsers}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        ) : (
          <ApplicationsList
            applications={applications}
            searchQuery={appFilters.searchQuery}
            onView={handleViewApplication}
            onApprove={handleApproveApplication}
            onReject={handleRejectApplication}
          />
        )}

        {/* Modals */}
        <AddEditUserModal
          isOpen={isAddModalOpen}
          isEditing={!!selectedUser}
          formData={formData}
          onClose={() => {
            setIsAddModalOpen(false);
            setFormData({ name: '', email: '', phone: '', role: 'CUSTOMER' });
            setSelectedUser(null);
          }}
          onSubmit={handleSubmit}
          onFormChange={handleFormChange}
        />

        {selectedUser && (
          <ViewUserModal
            isOpen={isViewModalOpen && !selectedApplication}
            user={selectedUser}
            onClose={handleCloseViewModal}
          />
        )}

        {selectedApplication && editedApplication && (
          <ApplicationDetailsModal
            isOpen={isViewModalOpen && !!selectedApplication}
            application={selectedApplication}
            editedApplication={editedApplication}
            isEditing={isEditingApplication}
            onClose={handleCloseViewModal}
            onEdit={handleEditApplication}
            onSave={handleSaveApplication}
            onCancel={handleCancelEditApplication}
            onApprove={handleApproveApplication}
            onReject={handleRejectApplication}
            onFieldChange={handleApplicationFieldChange}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
