import React, { useEffect, useState, useRef } from "react";
import {
  VStack,
  Heading,
  Center,
  Text,
  WrapItem,
  Wrap,
} from "@chakra-ui/react";
import { fetchWhitelists } from "../data/Whitelist";
import { fetchSales } from "../data/Sale";
import DeploymentCard from "./components/DeploymentCard";
import { getProviderOrSigner } from "../data/accountsConnection";
import { tronConnect } from "../data/TronAccountsManagement";
/**
 *
 * Blockchain Things
 */

//  let NetworkChain = "goerli";
// let Blockchain="ethereum"

let NetworkChain = "nile";
let Blockchain = "tron";

function Deployments() {
  const [loading, setLoading] = useState("");

  const [whitelistDeployments, setWhitelistDeployments] = useState([]);
  const [saleDeployments, setSaleDeployments] = useState([]);
  const [totalWhitelistCount, setTotalWhitelistCount] = useState(0);
  const [totalSaleCount, setTotalSaleCount] = useState(0);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [owner, setOwner] = useState(null);
  const Web3ModalRef = useRef();

  async function init() {
    if (Blockchain == "ethreum") {
      console.log("Ethereum Fetch...");
      getProviderOrSigner(NetworkChain, Web3ModalRef, true).then((signer) => {
        signer
          ?.getAddress()
          .then(async (user) => {
            fetchUserDeployments(user);
            setOwner(user);
          })
          .catch(console.log);
      });
    } else if (Blockchain == "tron") {
      console.log("Tron Fetch...");
      let ownerAddress = await tronConnect();
      console.log("Tron connected with address :", ownerAddress);
      fetchUserDeployments(ownerAddress);
      setOwner(ownerAddress);
    } else if (Blockchain == "polygon") {
    } else {
      alert("Invalid Blockchain" + Blockchain);
    }
  }
  useEffect(() => {
    init();
  }, []);

  async function fetchUserDeployments(_owner) {
    setLoading(true);
    await fetchWhitelists(
      NetworkChain,
      Web3ModalRef,
      _owner,
      setWhitelistDeployments,
      Blockchain
    );
    // await fetchSales(
    //   NetworkChain,
    //   Web3ModalRef,
    //   _owner,
    //   setSaleDeployments,
    //   Blockchain
    // );

    setLoading(false);
  }

  return (
    <>
      {!selectedDeployment && (
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
            <Center>
              <VStack spacing={10}>
                <Heading>Whitelist Deployments</Heading>
                <Wrap justify={"center"} spacing={10}>
                  {whitelistDeployments.map((item, index) => {
                    return (
                      <WrapItem key={"wrapWhitelist" + item.name + index}>
                        <DeploymentCard
                          item={item}
                          key={"whitelist" + item.id+item.id}
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

          <Center padding={"10px"}>
            {saleDeployments.length > 0 ? (
              <VStack spacing={10}>
                <Heading>Sale Deployments</Heading>
                <Wrap justify={"center"} spacing={10}>
                  {saleDeployments.map((item, index) => {
                    return (
                      <WrapItem key={"wrapSale" + item.name + index}>
                        <DeploymentCard
                          item={item}
                          key={"sale" + item.name}
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
