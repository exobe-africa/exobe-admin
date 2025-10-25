import { create } from 'zustand';
import { getApolloClient } from '../lib/apollo/client';
import { gql } from '@apollo/client';

const PRODUCT_BY_ID_QUERY = gql`
  query ProductById($id: String!) {
    productById(id: $id) {
      id
      vendorId
      categoryId
      title
      slug
      description
      status
      isActive
      featured
      productType
      deliveryMinDays
      deliveryMaxDays
      weight
      weightUnit
      length
      width
      height
      dimensionUnit
      tags
      features
      availableLocations
      priceInCents
      compareAtPriceInCents
      stockQuantity
      salesCount
      media {
        id
        url
        type
        position
      }
      variants {
        id
        sku
        title
        priceCents
        compareAtPriceCents
        stockQuantity
        attributes
        media {
          id
          url
          type
        }
      }
      options {
        id
        name
        values {
          id
          value
        }
      }
      category {
        id
        name
        slug
      }
      vendor {
        id
        name
        slug
      }
      pickupLocation {
        id
        name
        address
        city
        province
        postalCode
        country
        instructions
      }
      returnPolicy {
        id
        name
        returnsAccepted
        returnPeriodDays
        returnConditions
        restockingFeePct
        returnShippingPaidBy
      }
      warranty {
        id
        hasWarranty
        warrantyPeriod
        warrantyUnit
        warrantyDetails
      }
      bookDetails {
        isbn
        author
        publisher
        publicationDate
        pages
        language
        genre
        format
      }
      consumableDetails {
        expiryDate
        ingredients
        allergens
        nutritionalInfo
      }
      electronicsDetails {
        energyRating
      }
      mediaDetails {
        artist
        genre
        format
      }
      softwareDetails {
        platform
        licenseType
      }
      serviceDetails {
        serviceDuration
      }
      complianceDetails {
        ageRating
        certification
      }
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
    }
  }
`;

const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
      slug
    }
  }
`;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface AdminProductsState {
  categories: Category[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  fetchProduct: (id: string) => Promise<any>;
  fetchCategories: () => Promise<void>;
  updateProduct: (id: string, input: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useAdminProductsStore = create<AdminProductsState>((set) => ({
  categories: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const client = getApolloClient();
      const { data } = await client.query<{ productById: any }>({
        query: PRODUCT_BY_ID_QUERY,
        variables: { id },
        fetchPolicy: 'network-only',
      });
      set({ isLoading: false });
      return data?.productById || null;
    } catch (err: any) {
      set({ error: err?.message || 'Failed to fetch product', isLoading: false });
      throw err;
    }
  },

  fetchCategories: async () => {
    try {
      const client = getApolloClient();
      const { data } = await client.query<{ categories: Category[] }>({
        query: CATEGORIES_QUERY,
        fetchPolicy: 'network-only',
      });
      set({ categories: data?.categories || [] });
    } catch (err: any) {
      console.error('Failed to fetch categories:', err);
    }
  },

  updateProduct: async (id: string, input: any) => {
    set({ isSubmitting: true, error: null });
    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: UPDATE_PRODUCT_MUTATION,
        variables: { id, input },
      });
      set({ isSubmitting: false });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to update product', isSubmitting: false });
      throw err;
    }
  },

  deleteProduct: async (id: string) => {
    set({ isSubmitting: true, error: null });
    try {
      const client = getApolloClient();
      await client.mutate({
        mutation: DELETE_PRODUCT_MUTATION,
        variables: { id },
      });
      set({ isSubmitting: false });
    } catch (err: any) {
      set({ error: err?.message || 'Failed to delete product', isSubmitting: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

