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
} from "@chakra-ui/react";
import FilterMenuItem from "./components/FilterMenuItem";
import DappInformationPopup from "./components/DappInformationPopup";
import { getCustomNetworkWebsiteRentContract } from "../data/WebsiteRent";
import { fetchWhitelists } from "../data/Whitelist";
import { fetchSales } from "../data/Sale";
import { fetchDappsContent, getAllDappsUris } from "../data/ipfsStuff";
import { getProviderOrSigner } from "../data/accountsConnection";
import { useRef } from "react";

let NetworkChain = "goerli";
export async function getStaticProps(context) {
  require("dotenv").config();
  return {
    props: { token: process.env.WEB3STORAGE_TOKEN }, // will be passed to the page component as props
  };
}

function ExploreDapps(props) {
  const [currentMenu, setCurrentMenu] = useState("all");
  const [selectedDapp, setSelectedDapp] = useState(null);
  const [allDapps, setAllDapps] = useState([]);
  const [dappCids, setDappCids] = useState([]);
  const [loader, setLoader] = useState(true);
  const [whitelistDeployments, setWhitelistDeployments] = useState([]);
  const [saleDeployments, setSaleDeployments] = useState([]);
  const [owner, setOwner] = useState();
  const [websiteRentContract, setWebsiteRentContract] = useState(null);
  let web3ModalRef = useRef();

  async function Connect() {
    getProviderOrSigner(NetworkChain, web3ModalRef, true).then((signer) => {
      signer?.getAddress().then(async (user) => {
        console.log("user is ", user);
        fetchUserDeployments(user);
        setOwner(user);
      });
    });
  }

  useEffect(() => {
    if (!owner) {
      Connect();
    }
  }, []);

  async function fetchUserDeployments(Owner) {
    setLoader(true);
    await fetchWhitelists(
      NetworkChain,
      web3ModalRef,
      Owner,
      setWhitelistDeployments
    );
    await fetchSales(NetworkChain, web3ModalRef, Owner, setSaleDeployments);
    setLoader(false);
  }

  let filteredDapps = [];

  allDapps.map((item) => {
    if (item.type == currentMenu || currentMenu == "all") {
      filteredDapps.push(item);
    }
  });

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
    await getCustomNetworkWebsiteRentContract(
      NetworkChain,
      web3ModalRef,
      setWebsiteRentContract
    ).then(async (contract) => {
      await getAllDappsUris(contract).then(async (cids) => {
        console.log("CIDs are ", cids);
        setDappCids(cids);
        if (cids.length == 0) {
          setLoader(false);
        } else {
          await fetchDappsContent(
            cids,
            setAllDapps,
            NetworkChain,
            web3ModalRef
          );
          setLoader(false);
        }
      });
      setWebsiteRentContract(contract);
    });
  }

  useEffect(() => {
    init();
  }, []);
  console.log("Filtered Dapps are ", filteredDapps);
  console.log("loader is ", loader);
  console.log("cids ", dappCids.length);
  return (
    <>
      <VStack height={"fit-content"} bg="black" textColor={"white"}>
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
        {filteredDapps?.length > 0 ? (
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
                      height={"40vh"}
                      width={"30vw"}
                      src={item.image}
                      borderRadius={"20px"}
                    />
                    <HStack>
                      {" "}
                      <Text fontSize={"20px"}>{item.name}</Text>
                      {item.rented ? (
                        <Text
                          colorScheme={"white"}
                          variant={"solid"}
                          disabled
                          padding={"10px"}
                        >
                          Rented
                        </Text>
                      ) : (
                        <Text
                          padding={"10px"}
                          colorScheme={"aqua"}
                          variant={"solid"}
                          disabled
                        >
                          Available
                        </Text>
                      )}
                    </HStack>
                  </VStack>
                </WrapItem>
              );
            })}
          </Wrap>
        ) : (
          <Heading fontSize={"24px"} height={"50vh"}>
            {loader && "Loading Available Dapps"}
            {!loader && dappCids.length == 0 && "No Dapps Available"}
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
