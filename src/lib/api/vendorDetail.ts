import { gql } from '@apollo/client';

export const VENDOR_BY_ID_QUERY = gql`
  query VendorById($id: String!) {
    vendorById(id: $id) {
      id
      name
      slug
      description
      email
      phone
      address
      city
      province
      postalCode
      country
      status
      sellerType
      created_at
      isActive
      owner_user_id
      _count {
        products
      }
      products {
        id
        title
        slug
        description
        priceInCents
        compareAtPriceInCents
        stockQuantity
        status
        isActive
        productType
        category {
          id
          name
        }
        media {
          id
          url
          type
          position
        }
      }
    }
  }
`;

