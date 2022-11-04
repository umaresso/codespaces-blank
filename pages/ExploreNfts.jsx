import React, { useEffect, useState } from "react";
import {
  Heading,
  HStack,
  Box,
  Text,
  VStack,
  Center,
  Button,
} from "@chakra-ui/react";
import FilterMenuItem from "./components/FilterMenuItem";
import { useRef } from "react";
import { getProvider } from "@wagmi/core";
import { connectWallet, getProviderOrSigner } from "./data/accountsConnection";
import {
  getCustomNetworkNFTTrackerContract,
  getRentableContract,
} from "./data/NftRenting";
import {
  getAllContractAddressess,
  getAllContractTokens,
} from "./data/ipfsStuff";
import {
  getCustomNetworkERC721Contract,
  getTokenOwner,
  getTokenRentStatus,
  getTokenUri,
} from "./data/ERC721";
import ContractNFTs from "./components/ContractNFTs";
import NftInformationPopup from "./components/NftInformationPopup";
import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";

let NetworkChain = "goerli";
export async function getStaticProps(context) {
  require("dotenv").config();
  return {
    props: { token: process.env.WEB3STORAGE_TOKEN }, // will be passed to the page component as props
  };
}

function Explorecontracts(props) {
  const [currentMenu, setCurrentMenu] = useState("all");
  const [owner, setOwner] = useState(null);
  //  const [contractAddresses,setContractAddresses]=useState(null);
  const [contractTokens, setContractTokens] = useState(null);
  const [contractTokenURIs, setContractTokenURIs] = useState([]);
  const [selectedNft, setSelectedNft] = useState(null);
  const [NftRentingTracker, setNftRentingTracker] = useState(null);
  const [loading, setLoading] = useState(true);

  let web3ModalRef = useRef();
  // console.log("contract tokens are", contractTokens);

  /**
   *
   * IPFS
   *
   */

  function getAccessToken() {
    return props.token;
  }
  async function storeWithProgress(files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {
      console.log("uploading files with cid:", cid);
    };

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
    let uploaded = 0;

    const onStoredChunk = (size) => {
      uploaded += size;
      const pct = 100 * (uploaded / totalSize);
    };

    const client = makeStorageClient();
    return client.put(files, { onRootCidReady, onStoredChunk });
  }
  async function StoreUpdatedcontractsOnIpfs(contractAddresses) {
    const _blob = new Blob(
      [
        JSON.stringify({
          contracts: [...contractAddresses],
        }),
      ],
      { type: "application/json" }
    );
    const updatedDappInfo = [new File([_blob], `contracts.json`)];
    let newCID = await storeWithProgress(updatedDappInfo);
    return newCID;
  }

  /**      */

  async function connectWallet() {
    getProviderOrSigner(NetworkChain, web3ModalRef, true).then((signer) => {
      if (signer) {
        signer.getAddress().then((user) => {
          console.log("siger address ", user);
          setOwner(user);
        });
      }
    });
  }
  async function init() {
    await connectWallet();
    console.log("owner ", owner);
    if (!owner) return;
    getCustomNetworkNFTTrackerContract(NetworkChain, web3ModalRef).then(
      async (TrackerContract) => {
        getAllContractTokens(TrackerContract, setContractTokens).then(
          (contractTokensArray) => {
            setLoading(false);
            let addresses = Object.keys(contractTokensArray);

            addresses?.map(async (adr) => {
              // console.log("address is ", adr);
              getCustomNetworkERC721Contract(
                NetworkChain,
                web3ModalRef,
                adr
              ).then((erc721Contract) => {
                getRentableContract(TrackerContract, adr).then(
                  (rentableContract) => {
                    let tokens = contractTokensArray[adr];
                    console.log(
                      "Smart contract at ",
                      adr,
                      " got tokens: ",
                      tokens
                    );
                    let tokenUris = [];
                    let tokenRentStatusObject = {};
                    tokens?.map((tokenId, index) => {
                      getTokenUri(erc721Contract, tokenId).then((uri) => {
                        getTokenOwner(erc721Contract, tokenId).then(
                          (_owner) => {
                            getTokenRentStatus(
                              TrackerContract,
                              rentableContract,
                              tokenId
                            ).then((tokenRentStatus) => {
                              tokenUris.push(uri);
                              tokenRentStatusObject[tokenId] = tokenRentStatus;
                              if (index + 1 == tokens.length) {
                                // console.log("Token Base URIs got ", tokenUris);
                                let arr = [...contractTokenURIs];
                                let contractInstance = {
                                  ercContractAddress: adr,
                                  tokenURIs: tokenUris,
                                  tokenIds: tokens,
                                  owner: _owner,
                                  rentableContract,
                                  rentalStatus: tokenRentStatusObject,
                                };
                                arr.push(contractInstance);
                                setContractTokenURIs(arr);
                              }
                            });
                          }
                        );
                      });
                    });
                  }
                );
              });
            });
          }
        );

        setNftRentingTracker(TrackerContract);
      }
    );
  }
  function getAccessToken() {
    return props.token;
  }
  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  useEffect(() => {
    init();
  }, [owner]);

  return (
    <>
      {owner == null && (
        <VStack
          paddingTop={"20vh"}
          height={"100vh"}
          bg="black"
          textColor={"white"}
          width={"100%"}
        >
          <Button
            onClick={connectWallet}
            colorScheme={"blue"}
            variant={"solid"}
          >
            Connect Wallet
          </Button>
        </VStack>
      )}
      {owner != null && (
        <>
          <VStack
            height={contractTokenURIs.length > 0 ? "fit-content" : "100vh"}
            bg="black"
            textColor={"white"}
            width={"100%"}
          >
            <Center>
              <VStack>
                <Heading
                  paddingTop={"15vh"}
                  fontSize={"5em"}
                  width={["80vw", "70vw", "50vw"]}
                >
                  Rent cool NFTs
                </Heading>
                <Text
                  fontFamily={"sans-serif"}
                  textColor={"grey"}
                  fontSize={"18px"}
                  width={["80vw", "70vw", "50vw"]}
                >
                  RentWeb3 is your favorite place to rent awesome NFTs to use in
                  your Next game , for attending an event or hosting your
                  Phenomenal event in the Metaverse. We bring you the NFTs from
                  World's best creators at affordable prices. So , if you want
                  to be the part of the family ,Rent an NFT Now !
                </Text>
              </VStack>
            </Center>

            <HStack spacing={10}>
              <FilterMenuItem
                title={"all"}
                setter={setCurrentMenu}
                isClicked={currentMenu === "all"}
              />
              <FilterMenuItem
                title={"available"}
                setter={setCurrentMenu}
                isClicked={currentMenu === "whitelist"}
              />
              <FilterMenuItem
                title={"rented"}
                setter={setCurrentMenu}
                isClicked={currentMenu === "sale"}
              />
            </HStack>

            {loading && <Heading>Loading NFT Collections..</Heading>}

            <VStack
              align={"left"}
              paddingLeft={10}
              width={"100%"}
              height={"fit-content"}
              spacing={10}
            >
              {contractTokenURIs &&
                contractTokenURIs.map((ContractInstance, index) => {
                  return (
                    <ContractNFTs
                      Key={
                        ContractInstance.ercContractAddress + index.toString()
                      }
                      selector={setSelectedNft}
                      contract={ContractInstance}
                    />
                  );
                })}
            </VStack>
          </VStack>
          {selectedNft != null && (
            <Box width={"100vh"} height="fit-content">
              <NftInformationPopup
                NFT={selectedNft}
                displayToggle={setSelectedNft}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}

export default Explorecontracts;
