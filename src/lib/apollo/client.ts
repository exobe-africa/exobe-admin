"use client";

import { ApolloClient, HttpLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { Observable } from "@apollo/client/utilities";
import { REFRESH_MUTATION } from "../api/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";

type ApolloErrorResponse = {
  graphQLErrors?: Array<{ message?: string }>;
  networkError?: unknown;
  operation: any;
  forward: any;
};

let apolloClient: ApolloClient | null = null;

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];
const addPendingRequest = (cb: () => void) => pendingRequests.push(cb);
const resolvePendingRequests = () => {
  pendingRequests.forEach((cb) => cb());
  pendingRequests = [];
};

function createApolloClient() {
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }: ApolloErrorResponse) => {
    const isAuthError = graphQLErrors?.some((e: any) => {
      const msg = (e as any)?.message || "";
      return /unauthorized|forbidden/i.test(msg);
    });

    if (isAuthError) {
      if (isRefreshing) {
        return new Observable((observer) => {
          addPendingRequest(() => {
            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          });
        });
      }

      isRefreshing = true;
      return new Observable((observer) => {
        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: "mutation Refresh { refresh }" }),
          credentials: "include",
        })
          .then((res) => res.json())
          .then((json) => {
            const ok = json?.data?.refresh === true;
            isRefreshing = false;
            if (ok) {
              resolvePendingRequests();
              forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer),
              });
            } else {
              observer.error(new Error("Unauthorized"));
            }
          })
          .catch((e) => {
            isRefreshing = false;
            pendingRequests = [];
            observer.error(e);
          });
      });
    }

    if (networkError) {
      // Do not log the user out on network blips
      console.error("Network error:", networkError);
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

