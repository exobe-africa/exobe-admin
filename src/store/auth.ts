"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getApolloClient } from "../lib/apollo/client";
import { LOGIN_MUTATION, REQUEST_PASSWORD_RESET, RESET_PASSWORD, ME_QUERY } from "../lib/api/auth";

export interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  role: 'ADMIN' | 'SUPER_ADMIN';
  token?: string | null;
  permissions?: string[];
}

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  login: (input: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

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

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasHydrated: false,

      setHasHydrated(value) {
        set({ hasHydrated: value });
      },

      async login(input) {
        set({ isLoading: true, error: null });
        try {
          const client = getApolloClient();
          const { data } = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: { input },
          });
          
          const user = (data as any)?.login ?? null;
          
          if (!user) {
            throw new Error('Invalid response from server');
          }

          // Validate admin role
          if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            throw new Error('You do not have permission to access the admin dashboard.');
          }

          const adminUser: AdminUser = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            token: user.token,
            permissions: ['all'], // Can be expanded based on role
          };

          set({ user: adminUser, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ error: extractApolloErrorMessage(err), isLoading: false, user: null, isAuthenticated: false });
          throw err;
        }
      },

      async logout() {
        try {
          // Call logout endpoint to clear cookies
          await fetch(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: "mutation{ logout }" }),
            credentials: "include",
          });
        } catch (_) {
          // Ignore logout errors
        }
        set({ user: null, isAuthenticated: false, error: null });
      },

      async fetchMe() {
        try {
          const client = getApolloClient();
          const { data } = await client.query({ 
            query: ME_QUERY, 
            fetchPolicy: "no-cache" 
          });
          
          const user = (data as any)?.me ?? null;
          
          if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
            const adminUser: AdminUser = {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              permissions: ['all'],
            };
            set({ user: adminUser, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (err) {
          // If not authenticated or invalid, clear state
          set({ user: null, isAuthenticated: false });
        }
      },

      async requestPasswordReset(email) {
        set({ isLoading: true, error: null });
        try {
          const client = getApolloClient();
          await client.mutate({
            mutation: REQUEST_PASSWORD_RESET,
            variables: { email },
          });
          set({ isLoading: false });
        } catch (err) {
          set({ error: extractApolloErrorMessage(err), isLoading: false });
          throw err;
        }
      },

      async resetPassword(token, newPassword) {
        set({ isLoading: true, error: null });
        try {
          const client = getApolloClient();
          await client.mutate({
            mutation: RESET_PASSWORD,
            variables: { token, newPassword },
          });
          set({ isLoading: false });
        } catch (err) {
          set({ error: extractApolloErrorMessage(err), isLoading: false });
          throw err;
        }
      },

      clearError() {
        set({ error: null });
      },
    }),
    {
      name: "exobe-admin-auth",
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state, error) => {
        // Mark hydration complete regardless of success/failure
        state?.setHasHydrated(true);
      },
    }
  )
);

