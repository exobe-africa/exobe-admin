"use client";

import Button from '../common/Button';
import { CheckCircle, Truck, XCircle } from 'lucide-react';

interface OrderQuickActionsProps {
  status: string;
  onProcess: () => void;
  onShip: () => void;
  onDeliver: () => void;
  onCancel: () => void;
}

export default function OrderQuickActions({ status, onProcess, onShip, onDeliver, onCancel }: OrderQuickActionsProps) {
  const s = String(status).toUpperCase();
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-blue-900">Quick Actions</h3>
          <p className="text-sm text-blue-700 mt-1">Update this order's status</p>
        </div>
        <div className="flex gap-2">
          {s === 'PENDING' && (
            <Button icon={CheckCircle} onClick={onProcess}>Process Order</Button>
          )}
          {s === 'PROCESSING' && (
            <Button icon={Truck} onClick={onShip}>Mark as Shipped</Button>
          )}
          {s === 'SHIPPED' && (
            <Button icon={CheckCircle} onClick={onDeliver}>Mark as Delivered</Button>
          )}
          <Button variant="secondary" icon={XCircle} onClick={onCancel}>Cancel Order</Button>
        </div>
      </div>
    </div>
  );
}


