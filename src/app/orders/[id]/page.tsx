"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { ArrowLeft, Truck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useOrdersStore, type OrderStatus } from '../../../store';
import OrderDetailSkeleton from '../../../components/skeletons/OrderDetailSkeleton';
import OrderQuickActions from '../../../components/orders/OrderQuickActions';
import OrderItemsByVendor from '../../../components/orders/OrderItemsByVendor';
import OrderTimeline from '../../../components/orders/OrderTimeline';
import OrderSummaryCard from '../../../components/orders/OrderSummaryCard';
import OrderCustomerCard from '../../../components/orders/OrderCustomerCard';
import OrderAddressCard from '../../../components/orders/OrderAddressCard';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  
  const { currentOrder, isLoading, fetchOrderById, updateOrderStatus, cancelOrder } = useOrdersStore();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

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

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!currentOrder) return;
    await updateOrderStatus(currentOrder.id, newStatus);
    await fetchOrderById(currentOrder.id);
  };

  const handleCancelOrderSubmit = async () => {
    if (!currentOrder) return;
    
    // Validate reason
    if (!cancelReason.trim() || cancelReason.trim().length < 10) {
      setCancelError('Please provide a detailed reason (at least 10 characters)');
      return;
    }

    try {
      await cancelOrder(currentOrder.id, cancelReason.trim());
      await fetchOrderById(currentOrder.id);
      setShowCancelModal(false);
      setCancelReason('');
      setCancelError('');
    } catch (error) {
      setCancelError('Failed to cancel order. Please try again.');
    }
  };

  const handleOpenCancelModal = () => {
    setShowCancelModal(true);
    setCancelReason('');
    setCancelError('');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <OrderDetailSkeleton />
      </DashboardLayout>
    );
  }

  if (!currentOrder) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Order not found</p>
          <div className="mt-4">
            <Button onClick={() => router.push('/orders')}>
              Back to Orders
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const vendorGroups = currentOrder.items.reduce((acc, item) => {
    const vendorId = item.product?.vendor?.id || item.vendor_id || 'unknown';
    const vendorName = item.product?.vendor?.name || 'Unknown Vendor';
    if (!acc[vendorId]) {
      acc[vendorId] = { name: vendorName, items: [] };
    }
    acc[vendorId].items.push(item);
    return acc;
  }, {} as Record<string, { name: string; items: typeof currentOrder.items }>);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/orders')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order {currentOrder.order_number}</h1>
              <p className="text-gray-600 mt-1">Order details and status</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={statusVariant(currentOrder.status)}>
              {statusLabel(currentOrder.status)}
            </Badge>
            <Badge variant={String(currentOrder.payment_status).toUpperCase() === 'PAID' ? 'success' : 'warning'}>
              {String(currentOrder.payment_status).charAt(0).toUpperCase() + String(currentOrder.payment_status).slice(1).toLowerCase()}
            </Badge>
          </div>
        </div>

        <OrderQuickActions
          status={currentOrder.status}
          onProcess={() => handleUpdateStatus('PROCESSING')}
          onShip={() => handleUpdateStatus('SHIPPED')}
          onDeliver={() => handleUpdateStatus('FULFILLED')}
          onCancel={handleOpenCancelModal}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <OrderItemsByVendor vendorGroups={vendorGroups} />

            <OrderTimeline events={currentOrder.events || []} />
          </div>

          <div className="space-y-6">
            <OrderSummaryCard order={currentOrder} />

            <OrderCustomerCard order={currentOrder} />

            <OrderAddressCard title="Shipping Address" icon="shipping" address={currentOrder.shipping_address} />

            {currentOrder.billing_address && (
              <OrderAddressCard title="Billing Address" icon="billing" address={currentOrder.billing_address} />
            )}
          </div>
        </div>
      </div>

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

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Order Details</h4>
            <div className="space-y-1 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">Order Number:</span> {currentOrder?.order_number}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Customer:</span> {currentOrder?.email}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Total:</span> {currentOrder ? centsToRand(currentOrder.total_cents) : ''}
              </p>
            </div>
          </div>

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
    </DashboardLayout>
  );
}

