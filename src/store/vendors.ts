import { create } from 'zustand';
import { getApolloClient } from '../lib/apollo/client';
import { VENDORS_QUERY, VENDOR_STATS_QUERY } from '../lib/api/vendors';

export interface VendorRow {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  location?: string; // computed from city/province
  status: string;
  products: number;
  created_at: string;
}

export interface VendorStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  totalProducts: number;
}

export interface VendorFilters {
  searchQuery: string;
  status: string;
}

interface VendorsState {
  vendors: VendorRow[];
  stats: VendorStats | null;
  filters: VendorFilters;
  isLoading: boolean;
  error: string | null;
  
  setFilters: (filters: Partial<VendorFilters>) => void;
  resetFilters: () => void;
  fetchVendors: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

const initialFilters: VendorFilters = {
  searchQuery: '',
  status: '',
};

export const useVendorsStore = create<VendorsState>((set, get) => ({
  vendors: [],
  stats: null,
  filters: initialFilters,
  isLoading: false,
  error: null,

  setFilters: (newFilters) => {
    set({ filters: { ...get().filters, ...newFilters } });
  },

  resetFilters: () => {
    set({ filters: initialFilters });
  },

  fetchVendors: async () => {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      const { data } = await client.query<{ vendorsList: any[] }>({
        query: VENDORS_QUERY,
        fetchPolicy: 'network-only',
      });

      const vendors: VendorRow[] = (data?.vendorsList || []).map((v: any) => ({
        id: v.id,
        name: v.name || '',
        email: v.email || '',
        phone: v.phone || '',
        address: v.address || '',
        city: v.city || '',
        province: v.province || '',
        location: [v.city, v.province].filter(Boolean).join(', ') || 'N/A',
        status: v.status || 'PENDING',
        products: v._count?.products || 0,
        created_at: v.created_at || '',
      }));

      set({ vendors, isLoading: false });
    } catch (err: any) {
      set({ 
        error: err?.message || 'Failed to fetch vendors', 
        isLoading: false 
      });
    }
  },

  fetchStats: async () => {
    try {
      const client = getApolloClient();
      const { data } = await client.query<{ vendorStats: VendorStats }>({
        query: VENDOR_STATS_QUERY,
        fetchPolicy: 'network-only',
      });
      set({ stats: data?.vendorStats || null });
    } catch (err: any) {
      console.error('Failed to fetch vendor stats:', err);
    }
  },
}));

