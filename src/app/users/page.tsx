"use client";

import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import { UserPlus } from 'lucide-react';
import { getApolloClient } from '../../lib/apollo/client';
import { ADMIN_USERS_QUERY } from '../../lib/api/users';
import {
  SELLER_APPLICATIONS_QUERY,
  APPROVE_SELLER_APPLICATION,
  REJECT_SELLER_APPLICATION,
  UPDATE_SELLER_APPLICATION
} from '../../lib/api/applications';
import { useToast } from '../../context/ToastContext';
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
  const [activeTab, setActiveTab] = useState<'users' | 'applications'>('users');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<Role | ''>('');
  const [filterStatus, setFilterStatus] = useState<'Active' | 'Inactive' | ''>('');
  const [applicationFilterStatus, setApplicationFilterStatus] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditingApplication, setIsEditingApplication] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [editedApplication, setEditedApplication] = useState<any>(null);
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState<{ name: string; email: string; phone: string; role: Role }>({
    name: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
  });

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
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, name: formData.name, email: formData.email, phone: formData.phone, role: formData.role } : u));
    } else {
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

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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

  const fetchApplications = async () => {
    const client = getApolloClient();
    const query = SELLER_APPLICATIONS_QUERY;

    try {
      const { data } = await client.query({
        query,
        variables: {
          status: applicationFilterStatus || undefined,
          take: 50,
          skip: 0,
        },
        fetchPolicy: 'network-only',
      });

      setApplications(data?.sellerApplications || []);
    } catch (error) {
      showError('Failed to load applications');
      console.error('Error fetching applications:', error);
    }
  };

  const handleApproveApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to approve this application? This will create a vendor account.')) {
      return;
    }

    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: APPROVE_SELLER_APPLICATION,
        variables: { applicationId },
      });

      showSuccess('Application approved successfully!');
      fetchApplications();
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
      const client = getApolloClient();
      await client.mutate({
        mutation: REJECT_SELLER_APPLICATION,
        variables: { applicationId },
      });

      showSuccess('Application rejected successfully!');
      fetchApplications();
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
      const client = getApolloClient();
      await client.mutate({
        mutation: UPDATE_SELLER_APPLICATION,
        variables: {
          applicationId: selectedApplication.id,
          data: {
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
          },
        },
      });

      showSuccess('Application updated successfully!');
      setIsEditingApplication(false);
      fetchApplications();
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

  useEffect(() => {
    if (activeTab === 'users') {
      const t = setTimeout(fetchUsers, 250);
      return () => clearTimeout(t);
    } else {
      fetchApplications();
    }
  }, [activeTab, searchQuery, filterRole, filterStatus, applicationFilterStatus]);

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
            searchQuery={searchQuery}
            filterRole={filterRole}
            filterStatus={filterStatus}
            onSearchChange={setSearchQuery}
            onRoleChange={setFilterRole}
            onStatusChange={setFilterStatus}
          />
        ) : (
          <ApplicationsFilters
            searchQuery={searchQuery}
            filterStatus={applicationFilterStatus}
            onSearchChange={setSearchQuery}
            onStatusChange={setApplicationFilterStatus}
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
            searchQuery={searchQuery}
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
