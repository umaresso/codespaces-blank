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
import { getTokensMetaData } from "../data/ipfsStuff";
let NetwokChain = "goerli";
function ContractNFTs({ contract, selector, Key }) {
  console.log("key is ", Key);
  const [loading, setLoading] = useState(true);
  let address = contract.ercContractAddress;
  let Uris = contract.tokenURIs;
  let Ids = [...contract.tokenIds];
  let NftSelector = selector;
  let _owner = contract.owner;
  let rentalStatus = contract.rentalStatus;
  // console.log("showing NFTs for ", contract);
  const [tokenMetadataArray, setTokenMetadataArray] = useState(null);
  const [contractName, setContractName] = useState(null);
  let web3ModalRef = useRef();
  function getIpfsImageLink(_link) {
    if (_link.toString().startsWith("ipfs:")) {
      let Cid = _link.toString().slice(5);
      let link = "https://ipfs.io/ipfs/" + Cid;
      return link;
    }
    return _link;
  }
  useEffect(() => {
    getTokensMetaData(Uris, setTokenMetadataArray);
    getContractName(NetwokChain, web3ModalRef, address).then((_name) => {
      setContractName(_name);
    });
  }, []);
  console.log("Showing", contract);
  return (
    <VStack
      paddingBottom={"5vh"}
      key={Key}
      align={"left"}
      bg={"black"}
      height={"fit-content"}
    >
      <Heading width={"fit-content"} fontSize="30px">
        {contractName ? contractName : <p>Fetching Collection..</p>}{" "}
        <hr
          style={{
            marginTop: "10px",
            borderTop: " 1px solid grey",
          }}
        />
      </Heading>

      {!tokenMetadataArray && (
        <Text>No Tokens for this Collection( or refresh the page)</Text>
      )}
      <Wrap paddingTop={5} spacing={20}>
        {tokenMetadataArray &&
          tokenMetadataArray.map((token, index) => {
            let img = getIpfsImageLink(token.image);
            return (
              <WrapItem
                onClick={() => {
                  let token = {
                    id: Ids[index],
                    metadata: tokenMetadataArray[index],
                    tokenContract: address,
                    owner: _owner,
                    rented: rentalStatus[Ids[index]],
                  };

                  NftSelector(token);
                  //                  console.log("Token ", token, " is clicked");
                }}
                key={token.name + index + Key}
              >
                <VStack>
                  <Img
                    height={"40vh"}
                    transition={"200ms all ease-in-out"}
                    _hover={{
                      cursor: "pointer",
                      transform: "scale(1.05)",
                    }}
                    borderRadius={"20px"}
                    key={token.name + index}
                    src={
                      img
                        ? img
                        : "https://www.miamibeachvca.com/_resources/img/content/repeater-loader.gif"
                    }
                  />
                  <HStack spacing={10}>
                    <Heading fontSize={"24px"}>
                      Token # <b>{Ids[index]}</b>
                    </Heading>
                    {!rentalStatus[Ids[index]] ? (
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
              </WrapItem>
            );
          })}
      </Wrap>
    </VStack>
  );
}

export default ContractNFTs;
