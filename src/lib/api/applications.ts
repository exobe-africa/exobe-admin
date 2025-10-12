import { gql } from "@apollo/client";

export const SELLER_APPLICATIONS_QUERY = gql`
  query SellerApplications($status: String, $take: Int, $skip: Int) {
    sellerApplications(status: $status, take: $take, skip: $skip) {
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
    }
  }
`;

export const SERVICE_PROVIDER_APPLICATIONS_QUERY = gql`
  query ServiceProviderApplications($status: String, $take: Int, $skip: Int) {
    serviceProviderApplications(status: $status, take: $take, skip: $skip) {
      id
      first_name
      last_name
      email
      phone
      primary_service
      status
      created_at
    }
  }
`;

export const APPROVE_SELLER_APPLICATION = gql`
  mutation ApproveSellerApplication($applicationId: String!) {
    approveSellerApplication(applicationId: $applicationId)
  }
`;

export const REJECT_SELLER_APPLICATION = gql`
  mutation RejectSellerApplication($applicationId: String!) {
    rejectSellerApplication(applicationId: $applicationId)
  }
`;

export const UPDATE_SELLER_APPLICATION = gql`
  mutation UpdateSellerApplication($applicationId: String!, $data: SellerApplicationInput!) {
    updateSellerApplication(applicationId: $applicationId, data: $data)
  }
`;

export const REJECT_SELLER_APPLICATION_WITH_REASON = gql`
  mutation RejectSellerApplicationWithReason($applicationId: String!, $rejectionData: RejectApplicationInput!) {
    rejectSellerApplication(applicationId: $applicationId, rejectionData: $rejectionData)
  }
`;
