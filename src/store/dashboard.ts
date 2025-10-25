import { create } from 'zustand';
import { getApolloClient } from '../lib/apollo/client';
import { DASHBOARD_STATS_QUERY, RECENT_ORDERS_QUERY } from '../lib/api/dashboard';

export interface DashboardStats {
  totalUsers: number;
  usersTrend: number;
  activeVendors: number;
  vendorsTrend: number;
  totalProducts: number;
  productsTrend: number;
  totalOrders: number;
  ordersTrend: number;
  revenueCents: number;
  revenueTrend: number;
  growthRate: number;
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer: string;
  amount_cents: number;
  status: string;
  items_count: number;
  payment_status: string;
  date: string;
}

interface DashboardState {
  stats: DashboardStats | null;
  recentOrders: RecentOrder[];
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  recentOrders: [],
  isLoading: false,
  error: null,

  async fetchDashboardData() {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();

      const [statsResult, ordersResult] = await Promise.all([
        client.query<{ dashboardStats: DashboardStats }>({
          query: DASHBOARD_STATS_QUERY,
          fetchPolicy: 'network-only',
        }),
        client.query<{ recentOrders: RecentOrder[] }>({
          query: RECENT_ORDERS_QUERY,
          variables: { limit: 5 },
          fetchPolicy: 'network-only',
        }),
      ]);

      set({
        stats: statsResult.data?.dashboardStats || null,
        recentOrders: ordersResult.data?.recentOrders || [],
        isLoading: false,
      });
    } catch (err: any) {
      set({ 
        error: err?.message || 'Failed to fetch dashboard data', 
        isLoading: false 
      });
    }
  },
}));

