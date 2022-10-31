import React from "react";
import { Box, Heading, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";

function NftRent() {
  return (
    <Box paddingTop={"10vh"} bg={"black"} height={"100vh"} textColor={"white"}>
      <VStack justify={"space-between"} height={"100%"}>
        {" "}
        <Box>
          <Heading>Available Nfts</Heading>
        </Box>
        <Box>
          <Heading>Rented NFTs</Heading>
        </Box>
      </VStack>
    </Box>
  );
}

export default NftRent;
