import { Heading, Box, Input, VStack, Link } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import Card from "./components/Card/Card";
import LinkButton from "./components/LinkButton/LinkButton";
import NamedInput from "./components/NamedInput";
function NftUpload() {
  let bg = "black";
  let textColor = "white";
  const [contractAddress, setContractAddress] = useState(null);
  const [tokenId, setTokenId] = useState(0);
  const [pricePerDay, setPricePerDay] = useState(0);
  function uploadNFT() {
    alert("uploading NFTs");
  }
  return (
    <Card>
      <Box
        height={"fit-content"}
        padding={[0, 10, 10]}
        width={"65vw"}
        borderRadius={"10px"}
        background={bg}
        color={textColor}
        justifyContent={"center"}
        alignItems={"center"}
        boxShadow={"1px 1px 1px 1px grey"}
      >
        <Heading align={"center"}>Upload NFTs</Heading>
        <VStack paddingTop={"2vh"} spacing={5}>
          <NamedInput title={"Contract Address"}>
            <Input
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x4b26..8c"
            />
          </NamedInput>
          <NamedInput title={"Token Id"}>
            <Input
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="1"
            />
          </NamedInput>
          <NamedInput title={"Price"}>
            <Input
              onChange={(e) => setPricePerDay(e.target.value)}
              placeholder="price per day in "
            />
          </NamedInput>
          <NamedInput title={"Blockchain"}>
            <Input
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Ethereum,Tron,polygon"
            />
          </NamedInput>
          <LinkButton
            color={"green"}
            variant={"solid"}
            onClick={() => uploadNFT()}
            title={"Upload NFT"}
          />
        </VStack>
      </Box>
    </Card>
  );
}

export default NftUpload;
