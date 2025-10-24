"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DataTable from '../../components/common/DataTable';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { Search, Eye, Truck, CheckCircle, XCircle, Download, AlertTriangle } from 'lucide-react';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { useOrdersStore, type OrderRow, type OrderStatus } from '../../store';
import OrdersListSkeleton from '../../components/skeletons/OrdersListSkeleton';

export default function OrdersPage() {
  const router = useRouter();
  const {
    orders,
    isLoading,
    filters,
    setFilters,
    fetchOrders,
    updateOrderStatus,
    cancelOrder,
  } = useOrdersStore();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function centsToRand(cents: number): string {
    const rands = (cents || 0) / 100;
    return `R ${rands.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function statusLabel(status: string): string {
    switch ((status || '').toUpperCase()) {
      case 'PENDING': return 'Pending';
      case 'PROCESSING': return 'Processing';
      case 'SHIPPED': return 'Shipped';
      case 'FULFILLED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      default: return status || 'Unknown';
    }
  }

  function statusVariant(status: string): 'success' | 'info' | 'warning' | 'danger' | 'neutral' {
    switch ((status || '').toUpperCase()) {
      case 'FULFILLED': return 'success';
      case 'SHIPPED': return 'info';
      case 'PROCESSING': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'neutral';
    }
  }

  const columns = [
    { 
      key: 'order_number', 
      label: 'Order #', 
      sortable: true,
      render: (order: any) => (
        <button
          onClick={() => router.push(`/orders/${order.id}`)}
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          {order.order_number}
        </button>
      ),
    },
    {
      key: 'email',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'total_cents',
      label: 'Total',
      sortable: true,
      render: (order: any) => centsToRand(order.total_cents),
    },
    {
      key: 'items',
      label: 'Items',
      sortable: true,
      render: (order: any) => (order.items || []).reduce((sum: number, it: any) => sum + (it?.quantity || 0), 0),
    },
    {
      key: 'status',
      label: 'Status',
      render: (order: any) => (
        <Badge variant={statusVariant(order.status)}>
          {statusLabel(order.status)}
        </Badge>
      ),
    },
    {
      key: 'payment_status',
      label: 'Payment',
      render: (order: any) => (
        <Badge variant={String(order.payment_status).toUpperCase() === 'PAID' ? 'success' : 'warning'}>
          {String(order.payment_status).toUpperCase() === 'REFUNDED' ? 'Refunded' : (String(order.payment_status).charAt(0).toUpperCase() + String(order.payment_status).slice(1).toLowerCase())}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/orders/${order.id}`);
            }}
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          {String(order.status).toUpperCase() === 'PENDING' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(order.id, 'PROCESSING');
              }}
              className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
              title="Process Order"
            >
              <CheckCircle size={16} />
            </button>
          )}
          {String(order.status).toUpperCase() === 'PROCESSING' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(order.id, 'SHIPPED');
              }}
              className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
              title="Mark as Shipped"
            >
              <Truck size={16} />
            </button>
          )}
          {(String(order.status).toUpperCase() === 'PENDING' || String(order.status).toUpperCase() === 'PROCESSING') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancelOrder(order.id);
              }}
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

  const handleViewOrder = (order: OrderRow) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const handleCancelOrder = (orderId: string) => {
    setOrderToCancel(orderId);
    setShowCancelModal(true);
    setCancelReason('');
    setCancelError('');
  };

  const handleCancelOrderSubmit = async () => {
    if (!orderToCancel) return;
    
    // Validate reason
    if (!cancelReason.trim() || cancelReason.trim().length < 10) {
      setCancelError('Please provide a detailed reason (at least 10 characters)');
      return;
    }

    try {
      await cancelOrder(orderToCancel, cancelReason.trim());
      setShowCancelModal(false);
      setOrderToCancel(null);
      setCancelReason('');
      setCancelError('');
    } catch (error) {
      setCancelError('Failed to cancel order. Please try again.');
    }
  };

  const filteredOrders = useMemo(() => {
    const q = (filters.searchQuery || '').toLowerCase();
    const s = (filters.status || '').toUpperCase();
    return (orders || []).filter((o) => {
      const matchesSearch = !q || (o.order_number?.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q));
      const matchesStatus = !s || String(o.status).toUpperCase() === s;
      return matchesSearch && matchesStatus;
    });
  }, [orders, filters.searchQuery, filters.status]);

  const statuses = useMemo(() => Array.from(new Set((orders || []).map(o => String(o.status).toUpperCase()))), [orders]);

  if (isLoading && orders.length === 0) {
    return (
      <DashboardLayout>
        <OrdersListSkeleton />
      </DashboardLayout>
    );
  }

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
                placeholder="Search by order # or email..."
                value={filters.searchQuery}
                onChange={(v) => setFilters({ searchQuery: v })}
                icon={Search}
                fullWidth
              />
            </div>
            <Select
              placeholder="Filter by status"
              value={filters.status}
              onChange={(v) => setFilters({ status: v })}
              options={[
                { value: '', label: 'All Statuses' },
                ...statuses.map(status => ({ value: status, label: statusLabel(status) }))
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
              {orders.filter(o => String(o.status).toUpperCase() === 'PENDING').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Processing</p>
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => String(o.status).toUpperCase() === 'PROCESSING').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Shipped</p>
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => String(o.status).toUpperCase() === 'SHIPPED').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Delivered</p>
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => String(o.status).toUpperCase() === 'FULFILLED').length}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <DataTable
          columns={columns}
          data={filteredOrders}
          keyExtractor={(order) => order.id}
          emptyMessage={isLoading ? 'Loading orders...' : 'No orders found'}
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
                  <h3 className="text-xl font-bold text-gray-900">{selectedOrder.order_number}</h3>
                </div>
                <div className="flex gap-2">
                  <Badge variant={statusVariant(selectedOrder.status)}>
                    {statusLabel(selectedOrder.status)}
                  </Badge>
                  <Badge variant={String(selectedOrder.payment_status).toUpperCase() === 'PAID' ? 'success' : 'warning'}>
                    {String(selectedOrder.payment_status).toUpperCase() === 'REFUNDED' ? 'Refunded' : (String(selectedOrder.payment_status).charAt(0).toUpperCase() + String(selectedOrder.payment_status).slice(1).toLowerCase())}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Customer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Shipping Location</p>
                    <p className="font-medium text-gray-900">{selectedOrder.shipping_address?.city || selectedOrder.shipping_address?.province || '-'}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items</span>
                    <span className="font-medium">{(selectedOrder.items || []).reduce((s, it) => s + (it?.quantity || 0), 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{centsToRand(selectedOrder.subtotal_cents)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">{centsToRand(selectedOrder.shipping_cents)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VAT</span>
                    <span className="font-medium">{centsToRand(selectedOrder.vat_cents)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#C8102E]">{centsToRand(selectedOrder.total_cents)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3">Quick Actions</h4>
                <div className="flex gap-2">
                  {String(selectedOrder.status).toUpperCase() === 'PENDING' && (
                    <Button icon={CheckCircle} onClick={async () => {
                      await handleUpdateStatus(selectedOrder.id, 'PROCESSING');
                      setIsViewModalOpen(false);
                    }}>
                      Process Order
                    </Button>
                  )}
                  {String(selectedOrder.status).toUpperCase() === 'PROCESSING' && (
                    <Button icon={Truck} onClick={async () => {
                      await handleUpdateStatus(selectedOrder.id, 'SHIPPED');
                      setIsViewModalOpen(false);
                    }}>
                      Mark as Shipped
                    </Button>
                  )}
                  <Button variant="secondary" icon={Download} onClick={() => {
                    const url = selectedOrder.invoice_url || selectedOrder.receipt_url;
                    if (url) window.open(url, '_blank');
                  }}>
                    Download Invoice
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Cancel Order Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Order"
          size="md"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Order
              </Button>
              <Button
                variant="danger"
                icon={XCircle}
                onClick={handleCancelOrderSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            {/* Warning Alert */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-red-900">This action cannot be undone</h4>
                <p className="text-sm text-red-700 mt-1">
                  Cancelling this order will notify the customer via email with your provided reason.
                  The payment status will be marked as refunded.
                </p>
              </div>
            </div>

            {/* Order Details */}
            {orderToCancel && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Order Details</h4>
                <div className="space-y-1 text-sm">
                  {(() => {
                    const order = orders.find(o => o.id === orderToCancel);
                    if (!order) return null;
                    return (
                      <>
                        <p className="text-gray-700">
                          <span className="font-medium">Order Number:</span> {order.order_number}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Customer:</span> {order.email}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Total:</span> {centsToRand(order.total_cents)}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Reason Input */}
            <div>
              <label htmlFor="cancelReason" className="block text-sm font-medium text-gray-900 mb-2">
                Cancellation Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                id="cancelReason"
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border ${
                  cancelError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[#C8102E]'
                } focus:ring-2 focus:border-transparent transition-colors resize-none text-gray-900 placeholder:text-gray-400`}
                placeholder="Please provide a detailed reason for cancelling this order. This will be sent to the customer via email."
                value={cancelReason}
                onChange={(e) => {
                  setCancelReason(e.target.value);
                  setCancelError('');
                }}
              />
              {cancelError && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertTriangle size={14} />
                  {cancelError}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-600">
                Minimum 10 characters. Be clear and professional - this will be sent to the customer.
              </p>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

