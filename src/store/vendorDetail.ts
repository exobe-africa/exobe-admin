import { create } from 'zustand';
import { getApolloClient } from '../lib/apollo/client';
import { VENDOR_BY_ID_QUERY } from '../lib/api/vendorDetail';

interface ProductMedia {
  id: string;
  url: string;
  type: string;
  position: number;
}

interface ProductCategory {
  id: string;
  name: string;
}

interface VendorProduct {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  priceInCents: number | null;
  compareAtPriceInCents: number | null;
  stockQuantity: number;
  status: string;
  isActive: boolean;
  productType: string;
  category: ProductCategory | null;
  media: ProductMedia[];
  createdAt?: string;
  updatedAt?: string;
}

interface VendorDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  country: string | null;
  status: string;
  sellerType: string;
  created_at: string;
  isActive: boolean;
  _count: {
    products: number;
  };
  products: VendorProduct[];
}

interface VendorDetailState {
  vendor: VendorDetail | null;
  isLoading: boolean;
  error: string | null;
  fetchVendor: (id: string) => Promise<void>;
}

export const useVendorDetailStore = create<VendorDetailState>((set) => ({
  vendor: null,
  isLoading: false,
  error: null,

  fetchVendor: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      const { data } = await client.query<{ vendorById: VendorDetail }>({
        query: VENDOR_BY_ID_QUERY,
        variables: { id },
        fetchPolicy: 'network-only',
      });

      set({ vendor: data.vendorById, isLoading: false });
    } catch (error: any) {
      console.error('Error fetching vendor:', error);
      set({ error: error.message || 'Failed to fetch vendor', isLoading: false });
    }
  },
}));

export type { VendorDetail, VendorProduct };

