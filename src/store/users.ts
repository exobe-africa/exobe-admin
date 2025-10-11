"use client";

import { create } from "zustand";
import { getApolloClient } from "../lib/apollo/client";
import { ADMIN_USERS_QUERY } from "../lib/api/users";

export type Role = 'ADMIN' | 'SUPER_ADMIN' | 'CUSTOMER' | 'RETAILER' | 'WHOLESALER' | 'SERVICE_PROVIDER';

export interface UserRow {
  id: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  role: Role;
  is_active: boolean;
  created_at: string;
}

export interface UserFilters {
  searchQuery: string;
  role: Role | '';
  status: 'Active' | 'Inactive' | '';
}

interface UsersState {
  // State
  users: UserRow[];
  filters: UserFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUsers: (users: UserRow[]) => void;
  setFilters: (filters: Partial<UserFilters>) => void;
  resetFilters: () => void;
  fetchUsers: () => Promise<void>;
  addUser: (user: UserRow) => void;
  updateUser: (userId: string, updates: Partial<UserRow>) => void;
  deleteUser: (userId: string) => void;
  clearError: () => void;
}

const initialFilters: UserFilters = {
  searchQuery: '',
  role: '',
  status: '',
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

export const useUsersStore = create<UsersState>()((set, get) => ({
  users: [],
  filters: initialFilters,
  isLoading: false,
  error: null,

  setUsers(users) {
    set({ users });
  },

  setFilters(filters) {
    set({ filters: { ...get().filters, ...filters } });
  },

  resetFilters() {
    set({ filters: initialFilters });
  },

  async fetchUsers() {
    set({ isLoading: true, error: null });
    
    try {
      const client = getApolloClient();
      const { filters } = get();
      
      const { data } = await client.query({
        query: ADMIN_USERS_QUERY,
        variables: {
          query: filters.searchQuery || null,
          role: filters.role || null,
          status: filters.status === '' ? null : filters.status === 'Active',
        },
        fetchPolicy: 'network-only',
      });

      const users = data?.searchUsers ?? [];
      set({ users, isLoading: false });
    } catch (err) {
      set({ 
        error: extractApolloErrorMessage(err), 
        isLoading: false,
        users: [] 
      });
      throw err;
    }
  },

  addUser(user) {
    set({ users: [...get().users, user] });
  },

  updateUser(userId, updates) {
    set({
      users: get().users.map(u => 
        u.id === userId ? { ...u, ...updates } : u
      )
    });
  },

  deleteUser(userId) {
    set({
      users: get().users.filter(u => u.id !== userId)
    });
  },

  clearError() {
    set({ error: null });
  },
}));

