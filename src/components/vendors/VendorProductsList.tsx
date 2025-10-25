"use client";

import Badge from '../common/Badge';
import Button from '../common/Button';
import Image from 'next/image';
import { Package, Edit } from 'lucide-react';

interface ProductItem {
  id: string;
  title: string;
  status: string;
  priceInCents: number | null;
  stockQuantity: number;
  category?: { id: string; name: string } | null;
  media?: { id: string; url: string }[];
}

function getProductStatusColor(status: string) {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'DRAFT':
      return 'warning';
    case 'ARCHIVED':
      return 'danger';
    default:
      return 'secondary';
  }
}

function formatPrice(cents: number | null) {
  if (cents === null) return 'N/A';
  return `R ${(cents / 100).toFixed(2)}`;
}

interface VendorProductsListProps {
  products: ProductItem[];
  onEditProduct: (productId: string) => void;
}

export default function VendorProductsList({ products, onEditProduct }: VendorProductsListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Products ({products.length})</h2>
        <Button variant="secondary" size="sm">View All</Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600">No products yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => onEditProduct(product.id)}
              className="border border-gray-200 rounded-lg p-4 hover:border-[#C8102E] hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {product.media && product.media.length > 0 ? (
                    <Image src={product.media[0].url} alt={product.title} width={80} height={80} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="text-gray-400" size={32} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                    <Edit size={16} className="text-gray-400 flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getProductStatusColor(product.status) as any} size="sm">{product.status}</Badge>
                    {product.category && (
                      <span className="text-xs text-gray-500">{product.category.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="font-semibold text-[#C8102E]">{formatPrice(product.priceInCents)}</span>
                    <span className="text-gray-500">Stock: {product.stockQuantity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


