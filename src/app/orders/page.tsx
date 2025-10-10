"use client";

import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { ShoppingCart, Search, Eye, Truck, CheckCircle, XCircle, Download } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

// Mock data
const mockOrders = [
  { id: 'ORD-2025-001', customer: 'John Doe', email: 'john@example.com', date: '2025-10-10', total: 'R 3,499', items: 3, status: 'Pending', payment: 'Paid', shipping: 'Johannesburg' },
  { id: 'ORD-2025-002', customer: 'Jane Smith', email: 'jane@example.com', date: '2025-10-10', total: 'R 1,299', items: 1, status: 'Processing', payment: 'Paid', shipping: 'Cape Town' },
  { id: 'ORD-2025-003', customer: 'Mike Johnson', email: 'mike@example.com', date: '2025-10-09', total: 'R 5,678', items: 5, status: 'Shipped', payment: 'Paid', shipping: 'Durban' },
  { id: 'ORD-2025-004', customer: 'Sarah Williams', email: 'sarah@example.com', date: '2025-10-09', total: 'R 2,345', items: 2, status: 'Delivered', payment: 'Paid', shipping: 'Pretoria' },
  { id: 'ORD-2025-005', customer: 'Tom Brown', email: 'tom@example.com', date: '2025-10-08', total: 'R 899', items: 1, status: 'Cancelled', payment: 'Refunded', shipping: 'Port Elizabeth' },
  { id: 'ORD-2025-006', customer: 'Emily Davis', email: 'emily@example.com', date: '2025-10-08', total: 'R 4,567', items: 4, status: 'Processing', payment: 'Paid', shipping: 'Johannesburg' },
  { id: 'ORD-2025-007', customer: 'David Wilson', email: 'david@example.com', date: '2025-10-07', total: 'R 1,899', items: 2, status: 'Delivered', payment: 'Paid', shipping: 'Cape Town' },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const columns = [
    { key: 'id', label: 'Order ID', sortable: true },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'total', label: 'Total', sortable: true },
    { key: 'items', label: 'Items', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (order: any) => (
        <Badge variant={
          order.status === 'Delivered' ? 'success' :
          order.status === 'Shipped' ? 'info' :
          order.status === 'Processing' ? 'warning' :
          order.status === 'Cancelled' ? 'danger' :
          'neutral'
        }>
          {order.status}
        </Badge>
      ),
    },
    {
      key: 'payment',
      label: 'Payment',
      render: (order: any) => (
        <Badge variant={order.payment === 'Paid' ? 'success' : 'warning'}>
          {order.payment}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewOrder(order)}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          {order.status === 'Pending' && (
            <button
              onClick={() => handleUpdateStatus(order.id, 'Processing')}
              className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
              title="Process Order"
            >
              <CheckCircle size={16} />
            </button>
          )}
          {order.status === 'Processing' && (
            <button
              onClick={() => handleUpdateStatus(order.id, 'Shipped')}
              className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
              title="Mark as Shipped"
            >
              <Truck size={16} />
            </button>
          )}
          {(order.status === 'Pending' || order.status === 'Processing') && (
            <button
              onClick={() => handleCancelOrder(order.id)}
              className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              title="Cancel Order"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Cancelled', payment: 'Refunded' } : o));
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses = Array.from(new Set(orders.map(o => o.status)));

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Track and manage all orders across the platform</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by order ID or customer name..."
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
                ...statuses.map(status => ({ value: status, label: status }))
              ]}
              fullWidth
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-gray-600">
              {orders.filter(o => o.status === 'Pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Processing</p>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'Processing').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Shipped</p>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'Shipped').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Delivered</p>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'Delivered').length}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <DataTable
          columns={columns}
          data={filteredOrders}
          keyExtractor={(order) => order.id}
          emptyMessage="No orders found"
        />

        {/* View Order Modal */}
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedOrder(null);
          }}
          title="Order Details"
          size="lg"
        >
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-600">{selectedOrder.date}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={
                    selectedOrder.status === 'Delivered' ? 'success' :
                    selectedOrder.status === 'Shipped' ? 'info' :
                    selectedOrder.status === 'Processing' ? 'warning' :
                    selectedOrder.status === 'Cancelled' ? 'danger' :
                    'neutral'
                  }>
                    {selectedOrder.status}
                  </Badge>
                  <Badge variant={selectedOrder.payment === 'Paid' ? 'success' : 'warning'}>
                    {selectedOrder.payment}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-medium text-gray-900">{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Shipping Location</p>
                    <p className="font-medium text-gray-900">{selectedOrder.shipping}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium">{selectedOrder.items}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#C8102E]">{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Quick Actions</h4>
                <div className="flex gap-2">
                  {selectedOrder.status === 'Pending' && (
                    <Button icon={CheckCircle} onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'Processing');
                      setIsViewModalOpen(false);
                    }}>
                      Process Order
                    </Button>
                  )}
                  {selectedOrder.status === 'Processing' && (
                    <Button icon={Truck} onClick={() => {
                      handleUpdateStatus(selectedOrder.id, 'Shipped');
                      setIsViewModalOpen(false);
                    }}>
                      Mark as Shipped
                    </Button>
                  )}
                  <Button variant="secondary" icon={Download}>
                    Download Invoice
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}

