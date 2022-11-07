import {
  Button,
  Heading,
  HStack,
  Img,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { getIpfsImageLink } from "../../data/ipfsStuff";
let NetwokChain = "goerli";
function NftDetails(props) {
  const [loading, setLoading] = useState(true);
  let NFT=props.NFT;
  let selector=props.selector;
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

  let img = getIpfsImageLink(Nft?.image);
  let Key = props.Key;
  return (
    <VStack onClick={() => selector(Nft)} height={"fit-content"} key={Key}>
      <Img
        height={"200px"}
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
      <HStack spacing={5}>
        <Heading textTransform={"capitalize"} fontSize={"20px"}>
          {
            Nft?.name
          }
        </Heading>
        {!Nft?.rented ? (
          <Button size={"sm"}  colorScheme={"green"} textColor={"white"}>
            Available
          </Button>
        ) : (
          <Button size={"sm"} colorScheme={"blue"} textColor={"white"} disabled>
            Rented
          </Button>
        )}
      </HStack>
    </VStack>
  );
}

export default NftDetails;
