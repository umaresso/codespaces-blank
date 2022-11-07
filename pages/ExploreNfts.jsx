import React, { useEffect, useState } from "react";
import {
  Heading,
  HStack,
  Box,
  Text,
  VStack,
  Center,
  Button,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import FilterMenuItem from "./components/FilterMenuItem";
import { useRef } from "react";
import { getProviderOrSigner } from "../data/accountsConnection";
import {
  getCustomNetworkNFTFactoryContract,
  getCustomNetworkNFTTrackerContract,
  getNftPrice,
  getNftUser,
  getRentableContract,
  isRented,
} from "../data/NftRenting";
import {
  getAllContractAddressess,
  getAllContractTokens,
} from "../data/ipfsStuff";
import NftInformationPopup from "./components/NftInformationPopup";
import NftDetails from "./components/NftDetails";

let NetworkChain = "goerli";
export async function getStaticProps(context) {
  require("dotenv").config();
  return {
    props: { token: process.env.WEB3STORAGE_TOKEN }, // will be passed to the page component as props
  };
}

function ExploreNfts(props) {
  const [currentMenu, setCurrentMenu] = useState("all");
  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedNft, setSelectedNft] = useState(null);
  const [NftRentingTracker, setNftRentingTracker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [NFTs, setNFTs] = useState([]);
 let filteredNfts=[];
  let web3ModalRef = useRef();
  async function connectWallet() {
    getProviderOrSigner(NetworkChain, web3ModalRef, true).then((signer) => {
      if (signer) {
        signer.getAddress().then((user) => {
          setWalletAddress(user);
        });
      }
    });
  }
  async function init() {
    if (!walletAddress) return;
    let allNFTs = [];
    let trackerContract = await getCustomNetworkNFTTrackerContract(
      NetworkChain,
      web3ModalRef
    );
    //  console.log("Tracker contract is ",trackerContract);
    let contractsArray = await getAllContractAddressess(trackerContract);
    // console.log("Contracts to read from", contractsArray);
    let allContractsTokens = await getAllContractTokens(trackerContract);
    // console.log("All contract tokens are ", allContractsTokens);

    let indexer = 0;
    if (contractsArray.length == 0) {
      setLoading(false);
      return 0;
    }
    contractsArray?.map(async (contractAddress, contractsAddressIndex) => {
      let thisContractTokens = allContractsTokens[contractAddress];
      let rentableContractAddress = await getRentableContract(
        trackerContract,
        contractAddress
      );
      let rentableContractInstance = await getCustomNetworkNFTFactoryContract(
        NetworkChain,
        web3ModalRef,
        rentableContractAddress
      );
      thisContractTokens?.map(async (token, tokenIndexer) => {
        console.log("Token is ", token);
        let currentUser = await getNftUser(rentableContractInstance, token.id);
        let rentPrice = await getNftPrice(
          trackerContract,
          rentableContractAddress,
          token.id
        );
        let rented = await isRented(
          trackerContract,
          rentableContractAddress,
          token.id
        );
        if (!rented) {
          currentUser = null;
        }
        let _token = {
          name: token.name,
          id: token.id,
          description: token.description,
          image: token.image,
          erc721ContractAddress: token.erc721ContractAddress,
          owner: token.owner,
          rentPrice: rentPrice,
          rented: rented,
          user: currentUser,
        };
        allNFTs.push(_token);
        // if it's last token to show
        if (
          contractsAddressIndex + 1 == contractsArray.length &&
          tokenIndexer + 1 == thisContractTokens.length
        ) {

          setNFTs(allNFTs);
          setTimeout(() => {
            setLoading(false);
            setCurrentMenu("all")
            
          }, 2000);
        }
      });
    });

    setNftRentingTracker(trackerContract);
  }
  function getAccessToken() {
    return props.token;
  }
  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  useEffect(() => {
    setLoading(true);

    init();
  }, [walletAddress]);

  // console.log("NFTs are", NFTs);
  let filtered = [];
  if (currentMenu != "all") {
    NFTs?.map((nft) => {
      if (
        (currentMenu == "rented" && nft.rented) ||
        (currentMenu == "available" && !nft.rented) ||
        (currentMenu == "mine" &&
          (nft.owner == walletAddress || nft.user == walletAddress))
      ) {
        filteredNfts.push(nft);
      }
    });
  } else {
    filteredNfts=[...NFTs];
  }
  
  console.log("filtered NFT are", filteredNfts);

  return (
    <>
      {walletAddress == null && (
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
      {walletAddress != null && (
        <>
          <VStack
            height={filteredNfts?.length > 0 ? "fit-content" : "100vh"}
            minHeight={"100vh"}
            bg="black"
            textColor={"white"}
            width={"100%"}
            paddingBottom={"5vh"}
          >
            <Center>
              <VStack>
                <Heading
                  paddingTop={"15vh"}
                  fontSize={"4em"}
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
                  World&apos;s best creators at affordable prices. So , if you want
                  to be the part of the family ,Rent an NFT Now !
                </Text>
              </VStack>
            </Center>

            <HStack spacing={10}>
              <FilterMenuItem
                key={"filter-all"}
                title={"all"}
                setter={setCurrentMenu}
                isClicked={currentMenu === "all"}
              />
              <FilterMenuItem
                key={"filter-available"}
                title={"available"}
                setter={setCurrentMenu}
                isClicked={currentMenu === "available"}
              />
              <FilterMenuItem
                key={"filter-rented"}
                title={"rented"}
                setter={setCurrentMenu}
                isClicked={currentMenu === "rented"}
              />
              <FilterMenuItem
                key={"filter-mine"}
                title={"mine"}
                setter={setCurrentMenu}
                isClicked={currentMenu === "mine"}
              />
            </HStack>

            {loading && (
              <Heading fontSize={"24px"}>Loading NFT Collections..</Heading>
            )}

            <HStack
              paddingLeft={10}
              width={"100%"}
              height={"fit-content"}
              spacing={10}
            >
              <Wrap
                justify={"center"}
                width={filteredNfts.length > 0 ? "100vw" : "0vw"}
                spacing={10}
              >
                {filteredNfts?.map((nft) => {
                  return (
                    <WrapItem key={nft.id + nft.name}>
                      <NftDetails
                        key={''+nft.id + nft.name+nft.erc721ContractAddress.toString()}
                        selector={setSelectedNft}
                        NFT={nft}
                      />
                    </WrapItem>
                  );
                })}
              </Wrap>

              {!loading && filteredNfts.length == 0 && (
                <Center width={"100vw"}>
                  <Heading fontSize={"24px"}>
                    {currentMenu == "all"
                      ? "No Collections to Display"
                      : `No Collections for Category
                      "${currentMenu.toLocaleUpperCase()}"`}
                  </Heading>
                </Center>
              )}
            </HStack>
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

export default ExploreNfts;
