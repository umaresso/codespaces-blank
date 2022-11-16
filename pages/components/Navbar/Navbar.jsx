import { Box, HStack, Button, Heading, Img } from "@chakra-ui/react";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import {
  getProviderOrSigner,
  connectWallet,
} from "../../../data/accountsConnection";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import Web3Modal from "web3modal";
import { connect } from "formik";
import { tronConnect } from "../../../data/TronAccountsManagement";
import { getCurrentConnectedOwner } from "../../../data/blockchainSpecificExports";
import { useSelector, useDispatch } from "react-redux";
import { updateBlockchain } from "../../../Reducers/index";
import DropDownMenu from "../DropDownMenu";

let NetworkChains = {
  ethereum: "goerli",
  tron: "nile",
  polygon: "mumbai",
};
function Navbar() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [selectedBlockchain, setSelectedBlockchain] = useState("tron");
  const dispatch = useDispatch();
  let Blockchain = selectedBlockchain;
  let NetworkChain = NetworkChains[selectedBlockchain];
  const selectedBlockchainInformation = useSelector(
    (state) => state.blockchain.value
  );
  const connectedAddress=selectedBlockchainInformation.address;
  // console.log(selectedBlockchainInformation)
  const web3ModalRef = useRef();
  let connectionCheckerId = 0;
  // theme
  let textColor = "white";
  let background = "black";
  let theme = {
    textColor,
    background,
  };

  //  _____

  // for intra and inter-Blockchain connection

  async function updateReducerWithUser(user_) {
    if (walletAddress == user_) return null;
    if (user_) {
      dispatch(
        updateBlockchain({
          name: selectedBlockchain,
          network: NetworkChains[selectedBlockchain],
          address: user_,
        })
      );
    }
  }
  async function Connect() {
    changeBlockchain(selectedBlockchain)
  }
  useEffect(() => {
    // if (!walletAddress) {
    //   Connect();
    // }
    
    changeBlockchain(selectedBlockchain)
  }, []);

  function getMinimalAddress(_adr) {
    if (!_adr) return "";
    let adr = _adr.toString();
    return adr.slice(0, 6) + ".." + adr.slice(40);
  }
  async function changeBlockchain(newBlockchain) {
    if (newBlockchain == "polygon") {
      // alert("We are working to enable polygon soon..");
      // return null;

    }
    // console.log(newBlockchain)
    await getCurrentConnectedOwner(
      newBlockchain,
      NetworkChains[newBlockchain],
      web3ModalRef
    ).then((user_) => {
      dispatch(
        updateBlockchain({
          name: newBlockchain,
          network: NetworkChains[newBlockchain],
          address: user_,
        })
      );
      setWalletAddress(user_);
      setSelectedBlockchain(newBlockchain);
    });
  }
  return (
    <HStack
      position={"fixed"}
      top={"0"}
      padding={"10px"}
      paddingTop={"30px"}
      paddingBottom={"30px"}
      justifyContent={"space-between"}
      width={"100%"}
      height={"50px"}
      boxShadow={"1px 1px 1px 1px white"}
      {...theme}
      zIndex={"10"}
    >
      <Box width={"10vw"}>
        <Link href="/">
          <Img
            _hover={{
              cursor: "pointer",
            }}
            borderRadius={"50%"}
            width={"50px"}
            src={"./rw3.png"}
          />
        </Link>
      </Box>
      <HStack
        display={["none", "none", "none", "flex"]}
        spacing={[5, 8, 8]}
        width="40vw"
        justifyContent={"space-between"}
        fontSize={["12px", "12px", "14px"]}
        fontWeight={"semibold"}
      >
        <Link href="/">Home</Link>
        <Link href="/Create">Create</Link>
        <Link href="/Explore">Explore</Link>
        <Link href="/Deployments">Deployments</Link>
        <Link href="/About">About</Link>
      </HStack>
      <HStack spacing={2}>
        <DropDownMenu
          title={"Select Blockchain"}
          options={["tron", "ethereum", "polygon"]}
          selector={changeBlockchain}
          selected={selectedBlockchain}
          textMenu={true}
        />{" "}
        
        <Button
          colorScheme={"green"}
          _hover={{
            cursor: "pointer",
          }}
          variant={walletAddress ? "solid" : "outline"}
          onClick={Connect}
          as="h5"
          fontSize={"18px"}
          width={"max-content"}
        >
          {walletAddress ? getMinimalAddress(walletAddress) : "Connect"}
        </Button>
      </HStack>
    </HStack>
  );
}

export default Navbar;
