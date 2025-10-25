"use client";

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import VendorDetailSkeleton from '../../../components/skeletons/VendorDetailSkeleton';
import { useVendorDetailStore } from '../../../store/vendorDetail';
import { 
  ArrowLeft, 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Package,
  DollarSign,
  Box,
  Edit,
  Ban,
  CheckCircle
} from 'lucide-react';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'SUSPENDED':
        return 'danger';
      default:
        return 'secondary';
    }
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => router.push('/vendors')}
              className="!p-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C8102E] to-[#a00d24] flex items-center justify-center text-white shadow-lg">
              <Store size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <Badge variant={getStatusColor(vendor.status) as any}>
                  {vendor.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {vendor.sellerType}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {vendor.status === 'PENDING' && (
              <>
                <Button variant="primary">
                  <CheckCircle size={18} />
                  Approve Vendor
                </Button>
                <Button variant="danger">
                  <Ban size={18} />
                  Reject
                </Button>
              </>
            )}
            {vendor.status === 'APPROVED' && (
              <Button variant="danger">
                <Ban size={18} />
                Suspend Vendor
              </Button>
            )}
            {vendor.status === 'SUSPENDED' && (
              <Button variant="primary">
                <CheckCircle size={18} />
                Reactivate Vendor
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Products</p>
              <Package className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{vendor._count.products}</p>
            <p className="text-xs text-gray-500 mt-1">{activeProducts} active</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Est. Inventory Value</p>
              <DollarSign className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">Based on stock</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Draft Products</p>
              <Box className="text-yellow-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{draftProducts}</p>
            <p className="text-xs text-gray-500 mt-1">{archivedProducts} archived</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Member Since</p>
              <Calendar className="text-purple-500" size={20} />
            </div>
            <p className="text-lg font-bold text-gray-900">{formatDate(vendor.created_at)}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Business Information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Business Name</p>
                  <p className="font-medium text-gray-900">{vendor.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Seller Type</p>
                  <p className="font-medium text-gray-900">{vendor.sellerType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <Badge variant={getStatusColor(vendor.status) as any}>
                    {vendor.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Account Active</p>
                  <Badge variant={vendor.isActive ? 'success' : 'danger'}>
                    {vendor.isActive ? 'Yes' : 'No'}
                  </Badge>
                </div>
                {vendor.description && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-gray-900">{vendor.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Products ({vendor.products.length})</h2>
                <Button variant="secondary" size="sm">
                  View All
                </Button>
              </div>

              {vendor.products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Package className="mx-auto text-gray-400 mb-3" size={48} />
                  <p className="text-gray-600">No products yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {vendor.products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => router.push(`/products/${product.id}/edit`)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-[#C8102E] hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.media && product.media.length > 0 ? (
                            <Image
                              src={product.media[0].url}
                              alt={product.title}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="text-gray-400" size={32} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                            <Edit size={16} className="text-gray-400 flex-shrink-0" />
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={getProductStatusColor(product.status) as any} size="sm">
                              {product.status}
                            </Badge>
                            {product.category && (
                              <span className="text-xs text-gray-500">{product.category.name}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="font-semibold text-[#C8102E]">
                              {formatPrice(product.priceInCents)}
                            </span>
                            <span className="text-gray-500">
                              Stock: {product.stockQuantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                {vendor.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600">Email</p>
                      <a
                        href={`mailto:${vendor.email}`}
                        className="text-[#C8102E] hover:underline break-all"
                      >
                        {vendor.email}
                      </a>
                    </div>
                  </div>
                )}
                {vendor.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600">Phone</p>
                      <a
                        href={`tel:${vendor.phone}`}
                        className="text-gray-900 hover:text-[#C8102E]"
                      >
                        {vendor.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            {(vendor.address || vendor.city) && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-gray-400" size={20} />
                  <h2 className="text-xl font-bold text-gray-900">Address</h2>
                </div>
                <div className="text-gray-900 space-y-1">
                  {vendor.address && <p>{vendor.address}</p>}
                  {vendor.city && (
                    <p>
                      {vendor.city}
                      {vendor.province && `, ${vendor.province}`}
                    </p>
                  )}
                  {vendor.postalCode && <p>{vendor.postalCode}</p>}
                  {vendor.country && <p>{vendor.country}</p>}
                </div>
              </div>
            )}

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

