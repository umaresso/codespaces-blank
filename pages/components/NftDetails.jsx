import {
  Button,
  Heading,
  HStack,
  Img,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import axios from "axios";
import { transform } from "lodash";
import Head from "next/head";
import React from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { Blob } from "web3.storage";
import { getMinimalAddress } from "../../Utilities";
import { getProviderOrSigner } from "../data/accountsConnection";
import { getContractName } from "../data/ERC721";
import { getIpfsImageLink, getTokensMetaData } from "../data/ipfsStuff";
let NetwokChain = "goerli";
function NftDetails({ NFT, selector }) {
  const [loading, setLoading] = useState(true);
  let Nft = { ...NFT };
  const [tokenMetadataArray, setTokenMetadataArray] = useState(null);
  const [contractName, setContractName] = useState(null);
  const [Owner, setOwner] = useState(null);
  let web3ModalRef = useRef();

  useEffect(() => {
    // getProviderOrSigner(NetwokChain, web3ModalRef).then((_signer) => {
    //   if (_signer) {
    //     _signer.getAddress((_Owner) => {
    //       setOwner(Owner);
    //     });
    //   }
    // });
    // getTokensMetaData(Uris, setTokenMetadataArray);
    // getContractName(NetwokChain, web3ModalRef, address).then((_name) => {
    //   setContractName(_name);
    // });
  }, []);

  let img = getIpfsImageLink(Nft.image);
  let Key = Nft.name + Nft.id;
  return (
    <VStack onClick={() => selector(Nft)} height={"fit-content"} key={Key}>
      <Img
        height={"300px"}
        transition={"200ms all ease-in-out"}
        _hover={{
          cursor: "pointer",
          transform: "scale(1.05)",
        }}
        key={"image of " + Key}
        src={
          img
            ? img
            : "https://www.miamibeachvca.com/_resources/img/content/repeater-loader.gif"
        }
        borderRadius={"40px"}
      />
      <HStack spacing={10}>
        <Heading fontSize={"24px"}>
          Token # <b>{Nft.id}</b>
        </Heading>
        {!Nft.rented ? (
          <Button colorScheme={"green"} textColor={"white"}>
            Available
          </Button>
        ) : (
          <Button colorScheme={"blue"} textColor={"white"} disabled>
            Rented
          </Button>
        )}
      </HStack>
    </VStack>
  );
}

export default NftDetails;
