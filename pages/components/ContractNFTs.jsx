import { Heading, Img, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Blob } from "web3.storage";
import { getMinimalAddress } from "../../Utilities";
import { getTokensMetaData } from "../data/ipfsStuff";

function ContractNFTs({ contract }) {
  let address = contract.contractAddress;
  let Uris = contract.tokenURIs;
  console.log("showing NFTs for ", contract);
  const [tokenMetadataArray, setTokenMetadataArray] = useState(null);
  useEffect(() => {
    getTokensMetaData(Uris, setTokenMetadataArray).then((arr) => {});
  }, []);
  console.log("tokenMetadataArray is ", tokenMetadataArray);
  return (
    <VStack align={"left"} bg={"black"} height={"100vh"}>
      <Heading>{getMinimalAddress(address)}</Heading>
      {!tokenMetadataArray && <Text>No Tokens for this Collection</Text>}
      <Wrap spacing={20} >
        {tokenMetadataArray &&
          tokenMetadataArray.map((token) => {
            let img = token.image;
            return (
              <WrapItem key={token.name + "wrap"}>
                <Img
                  borderRadius={"20px"}
                  key={token.name}
                  src={
                    img
                      ? img
                      : "https://www.miamibeachvca.com/_resources/img/content/repeater-loader.gif"
                  }
                />
              </WrapItem>
            );
          })}
      </Wrap>
      {/* <img src="https://ipfs.io/ipfs/QmRs9npHindvVComEE2GXcuEWeALM3mD5M7HECCxav8E3a/1.png" /> */}
    </VStack>
  );
}

export default ContractNFTs;
