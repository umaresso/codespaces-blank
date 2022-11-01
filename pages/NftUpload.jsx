import {
  Heading,
  Box,
  Input,
  VStack,
  Link,
  Text,
  HStack,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import React from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import Card from "./components/Card/Card";
import LinkButton from "./components/LinkButton/LinkButton";
import NamedInput from "./components/NamedInput";
import SuccessfulDeployment from "./components/SuccessfulDeployment";
import { getProviderOrSigner } from "./data/accountsConnection";
import {
  getCustomNetworkNFTFactoryContract,
  getCustomNetworkNFTTrackerContract,
} from "./data/NftRenting";
let NetworkChain = "goerli";

function NftUpload() {
  let bg = "black";
  let textColor = "white";
  /**
   * Default values
   */
  let _erc721 = "0x42b309108fF549ba4961c204935A0d59b7886181";
  let _blockchain = "ethereum";
  let _price = 0.02;
  let _tokenId = 2;
  /**
   *
   */
  const [formStep, setFormStep] = useState(1);
  const [contractAddress, setContractAddress] = useState(_erc721);
  const [tokenId, setTokenId] = useState(_tokenId);
  const [pricePerDay, setPricePerDay] = useState(_price);
  const [blockchain, setBlockchain] = useState(_blockchain);

  const [factoryContract, setFactoryContract] = useState(null);
  const [NftRentingTracker, setNftRentingTracker] = useState(null);
  const [owner, setOwner] = useState(null);
  const [deployedAddress, setDeployedAddress] = useState(null);
  const [loader, setLoader] = useState(false);

  let web3ModelRef = useRef();
  function setStatus(message) {
    let ele = document.getElementById("creationStatus");
    var p_tag = document.createElement("p");
    p_tag.key = `message${message}`;
    p_tag.textContent = "-> " + message;
    ele.append(p_tag);
  }

  function uploadNFT() {
    alert("uploading NFTs");
    deployNftUpload();
  }

  async function init() {
    getProviderOrSigner(NetworkChain, web3ModelRef, true).then((_signer) => {
      _signer?.getAddress().then((_user) => {
        setOwner(_user);
      });
    });
    getCustomNetworkNFTFactoryContract(NetworkChain, web3ModelRef).then(
      (contract) => {
        setFactoryContract(contract);
      }
    );
    getCustomNetworkNFTTrackerContract(NetworkChain, web3ModelRef).then(
      (contract) => {
        setNftRentingTracker(contract);
      }
    );
  }

  /**
   *  NFT uploading Smart contracts and IPFS stuff
   *
   */

  async function deployNftUpload(sale) {
    if (blockchain == "ethereum") {
      setFormStep((prev) => prev + 1);
      setStatus("Making Ethereum NftUpload..");
      EthUpload(sale);
    } else if (blockchain == "tron") {
      setFormStep((prev) => prev + 1);

      setStatus("Making Tron NftUpload..");
    } else if (blockchain == "polygon") {
      setFormStep((prev) => prev + 1);

      setStatus("Making Polygon NftUpload..");
    }
  }
  async function EthUpload() {
    async function deploy() {
      try {
        console.log("inside deploy");
        let factory = factoryContract;
        console.log("factory", factory);
        console.log("creating instance");
        setStatus("Creating Rentable Version of the Contract");

        const contract = await factory.deploy(contractAddress);
        await contract.deployed();

        setStatus(`Successfully Created 🎉`);

        setStatus("Contract Address := ");
        setStatus(getMinimalAddress(contract.address));
        setStatus("Starting Actual upload ");
        setStatus("Approve Transaction");
        await trackNFTUpload(contract.address);
        setStatus(`Upload successful 🎉`);
        setFormStep((prev) => prev + 1);
        return contract.address;
      } catch (e) {
        alert("Error : NFT is Not Uploaded !");
        console.log(e);
      }
      // Deploy the contract to Ethereum test network - Goerli
    }
    setStatus("Checking if Rentable Version Already exists !");
    let response = await NftRentingTracker.erc721ToRentableContract(
      contractAddress
    );
    console.log("rentable version :", response);
    if (!response.toString().includes("0x000")) {
      setStatus("Wow ! The Rentable contract already Exists !");
      setStatus("Directly Uploading your NFT for rent");
      trackNFTUpload(response.toString());
    } else {
      console.log("uploading rentable version of smart contract");
      deploy();
    }
  }

  async function trackNFTUpload(deployedContractAddress) {
    let contract = NftRentingTracker;
    console.log("uploading", {
      contractAddress,
      deployedContractAddress,
      tokenId,
      price: ethers.utils.parseEther(pricePerDay.toString()),
    });
    try {
      let tx = await contract.uploadNftForRent(
        contractAddress,
        deployedContractAddress,
        tokenId,
        ethers.utils.parseEther(pricePerDay.toString())
      );
      setStatus("Waiting for Transaction Completion..");
      setTimeout(() => {
        setStatus("Oh No ! Its Taking Longer : (");
        setStatus("Do not Worry , I am with You");
      }, 2000);

      await tx.wait();
      setStatus("Upload SuccessFull✅");
      setDeployedAddress(deployedContractAddress);
    } catch (e) {
      setStatus(e.error.message);
      console.log("Deployment Error := ", e.error.message);
    }
  }

  /**
   *
   *
   */
  function getMinimalAddress(adr) {
    if (!adr) return "Fetching..";
    return adr.slice(0, 6) + ".." + adr.slice(38);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Card>
      {formStep == 1 && (
        <Box
          height={"fit-content"}
          padding={[0, 10, 10]}
          width={"50vw"}
          borderRadius={"10px"}
          background={bg}
          color={textColor}
          justifyContent={"center"}
          alignItems={"center"}
          boxShadow={"1px 1px 1px 1px grey"}
        >
          <Heading align={"center"}>Upload NFTs</Heading>
          <VStack paddingTop={"2vh"} spacing={5}>
            <NamedInput title={"Contract Address"}>
              <Input
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x4b26..8c"
              />
            </NamedInput>
            <NamedInput title={"Token Id"}>
              <Input
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="1"
              />
            </NamedInput>
            <NamedInput title={"Price"}>
              <Input
                onChange={(e) => setPricePerDay(e.target.value)}
                placeholder="price per day in "
              />
            </NamedInput>
            <NamedInput title={"Blockchain"}>
              <Input
                onChange={(e) => setBlockchain(e.target.value)}
                placeholder="Ethereum,Tron,polygon"
              />
            </NamedInput>
            <LinkButton
              color={"green"}
              variant={"solid"}
              onClick={() => uploadNFT()}
              title={"Upload NFT"}
            />
          </VStack>
        </Box>
      )}
      <VStack
        height={formStep == 2 ? "100vh" : "1px"}
        bg={"black"}
        color={"white"}
        width={"100vw"}
        paddingTop={"20vh"}
        align={"center"}
        display={deployedAddress || formStep != 2 ? "none" : "flex"}
      >
        <Heading>NFT Upload Status</Heading>
        <VStack spacing={5} width="60vw" id="creationStatus">
          <Text fontSize={"20px"}> {loader && "Sale Creation Started.."}</Text>
        </VStack>
      </VStack>
      {deployedAddress !== null && (
        <SuccessfulDeployment
          network={NetworkChain}
          address={deployedAddress}
        />
      )}
    </Card>
  );
}

export default NftUpload;
