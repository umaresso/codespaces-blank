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

// let NetworkChain = "goerli";
// let Blockchain="ethereum"
let NetworkChain = "nile";
let Blockchain = "tron";

function Navbar() {
  const [walletAddress, setWalletAddress] = useState(null);
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

  async function Connect() {
    getCurrentConnectedOwner(Blockchain,NetworkChain,web3ModalRef,setWalletAddress);
  }
  useEffect(() => {
    if (!walletAddress) {
      Connect();
    }
  }, []);

  function getMinimalAddress(_adr) {
    if (!_adr) return "";
    let adr = _adr.toString();
    return adr.slice(0, 6) + ".." + adr.slice(40);
  }
  console.log(walletAddress);
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
  );
}

export default Navbar;
