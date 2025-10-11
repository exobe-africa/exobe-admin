"use client";

import { create } from "zustand";
import { getApolloClient } from "../lib/apollo/client";
import {
  SELLER_APPLICATIONS_QUERY,
  APPROVE_SELLER_APPLICATION,
  REJECT_SELLER_APPLICATION,
  UPDATE_SELLER_APPLICATION,
} from "../lib/api/applications";

export interface SellerApplication {
  id: string;
  seller_role: string;
  business_type: string;
  applicant_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  landline?: string;
  identification_type: string;
  business_name: string;
  business_registration?: string;
  sa_id_number?: string;
  vat_registered: string;
  vat_number?: string;
  monthly_revenue?: string;
  physical_stores?: string;
  number_of_stores?: string;
  supplier_to_retailers?: string;
  other_marketplaces?: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  unique_products?: string;
  primary_category: string;
  stock_type: string;
  product_description: string;
  owned_brands?: string;
  reseller_brands?: string;
  website?: string;
  social_media?: string;
  business_summary: string;
  how_did_you_hear: string;
  agree_to_terms: boolean;
  status: string;
  created_at: string;
}

export interface ApplicationFilters {
  searchQuery: string;
  status: string;
}

interface ApplicationsState {
  // State
  applications: SellerApplication[];
  filters: ApplicationFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  setApplications: (applications: SellerApplication[]) => void;
  setFilters: (filters: Partial<ApplicationFilters>) => void;
  resetFilters: () => void;
  fetchApplications: () => Promise<void>;
  approveApplication: (applicationId: string) => Promise<void>;
  rejectApplication: (applicationId: string) => Promise<void>;
  updateApplication: (applicationId: string, data: any) => Promise<void>;
  clearError: () => void;
}

const initialFilters: ApplicationFilters = {
  searchQuery: '',
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

export const useApplicationsStore = create<ApplicationsState>()((set, get) => ({
  applications: [],
  filters: initialFilters,
  isLoading: false,
  error: null,

  setApplications(applications) {
    set({ applications });
  },

  setFilters(filters) {
    set({ filters: { ...get().filters, ...filters } });
  },

  resetFilters() {
    set({ filters: initialFilters });
  },

  async fetchApplications() {
    set({ isLoading: true, error: null });
    
    try {
      const client = getApolloClient();
      const { filters } = get();
      
      const { data } = await client.query({
        query: SELLER_APPLICATIONS_QUERY,
        variables: {
          status: filters.status || undefined,
          take: 50,
          skip: 0,
        },
        fetchPolicy: 'network-only',
      });

      const applications = data?.sellerApplications || [];
      set({ applications, isLoading: false });
    } catch (err) {
      set({ 
        error: extractApolloErrorMessage(err), 
        isLoading: false,
        applications: [] 
      });
      throw err;
    }
  },

  async approveApplication(applicationId) {
    set({ isLoading: true, error: null });
    
    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: APPROVE_SELLER_APPLICATION,
        variables: { applicationId },
      });

      // Refetch applications after approval
      await get().fetchApplications();
    } catch (err) {
      set({ error: extractApolloErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  async rejectApplication(applicationId) {
    set({ isLoading: true, error: null });
    
    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: REJECT_SELLER_APPLICATION,
        variables: { applicationId },
      });

      // Refetch applications after rejection
      await get().fetchApplications();
    } catch (err) {
      set({ error: extractApolloErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  async updateApplication(applicationId, data) {
    set({ isLoading: true, error: null });
    
    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: UPDATE_SELLER_APPLICATION,
        variables: {
          applicationId,
          data,
        },
      });

      // Refetch applications after update
      await get().fetchApplications();
    } catch (err) {
      set({ error: extractApolloErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  clearError() {
    set({ error: null });
  },
}));

