"use client";

import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Package, Search, Edit, Trash2, Eye, Archive } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

// Mock data
const mockProducts = [
  { id: '1', name: 'Premium Wireless Headphones', sku: 'PRD-001', category: 'Electronics', vendor: 'Tech Solutions SA', price: 'R 1,299', stock: 45, status: 'Active', sales: 124 },
  { id: '2', name: 'Ergonomic Office Chair', sku: 'PRD-002', category: 'Furniture', vendor: 'Home & Living', price: 'R 3,499', stock: 12, status: 'Active', sales: 67 },
  { id: '3', name: 'Smart Watch Pro', sku: 'PRD-003', category: 'Electronics', vendor: 'Tech Solutions SA', price: 'R 2,899', stock: 0, status: 'Out of Stock', sales: 89 },
  { id: '4', name: 'Yoga Mat Premium', sku: 'PRD-004', category: 'Sports', vendor: 'Sports World', price: 'R 499', stock: 156, status: 'Active', sales: 234 },
  { id: '5', name: 'Coffee Maker Deluxe', sku: 'PRD-005', category: 'Appliances', vendor: 'Home & Living', price: 'R 1,799', stock: 23, status: 'Active', sales: 45 },
  { id: '6', name: 'Designer Sunglasses', sku: 'PRD-006', category: 'Fashion', vendor: 'Fashion Hub', price: 'R 899', stock: 78, status: 'Active', sales: 123 },
  { id: '7', name: 'Bluetooth Speaker', sku: 'PRD-007', category: 'Electronics', vendor: 'Tech Solutions SA', price: 'R 699', stock: 5, status: 'Low Stock', sales: 178 },
  { id: '8', name: 'Running Shoes', sku: 'PRD-008', category: 'Sports', vendor: 'Sports World', price: 'R 1,599', stock: 34, status: 'Active', sales: 92 },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const columns = [
    { key: 'sku', label: 'SKU', sortable: true },
    { key: 'name', label: 'Product Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'vendor', label: 'Vendor', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { 
      key: 'stock', 
      label: 'Stock',
      sortable: true,
      render: (product: any) => (
        <span className={`font-medium ${
          product.stock === 0 ? 'text-red-600' :
          product.stock < 20 ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {product.stock}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (product: any) => (
        <Badge variant={
          product.status === 'Active' ? 'success' :
          product.status === 'Low Stock' ? 'warning' :
          'danger'
        }>
          {product.status}
        </Badge>
      ),
    },
    { key: 'sales', label: 'Sales', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (product: any) => (
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
            title="Archive"
          >
            <Archive size={16} />
          </button>
          <button
            onClick={() => handleDeleteProduct(product.id)}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(products.map(p => p.category)));
  const statuses = Array.from(new Set(products.map(p => p.status)));

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by product name or SKU..."
                value={searchQuery}
                onChange={setSearchQuery}
                icon={Search}
                fullWidth
              />
            </div>
            <Select
              placeholder="Filter by category"
              value={filterCategory}
              onChange={setFilterCategory}
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map(cat => ({ value: cat, label: cat }))
              ]}
              fullWidth
            />
            <Select
              placeholder="Filter by status"
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { value: '', label: 'All Statuses' },
                ...statuses.map(status => ({ value: status, label: status }))
              ]}
              fullWidth
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {products.filter(p => p.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600">
              {products.filter(p => p.status === 'Low Stock' || (p.stock > 0 && p.stock < 20)).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
            <p className="text-2xl font-bold text-red-600">
              {products.filter(p => p.stock === 0).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Categories</p>
            <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
          </div>
        </div>

        {/* Products Table */}
        <DataTable
          columns={columns}
          data={filteredProducts}
          keyExtractor={(product) => product.id}
          emptyMessage="No products found"
        />
      </div>
    </DashboardLayout>
  );
}

