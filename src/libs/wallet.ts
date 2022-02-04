import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

// CONSTANTS
export const DEFAULT_CHAIN_ID = 1;
export const RPC_URLS: { [chainId: number]: string } = {
  1: "https://mainnet.infura.io/v3/4f88abdfd94a43c684fa93091d00515e", // mainnet
  4: "https://rinkeby.infura.io/v3/4f88abdfd94a43c684fa93091d00515e", // rinkeby
};

// CONNECTORS
export const network = new NetworkConnector({
  urls: RPC_URLS,
  defaultChainId: DEFAULT_CHAIN_ID,
});

export const injected = new InjectedConnector({
  supportedChainIds: [1, 4], // todo:: add more selected chain IDs
});
