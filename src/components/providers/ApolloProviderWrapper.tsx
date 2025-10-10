"use client";

import { ApolloProvider } from "@apollo/client/react";
import { PropsWithChildren } from "react";
import { getApolloClient } from "../../lib/apollo/client";

export default function ApolloProviderWrapper({ children }: PropsWithChildren) {
  return <ApolloProvider client={getApolloClient()}>{children}</ApolloProvider>;
}

