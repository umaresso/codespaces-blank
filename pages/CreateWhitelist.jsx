import React, { useState, useEffect, useRef } from "react";
import { Center, Box, HStack, VStack, Heading, Text } from "@chakra-ui/react";

import {
  getBlockchainSpecificWebsiteRentContract,
  getBlockchainSpecificWhitelistFactoryContract,
  getBlockchainSpecificWhitelistTrackerContract,
  getCustomNetworkWhitelistContract,
  getCustomNetworkWhitelistTrackerContract,
  whitelistABI,
  whitelistByteCode,
  whitelistTrackerABI,
  whitelistTrackerTronNileAddress,
} from "../data/Whitelist";

import Sale from "./components/Sale";
import SuccessfulDeployment from "./components/SuccessfulDeployment";
import { getMinimalAddress } from "../Utilities";
import {
  deploy_tron_contract,
  tronConnect,
} from "../data/TronAccountsManagement";
import { useSelector } from "react-redux";

const ethers = require("ethers");

function CreateWhitelist(props) {
  const selectedBlockchainInformation = useSelector(
    (state) => state.blockchain.value
  );
  let _Blockchain = selectedBlockchainInformation.name;
  let _NetworkChain = selectedBlockchainInformation.network;
  let connectedAddress = selectedBlockchainInformation.address;
  const [Blockchain, setBlockchain] = useState(null);
  const [NetworkChain, setNetworkChain] = useState(null);

  const [deployedAddress, setDeployedAddress] = useState(null);
  const [loader, setLoader] = useState(false);
  const [formStage, setFormStage] = useState(1);
  const [whitelistFactoryContract, setWhitelistFactoryContract] =
    useState(null);
  const [whitelistTracker, setWhitelistTracker] = useState(null);

  const Web3ModalRef = useRef();

  /**  */
  function setStatus(message) {
    let ele = document.getElementById("creationStatus");
    var p_tag = document.createElement("p");
    p_tag.key = `message${message}`;
    p_tag.textContent = "-> " + message;
    ele.append(p_tag);
  }

  async function deployWhitelist(sale) {
    let _Blockchain = sale?._Blockchain;
    _Blockchain = _Blockchain.toString().toLowerCase();
    if (_Blockchain == "ethereum") {
      setFormStage((prev) => prev + 1);
      setStatus("Creating Ethereum whitelist..");
      deployEthWhitelist(sale);
    } else if (_Blockchain == "tron") {
      let connectedUser = await tronConnect();
      console.log("connected address is ", connectedUser);

      setFormStage((prev) => prev + 1);
      setStatus("Creating Tron whitelist..");
      deployTronWhitelist(sale, connectedUser);
    } else if (_Blockchain == "polygon") {
      setFormStage((prev) => prev + 1);
      setStatus("Creatibg Polygon whitelist..");
    }
  }
  async function deployTronWhitelist(sale, owner) {
    let paramters = [
      sale.name,
      sale.symbol,
      sale.maxWhitelists,
      connectedAddress,
      sale.baseURI,
      sale.saleSupply,
      sale.startTime,
      sale.endTime,
    ];
    let abi = whitelistABI;
    let bytecode = whitelistByteCode;
    console.log("calling tron deployer");
    setStatus("Starting tron Deployment..");
    let deployedAddress = await deploy_tron_contract(
      _NetworkChain,
      abi,
      bytecode,
      paramters,
      setStatus,
      successFallback
    );
    async function successFallback(deployedAddress, owner) {
      console.log("deployed address is ", deployedAddress);
      await trackTronWhitelistDeployment(deployedAddress, owner);
    }
  }
  async function trackTronWhitelistDeployment(contractAddress, owner) {
    let trackerAddress = null;
    console.log("tracker is ", trackerAddress);
    if (_NetworkChain == "nile") {
      trackerAddress = whitelistTrackerTronNileAddress;
    }
    console.log("tracker is ", trackerAddress);

    let contract = await tronWeb.contract().at(trackerAddress);

    setStatus("Keeping track of your contract for future");
    setStatus("Waiting for Transaction Completion..");

    let result = await contract.addUserWhitelist(owner, contractAddress).send({
      feeLimit: 100000000,
      callValue: 0,
      tokenId: "",
      tokenValue: "",
      shouldPollResponse: true,
    });
    console.log("receipt is ", result);

    setStatus("Transaction Completed ✅");

    setDeployedAddress(contractAddress);
    
  }

  function deployEthWhitelist(Sale) {
    async function deploy(sale) {
      let factory = await getBlockchainSpecificWhitelistFactoryContract(
        _Blockchain,
        _NetworkChain,
        Web3ModalRef
      );
      
      const contract = await factory.deploy(
        sale.name,
        sale.symbol,
        sale.maxWhitelists,
        sale.owner,
        sale.baseURI,
        sale.saleSupply,
        sale.startTime,
        sale.endTime
      );
      console.log("deployment insance", contract);
      setStatus("Creating " + sale.name + "..");
      await contract.deployed();

      setStatus(`Successfully Created 🎉`);
      setStatus(getMinimalAddress(contract.address));
      setStatus("Storing on Smart Contract");
      setStatus("Approve Transaction");
      await trackEthWhitelistDeployment(contract.address, sale.owner);

      setStatus(`Deployment successful 🎉`);
      setFormStage((prev) => prev + 1);
      return contract.address;

      // Set gas limit and gas price, using the default Ropsten provider
    }
    console.log("calling deploy");
    deploy(Sale);
  }

  async function trackEthWhitelistDeployment(contractAddress, owner) {
    let contract = await getBlockchainSpecificWhitelistTrackerContract(
      _Blockchain,
      _NetworkChain,
      Web3ModalRef
    );
    console.log("Calling add user on on", {
      owner,
      contractAddress,
      contract,
    });
    let tx = await contract.addUserWhitelist(owner, contractAddress);
    setStatus("Waiting for Transaction Completion..");
    setTimeout(() => {
      setStatus("Oh No ! Its Taking Longer : (");
      setStatus("Do not Worry , I am with You");
    }, 4000);

    await tx.wait();
    setStatus("Transaction Completed ✅");

    setDeployedAddress(contractAddress);
  }

  async function init() {
    // for ethereum
      
  }
  function RefreshToNewBlockchain() {
    setNetworkChain(_NetworkChain);
    setBlockchain(_Blockchain);
    
    init();

    // console.log("calling init");
  }
  if (_Blockchain != Blockchain) {
    RefreshToNewBlockchain();
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {formStage == 1 && (
        <HStack height={"100%"}>
          <Sale
            _blockchain={_Blockchain}
            saleType={"whitelist"}
            deploySale={deployWhitelist}
          />
        </HStack>
      )}
      {
        <VStack
          height={formStage >= 2 ? "100vh" : "0.001vh"}
          bg={"black"}
          color={"white"}
          width={"100%"}
          align={"center"}
          paddingTop={"15vh"}
          display={deployedAddress ? "none" : "flex"}
        >
          <Heading fontSize={["30px", "40px", "50px"]}>
            Whitelist Creation Status
          </Heading>
          <VStack
            spacing={2}
            style={{
              width: "30vw",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            align={"left"}
            id="creationStatus"
          >
            <Text fontSize={["16px", "18px", "20px"]}>
              {" "}
              {loader && "Dapp Creation Started.."}
            </Text>
          </VStack>
        </VStack>
      }
      {deployedAddress !== null && (
        <SuccessfulDeployment
          network={_NetworkChain}
          address={deployedAddress}
          
        />
      )}
    </>
  );
}

export default CreateWhitelist;
