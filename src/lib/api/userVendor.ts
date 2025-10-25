import { gql } from '@apollo/client';

export const USER_BY_ID_QUERY = gql`
  query UserById($id: String!) {
    userById(id: $id) {
      id
      email
      name
      first_name
      last_name
      phone
      role
      is_active
      created_at
    }
  }
`;

export const APPLICATION_BY_EMAIL_QUERY = gql`
  query ApplicationByEmail($email: String!) {
    applicationByEmail(email: $email) {
      id
      seller_role
      business_type
      applicant_type
      first_name
      last_name
      email
      phone
      landline
      identification_type
      business_name
      business_registration
      sa_id_number
      vat_registered
      vat_number
      monthly_revenue
      physical_stores
      number_of_stores
      supplier_to_retailers
      other_marketplaces
      address
      city
      province
      postal_code
      unique_products
      primary_category
      stock_type
      product_description
      owned_brands
      reseller_brands
      website
      social_media
      business_summary
      how_did_you_hear
      agree_to_terms
      status
      created_at
      updated_at
    }
  }
`;

