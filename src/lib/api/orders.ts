import { gql } from "@apollo/client";

export const ADMIN_ORDERS_QUERY = gql`
  query AdminOrders($status: String, $query: String, $take: Float, $skip: Float) {
    orders(status: $status, query: $query, take: $take, skip: $skip) {
      id
      order_number
      email
      status
      payment_status
      subtotal_cents
      shipping_cents
      vat_cents
      total_cents
      invoice_url
      receipt_url
      shipping_address
      billing_address
      items {
        id
        sku
        title
        attributes
        price_cents
        quantity
        total_cents
      }
    }
  }
`;

export const ORDER_BY_ID_QUERY = gql`
  query OrderById($orderId: String!) {
    orderById(orderId: $orderId) {
      id
      order_number
      email
      status
      payment_status
      subtotal_cents
      shipping_cents
      vat_cents
      total_cents
      invoice_url
      receipt_url
      shipping_address
      billing_address
      gift_card_code
      gift_card_amount_cents
      discount_total_cents
      items {
        id
        sku
        title
        attributes
        price_cents
        quantity
        total_cents
        vendor_id
        product_id
        product {
          id
          title
          slug
          description
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
        product_variant {
          id
          title
          sku
          media {
            id
            url
            type
          }
        }
      }
      customer {
        id
        email
        first_name
        last_name
        phone
        mobile
      }
      events {
        id
        status
        payment_status
        description
        created_at
      }
      discounts {
        id
        amount_cents
        code
        description
      }
    }
  }
`;

export const UPDATE_ORDER_MUTATION = gql`
  mutation UpdateOrder($orderId: String!, $input: UpdateOrderInput!) {
    updateOrder(orderId: $orderId, input: $input) {
      id
      status
      payment_status
      total_cents
    }
  }
`;
