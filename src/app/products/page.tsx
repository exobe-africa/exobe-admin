"use client";

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { Search, Eye, Edit, Trash2, Package } from 'lucide-react';
import { useProductsStore } from '../../store';
import ProductsListSkeleton from '../../components/skeletons/ProductsListSkeleton';

export default function ProductsPage() {
  const router = useRouter();
  const { 
    products, 
    stats, 
    categories, 
    isLoading, 
    filters, 
    setFilters, 
    fetchProducts, 
    fetchStats,
    fetchCategories 
  } = useProductsStore();

  useEffect(() => {
    fetchProducts();
    fetchStats();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function centsToRand(cents: number | null): string {
    if (cents === null) return 'N/A';
    const rands = cents / 100;
    return `R ${rands.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function statusVariant(status: string): 'success' | 'info' | 'warning' | 'danger' | 'neutral' {
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'success';
      case 'DRAFT': return 'neutral';
      case 'ARCHIVED': return 'danger';
      default: return 'neutral';
    }
  }

  function statusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  const columns = [
    {
      key: 'title',
      label: 'Product Name',
      sortable: true,
      render: (product: any) => (
        <div className="flex items-center gap-2">
          {product.media?.[0]?.url ? (
            <img 
              src={product.media[0].url} 
              alt={product.title} 
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
              <Package size={16} className="text-gray-400" />
            </div>
          )}
          <span className="font-medium">{product.title}</span>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (product: any) => product.category?.name || '-',
    },
    {
      key: 'vendor',
      label: 'Vendor',
      sortable: true,
      render: (product: any) => product.vendor?.name || '-',
    },
    {
      key: 'priceInCents',
      label: 'Price',
      sortable: true,
      render: (product: any) => centsToRand(product.priceInCents),
    },
    {
      key: 'stockQuantity',
      label: 'Stock',
      sortable: true,
      render: (product: any) => {
        const stock = product.stockQuantity;
        const color = stock === 0 ? 'text-red-600' : stock < 10 ? 'text-yellow-600' : 'text-gray-900';
        return <span className={color}>{stock}</span>;
      },
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (product: any) => {
        const isActive = product.isActive && product.status === 'ACTIVE';
        return (
          <Badge variant={isActive ? 'success' : statusVariant(product.status)}>
            {isActive ? 'Active' : statusLabel(product.status)}
          </Badge>
        );
      },
    },
    {
      key: 'sales',
      label: 'Sales',
      sortable: true,
      render: () => '-', // Placeholder
    },
    {
      key: 'actions',
      label: 'ACTIONS',
      render: (product: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // View action
            }}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Edit action
            }}
            className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Delete action
            }}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const filteredProducts = useMemo(() => {
    return products;
  }, [products]);

  if (isLoading && products.length === 0) {
    return (
      <DashboardLayout>
        <ProductsListSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Management</h1>
          <p className="text-gray-600">Manage all products, inventory, and pricing across the platform</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Input
                placeholder="Search by product name or SKU..."
                value={filters.searchQuery || ''}
                onChange={(v) => {
                  setFilters({ searchQuery: v });
                  fetchProducts();
                }}
                icon={Search}
                fullWidth
              />
            </div>
            <Select
              placeholder="Filter by category"
              value={filters.categoryId || ''}
              onChange={(v) => {
                setFilters({ categoryId: v });
                fetchProducts();
              }}
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map(cat => ({ value: cat.id, label: cat.name }))
              ]}
              fullWidth
            />
            <Select
              placeholder="Filter by status"
              value={filters.status || ''}
              onChange={(v) => {
                setFilters({ status: v });
                fetchProducts();
              }}
              options={[
                { value: '', label: 'All Statuses' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
              fullWidth
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.total || products.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Draft</p>
            <p className="text-2xl font-bold text-yellow-600">{stats?.draft || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">{stats?.outOfStock || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Categories</p>
            <p className="text-2xl font-bold text-blue-600">{stats?.categoriesTotal ?? categories.length}</p>
          </div>
        </div>

        {/* Products Table */}
        <DataTable
          columns={columns}
          data={filteredProducts}
          keyExtractor={(product) => product.id}
          onRowClick={(product) => router.push(`/products/${product.id}/edit`)}
          emptyMessage={isLoading ? 'Loading products...' : 'No products found'}
        />
      </div>
    </DashboardLayout>
  );
}
