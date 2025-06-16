"use client";

import { GRAPHQL_API_URL, STORY_CHAIN } from "@/constants";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { type ReactNode, Suspense } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MyRepliconProvider } from "@/features/myreplicon";

const client = new ApolloClient({
  uri: GRAPHQL_API_URL,
  cache: new InMemoryCache(),
});

const wagmiConfig = createConfig({
  // Your dApps chains
  chains: [STORY_CHAIN], // see https://docs.story.foundation/network/network-info/aeneid#aeneid-testnet
  transports: {
    // RPC URL for each chain
    [STORY_CHAIN.id]: http(STORY_CHAIN.rpcUrls.default.http[0]),
  },
});

const queryClient = new QueryClient();

export const ClientProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <ConnectKitProvider options={{ initialChainId: STORY_CHAIN.id }}>
            <Suspense fallback={null}>
              <MyRepliconProvider>
                <Suspense fallback={null}>{children}</Suspense>
              </MyRepliconProvider>
            </Suspense>
          </ConnectKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </ApolloProvider>
  );
};
