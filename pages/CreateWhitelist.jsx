import React, { useState, useEffect, useRef } from "react";
import { Center, Box, HStack, VStack, Heading, Text } from "@chakra-ui/react";

import {
  getCustomNetworkWhitelistContract,
  getCustomNetworkWhitelistTrackerContract,
} from "./data/Whitelist";

import Sale from ".//components/Sale";
import SuccessfulDeployment from ".//components/SuccessfulDeployment";
import { getMinimalAddress } from "../Utilities";

const ethers = require("ethers");

let NetworkChain = "goerli";

const provider = ethers.providers.getDefaultProvider(
  "wss://little-quaint-liquid.ethereum-goerli.discover.quiknode.pro/b2367619fda52ade145960cc52e5bd23015b30ae/"
);

function CreateWhitelist(props) {
  const [deployedAddress, setDeployedAddress] = useState(null);
  const [loader, setLoader] = useState(false);
  const [formStage, setFormStage] = useState(1);
  const [whitelistFactoryContract, setWhitelistFactoryContract] =
    useState(null);
  const [whitelistTracker, setWhitelistTracker] = useState(null);
  const Web3ModalRef = useRef();

  /** Dummy Data */
  let _name = "bored ape";
  let _symbol = "monkey";
  let _owner = "";
  let _baseURI = "//ipfs/QmVK3Cnfpuou3rg71kgBFxqo1rSmsBvCFCw9upHntbQhU6";
  let bg = "black";
  let textColor = "white";
  let _storagePlatform = "pinata";

  /**  */
  function setStatus(message) {
    let ele = document.getElementById("creationStatus");
    var p_tag = document.createElement("p");
    p_tag.key = `message${message}`;
    p_tag.textContent = "-> " + message;
    ele.append(p_tag);
  }

  async function deployWhitelist(sale) {
    if (sale.blockchain == "ethereum") {
      setFormStage((prev) => prev + 1);
      setStatus("Creating Ethereum whitelist..");
      deployEthWhitelist(sale);
    } else if (sale.blockchain == "tron") {
      setFormStage((prev) => prev + 1);

      setStatus("Creating Tron whitelist..");
    } else if (sale.blockchain == "polygon") {
      setFormStage((prev) => prev + 1);

      setStatus("Creatibg Polygon whitelist..");
    }
  }
  function deployEthWhitelist(Sale) {
    async function deploy(sale) {
      // Deploy the contract to Ethereum test network - Goerli
      console.log("inside deploy");
      let factory = whitelistFactoryContract;
      console.log("factory", factory);
      // const price = ethers.utils.formatUnits(
      //   await provider.getGasPrice(),
      //   "gwei"
      // );
      // const options = {
      //   gasLimit: 100000,
      //   gasPrice: ethers.utils.parseUnits(price, "gwei"),
      // };

      // Deploy the contract
      //        const contract = await factory.deploy("uar",100,owner,baseURI,12,12);
      console.log("creating instance");
      const contract = await factory.deploy(
        sale.name,
        sale.symbol,
        sale.saleSupply,
        sale.owner,
        sale.baseURI,
        sale.startTime,
        sale.endTime
      );
      console.log("deplyment insance", contract);
      setStatus("Creating " + sale.name + "..");
      await contract.deployed();

      setStatus(`Successfully Created 🎉`);

      setStatus("Contract Address := ");
      setStatus(getMinimalAddress(contract.address));
      setStatus("Storing on Smart Contract");
      setStatus("Approve Transaction");
      await trackWhitelistDeployment(contract.address, sale.owner);

      setStatus(`Deployment successful 🎉`);
      setFormStage((prev) => prev + 1);
      return contract.address;

      // Set gas limit and gas price, using the default Ropsten provider
    }
    console.log("calling deploy");
    deploy(Sale);
  }

  async function trackWhitelistDeployment(contractAddress, owner) {
    getCustomNetworkWhitelistTrackerContract(NetworkChain, Web3ModalRef).then(
      async (contract) => {
        let tx = await contract.addUserWhitelist(owner, contractAddress);
        setStatus("Waiting for Transaction Completion..");
        setTimeout(() => {
          setStatus("Oh No ! Its Taking Longer : (");
          setStatus("Do not Worry , I am with You");
        }, 2000);

        await tx.wait();
        setStatus("Transaction Completed ✅");

        setDeployedAddress(contractAddress);
      }
    );
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
            saleType={"whitelist"}
            deploySale={deployWhitelist}
            _name={_name}
            _symbol={_symbol}
            _owner={_owner}
            _baseURI={_baseURI}
            _storagePlatform={_storagePlatform}
          />
        </HStack>
      )}
      {
        <VStack
          height={formStage >= 2 ? "100vh" : "0.001vh"}
          bg={"black"}
          paddingTop={"10vh"}
          color={"white"}
          width={"100%"}
          align={"center"}
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
