"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import VendorsListSkeleton from '../../components/skeletons/VendorsListSkeleton';
import { useVendorsStore } from '../../store/vendors';
import { Store, Search, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';

export default function VendorsPage() {
  const router = useRouter();
  const {
    vendors,
    stats,
    filters,
    isLoading,
    setFilters,
    fetchVendors,
    fetchStats,
  } = useVendorsStore();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  useEffect(() => {
    fetchVendors();
    fetchStats();
  }, [fetchVendors, fetchStats]);

  const columns = [
    { key: 'name', label: 'Vendor Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'products', label: 'Products', sortable: true },
    {
      key: 'status',
      label: 'STATUS',
      render: (vendor: any) => (
        <Badge variant={
          vendor.status === 'ACTIVE' ? 'success' :
          vendor.status === 'PENDING' ? 'warning' :
          'danger'
        }>
          {vendor.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (vendor: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewVendor(vendor)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          {vendor.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleApproveVendor(vendor.id)}
                className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                title="Approve"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={() => handleRejectVendor(vendor.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Reject"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
          {vendor.status === 'ACTIVE' && (
            <button
              onClick={() => handleSuspendVendor(vendor.id)}
              className="p-2 rounded-lg hover:bg-orange-50 text-orange-600 transition-colors"
              title="Suspend"
            >
              <XCircle size={16} />
            </button>
          )}
          <button
            onClick={() => handleDeleteVendor(vendor.id)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleViewVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setIsViewModalOpen(true);
  };

  const handleApproveVendor = (vendorId: string) => {
    // TODO: Implement approve mutation
    console.log('Approve vendor:', vendorId);
  };

  const handleRejectVendor = (vendorId: string) => {
    if (confirm('Are you sure you want to reject this vendor application?')) {
      // TODO: Implement reject mutation
      console.log('Reject vendor:', vendorId);
    }
  };

  const handleSuspendVendor = (vendorId: string) => {
    if (confirm('Are you sure you want to suspend this vendor?')) {
      // TODO: Implement suspend mutation
      console.log('Suspend vendor:', vendorId);
    }
  };

  const handleDeleteVendor = (vendorId: string) => {
    if (confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      // TODO: Implement delete mutation
      console.log('Delete vendor:', vendorId);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchesStatus = !filters.status || vendor.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <VendorsListSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
          <p className="text-gray-600">Manage all vendors, approve applications, and monitor performance</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by vendor name or email..."
                value={filters.searchQuery}
                onChange={(value) => setFilters({ searchQuery: value })}
                icon={Search}
                fullWidth
              />
            </div>
            <Select
              placeholder="Filter by status"
              value={filters.status}
              onChange={(value) => setFilters({ status: value })}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'SUSPENDED', label: 'Suspended' },
              ]}
              fullWidth
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Vendors</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Active Vendors</p>
            <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
            <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-blue-600">{stats?.totalProducts || 0}</p>
          </div>
        </div>

        {/* Vendors Table */}
        <DataTable
          columns={columns}
          data={filteredVendors}
          keyExtractor={(vendor) => vendor.id}
          emptyMessage="No vendors found"
          onRowClick={(vendor) => router.push(`/vendors/${vendor.id}`)}
        />

        {/* View Vendor Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedVendor(null);
          }}
          title="Vendor Details"
          size="lg"
        >
          {selectedVendor && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#C8102E] flex items-center justify-center text-white text-3xl font-bold">
                  <Store size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedVendor.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={
                      selectedVendor.status === 'ACTIVE' ? 'success' :
                      selectedVendor.status === 'PENDING' ? 'warning' :
                      'danger'
                    }>
                      {selectedVendor.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{selectedVendor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium text-gray-900">{selectedVendor.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="font-medium text-gray-900">{selectedVendor.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Products</p>
                  <p className="font-medium text-gray-900">{selectedVendor.products}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Quick Actions</h4>
                <div className="flex gap-2">
                  {selectedVendor.status === 'PENDING' && (
                    <>
                      <Button icon={CheckCircle} onClick={() => {
                        handleApproveVendor(selectedVendor.id);
                        setIsViewModalOpen(false);
                      }}>
                        Approve
                      </Button>
                      <Button variant="danger" icon={XCircle} onClick={() => {
                        handleRejectVendor(selectedVendor.id);
                        setIsViewModalOpen(false);
                      }}>
                        Reject
                      </Button>
                    </>
                  )}
                  {selectedVendor.status === 'ACTIVE' && (
                    <Button variant="secondary" icon={XCircle} onClick={() => {
                      handleSuspendVendor(selectedVendor.id);
                      setIsViewModalOpen(false);
                    }}>
                      Suspend
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
