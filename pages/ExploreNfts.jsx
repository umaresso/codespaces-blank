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
import { getProviderOrSigner } from "./data/accountsConnection";
import {
  getCustomNetworkNFTTrackerContract,
  getNftPrice,
  getRentableContract,
  isRented,
} from "./data/NftRenting";
import {
  getAllContractAddressess,
  getAllContractTokens,
} from "./data/ipfsStuff";
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
  const [owner, setOwner] = useState(null);
  const [selectedNft, setSelectedNft] = useState(null);
  const [NftRentingTracker, setNftRentingTracker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [NFTs, setNFTs] = useState([]);
  let web3ModalRef = useRef();
  // console.log("contract tokens are", contractTokens);

  /**
   *
   * IPFS
   *
   */

  // function getAccessToken() {
  //   return props.token;
  // }
  // async function storeWithProgress(files) {
  //   // show the root cid as soon as it's ready
  //   const onRootCidReady = (cid) => {
  //     console.log("uploading files with cid:", cid);
  //   };

  //   // when each chunk is stored, update the percentage complete and display
  //   const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
  //   let uploaded = 0;

  //   const onStoredChunk = (size) => {
  //     uploaded += size;
  //     const pct = 100 * (uploaded / totalSize);
  //   };

  //   const client = makeStorageClient();
  //   return client.put(files, { onRootCidReady, onStoredChunk });
  // }
  // async function StoreUpdatedcontractsOnIpfs(contractAddresses) {
  //   const _blob = new Blob(
  //     [
  //       JSON.stringify({
  //         contracts: [...contractAddresses],
  //       }),
  //     ],
  //     { type: "application/json" }
  //   );
  //   const updatedDappInfo = [new File([_blob], `contracts.json`)];
  //   let newCID = await storeWithProgress(updatedDappInfo);
  //   return newCID;
  // }

  /**      */

  async function connectWallet() {
    getProviderOrSigner(NetworkChain, web3ModalRef, true).then((signer) => {
      if (signer) {
        signer.getAddress().then((user) => {
          setOwner(user);
        });
      }
    });
  }
  async function init() {
    await connectWallet();
    if (!owner) return;
    let trackerContract = await getCustomNetworkNFTTrackerContract(
      NetworkChain,
      web3ModalRef
    );
    //  console.log("Tracker contract is ",trackerContract);
    let contractsArray = await getAllContractAddressess(trackerContract);
    //    console.log("Contracts to read from",contractsArray)
    let allContractsTokens = await getAllContractTokens(trackerContract);
    // console.log("All contract tokens are ", allContractsTokens);
    let allNFTs = [];
    contractsArray?.map((contractAddress, contractsAddressIndex) => {
      let thisContractTokens = allContractsTokens[contractAddress];
      //console.log("contract ",contractAddress, " has tokens ",thisContractTokens);
      thisContractTokens?.map(async (token) => {
        let rentableContractAddress = await getRentableContract(
          trackerContract,
          contractAddress
        );
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
        let enhancedToken = { ...token, price: rentPrice, rented };
        // console.log("enhanced token is ",enhancedToken)
        allNFTs.push(enhancedToken);
      });
      if (contractsAddressIndex + 1 == contractsArray.length) {
        //        console.log("setting filtred nfts as ",allNFTs)
        setNFTs(allNFTs);
        setLoading(false);
      }
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
  }, [owner]);

  let filteredNfts = [...NFTs];
  console.log("filtered NFT are", filteredNfts);

  return (
    <>
    <VStack
          paddingTop={"20vh"}
          height={"100vh"}
          bg="black"
          textColor={"white"}
          width={"100%"}
        >
      {filteredNfts?.map((nft) => {
        return <NftDetails NFT={nft} />;
      })}

        </VStack>

      {/* {owner == null && (
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
            height={"100vh"}
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

            {loading && <Heading>Loading NFT Collections..</Heading>}

            <VStack
              align={"left"}
              paddingLeft={10}
              width={"100%"}
              height={"fit-content"}
              spacing={10}
            >
              {
                filteredNfts?.map(nft=>{
                 return <NftDetails  NFT={nft}/>
                })
              }
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
          */}
    </>
  );
}

export default ExploreNfts;
