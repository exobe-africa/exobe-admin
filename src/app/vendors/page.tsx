"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import VendorsFilters from '../../components/vendors/VendorsFilters';
import VendorsStats from '../../components/vendors/VendorsStats';
import VendorsTable from '../../components/vendors/VendorsTable';
import VendorsListSkeleton from '../../components/skeletons/VendorsListSkeleton';
import { useVendorsStore } from '../../store/vendors';
import { Store, Search, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';

export default function VendorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // If navigated from Users with a userId param, try to route to that vendor's detail page
  const userIdParam = searchParams?.get('userId');
  const targetVendor = useMemo(() => (
    userIdParam ? vendors.find(v => (v as any).owner_user_id === userIdParam || (v as any).account_manager_user_id === userIdParam) : null
  ), [vendors, userIdParam]);

  useEffect(() => {
    if (userIdParam && targetVendor) {
      router.push(`/vendors/${targetVendor.id}`);
    }
  }, [userIdParam, targetVendor, router]);

  // handlers kept in page

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
        <VendorsFilters filters={filters} onChange={setFilters} />

        {/* Stats */}
        <VendorsStats stats={stats} />

        {/* Vendors Table */}
        <VendorsTable
          vendors={filteredVendors as any}
          onView={handleViewVendor}
          onApprove={handleApproveVendor}
          onReject={handleRejectVendor}
          onSuspend={handleSuspendVendor}
          onDelete={handleDeleteVendor}
          onRowClick={(vendor) => router.push(`/vendors/${vendor.id}`)}
        />

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
