import { Heading, Img, Text, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import axios from "axios";
import { transform } from "lodash";
import React from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { Blob } from "web3.storage";
import { getMinimalAddress } from "../../Utilities";
import { getProviderOrSigner } from "../data/accountsConnection";
import { getContractName } from "../data/ERC721";
import { getTokensMetaData } from "../data/ipfsStuff";
let NetwokChain = "goerli";
function ContractNFTs({ contract, selector }) {
  let address = contract.contractAddress;
  let Uris = contract.tokenURIs;
  let Ids = [...contract.tokenIds];
  let NftSelector = selector;
  console.log("showing NFTs for ", contract);
  const [tokenMetadataArray, setTokenMetadataArray] = useState(null);
  const [contractName, setContractName] = useState(null);
  const [owner, setOwner] = useState(null);
  let web3ModalRef = useRef();
  useEffect(() => {
    getTokensMetaData(Uris, setTokenMetadataArray);
    getContractName(NetwokChain, web3ModalRef, address).then((_name) => {
      setContractName(_name);
    });
    getProviderOrSigner(NetwokChain, web3ModalRef).then((signer) => {
      signer.getAddress((_owner) => {
        setOwner(_owner);
      });
    });
  }, []);
  console.log("tokenMetadataArray is ", tokenMetadataArray);
  return (
    <VStack align={"left"} bg={"black"} height={"100vh"}>
      <Heading width={"fit-content"}>
        {contractName ? contractName : <p>Fetching Collection..</p>}{" "}
        <hr
          style={{
            marginTop: "10px",
            borderTop: " 1px solid grey",
          }}
        />
      </Heading>

      {!tokenMetadataArray && <Text>No Tokens for this Collection</Text>}
      <Wrap paddingTop={5} spacing={20}>
        {tokenMetadataArray &&
          tokenMetadataArray.map((token, index) => {
            let img = token.image;
            return (
              <WrapItem
                onClick={() => {
                  let token = {
                    id: Ids[index],
                    metadata: tokenMetadataArray[index],
                    tokenContract: address,
                    owner,
                  };
                  NftSelector(token);
                  //                  console.log("Token ", token, " is clicked");
                }}
                key={token.name + "wrap"}
              >
                <VStack>
                  <Img
                    transition={"200ms all ease-in-out"}
                    _hover={{
                      cursor: "pointer",
                      transform: "scale(1.05)",
                    }}
                    borderRadius={"20px"}
                    key={token.name}
                    src={
                      img
                        ? img
                        : "https://www.miamibeachvca.com/_resources/img/content/repeater-loader.gif"
                    }
                  />
                  <Heading>
                    Token # <b>{Ids[index]}</b>
                  </Heading>
                </VStack>
              </WrapItem>
            );
          })}
      </Wrap>
    </VStack>
  );
}

export default ContractNFTs;
