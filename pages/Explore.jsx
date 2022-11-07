import React from "react";
import {
  VStack,
  Text,
  Center,
  Heading,
  HStack,
  WrapItem,
  Wrap,
} from "@chakra-ui/react";
import LinkButton from "./components/LinkButton/LinkButton";
function Explore() {
  return (
    <VStack height={"100vh"} bg="black" textColor={"white"}>
      <Center>
        <VStack paddingTop={"15vh"} spacing={5}>
          <Heading fontSize={"4em"} width={"50vw"}>
            Rent Web3 Assets
          </Heading>
          <Text
            fontFamily={"sans-serif"}
            textColor={"grey"}
            fontSize={"18px"}
            width={"50vw"}
          >
            Explore NFTs of famous collections and rent Dapps made by the best
            developers in the space for showing your NFT collections with
            no-code at affordable prices. 
          <Heading fontSize={"18px"}>So what are you waiting For ?</Heading>
            
          </Text>
          
          <hr />
          <Heading padding={"2vh 0 2vh 0"}>Take Action</Heading>
          <Center>
            <Wrap paddingBottom={"vh"} spacing={20}>
              <WrapItem>
                <LinkButton
                  title={"Rent NFTs"}
                  href={"/ExploreNfts"}
                  color={"blue"}
                  variant={"solid"}
                />
              </WrapItem>
              <WrapItem>
                <LinkButton
                  title={"Rent Dapps"}
                  href={"/ExploreDapps"}
                  color={"green"}
                  variant={"solid"}
                />
              </WrapItem>
            </Wrap>
          </Center>
        </VStack>
      </Center>
    </VStack>
  );
}

export default Explore;
