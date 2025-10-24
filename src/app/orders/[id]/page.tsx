"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck, CheckCircle, XCircle, Download, Clock, AlertTriangle } from 'lucide-react';
import { useOrdersStore, type OrderStatus } from '../../../store';
import OrderDetailSkeleton from '../../../components/skeletons/OrderDetailSkeleton';

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

        {/* Quick Actions */}
        {(String(currentOrder.status).toUpperCase() === 'PENDING' || String(currentOrder.status).toUpperCase() === 'PROCESSING' || String(currentOrder.status).toUpperCase() === 'SHIPPED') && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">Quick Actions</h3>
                <p className="text-sm text-blue-700 mt-1">Update this order's status</p>
              </div>
              <div className="flex gap-2">
                {String(currentOrder.status).toUpperCase() === 'PENDING' && (
                  <Button icon={CheckCircle} onClick={() => handleUpdateStatus('PROCESSING')}>
                    Process Order
                  </Button>
                )}
                {String(currentOrder.status).toUpperCase() === 'PROCESSING' && (
                  <Button icon={Truck} onClick={() => handleUpdateStatus('SHIPPED')}>
                    Mark as Shipped
                  </Button>
                )}
                {String(currentOrder.status).toUpperCase() === 'SHIPPED' && (
                  <Button icon={CheckCircle} onClick={() => handleUpdateStatus('FULFILLED')}>
                    Mark as Delivered
                  </Button>
                )}
                <Button variant="secondary" icon={XCircle} onClick={handleOpenCancelModal}>
                  Cancel Order
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products by Vendor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Package className="text-[#C8102E]" size={20} />
                  <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {Object.entries(vendorGroups).map(([vendorId, { name, items }]) => (
                  <div key={vendorId} className="p-6">
                    {/* Vendor Header */}
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-[#C8102E] flex items-center justify-center text-white font-bold">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{name}</p>
                        <p className="text-sm text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {/* Vendor Items */}
                    <div className="space-y-4">
                      {items.map((item) => {
                        const imageUrl = item.product_variant?.media?.[0]?.url || item.product?.media?.[0]?.url;
                        return (
                          <div key={item.id} className="flex gap-4">
                            {/* Product Image */}
                            <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                              {imageUrl ? (
                                <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package size={24} className="text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">{item.product?.title || item.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.product_variant?.title || 'Default Variant'}
                              </p>
                              {item.product?.category && (
                                <p className="text-xs text-gray-500 mt-1">Category: {item.product.category.name}</p>
                              )}
                              {Object.keys(item.attributes || {}).length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {Object.entries(item.attributes).map(([key, value]) => (
                                    <span key={key} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                                      {key}: {String(value)}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Price Details */}
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{centsToRand(item.price_cents)}</p>
                              <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                              <p className="text-sm font-semibold text-[#C8102E] mt-2">{centsToRand(item.total_cents)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            {currentOrder.events && currentOrder.events.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="text-[#C8102E]" size={20} />
                    <h2 className="text-xl font-bold text-gray-900">Order Timeline</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {currentOrder.events.map((event, index) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Clock size={16} className="text-blue-600" />
                          </div>
                          {index < currentOrder.events!.length - 1 && (
                            <div className="absolute left-1/2 top-10 w-0.5 h-full bg-gray-200 -ml-px"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-semibold text-gray-900">{event.description || 'Status Update'}</p>
                          {event.status && (
                            <div className="mt-2">
                              <Badge variant={statusVariant(event.status)}>
                                {statusLabel(event.status)}
                              </Badge>
                            </div>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(event.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>{centsToRand(currentOrder.subtotal_cents)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>{centsToRand(currentOrder.shipping_cents)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>VAT</span>
                  <span>{centsToRand(currentOrder.vat_cents)}</span>
                </div>
                {currentOrder.discounts && currentOrder.discounts.length > 0 && (
                  <>
                    {currentOrder.discounts.map((discount) => (
                      <div key={discount.id} className="flex justify-between text-green-600">
                        <span className="flex items-center gap-1">
                          Discount
                          {discount.code && <span className="text-xs">({discount.code})</span>}
                        </span>
                        <span>-{centsToRand(discount.amount_cents)}</span>
                      </div>
                    ))}
                  </>
                )}
                {currentOrder.gift_card_code && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      Gift Card
                      <span className="text-xs">({currentOrder.gift_card_code})</span>
                    </span>
                    <span>-{centsToRand(currentOrder.gift_card_amount_cents || 0)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-[#C8102E]">{centsToRand(currentOrder.total_cents)}</span>
                  </div>
                </div>
                {(currentOrder.invoice_url || currentOrder.receipt_url) && (
                  <div className="mt-4">
                    <Button
                      variant="secondary"
                      icon={Download}
                      fullWidth
                      onClick={() => {
                        const url = currentOrder.invoice_url || currentOrder.receipt_url;
                        if (url) window.open(url, '_blank');
                      }}
                    >
                      Download Invoice
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <User className="text-[#C8102E]" size={20} />
                  <h2 className="text-xl font-bold text-gray-900">Customer</h2>
                </div>
              </div>
              <div className="p-6 space-y-3">
                {currentOrder.customer?.first_name && currentOrder.customer?.last_name && (
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {currentOrder.customer.first_name} {currentOrder.customer.last_name}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{currentOrder.email}</p>
                </div>
                {(currentOrder.customer?.phone || currentOrder.customer?.mobile) && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">
                      {currentOrder.customer.phone || currentOrder.customer.mobile}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MapPin className="text-[#C8102E]" size={20} />
                  <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-1 text-gray-900">
                  {currentOrder.shipping_address.street && <p>{currentOrder.shipping_address.street}</p>}
                  {currentOrder.shipping_address.suburb && <p>{currentOrder.shipping_address.suburb}</p>}
                  <p>
                    {currentOrder.shipping_address.city}
                    {currentOrder.shipping_address.province && `, ${currentOrder.shipping_address.province}`}
                  </p>
                  {currentOrder.shipping_address.postal_code && <p>{currentOrder.shipping_address.postal_code}</p>}
                  {currentOrder.shipping_address.country && <p>{currentOrder.shipping_address.country}</p>}
                </div>
              </div>
            </div>

            {/* Billing Address */}
            {currentOrder.billing_address && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-[#C8102E]" size={20} />
                    <h2 className="text-xl font-bold text-gray-900">Billing Address</h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-1 text-gray-900">
                    {currentOrder.billing_address.street && <p>{currentOrder.billing_address.street}</p>}
                    {currentOrder.billing_address.suburb && <p>{currentOrder.billing_address.suburb}</p>}
                    <p>
                      {currentOrder.billing_address.city}
                      {currentOrder.billing_address.province && `, ${currentOrder.billing_address.province}`}
                    </p>
                    {currentOrder.billing_address.postal_code && <p>{currentOrder.billing_address.postal_code}</p>}
                    {currentOrder.billing_address.country && <p>{currentOrder.billing_address.country}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </DashboardLayout>
  );
}

