import React, { useEffect, useState } from "react";
import {
  Heading,
  HStack,
  Img,
  Text,
  VStack,
  Wrap,
  Center,
  WrapItem,
  Button,
} from "@chakra-ui/react";
import FilterMenuItem from "./components/FilterMenuItem";
import DappInformationPopup from "./components/DappInformationPopup";
import { getCustomNetworkWebsiteRentContract } from "../data/WebsiteRent";
import {
  fetchWhitelists,
  getBlockchainSpecificWebsiteRentContract,
} from "../data/Whitelist";
import { fetchSales } from "../data/Sale";
import { fetchDappsContent, getAllDappsUris } from "../data/ipfsStuff";
import { getProviderOrSigner } from "../data/accountsConnection";
import { useRef } from "react";
import { getCurrentConnectedOwner } from "../data/blockchainSpecificExports";
import { useSelector } from "react-redux";
import { set } from "lodash";

export async function getStaticProps(context) {
  require("dotenv").config();
  return {
    props: { token: process.env.WEB3STORAGE_TOKEN }, // will be passed to the page component as props
  };
}

function ExploreDapps(props) {
  const selectedBlockchainInformation = useSelector(
    (state) => state.blockchain.value
  );
  let _Blockchain = selectedBlockchainInformation.name;
  let _NetworkChain = selectedBlockchainInformation.network;
  let connectedAddress = selectedBlockchainInformation.address;

  const [currentMenu, setCurrentMenu] = useState("all");
  const [selectedDapp, setSelectedDapp] = useState(null);
  const [allDapps, setAllDapps] = useState([]);
  const [dappCids, setDappCids] = useState([]);
  const [loader, setLoader] = useState(true);
  const [whitelistDeployments, setWhitelistDeployments] = useState([]);
  const [saleDeployments, setSaleDeployments] = useState([]);
  const [owner, setOwner] = useState();
  const [websiteRentContract, setWebsiteRentContract] = useState(null);
  const [Blockchain, setBlockchain] = useState(null);
  const [NetworkChain, setNetworkChain] = useState(null);
  const [noDapps, setNoDapps] = useState(false);
  let web3ModalRef = useRef();

  async function fetchUserDeployments() {
    setLoader((prev) => prev != true && true);

    let wh = await fetchWhitelists(
      _NetworkChain,
      web3ModalRef,
      connectedAddress,
      setWhitelistDeployments,
      _Blockchain
    );
    await fetchSales(
      _NetworkChain,
      web3ModalRef,
      connectedAddress,
      setSaleDeployments,
      _Blockchain
    );
    setLoader((prev) => prev != false && false);
  }

  /**
   *
   * IPFS
   *
   */

  function getAccessToken() {
    return props.token;
  }
  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  /**      */
  async function init() {
    setDappCids([]);
    setAllDapps([]);
    await getCurrentConnectedOwner(
      _Blockchain,
      _NetworkChain,
      web3ModalRef,
      setOwner
    );

    if (!owner && !connectedAddress) return null;
    await fetchUserDeployments(connectedAddress);

    let contract = await getBlockchainSpecificWebsiteRentContract(
      _Blockchain,
      _NetworkChain,
      web3ModalRef
    );

    let cids = await getAllDappsUris(contract, setDappCids, _Blockchain);
    if (cids.length == 0) {
      setAllDapps([]);
      setDappCids([]);
      setLoader((prev) => prev != false && false);
      setNoDapps(true);
      return null;
    } else {
      await fetchDappsContent(
        cids,
        setAllDapps,
        _NetworkChain,
        web3ModalRef,
        _Blockchain
      ).then((res) => {
        setLoader((prev) => prev != false && false);
      });
    }

    setWebsiteRentContract(contract);
  }

  useEffect(() => {
    init();
  }, []);
  if (_Blockchain != Blockchain) {
    RefreshToNewBlockchain();
  }

  function RefreshToNewBlockchain() {
    setLoader((prev) => prev != true && true);
    setOwner(connectedAddress);
    init();
    setNetworkChain(_NetworkChain);
    setBlockchain(_Blockchain);
    // console.log("calling init");
  }

  let filteredDapps = [];

  allDapps?.map((item) => {
    if (item.type == currentMenu || currentMenu == "all") {
      filteredDapps.push(item);
    }
  });

  //  console.log("Filtered Dapps are ", filteredDapps);

  return (
    <>
      <VStack
        height={"fit-content"}
        minH={"100vh"}
        bg="black"
        textColor={"white"}
      >
        <Center>
          <VStack>
            <Heading paddingTop={"10vh"} fontSize={"4.5em"} width={"60vw"}>
              Rent Awesome Dapps like You
            </Heading>
            <Text
              fontFamily={"sans-serif"}
              textColor={"grey"}
              fontSize={"18px"}
              width={"60vw"}
            >
              RentWeb3 provides you bunch of Dapps to rent for your NFT
              Collection. Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Temporibus quas nulla consequatur fugiat ducimus ullam,
              laboriosam mollitia adipisci asperiores nisi tempore. Beatae,
              exercitationem rem? Minus nobis eaque iure temporibus quos.
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
            title={"whitelist"}
            setter={setCurrentMenu}
            isClicked={currentMenu === "whitelist"}
          />
          <FilterMenuItem
            title={"sale"}
            setter={setCurrentMenu}
            isClicked={currentMenu === "sale"}
          />
        </HStack>
        {!loader && filteredDapps?.length > 0 ? (
          <Wrap
            padding={"10px"}
            transition={"display 900ms ease-in-out"}
            spacing={10}
          >
            {filteredDapps?.map((item, index) => {
              return (
                <WrapItem
                  key={"wrap" + item.name + index}
                  transition={"all 300ms ease-in-out"}
                  _hover={{
                    transform: "scale(1.05)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedDapp({ ...item });
                  }}
                >
                  <VStack key={"item" + item.name}>
                    <Img
                      width={["70vw", "60vw", "40vw"]}
                      height={"30vh"}
                      objectFit={"contain"}
                      src={item.image}
                      borderRadius={"20px"}
                    />
                    <HStack>
                      {" "}
                      <Text fontSize={"20px"}>{item.name}</Text>
                      {item.rented ? (
                        <Button
                          background={"blue"}                          
                          variant={"solid"}
                          disabled
                          padding={"10px"}
                        >
                          Rented
                        </Button>
                      ) : (
                        <Button
                          background={"green"}                          
                          variant={"solid"}
                          disabled
                          padding={"10px"}
                        >
                          Available
                        </Button>
                      )}
                    </HStack>
                  </VStack>
                </WrapItem>
              );
            })}
          </Wrap>
        ) : (
          <Heading fontSize={"24px"} height={"50vh"}>
            {loader && !noDapps && "Loading Available Dapps"}
            {!loader && noDapps && "No Available Dapps"}
          </Heading>
        )}
      </VStack>
      {selectedDapp != null && (
        <DappInformationPopup
          displayToggle={() => setSelectedDapp(null)}
          dapp={selectedDapp}
          sales={saleDeployments.map((item) => item.address)}
          whitelists={whitelistDeployments.map((item) => item.address)}
        />
      )}
    </>
  );
}

export default ExploreDapps;
