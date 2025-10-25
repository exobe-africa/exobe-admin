"use client";

import { Package } from 'lucide-react';

interface OrderItem {
  id: string;
  title: string;
  price_cents: number;
  quantity: number;
  total_cents: number;
  attributes?: Record<string, any>;
  product?: {
    id: string;
    title: string;
    category?: { name: string };
    media?: { url: string }[];
  };
  product_variant?: { title?: string; media?: { url: string }[] };
}

function centsToRand(cents: number): string {
  const rands = (cents || 0) / 100;
  return `R ${rands.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function OrderItemsByVendor({
  vendorGroups,
}: {
  vendorGroups: Record<string, { name: string; items: OrderItem[] }>
}) {
  return (
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
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-[#C8102E] flex items-center justify-center text-white font-bold">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{name}</p>
                <p className="text-sm text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>
            </div>

            <div className="space-y-4">
              {items.map((item) => {
                const imageUrl = item.product_variant?.media?.[0]?.url || item.product?.media?.[0]?.url;
                const ecommerceBase = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://exobe-ecommerce.vercel.app';
                const productPath = item.product?.id ? `/product/${item.product.id}` : '';
                const productUrl = productPath ? `${ecommerceBase}${productPath}` : undefined;
                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                      {imageUrl ? (
                        productUrl ? (
                          <a href={productUrl} target="_blank" rel="noopener noreferrer">
                            <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </a>
                        ) : (
                          <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {productUrl ? (
                        <a href={productUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 truncate hover:underline">
                          {item.product?.title || item.title}
                        </a>
                      ) : (
                        <h4 className="font-semibold text-gray-900 truncate">{item.product?.title || item.title}</h4>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        {item.product_variant?.title || 'Default Variant'}
                      </p>
                      {item.product?.category && (
                        <p className="text-xs text-gray-500 mt-1">Category: {item.product.category.name}</p>
                      )}
                      {Object.keys(item.attributes || {}).length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(item.attributes || {}).map(([key, value]) => (
                            <span key={key} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                              {key}: {String(value)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

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
  );
}


