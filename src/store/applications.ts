"use client";

import { create } from "zustand";
import { getApolloClient } from "../lib/apollo/client";
import {
  SELLER_APPLICATIONS_QUERY,
  APPROVE_SELLER_APPLICATION,
  REJECT_SELLER_APPLICATION,
  REJECT_SELLER_APPLICATION_WITH_REASON,
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

  // Rejection modal state
  isRejectionModalOpen: boolean;
  rejectionData: { rejectionType: string; description: string };
  isRejecting: boolean;
  rejectionApplicationId: string | null;

  // Actions
  setApplications: (applications: SellerApplication[]) => void;
  setFilters: (filters: Partial<ApplicationFilters>) => void;
  resetFilters: () => void;
  fetchApplications: () => Promise<void>;
  approveApplication: (applicationId: string) => Promise<void>;
  rejectApplication: (applicationId: string) => Promise<void>;
  rejectApplicationWithReason: (applicationId: string, rejectionData: { rejectionType: string; description: string }) => Promise<void>;
  updateApplication: (applicationId: string, data: any) => Promise<void>;
  clearError: () => void;

  // Modal actions
  openRejectionModal: (applicationId: string) => void;
  closeRejectionModal: () => void;
  setRejectionData: (data: Partial<{ rejectionType: string; description: string }>) => void;
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
  isRejectionModalOpen: false,
  rejectionData: { rejectionType: '', description: '' },
  isRejecting: false,
  rejectionApplicationId: null,

  setApplications(applications) {
    set({ applications });
  },

  setFilters(filters) {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  resetFilters() {
    set({ filters: initialFilters });
  },

  async fetchApplications() {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      const { filters } = get();
      type Resp = { sellerApplications: SellerApplication[] };
      const { data } = await client.query<Resp>({
        query: SELLER_APPLICATIONS_QUERY,
        variables: { status: filters.status || undefined, take: 50, skip: 0 },
        fetchPolicy: "network-only",
      });
      set({ applications: data?.sellerApplications ?? [], isLoading: false });
    } catch (err) {
      set({ error: extractApolloErrorMessage(err), isLoading: false });
    }
  },

  async approveApplication(applicationId) {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      await client.mutate({ mutation: APPROVE_SELLER_APPLICATION, variables: { applicationId } });
      set({ isLoading: false });
      get().fetchApplications();
    } catch (err) {
      set({ error: extractApolloErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  async rejectApplication(applicationId) {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      await client.mutate({ mutation: REJECT_SELLER_APPLICATION, variables: { applicationId } });
      set({ isLoading: false });
      get().fetchApplications();
    } catch (err) {
      set({ error: extractApolloErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  async rejectApplicationWithReason(applicationId, rejectionData) {
    set({ isRejecting: true, error: null });
    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: REJECT_SELLER_APPLICATION_WITH_REASON,
        variables: { applicationId, rejectionData },
      });
      set({ isRejecting: false, isRejectionModalOpen: false, rejectionApplicationId: null });
      get().fetchApplications();
    } catch (err) {
      set({ error: extractApolloErrorMessage(err), isRejecting: false });
      throw err;
    }
  },

  async updateApplication(applicationId, data) {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      await client.mutate({ mutation: UPDATE_SELLER_APPLICATION, variables: { applicationId, data } });
      set({ isLoading: false });
      get().fetchApplications();
    } catch (err) {
      set({ error: extractApolloErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  clearError() {
    set({ error: null });
  },

  // Modal actions
  openRejectionModal: (applicationId) => {
    set({ isRejectionModalOpen: true, rejectionApplicationId: applicationId, rejectionData: { rejectionType: '', description: '' } });
  },

  closeRejectionModal: () => {
    set({ isRejectionModalOpen: false, rejectionApplicationId: null, rejectionData: { rejectionType: '', description: '' } });
  },

  setRejectionData: (data) => {
    set((state) => ({ rejectionData: { ...state.rejectionData, ...data } }));
  },
}));

