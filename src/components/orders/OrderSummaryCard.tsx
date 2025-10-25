"use client";

import Button from '../common/Button';
import { Download } from 'lucide-react';

function centsToRand(cents: number): string {
  const rands = (cents || 0) / 100;
  return `R ${rands.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function OrderSummaryCard({ order }: { order: any }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
      </div>
      <div className="p-6 space-y-3">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>{centsToRand(order.subtotal_cents)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Shipping</span>
          <span>{centsToRand(order.shipping_cents)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>VAT</span>
          <span>{centsToRand(order.vat_cents)}</span>
        </div>
        {order.discounts && order.discounts.length > 0 && (
          <>
            {order.discounts.map((discount: any) => (
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
        {order.gift_card_code && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1">
              Gift Card
              <span className="text-xs">({order.gift_card_code})</span>
            </span>
            <span>-{centsToRand(order.gift_card_amount_cents || 0)}</span>
          </div>
        )}
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span className="text-[#C8102E]">{centsToRand(order.total_cents)}</span>
          </div>
        </div>
        {(order.invoice_url || order.receipt_url) && (
          <div className="mt-4">
            <Button
              variant="secondary"
              icon={Download}
              fullWidth
              onClick={() => {
                const url = order.invoice_url || order.receipt_url;
                if (url) window.open(url, '_blank');
              }}
            >
              Download Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}


