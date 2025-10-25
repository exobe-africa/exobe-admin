"use client";

import Badge from '../common/Badge';
import { Clock } from 'lucide-react';

function statusVariant(status: string): 'success' | 'info' | 'warning' | 'danger' | 'neutral' {
  switch ((status || '').toUpperCase()) {
    case 'FULFILLED': return 'success';
    case 'SHIPPED': return 'info';
    case 'PROCESSING': return 'warning';
    case 'CANCELLED': return 'danger';
    default: return 'neutral';
  }
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

export default function OrderTimeline({ events }: { events: any[] }) {
  if (!events || events.length === 0) return null;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Clock className="text-[#C8102E]" size={20} />
          <h2 className="text-xl font-bold text-gray-900">Order Timeline</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock size={16} className="text-blue-600" />
                </div>
                {index < events.length - 1 && (
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
  );
}


