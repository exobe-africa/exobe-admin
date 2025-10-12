"use client";

import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";

let apolloClient: ApolloClient | null = null;

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
    // Read token from persisted Zustand store
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      try {
        const persisted = localStorage.getItem('exobe-admin-auth');
        if (persisted) {
          const parsed = JSON.parse(persisted);
          const state = parsed?.state || parsed;
          token = state?.user?.token ?? null;
        }
      } catch (_) {}

      if (!token) {
        try {
          const admin = localStorage.getItem('exobeAdmin');
          if (admin) token = JSON.parse(admin)?.token ?? null;
        } catch (_) {}
      }
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : headers?.authorization || "",
      },
    };
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

