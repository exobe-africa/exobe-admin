"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useToast } from '../../context/ToastContext';
import { useApplicationsStore } from '../../store/applications';
import {
  ApplicationsList,
  ApplicationsStats,
  ApplicationsFilters,
  ApplicationDetailsModal,
} from '../../components/pages/applications';

type ApplicationType = 'seller' | 'service-provider';

export default function ApplicationsPage() {
  const [activeTab, setActiveTab] = useState<ApplicationType>('seller');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditingApplication, setIsEditingApplication] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [editedApplication, setEditedApplication] = useState<any>(null);
  const { showSuccess, showError } = useToast();

  const {
    applications,
    filters,
    isLoading,
    setFilters,
    fetchApplications,
    approveApplication,
    rejectApplication,
    updateApplication,
    clearError,
  } = useApplicationsStore();

  useEffect(() => {
    fetchApplications().catch(err => {
      showError('Failed to load applications');
      console.error('Error fetching applications:', err);
    });
  }, [activeTab, filters.status]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleApprove = async (applicationId: string) => {
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

  const handleReject = async (applicationId: string) => {
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

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedApplication(null);
    setIsEditingApplication(false);
  };

  const filteredApplications = applications.filter(app => {
    if (!filters.searchQuery) return true;
    const query = filters.searchQuery.toLowerCase();
    const businessOrService = activeTab === 'seller' ? app.business_name : (app as any).primary_service;
    return (
      (app.first_name + ' ' + app.last_name).toLowerCase().includes(query) ||
      app.email.toLowerCase().includes(query) ||
      (businessOrService || '').toLowerCase().includes(query)
    );
  });

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
        <ApplicationsFilters
          searchQuery={filters.searchQuery}
          filterStatus={filters.status}
          activeTab={activeTab}
          onSearchChange={(value) => setFilters({ searchQuery: value })}
          onStatusChange={(value) => setFilters({ status: value })}
        />

        {/* Stats */}
        <ApplicationsStats applications={applications} />

        {/* Applications Table */}
        <ApplicationsList
          applications={filteredApplications}
          activeTab={activeTab}
          onView={handleViewApplication}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {/* Application Details Modal */}
        <ApplicationDetailsModal
          isOpen={isViewModalOpen}
          activeTab={activeTab}
          selectedApplication={selectedApplication}
          editedApplication={editedApplication}
          isEditing={isEditingApplication}
          onClose={handleCloseModal}
          onEdit={handleEditApplication}
          onSave={handleSaveApplication}
          onCancel={handleCancelEditApplication}
          onApprove={handleApprove}
          onReject={handleReject}
          onFieldChange={handleApplicationFieldChange}
        />
      </div>
    </DashboardLayout>
  );
}
