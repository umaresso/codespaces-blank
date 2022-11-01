import {
  Button,
  Heading,
  VStack,
  Input,
  Text,
  Highlight,
  Box,
  Center,
} from "@chakra-ui/react";
import {
  getCustomNetworkSaleContract,
  getCustomNetworkSaleTrackerContract,
} from "./data/Sale";
import {
  fetchWhitelistAddresses,
  getCustomNetworkWhitelistContract,
  getCustomNetworkWhitelistTrackerContract,
  whitelistABI,
} from "./data/Whitelist";

import React, { useEffect, useState, useRef } from "react";
import NamedInput from "./components/NamedInput";
import Link from "next/link";
import Card from "./components/Card/Card";
import Sale from "./components/Sale";
import LinkButton from "./components/LinkButton/LinkButton";
import DropDownMenu from "./components/DropDownMenu";
import SuccessfulDeployment from "./components/SuccessfulDeployment";
import { getProviderOrSigner } from "./data/accountsConnection";
import { minimizeContractInterface } from "@wagmi/core";

let NetworkChain = "goerli";
let Blockchain = "ethereum";

function CreateSale() {
  /**
   *  For Theming
   */
  let bg = "black";
  let textColor = "white";
  /** */

  const [formStep, setFormStep] = useState(1);
  const [deployedAddress, setDeployedAddress] = useState(null);
  const [whitelists, setWhitelists] = useState([]);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [baseURI, setBaseURI] = useState("");
  const [owner, setOwner] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [presaleMintRate, setPresaleMintRate] = useState(1);
  const [publicMintRate, setPublicMintRate] = useState(2);
  const [totalSupply, setTotalSupply] = useState("");
  const [whitelistAddress, setWhitelistAddress] = useState(null);
  const [loader, setLoader] = useState(false);
  const Web3ModalRef = useRef();
  const [saleTrackerContract, setSaleTrackerContract] = useState(null);
  const [saleContract, setSaleContract] = useState(null);
  const [whitelistFactory, setWhitelistFactory] = useState(null);
  function setStatus(message) {
    let ele = document.getElementById("creationStatus");
    var p_tag = document.createElement("p");
    p_tag.key = `message${message}`;
    p_tag.textContent = "-> " + message;
    ele.append(p_tag);
  }
  function getMinimalAddress(adr) {
    if (!adr) return "Fetching..";
    return adr.slice(0, 6) + ".." + adr.slice(38);
  }

  async function fetchDetails() {
    await getCustomNetworkWhitelistContract(
      NetworkChain,
      Web3ModalRef,
      whitelistAddress
    )
      .then(async (contract) => {
        console.log("fetching details from ", contract);
        let _name = await contract.name();
        setName(_name);
        let _symbol = await contract.symbol();
        setSymbol(_symbol);
        let _baseURI = await contract.baseURI();
        setBaseURI(_baseURI);
        let _owner = await contract.owner();
        setOwner(_owner);
        setFormStep((prev) => prev + 1);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function deploySale(saleobj) {
    setFormStep((prev) => prev + 1);
    setLoader((prev) => prev !== true && true);
    setStatus("Creating Ethereum Sale..");
    let sale = { ...saleobj };
    sale.presaleMintRate = presaleMintRate;
    sale.publicMintRate = publicMintRate;
    (async () => {
      // Deploy the contract to Ethereum test network - Goerli

      // Deploy the contract
      const factory = saleContract;
      try {
        setStatus("Deploying " + sale.name + "..");

        const contract = await factory.deploy(
          whitelistAddress,
          sale.name,
          sale.symbol,
          sale.owner,
          sale.baseURI,
          sale.startTime,
          sale.endTime,
          presaleMintRate,
          publicMintRate,
          sale.saleSupply
        );

        // "uar",100,owner,baseURI,1665317824956,1665317824956

        let tx = await contract.deployed();
        setStatus("It's taking longer but bear with us :/ ");

        setStatus(`Deployment successful 🎉 `);
        setStatus(`Contract Address:`);
        setStatus(minimizeContractInterface(contract.address));

        setStatus("Storing it!");
        await trackSaleDeployment(contract.address);
      } catch (e) {
        alert("deployment unsuccessful :(");
        alert("See Console for Details !");
        console.log("Deployment Unsuccessful Error", e);
      }
    })();
  }

  async function trackSaleDeployment(contractAddress) {
    let contract = saleTrackerContract;
    setStatus("Transaction initiated !");
    let tx = await contract.addUserSale(owner, contractAddress);
    setStatus("Waiting for Transaction Completion ");

    await tx.wait();
    setStatus("Storage Successful 🎉");

    setDeployedAddress(contractAddress);
  }

  async function getUserWhitelists() {
    getProviderOrSigner(NetworkChain, Web3ModalRef, true).then((signer) => {
      signer
        .getAddress()
        .then(async (user) => {
          getCustomNetworkWhitelistTrackerContract(
            NetworkChain,
            Web3ModalRef,
            true
          ).then(async (trackerContract) => {
            await fetchWhitelistAddresses(
              trackerContract,
              user,
              setWhitelists
            ).then((list) => {
              setWhitelistAddress(list[0]);
            });
          });

          setOwner(user);
        })
        .catch(console.log);
    });
  }

  async function init() {
    getUserWhitelists();
    getCustomNetworkSaleContract(NetworkChain, Web3ModalRef)
      .then(async (contract) => {
        setSaleContract(contract);
      })
      .catch((e) => {
        console.log("error  in obtaining the contract ");
      });
    getCustomNetworkSaleTrackerContract(NetworkChain, Web3ModalRef)
      .then(async (contract) => {
        setSaleTrackerContract(contract);
      })
      .catch((e) => {
        console.log("error  in obtaining the contract ");
      });
    getCustomNetworkWhitelistContract(NetworkChain, Web3ModalRef).then(
      async (contract) => {
        console.log("contract factory is ", contract);
        setWhitelistFactory(contract);
      }
    );
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {deployedAddress === null && (
        <Box>
          {formStep == 1 && (
            <Card>
              <VStack height={"90vh"} justify={"center"} color={textColor}>
                <Heading paddingBottom={"5vh"}>Create Sale</Heading>
                <VStack spacing={30}>
                  <NamedInput title={"Whitelist"}>
                    {
                      <DropDownMenu
                        key={"whitelisAddress"}
                        selected={
                          whitelistAddress ? whitelistAddress : whitelists[0]
                        }
                        selector={setWhitelistAddress}
                        options={whitelists}
                      />
                    }
                  </NamedInput>

                  <Text color="white">
                    if you have not created whitelist before{" "}
                    <a href="/CreateWhitelist">
                      <i
                        style={{ textDecoration: "underline", padding: "4px" }}
                      >
                        Create Here
                      </i>
                    </a>{" "}
                  </Text>

                  <LinkButton
                    onClick={fetchDetails}
                    title={`Fetch Details`}
                    loadingMessage={`Fetching Details..`}
                    color={"green"}
                    variant={"solid"}
                  />
                </VStack>
              </VStack>
            </Card>
          )}
          {formStep == 2 && (
            <Sale
              saleType={"Sale"}
              deploySale={deploySale}
              _name={name}
              _symbol={symbol}
              _owner={owner}
              _baseURI={baseURI}
            >
              <NamedInput title={"Presale Rate (ETH)"}>
                <Input
                  key={"presaleRate"}
                  onChange={(e) => {
                    let res = e.target.value;
                    setPresaleMintRate(res);
                  }}
                  variant="outline"
                  defaultValue={presaleMintRate}
                />
              </NamedInput>
              <NamedInput title={"PublicMint Rate(ETH)"}>
                <Input
                  key={"publicMintRate"}
                  onChange={(e) => {
                    let res = e.target.value;
                    setPublicMintRate(res);
                  }}
                  variant="outline"
                  placeholder={
                    Blockchain == "ethereum"
                      ? "1 Eth = 10^18"
                      : Blockchain == "Tron"
                      ? "1 Tron=1000000"
                      : "1 MATIC=10^18"
                  }
                  defaultValue={publicMintRate}
                />
              </NamedInput>
            </Sale>
          )}

          <VStack
            height={formStep != 2 ? "100vh" : "1px"}
            bg={"black"}
            color={"white"}
            width={"100vw"}
            paddingTop={"20vh"}
            align={"center"}
            display={deployedAddress ? "none" : "flex"}
          >
            <Heading>Sale Creation Status</Heading>
            <VStack spacing={10} width="60vw" id="creationStatus">
              <Text fontSize={"20px"}>
                {" "}
                {loader && "Sale Creation Started.."}
              </Text>
            </VStack>
          </VStack>
          
        </Box>
      )}
      {deployedAddress !== null && (
        <SuccessfulDeployment
          network={NetworkChain}
          address={deployedAddress}
        />
      )}
    </>
  );
}

export default CreateSale;
