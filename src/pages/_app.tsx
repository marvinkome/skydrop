import type { AppProps } from "next/app";
import Head from "next/head";
import * as ethers from "ethers";
import theme from "theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3ReactManager } from "components/wallet/manager";
import { QueryClient, QueryClientProvider } from "react-query";

function getLibrary(provider: any): ethers.providers.Web3Provider {
  const library = new ethers.providers.Web3Provider(provider);

  library.pollingInterval = 12000;
  return library;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 240 * 1000,
      retry: 1,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>SkyDrop</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ReactManager>
            <Component {...pageProps} />
          </Web3ReactManager>
        </Web3ReactProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;