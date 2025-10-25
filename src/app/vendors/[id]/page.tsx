"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import VendorDetailSkeleton from '../../../components/skeletons/VendorDetailSkeleton';
import VendorHeader from '../../../components/vendors/VendorHeader';
import VendorStatsCards from '../../../components/vendors/VendorStatsCards';
import VendorBusinessInfo from '../../../components/vendors/VendorBusinessInfo';
import VendorProductsList from '../../../components/vendors/VendorProductsList';
import { VendorContact, VendorAddress } from '../../../components/vendors/VendorContactAddress';
import { useVendorDetailStore } from '../../../store/vendorDetail';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';

export default function VendorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { vendor, isLoading, fetchVendor } = useVendorDetailStore();
  const vendorId = params?.id as string;

  useEffect(() => {
    if (vendorId) {
      fetchVendor(vendorId);
    }
  }, [vendorId, fetchVendor]);

  if (isLoading || !vendor) {
    return (
      <DashboardLayout>
        <VendorDetailSkeleton />
      </DashboardLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (cents: number | null) => {
    if (cents === null) return 'N/A';
    return `R ${(cents / 100).toFixed(2)}`;
  };

  const getProductStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'DRAFT':
        return 'warning';
      case 'ARCHIVED':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const totalRevenue = vendor.products.reduce((sum, product) => {
    return sum + (product.priceInCents || 0) * product.stockQuantity;
  }, 0);

  const activeProducts = vendor.products.filter(p => p.isActive && p.status === 'ACTIVE').length;
  const draftProducts = vendor.products.filter(p => p.status === 'DRAFT').length;
  const archivedProducts = vendor.products.filter(p => p.status === 'ARCHIVED').length;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <VendorHeader
          vendor={{ id: vendor.id, name: vendor.name, status: vendor.status, sellerType: vendor.sellerType }}
          onBack={() => router.push('/vendors')}
        />

        {/* Stats Cards */}
        <VendorStatsCards
          totalProducts={vendor._count.products}
          activeProducts={activeProducts}
          draftProducts={draftProducts}
          archivedProducts={archivedProducts}
          inventoryValue={formatPrice(totalRevenue)}
          createdAt={formatDate(vendor.created_at)}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Details */}
            <VendorBusinessInfo
              name={vendor.name}
              sellerType={vendor.sellerType}
              status={vendor.status}
              isActive={vendor.isActive}
              description={vendor.description}
            />

            {/* Products Section */}
            <VendorProductsList
              products={vendor.products as any}
              onEditProduct={(id) => router.push(`/products/${id}/edit`)}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <VendorContact email={vendor.email as any} phone={vendor.phone as any} />

            {/* Address */}
            <VendorAddress
              address={vendor.address as any}
              city={vendor.city as any}
              province={vendor.province as any}
              postalCode={vendor.postalCode as any}
              country={vendor.country as any}
            />

            {/* Account Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Account Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Vendor ID</p>
                  <p className="font-mono text-sm text-gray-900">{vendor.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Slug</p>
                  <p className="font-mono text-sm text-gray-900">{vendor.slug}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created At</p>
                  <p className="text-sm text-gray-900">{formatDate(vendor.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

