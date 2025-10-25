import { gql } from '@apollo/client';

export const PRODUCTS_QUERY = gql`
  query ProductsList($vendorId: String, $categoryId: String, $status: String, $query: String, $take: Float, $skip: Float) {
    productsList(vendorId: $vendorId, categoryId: $categoryId, status: $status, query: $query, take: $take, skip: $skip) {
      id
      title
      slug
      priceInCents
      compareAtPriceInCents
      stockQuantity
      status
      isActive
      featured
      vendorId
      categoryId
      vendor {
        id
        name
        slug
      }
      category {
        id
        name
        slug
      }
      media {
        id
        url
        type
      }
    }
  }
`;

export const PRODUCT_STATS_QUERY = gql`
  query ProductStats {
    productStats {
      total
      active
      lowStock
      outOfStock
    }
  }
`;

export const CATEGORIES_LIST_QUERY = gql`
  query Categories {
    categories {
      id
      name
      slug
    }
  }
`;

