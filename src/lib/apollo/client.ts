"use client";

import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";

let apolloClient: ApolloClient<any> | null = null;

function createApolloClient() {
  const errorLink = onError((err) => {
    const graphQLErrors = (err as any).graphQLErrors as { message?: string }[] | undefined;
    const networkError = (err as any).networkError as unknown;
    if (graphQLErrors) {
      for (const e of graphQLErrors) {
        if (typeof window !== "undefined" && e?.message && /unauthorized|forbidden/i.test(e.message)) {
          // Handle auth errors
          try {
            fetch(API_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: "mutation{ logout }" }),
              credentials: "include",
            });
          } catch (_) {}
        }
      }
    }
    if (networkError) {
      console.error('Network error:', networkError);
    }
  });

  const httpLink = new HttpLink({
    uri: API_URL,
    credentials: "include",
    fetchOptions: { credentials: "include" },
  });

  const authLink = setContext((_, { headers }) => {
    if (typeof window !== 'undefined') {
      const admin = localStorage.getItem('exobeAdmin');
      if (admin) {
        try {
          const { token } = JSON.parse(admin);
          return {
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : "",
            },
          };
        } catch (_) {}
      }
    }
    return { headers };
  });

  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
}

export function getApolloClient() {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
}

