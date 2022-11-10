import React, { useState, useEffect, useRef } from "react";
import { Center, Box, HStack, VStack, Heading, Text } from "@chakra-ui/react";

import {
  getBlockchainSpecificWebsiteRentContract,
  getBlockchainSpecificWhitelistFactoryContract,
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

const ethers = require("ethers");

// let NetworkChain = "goerli";  // Eth
let NetworkChain = "nile";
let Blockchain = "tron";
function CreateWhitelist(props) {
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
    let blockchain = sale?.blockchain;
    blockchain = blockchain.toString().toLowerCase();
    if (blockchain == "ethereum") {
      setFormStage((prev) => prev + 1);
      setStatus("Creating Ethereum whitelist..");
      deployEthWhitelist(sale);
    } else if (blockchain == "tron") {
      let connectedUser = await tronConnect();
      console.log("connected address is ", connectedUser);

      setFormStage((prev) => prev + 1);
      setStatus("Creating Tron whitelist..");
      deployTronWhitelist(sale, connectedUser);
    } else if (blockchain == "polygon") {
      setFormStage((prev) => prev + 1);
      setStatus("Creatibg Polygon whitelist..");
    }
  }
  async function deployTronWhitelist(sale, owner) {
    let paramters = [
      sale.name,
      sale.symbol,
      sale.maxWhitelists,
      sale.owner,
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
      NetworkChain,
      abi,
      bytecode,
      paramters,
      setStatus,successFallback
    );
    async function successFallback(deployedAddress,owner){
      console.log("deployed address is ", deployedAddress);
      await trackTronWhitelistDeployment(deployedAddress, owner);
    }
    
  }
  async function trackTronWhitelistDeployment(contractAddress, owner) {
    let trackerAddress = null;
    console.log("tracker is ", trackerAddress);
    if (NetworkChain == "nile") {
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
      let factory = getBlockchainSpecificWhitelistFactoryContract(
        Blockchain,
        NetworkChain,
        Web3ModalRef
      );
      console.log("factory", factory);
      console.log("creating instance");
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
    let contract = await getBlockchainSpecificWebsiteRentContract(
      Blockchain,
      NetworkChain,
      Web3ModalRef
    );
    console.log("Calling add user on on", {
      owner,
      contractAddress,
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
    getCustomNetworkWhitelistContract(NetworkChain, Web3ModalRef)
      .then(async (contract) => {
        console.log("factory is ", contract);
        setWhitelistFactoryContract(contract);
      })
      .catch((e) => {
        console.log("error  in obtaining the contract ");
      });
    getCustomNetworkWhitelistTrackerContract(NetworkChain, Web3ModalRef)
      .then(async (contract) => {
        console.log("tracker is ", contract);
        setWhitelistTracker(contract);
      })
      .catch((e) => {
        console.log("error  in obtaining the contract ");
      });
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {formStage == 1 && (
        <HStack height={"100%"}>
          <Sale
            _blockchain={Blockchain}
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
              width: "40vw",
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
          network={NetworkChain}
          address={deployedAddress}
        />
      )}
    </>
  );
}

export default CreateWhitelist;
