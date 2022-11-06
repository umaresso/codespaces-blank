/*
  connectWallet: Connects the MetaMask wallet
*/
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import Web3Modal from "web3modal";

export const connectWallet = async (web3ModalRef) => {
  try {
    // Get the provider from web3Modal, which in our case is MetaMask
    // When used for the first time, it prompts the user to connect their wallet
    await getProviderOrSigner(web3ModalRef, false);
    //          setWalletConnected(true);
  } catch (err) {
    if (
      err
        .toString()
        .includes(`Request of type 'wallet_requestPermissions' already pending`)
    ) {
      alert("Please Connect your Wallet !");
    }
    console.log(err.toString());
  }
};

/**
 * Returns a Provider or Signer object representing the Ethereum RPC with or without the
 * signing capabilities of metamask attached
 *
 * A `Provider` is needed to interact with the blockchain - reading transactions, reading balances, reading state, etc.
 *
 * A `Signer` is a special type of Provider used in case a `write` transaction needs to be made to the blockchain, which involves the connected account
 * needing to make a digital signature to authorize the transaction being sent. Metamask exposes a Signer API to allow your website to
 * request signatures from the user using Signer functions.
 *
=       */
export const getProviderOrSigner = async (network, web3ModalRef) => {
  // Connect to Metamask
  // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
  // alert("Please Accept the Metamask Connection");
  let Web3ModalRef = web3ModalRef;
  web3ModalRef.current = new Web3Modal({
    network: network,
    providerOptions: {},
    disableInjectedProvider: false,
  });
  let provider;
  let web3Provider;
  let signer;

  try {
    //     const QuickNodeProvider = ethers.providers.getDefaultProvider(
    // 'https://autumn-necessary-frost.ethereum-goerli.quiknode.pro/07319f15c47c89543c7bf75aa284cc5347ace6e1/'
    //       )

    //    provider = await Web3ModalRef.current.connect(QuickNodeProvider)
    provider = await Web3ModalRef.current.connect();

    web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider?.getNetwork();
    if (chainId && chainId !== 5) {
      window.alert("Please Change the network to Goerli");
      return null;
    }

    signer = web3Provider.getSigner();
    return signer;
  } catch (err) {
    if (err.toString().includes("already pending")) {
      alert("Please Connect your Wallet !");
    }
    console.log("Error connecting wallet", err.toString());
    return null;
  }
  return signer;
  // If user is not connected to the Mumbai network, let them know and throw an error
};
