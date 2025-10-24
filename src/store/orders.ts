"use client";

import { create } from "zustand";
import { getApolloClient } from "../lib/apollo/client";
import { ADMIN_ORDERS_QUERY, UPDATE_ORDER_MUTATION, ORDER_BY_ID_QUERY } from "../lib/api/orders";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "FULFILLED"
  | "CANCELLED";

export interface OrderRow {
  id: string;
  order_number: string;
  email: string;
  status: string;
  payment_status: string;
  subtotal_cents: number;
  shipping_cents: number;
  vat_cents: number;
  total_cents: number;
  invoice_url?: string | null;
  receipt_url?: string | null;
  shipping_address: Record<string, any>;
  billing_address: Record<string, any>;
  items: Array<{
    id: string;
    sku: string;
    title: string;
    attributes: Record<string, any>;
    price_cents: number;
    quantity: number;
    total_cents: number;
  }>;
}

export interface OrderDetailItem {
  id: string;
  sku: string;
  title: string;
  attributes: Record<string, any>;
  price_cents: number;
  quantity: number;
  total_cents: number;
  vendor_id: string;
  product_id: string;
  product?: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    vendor?: {
      id: string;
      name: string;
      slug: string;
    };
    category?: {
      id: string;
      name: string;
      slug: string;
    };
    media?: Array<{
      id: string;
      url: string;
      type: string;
    }>;
  };
  product_variant?: {
    id: string;
    title: string;
    sku: string;
    media?: Array<{
      id: string;
      url: string;
      type: string;
    }>;
  };
}

export interface OrderDetail {
  id: string;
  order_number: string;
  email: string;
  status: string;
  payment_status: string;
  subtotal_cents: number;
  shipping_cents: number;
  vat_cents: number;
  total_cents: number;
  invoice_url?: string | null;
  receipt_url?: string | null;
  shipping_address: Record<string, any>;
  billing_address: Record<string, any>;
  gift_card_code?: string | null;
  gift_card_amount_cents?: number | null;
  discount_total_cents?: number | null;
  items: OrderDetailItem[];
  customer?: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    mobile?: string;
  };
  events?: Array<{
    id: string;
    status?: string;
    payment_status?: string;
    description?: string;
    created_at: string;
  }>;
  discounts?: Array<{
    id: string;
    amount_cents: number;
    code?: string;
    description?: string;
  }>;
}

export interface OrderFilters {
  searchQuery: string;
  status: string | "";
}

interface OrdersState {
  orders: OrderRow[];
  currentOrder: OrderDetail | null;
  isLoading: boolean;
  error: string | null;
  filters: OrderFilters;

  setFilters: (filters: Partial<OrderFilters>) => void;
  resetFilters: () => void;

  fetchOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
}

const initialFilters: OrderFilters = {
  searchQuery: "",
  status: "",
};

function extractApolloErrorMessage(err: unknown): string {
  const fallback = "Something went wrong";
  if (!err) return fallback;
  const apolloErr = err as { message?: string };
  if (apolloErr?.message) return apolloErr.message;
  try {
    return String(err);
  } catch {
    return fallback;
  }
}

export const useOrdersStore = create<OrdersState>()((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  filters: initialFilters,

  setFilters(filters) {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  resetFilters() {
    set({ filters: initialFilters });
  },

  async fetchOrders() {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      const { filters } = get();
      type Resp = { orders: OrderRow[] };
      const { data } = await client.query<Resp>({
        query: ADMIN_ORDERS_QUERY,
        variables: {
          status: filters.status || undefined,
          query: filters.searchQuery || undefined,
          take: 50,
          skip: 0,
        },
        fetchPolicy: "network-only",
      });
      set({ orders: data?.orders ?? [], isLoading: false });
    } catch (err) {
      set({ error: extractApolloErrorMessage(err), isLoading: false, orders: [] });
    }
  },

  async fetchOrderById(orderId) {
    set({ isLoading: true, error: null, currentOrder: null });
    try {
      const client = getApolloClient();
      type Resp = { orderById: OrderDetail };
      const { data } = await client.query<Resp>({
        query: ORDER_BY_ID_QUERY,
        variables: { orderId },
        fetchPolicy: "network-only",
      });
      set({ currentOrder: data?.orderById ?? null, isLoading: false });
    } catch (err) {
      set({ error: extractApolloErrorMessage(err), isLoading: false, currentOrder: null });
      throw err;
    }
  },

  async updateOrderStatus(orderId, status) {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: UPDATE_ORDER_MUTATION,
        variables: { orderId, input: { status } },
      });
      set({ isLoading: false });
      await get().fetchOrders();
    } catch (err) {
      set({ error: extractApolloErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  async cancelOrder(orderId) {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: UPDATE_ORDER_MUTATION,
        variables: { orderId, input: { status: "CANCELLED", payment_status: "REFUNDED" } },
      });
      set({ isLoading: false });
      await get().fetchOrders();
    } catch (err) {
      set({ error: extractApolloErrorMessage(err), isLoading: false });
      throw err;
    }
  },
}));
