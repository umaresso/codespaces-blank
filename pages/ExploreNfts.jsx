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
  getBlockchainSpecificNFTFactory,
  getBlockchainSpecificNFTTracker,
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
import { getCurrentConnectedOwner } from "../data/blockchainSpecificExports";
import { useSelector } from "react-redux";

export async function getStaticProps(context) {
  require("dotenv").config();
  return {
    props: { token: process.env.WEB3STORAGE_TOKEN }, // will be passed to the page component as props
  };
}

function ExploreNfts(props) {
  const selectedBlockchainInformation = useSelector(
    (state) => state.blockchain.value
  );
  let _Blockchain = selectedBlockchainInformation.name;
  let _NetworkChain = selectedBlockchainInformation.network;
  let connectedAddress = selectedBlockchainInformation.address;
  const [currentMenu, setCurrentMenu] = useState("all");
  const [walletAddress, setWalletAddress] = useState(connectedAddress);
  const [selectedNft, setSelectedNft] = useState(null);
  const [NftRentingTracker, setNftRentingTracker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [NFTs, setNFTs] = useState([]);
  const [Blockchain, setBlockchain] = useState(null);
  const [NetworkChain, setNetworkChain] = useState(null);
  let filteredNfts = [];
  let web3ModalRef = useRef();
  async function connectWallet() {
    let _user = await getCurrentConnectedOwner(
      _Blockchain,
      _NetworkChain,
      web3ModalRef
    );
    setWalletAddress(_user);
    //  console.log("user from connectwallet", _user);
  }
  function RefreshToNewBlockchain() {
    setLoading(true);
    setNetworkChain(_NetworkChain);
    setBlockchain(_Blockchain);
    setNFTs([]);
    console.log("calling init");
    init();
  }

  async function init() {
    setNFTs([]);
    if (!walletAddress) return;
    let allNFTs = [];
    //console.log({ Blockchain, NetworkChain, web3ModalRef });
    let trackerContract = await getBlockchainSpecificNFTTracker(
      _Blockchain,
      _NetworkChain,
      web3ModalRef
    );

    // console.log("Tracker contract is ", trackerContract);
    let contractsArray = await getAllContractAddressess(
      trackerContract,
      null,
      _Blockchain,
      _NetworkChain
    );
    // console.log("Contracts to read from", contractsArray);
    if (!contractsArray || contractsArray.length == 0) {
      setLoading(false);
      return 0;
    }
    let allContractsTokens = await getAllContractTokens(
      trackerContract,
      null,
      _Blockchain
    );
    // console.log("All contract tokens are ", allContractsTokens);

    let indexer = 0;
    if (!contractsArray || contractsArray.length == 0) {
      setLoading(false);
      return 0;
    }
    contractsArray?.map(async (contractAddress, contractsAddressIndex) => {
      let thisContractTokens = allContractsTokens[contractAddress];
      let rentableContractAddress = await getRentableContract(
        trackerContract,
        contractAddress,
        null,
        _Blockchain
      );
      if (!rentableContractAddress) {
        // console.log("no rentable contract ");
        return null;
      }

      let rentableContractInstance = await getBlockchainSpecificNFTFactory(
        _Blockchain,
        _NetworkChain,
        web3ModalRef,
        rentableContractAddress
      );

      thisContractTokens?.map(async (token, tokenIndexer) => {
        let currentUser = await getNftUser(
          rentableContractInstance,
          token.id,
          _Blockchain
        );
        let rentPrice = await getNftPrice(
          trackerContract,
          rentableContractAddress,
          token.id,
          _Blockchain
        );
        let rented = await isRented(
          trackerContract,
          rentableContractAddress,
          token.id,
          _Blockchain
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
            setCurrentMenu("all");
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
    init();
  }, [walletAddress, _Blockchain]);
  // if (_Blockchain != Blockchain) {
  //   RefreshToNewBlockchain();
  // }

  // console.log("NFTs are", NFTs);
  let filtered = [];
  filteredNfts = [];
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
    filteredNfts = [...NFTs];
  }

  //  console.log("filtered NFT are", filteredNfts);

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
                  World&apos;s best creators at affordable prices. So , if you
                  want to be the part of the family ,Rent an NFT Now !
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
                {filteredNfts?.map((nft, index) => {
                  return (
                    <WrapItem
                      key={
                        "wrap" + nft.erc721ContractAddress.toString() + index
                      }
                    >
                      <NftDetails
                        Key={
                          "nftDetails" +
                          nft.id +
                          nft.erc721ContractAddress.toString() +
                          index
                        }
                        key={
                          "nftDetailsKey" +
                          nft.id +
                          nft.erc721ContractAddress.toString() +
                          index
                        }
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
