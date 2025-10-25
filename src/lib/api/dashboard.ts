import { gql } from '@apollo/client';

export const DASHBOARD_STATS_QUERY = gql`
  query DashboardStats {
    dashboardStats {
      totalUsers
      usersTrend
      activeVendors
      vendorsTrend
      totalProducts
      productsTrend
      totalOrders
      ordersTrend
      revenueCents
      revenueTrend
      growthRate
    }
  }
`;

export const RECENT_ORDERS_QUERY = gql`
  query RecentOrders($limit: Float) {
    recentOrders(limit: $limit) {
      id
      order_number
      customer
      amount_cents
      status
      items_count
      payment_status
      date
    }
  }
`;

