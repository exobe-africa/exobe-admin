"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import { Search, Eye, CheckCircle, XCircle, Edit, Filter, Save } from 'lucide-react';
import { getApolloClient } from '../../lib/apollo/client';
import {
  SELLER_APPLICATIONS_QUERY,
  SERVICE_PROVIDER_APPLICATIONS_QUERY,
  APPROVE_SELLER_APPLICATION,
  REJECT_SELLER_APPLICATION,
  UPDATE_SELLER_APPLICATION
} from '../../lib/api/applications';
import { useToast } from '../../context/ToastContext';
import Accordion from '../../components/common/Accordion';

type ApplicationType = 'seller' | 'service-provider';

type SellerApplication = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  business_name: string;
  business_summary: string;
  status: string;
  created_at: string;
};

type ServiceProviderApplication = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  primary_service: string;
  status: string;
  created_at: string;
};

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<ApplicationType>('seller');
  const [applications, setApplications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditingApplication, setIsEditingApplication] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [editedApplication, setEditedApplication] = useState<any>(null);
  const { showSuccess, showError } = useToast();

  const fetchApplications = async () => {
    const client = getApolloClient();
    const query = activeTab === 'seller' ? SELLER_APPLICATIONS_QUERY : SERVICE_PROVIDER_APPLICATIONS_QUERY;

    try {
      const { data } = await client.query({
        query,
        variables: {
          status: filterStatus || undefined,
          take: 50,
          skip: 0,
        },
        fetchPolicy: 'network-only',
      });

      setApplications(data[activeTab === 'seller' ? 'sellerApplications' : 'serviceProviderApplications'] || []);
    } catch (error) {
      showError('Failed to load applications');
      console.error('Error fetching applications:', error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeTab, filterStatus]);

  const handleApprove = async (applicationId: string) => {
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

  const handleReject = async (applicationId: string) => {
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

  const getColumns = () => [
    { key: 'first_name', label: 'First Name', sortable: true },
    { key: 'last_name', label: 'Last Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true, cellClassName: 'max-w-[220px] truncate' },
    { key: 'phone', label: 'Phone', sortable: true },
    {
      key: activeTab === 'seller' ? 'business_name' : 'primary_service',
      label: activeTab === 'seller' ? 'Business' : 'Service',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (app: any) => (
        <Badge variant={
          app.status === 'APPROVED' ? 'success' :
          app.status === 'REJECTED' ? 'danger' :
          app.status === 'PENDING' ? 'warning' :
          'neutral'
        }>
          {app.status}
        </Badge>
      ),
    },
    { key: 'created_at', label: 'Applied', sortable: true, cellClassName: 'whitespace-nowrap' },
    {
      key: 'actions',
      label: 'Actions',
      render: (app: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewApplication(app)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          {app.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleApprove(app.id)}
                className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                title="Approve"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={() => handleReject(app.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Reject"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const filteredApplications = applications.filter(app => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (app.first_name + ' ' + app.last_name).toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query) ||
      (activeTab === 'seller' ? app.business_name : app.primary_service).toLowerCase().includes(query)
    );
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'PENDING').length,
    approved: applications.filter(app => app.status === 'APPROVED').length,
    rejected: applications.filter(app => app.status === 'REJECTED').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
          <p className="text-gray-600">Review and manage vendor applications</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-1 border border-gray-100 inline-flex">
          <button
            onClick={() => setActiveTab('seller')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'seller'
                ? 'bg-[#C8102E] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Seller Applications
          </button>
          <button
            onClick={() => setActiveTab('service-provider')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'service-provider'
                ? 'bg-[#C8102E] text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Service Provider Applications
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder={`Search ${activeTab === 'seller' ? 'sellers' : 'service providers'}...`}
                value={searchQuery}
                onChange={setSearchQuery}
                icon={Search}
                fullWidth
              />
            </div>
            <Select
              placeholder="Filter by status"
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'APPROVED', label: 'Approved' },
                { value: 'REJECTED', label: 'Rejected' },
              ]}
              fullWidth
            />
          </div>
        </div>

        {/* Stats */}
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

        {/* Applications Table */}
        <DataTable
          columns={getColumns()}
          data={filteredApplications}
          keyExtractor={(app) => app.id}
          emptyMessage={`No ${activeTab === 'seller' ? 'seller' : 'service provider'} applications found`}
        />

        {/* View/Edit Application Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedApplication(null);
            setIsEditingApplication(false);
          }}
          title="Application Details"
          size="2xl"
          footer={selectedApplication && activeTab === 'seller' && (
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-3">
                {selectedApplication.status === 'PENDING' && !isEditingApplication && (
                  <>
                    <Button
                      icon={CheckCircle}
                      onClick={() => {
                        handleApprove(selectedApplication.id);
                        setIsViewModalOpen(false);
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      icon={XCircle}
                      onClick={() => {
                        handleReject(selectedApplication.id);
                        setIsViewModalOpen(false);
                      }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                {isEditingApplication ? (
                  <>
                    <Button variant="ghost" onClick={handleCancelEditApplication}>
                      Cancel
                    </Button>
                    <Button icon={Save} onClick={handleSaveApplication}>
                      Save Changes
                    </Button>
                  </>
                ) : (
                  selectedApplication.status === 'PENDING' && (
                    <Button icon={Edit} onClick={handleEditApplication}>
                      Edit Application
                    </Button>
                  )
                )}
              </div>
            </div>
          )}
        >
          {selectedApplication && activeTab === 'seller' && editedApplication && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Header with Status */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {editedApplication.first_name} {editedApplication.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{editedApplication.email}</p>
                </div>
                <Badge variant={
                  selectedApplication.status === 'APPROVED' ? 'success' :
                  selectedApplication.status === 'REJECTED' ? 'danger' :
                  'warning'
                }>
                  {selectedApplication.status}
                </Badge>
              </div>

              {/* Personal Information */}
              <Accordion title="Personal Information" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={editedApplication.first_name || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, first_name: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Last Name"
                    value={editedApplication.last_name || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, last_name: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Email"
                    value={editedApplication.email || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, email: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Phone"
                    value={editedApplication.phone || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, phone: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Landline (Optional)"
                    value={editedApplication.landline || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, landline: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="ID Number"
                    value={editedApplication.sa_id_number || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, sa_id_number: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                </div>
              </Accordion>

              {/* Business Information */}
              <Accordion title="Business Information" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Seller Role"
                    value={editedApplication.seller_role || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, seller_role: v})}
                    options={[
                      { value: 'RETAILER', label: 'Retailer' },
                      { value: 'WHOLESALER', label: 'Wholesaler' },
                    ]}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Business Type"
                    value={editedApplication.business_type || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, business_type: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Business Name"
                    value={editedApplication.business_name || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, business_name: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Business Registration"
                    value={editedApplication.business_registration || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, business_registration: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Applicant Type"
                    value={editedApplication.applicant_type || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, applicant_type: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Identification Type"
                    value={editedApplication.identification_type || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, identification_type: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Summary
                  </label>
                  <textarea
                    value={editedApplication.business_summary || ''}
                    onChange={(e) => setEditedApplication({...editedApplication, business_summary: e.target.value})}
                    disabled={!isEditingApplication}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </Accordion>

              {/* VAT & Financial Information */}
              <Accordion title="VAT & Financial Information">
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="VAT Registered"
                    value={editedApplication.vat_registered || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, vat_registered: v})}
                    options={[
                      { value: 'YES', label: 'Yes' },
                      { value: 'NO', label: 'No' },
                    ]}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="VAT Number"
                    value={editedApplication.vat_number || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, vat_number: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Monthly Revenue"
                    value={editedApplication.monthly_revenue || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, monthly_revenue: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                </div>
              </Accordion>

              {/* Physical Stores */}
              <Accordion title="Physical Stores & Distribution">
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Physical Stores"
                    value={editedApplication.physical_stores || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, physical_stores: v})}
                    options={[
                      { value: 'YES', label: 'Yes' },
                      { value: 'NO', label: 'No' },
                    ]}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Number of Stores"
                    value={editedApplication.number_of_stores || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, number_of_stores: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Select
                    label="Supplier to Retailers"
                    value={editedApplication.supplier_to_retailers || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, supplier_to_retailers: v})}
                    options={[
                      { value: 'YES', label: 'Yes' },
                      { value: 'NO', label: 'No' },
                    ]}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Other Marketplaces"
                    value={editedApplication.other_marketplaces || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, other_marketplaces: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                </div>
              </Accordion>

              {/* Address Information */}
              <Accordion title="Address Information">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Input
                      label="Address"
                      value={editedApplication.address || ''}
                      onChange={(v) => setEditedApplication({...editedApplication, address: v})}
                      disabled={!isEditingApplication}
                      fullWidth
                    />
                  </div>
                  <Input
                    label="City"
                    value={editedApplication.city || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, city: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Province"
                    value={editedApplication.province || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, province: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Postal Code"
                    value={editedApplication.postal_code || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, postal_code: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                </div>
              </Accordion>

              {/* Products & Inventory */}
              <Accordion title="Products & Inventory">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Primary Category"
                    value={editedApplication.primary_category || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, primary_category: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Stock Type"
                    value={editedApplication.stock_type || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, stock_type: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Unique Products"
                    value={editedApplication.unique_products || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, unique_products: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Owned Brands"
                    value={editedApplication.owned_brands || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, owned_brands: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Reseller Brands"
                    value={editedApplication.reseller_brands || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, reseller_brands: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Description
                  </label>
                  <textarea
                    value={editedApplication.product_description || ''}
                    onChange={(e) => setEditedApplication({...editedApplication, product_description: e.target.value})}
                    disabled={!isEditingApplication}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C8102E] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </Accordion>

              {/* Online Presence */}
              <Accordion title="Online Presence">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Website"
                    value={editedApplication.website || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, website: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <Input
                    label="Social Media"
                    value={editedApplication.social_media || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, social_media: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                </div>
              </Accordion>

              {/* Additional Information */}
              <Accordion title="Additional Information">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="How Did You Hear About Us?"
                    value={editedApplication.how_did_you_hear || ''}
                    onChange={(v) => setEditedApplication({...editedApplication, how_did_you_hear: v})}
                    disabled={!isEditingApplication}
                    fullWidth
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editedApplication.agree_to_terms || false}
                      onChange={(e) => setEditedApplication({...editedApplication, agree_to_terms: e.target.checked})}
                      disabled={!isEditingApplication}
                      className="w-4 h-4 text-[#C8102E] border-gray-300 rounded focus:ring-[#C8102E]"
                    />
                    <label className="ml-2 text-sm text-gray-700">Agrees to Terms & Conditions</label>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <strong>Applied:</strong> {new Date(selectedApplication.created_at).toLocaleDateString()} at {new Date(selectedApplication.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </Accordion>
            </div>
          )}

          {/* Service Provider View (Simple) */}
          {selectedApplication && activeTab === 'service-provider' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">First Name</p>
                  <p className="font-medium text-gray-900">{selectedApplication.first_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Name</p>
                  <p className="font-medium text-gray-900">{selectedApplication.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{selectedApplication.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{selectedApplication.phone || 'Not provided'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Primary Service</p>
                  <p className="font-medium text-gray-900">{selectedApplication.primary_service}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge variant={
                    selectedApplication.status === 'APPROVED' ? 'success' :
                    selectedApplication.status === 'REJECTED' ? 'danger' :
                    'warning'
                  }>
                    {selectedApplication.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Applied</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedApplication.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedApplication.status === 'PENDING' && (
                <div className="border-t pt-4">
                  <h4 className="font-bold text-gray-900 mb-3">Actions</h4>
                  <div className="flex gap-3">
                    <Button
                      icon={CheckCircle}
                      onClick={() => {
                        handleApprove(selectedApplication.id);
                        setIsViewModalOpen(false);
                      }}
                    >
                      Approve Application
                    </Button>
                    <Button
                      variant="danger"
                      icon={XCircle}
                      onClick={() => {
                        handleReject(selectedApplication.id);
                        setIsViewModalOpen(false);
                      }}
                    >
                      Reject Application
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}

