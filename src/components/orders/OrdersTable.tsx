"use client";

import DataTable from '../common/DataTable';
import Badge from '../common/Badge';
import { Eye, Truck, CheckCircle, XCircle } from 'lucide-react';

interface OrdersTableProps {
  data: any[];
  onView: (order: any) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onCancel: (id: string) => void;
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

function centsToRand(cents: number): string {
  const rands = (cents || 0) / 100;
  return `R ${rands.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function OrdersTable({ data, onView, onUpdateStatus, onCancel }: OrdersTableProps) {
  const columns = [
    { key: 'order_number', label: 'Order #', sortable: true, render: (order: any) => order.order_number },
    { key: 'email', label: 'Customer', sortable: true },
    { key: 'total_cents', label: 'Total', sortable: true, render: (order: any) => centsToRand(order.total_cents) },
    { key: 'items', label: 'Items', sortable: true, render: (order: any) => (order.items || []).reduce((s: number, it: any) => s + (it?.quantity || 0), 0) },
    { key: 'status', label: 'Status', render: (order: any) => <Badge variant={statusVariant(order.status)}>{statusLabel(order.status)}</Badge> },
    { key: 'payment_status', label: 'Payment', render: (order: any) => <Badge variant={String(order.payment_status).toUpperCase() === 'PAID' ? 'success' : 'warning'}>{String(order.payment_status).toUpperCase() === 'REFUNDED' ? 'Refunded' : (String(order.payment_status).charAt(0).toUpperCase() + String(order.payment_status).slice(1).toLowerCase())}</Badge> },
    {
      key: 'actions',
      label: 'Actions',
      render: (order: any) => (
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onView(order); }} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="View Details">
            <Eye size={16} />
          </button>
          {String(order.status).toUpperCase() === 'PENDING' && (
            <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'PROCESSING'); }} className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors" title="Process Order">
              <CheckCircle size={16} />
            </button>
          )}
          {String(order.status).toUpperCase() === 'PROCESSING' && (
            <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'SHIPPED'); }} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Mark as Shipped">
              <Truck size={16} />
            </button>
          )}
          {String(order.status).toUpperCase() === 'SHIPPED' && (
            <button onClick={(e) => { e.stopPropagation(); onUpdateStatus(order.id, 'FULFILLED'); }} className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors" title="Mark as Delivered">
              <CheckCircle size={16} />
            </button>
          )}
          {(String(order.status).toUpperCase() === 'PENDING' || String(order.status).toUpperCase() === 'PROCESSING') && (
            <button onClick={(e) => { e.stopPropagation(); onCancel(order.id); }} className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors" title="Cancel Order">
              <XCircle size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      keyExtractor={(order) => order.id}
      emptyMessage={'No orders found'}
      onRowClick={(order) => onView(order)}
    />
  );
}


