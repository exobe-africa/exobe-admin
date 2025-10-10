"use client";

import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import { Store, Mail, Phone, MapPin, Edit, Trash2, Eye, Search, CheckCircle, XCircle } from 'lucide-react';

// Mock data
const mockVendors = [
  { id: '1', name: 'Tech Solutions SA', email: 'info@techsolutions.co.za', phone: '+27 11 234 5678', location: 'Johannesburg', products: 145, revenue: 'R 1,234,567', status: 'Active', rating: 4.8, joinDate: '2024-06-15' },
  { id: '2', name: 'Fashion Hub', email: 'contact@fashionhub.co.za', phone: '+27 21 345 6789', location: 'Cape Town', products: 89, revenue: 'R 876,543', status: 'Active', rating: 4.6, joinDate: '2024-07-20' },
  { id: '3', name: 'Home & Living', email: 'hello@homeliving.co.za', phone: '+27 31 456 7890', location: 'Durban', products: 234, revenue: 'R 2,345,678', status: 'Active', rating: 4.9, joinDate: '2024-05-10' },
  { id: '4', name: 'Sports World', email: 'info@sportsworld.co.za', phone: '+27 12 567 8901', location: 'Pretoria', products: 67, revenue: 'R 567,890', status: 'Pending', rating: 4.3, joinDate: '2025-09-05' },
  { id: '5', name: 'Beauty Box', email: 'support@beautybox.co.za', phone: '+27 41 678 9012', location: 'Port Elizabeth', products: 123, revenue: 'R 987,654', status: 'Suspended', rating: 3.8, joinDate: '2024-08-12' },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState(mockVendors);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  const columns = [
    { key: 'name', label: 'Vendor Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'products', label: 'Products', sortable: true },
    { key: 'revenue', label: 'Revenue', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (vendor: any) => (
        <Badge variant={
          vendor.status === 'Active' ? 'success' :
          vendor.status === 'Pending' ? 'warning' :
          'danger'
        }>
          {vendor.status}
        </Badge>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (vendor: any) => (
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="font-medium">{vendor.rating}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (vendor: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewVendor(vendor)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          {vendor.status === 'Pending' && (
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
          {vendor.status === 'Active' && (
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
    setVendors(vendors.map(v => v.id === vendorId ? { ...v, status: 'Active' } : v));
  };

  const handleRejectVendor = (vendorId: string) => {
    if (confirm('Are you sure you want to reject this vendor application?')) {
      setVendors(vendors.filter(v => v.id !== vendorId));
    }
  };

  const handleSuspendVendor = (vendorId: string) => {
    if (confirm('Are you sure you want to suspend this vendor?')) {
      setVendors(vendors.map(v => v.id === vendorId ? { ...v, status: 'Suspended' } : v));
    }
  };

  const handleDeleteVendor = (vendorId: string) => {
    if (confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      setVendors(vendors.filter(v => v.id !== vendorId));
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || vendor.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
                { value: 'Active', label: 'Active' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Suspended', label: 'Suspended' },
              ]}
              fullWidth
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Vendors</p>
            <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Active Vendors</p>
            <p className="text-2xl font-bold text-green-600">
              {vendors.filter(v => v.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Pending Approval</p>
            <p className="text-2xl font-bold text-yellow-600">
              {vendors.filter(v => v.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-blue-600">
              {vendors.reduce((sum, v) => sum + v.products, 0)}
            </p>
          </div>
        </div>

        {/* Vendors Table */}
        <DataTable
          columns={columns}
          data={filteredVendors}
          keyExtractor={(vendor) => vendor.id}
          emptyMessage="No vendors found"
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
                      selectedVendor.status === 'Active' ? 'success' :
                      selectedVendor.status === 'Pending' ? 'warning' :
                      'danger'
                    }>
                      {selectedVendor.status}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-medium">{selectedVendor.rating}</span>
                    </div>
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
                  <p className="font-medium text-gray-900">{selectedVendor.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="font-medium text-gray-900">{selectedVendor.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Join Date</p>
                  <p className="font-medium text-gray-900">{selectedVendor.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Products</p>
                  <p className="font-medium text-gray-900">{selectedVendor.products}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="font-medium text-gray-900">{selectedVendor.revenue}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Quick Actions</h4>
                <div className="flex gap-2">
                  {selectedVendor.status === 'Pending' && (
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
                  {selectedVendor.status === 'Active' && (
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

