import React, { useEffect, useState, useRef } from "react";
import {
  VStack,
  Heading,
  Center,
  Text,
  WrapItem,
  Wrap,
  Button,
} from "@chakra-ui/react";
import { fetchWhitelists } from "../data/Whitelist";
import { fetchSales } from "../data/Sale";
import DeploymentCard from "./components/DeploymentCard";
import { getProviderOrSigner } from "../data/accountsConnection";
import { tronConnect } from "../data/TronAccountsManagement";
import { useSelector } from "react-redux";
import { getCurrentConnectedOwner } from "../data/blockchainSpecificExports";

function Deployments() {
  const selectedBlockchainInformation = useSelector(
    (state) => state.blockchain.value
  );
  let _Blockchain = selectedBlockchainInformation.name;
  let _NetworkChain = selectedBlockchainInformation.network;
  let connectedAddress = selectedBlockchainInformation.address;

  const [loading, setLoading] = useState(true);
  const [whitelistDeployments, setWhitelistDeployments] = useState([]);
  const [saleDeployments, setSaleDeployments] = useState([]);
  const [totalWhitelistCount, setTotalWhitelistCount] = useState(0);
  const [totalSaleCount, setTotalSaleCount] = useState(0);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [owner, setOwner] = useState(null);
  const [Blockchain, setBlockchain] = useState(null);
  const [NetworkChain, setNetworkChain] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const Web3ModalRef = useRef();

  async function init() {
    await getCurrentConnectedOwner(_Blockchain, _NetworkChain, Web3ModalRef);
    whitelistDeployments.length != 0 && setWhitelistDeployments([]);
    saleDeployments.length != 0 && setSaleDeployments([]);
    if (!connectedAddress) return null;
    fetchUserDeployments(connectedAddress);
  }

  function RefreshToNewBlockchain() {
    loading != true && setLoading(true);
    whitelistDeployments.length != 0 && setWhitelistDeployments([]);
    saleDeployments.length != 0 && setSaleDeployments([]);

    init();

    // setNetworkChain(_NetworkChain);
    // setBlockchain(_Blockchain);

    // console.log("calling init");
  }

  useEffect(() => {
    init();
    if (connectedAddress && !walletAddress) {
      setWalletAddress(connectedAddress);
    } else if (
      connectedAddress &&
      walletAddress &&
      connectedAddress != walletAddress
    ) {
      setWalletAddress(connectedAddress);
    }
  }, [_Blockchain]);

  async function fetchUserDeployments(_owner) {
    loading != true && setLoading(true);

    await fetchWhitelists(
      _NetworkChain,
      Web3ModalRef,
      _owner,
      setWhitelistDeployments,
      _Blockchain
    );
    await fetchSales(
      _NetworkChain,
      Web3ModalRef,
      connectedAddress,
      setSaleDeployments,
      _Blockchain,
      () => {
        setLoading(false);
      }
    );
  }
  async function connectWallet() {
    let usr = await getCurrentConnectedOwner(
      _Blockchain,
      _NetworkChain,
      Web3ModalRef
    );
    setWalletAddress(usr);
  }
  // if (Blockchain != _Blockchain) {
  //   RefreshToNewBlockchain();
  // }

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

      {walletAddress && !selectedDeployment && (
        <VStack
          padding={"10px"}
          height={"fit-content"}
          bg={"black"}
          paddingTop={"10vh"}
          textColor={"white"}
        >
          <Heading fontSize={["2em", "3em", "4em"]} marginTop={"10px"}>
            My Deployments
          </Heading>

          {whitelistDeployments.length > 0 ? (
            <Center key={"whitelist container"}>
              <VStack spacing={10}>
                <Heading>Whitelist Deployments</Heading>
                <Wrap justify={"center"} spacing={10}>
                  {whitelistDeployments.map((item, index) => {
                    return (
                      <WrapItem key={"wrapWhitelist" + index}>
                        <DeploymentCard
                          item={item}
                          Key={"whitelist" + item.id + index}
                          type={"whitelist"}
                          showIntegratePopup={() =>
                            setSelectedDeployment({
                              ...item,
                              type: "whitelist",
                            })
                          }
                        />
                      </WrapItem>
                    );
                  })}
                </Wrap>
              </VStack>
            </Center>
          ) : (
            <Text fontSize={"24px"} fontWeight={"700"} height={"50vh"}>
              {!loading
                ? "No Whitelist Deployments Found"
                : "Fetching Whitelists..."}
            </Text>
          )}

          <Center key={"sale container"} padding={"10px"}>
            {saleDeployments.length > 0 ? (
              <VStack spacing={10}>
                <Heading>Sale Deployments</Heading>
                <Wrap justify={"center"} spacing={10}>
                  {saleDeployments.map((item, index) => {
                    return (
                      <WrapItem
                        key={"wrapSale" + item.address + item.id + index}
                      >
                        <DeploymentCard
                          item={item}
                          Key={
                            "saleDeployment" + item.address + item.id + index
                          }
                          type={"sale"}
                        />
                      </WrapItem>
                    );
                  })}
                </Wrap>
              </VStack>
            ) : (
              <Text fontSize={"24px"} fontWeight={"700"} height={"50vh"}>
                {!loading ? "No Sale Deployments Found" : "Fetching Sales..."}
              </Text>
            )}
          </Center>
        </VStack>
      )}
    </>
  );
}

export default Deployments;
