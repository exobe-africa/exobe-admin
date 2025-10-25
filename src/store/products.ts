import { create } from 'zustand';
import { getApolloClient } from '../lib/apollo/client';
import { PRODUCTS_QUERY, PRODUCT_STATS_QUERY, CATEGORIES_LIST_QUERY } from '../lib/api/products';

export interface ProductMedia {
  id: string;
  url: string;
  type: string;
}

export interface ProductRow {
  id: string;
  title: string;
  slug: string;
  priceInCents: number | null;
  compareAtPriceInCents: number | null;
  stockQuantity: number;
  status: string;
  isActive: boolean;
  featured: boolean;
  vendorId: string;
  categoryId: string;
  vendor: {
    id: string;
    name: string;
    slug: string;
  } | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  media: ProductMedia[];
}

export interface ProductStats {
  total: number;
  active: number;
  draft: number;
  outOfStock: number;
  categoriesTotal?: number;
  categoriesActive?: number;
  categoriesInactive?: number;
  categoriesDraft?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductFilters {
  searchQuery?: string;
  categoryId?: string;
  status?: string;
  vendorId?: string;
}

interface ProductsState {
  products: ProductRow[];
  stats: ProductStats | null;
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  setFilters: (newFilters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
  fetchProducts: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

const initialFilters: ProductFilters = {
  searchQuery: '',
  categoryId: '',
  status: '',
  vendorId: '',
};

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  stats: null,
  categories: [],
  isLoading: false,
  error: null,
  filters: initialFilters,

  setFilters(newFilters) {
    set({ filters: { ...get().filters, ...newFilters } });
  },

  resetFilters() {
    set({ filters: initialFilters });
  },

  async fetchProducts() {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      const { filters } = get();
      
      const variables: any = {
        take: 100,
        skip: 0,
      };
      
      if (filters.searchQuery) variables.query = filters.searchQuery;
      if (filters.categoryId) variables.categoryId = filters.categoryId;
      if (filters.status) variables.status = filters.status;
      if (filters.vendorId) variables.vendorId = filters.vendorId;

      const { data } = await client.query<{ productsList: ProductRow[] }>({
        query: PRODUCTS_QUERY,
        variables,
        fetchPolicy: 'network-only',
      });

      set({ products: data?.productsList || [], isLoading: false });
    } catch (err: any) {
      set({ 
        error: err?.message || 'Failed to fetch products', 
        isLoading: false 
      });
    }
  },

  async fetchStats() {
    try {
      const client = getApolloClient();
      const { data } = await client.query<{ productStats: ProductStats }>({
        query: PRODUCT_STATS_QUERY,
        fetchPolicy: 'network-only',
      });
      set({ stats: data?.productStats || null });
    } catch (err: any) {
      console.error('Failed to fetch product stats:', err);
    }
  },

  async fetchCategories() {
    try {
      const client = getApolloClient();
      // Pull categories dynamically from products returned by productsList
      const { data } = await client.query<{ productsList: { category: Category | null }[] }>({
        query: CATEGORIES_LIST_QUERY,
        variables: { status: undefined },
        fetchPolicy: 'network-only',
      });
      const unique = new Map<string, Category>();
      (data?.productsList || []).forEach((p) => {
        if (p.category) unique.set(p.category.id, p.category);
      });
      set({ categories: Array.from(unique.values()) });
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
    }
  },
}));

