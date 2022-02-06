import { UnsupportedChainIdError } from "@web3-react/core";
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

// helpers
export async function connect(activate: any, connector: any) {
  try {
    await activate(connector, undefined, true);
  } catch (error) {
    if (connector === injected && error instanceof UnsupportedChainIdError) {
      await switchNetwork();
      activate(injected, undefined, true);
    } else {
    }
  }
}

export async function switchNetwork() {
  const { ethereum } = global as any;
  if (!ethereum) {
    console.log("MetaMask extension not available");
    return;
  }

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${Number(DEFAULT_CHAIN_ID).toString(16)}` }],
    });
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (error.code === 4902) {
    }
  }
}
