import { gql } from '@apollo/client';

export const VENDORS_QUERY = gql`
  query VendorsList {
    vendorsList {
      id
      name
      email
      phone
      address
      city
      province
      postal_code
      country
      business_registration_number
      tax_number
      status
      created_at
      _count {
        products
      }
    }
  }
`;

export const VENDOR_STATS_QUERY = gql`
  query VendorStats {
    vendorStats {
      total
      active
      pending
      suspended
      totalProducts
    }
  }
`;

