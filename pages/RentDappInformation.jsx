import {
  HStack,
  VStack,
  Box,
  LinkBox,
  Heading,
  Text,
  Center,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import LinkButton from "./components/LinkButton/LinkButton";

function RentDappInformation() {
  let textColor = "white";
  return (
    <Center
      height={["fit-content", "fit-content", "100vh"]}
      justify={"center"}
      bg="black"
      color={textColor}
      flexDirection={"column"}
    >
      <VStack
        paddingBottom={"5vh"}
        paddingTop={["25vh", "20vh", "5vh"]}
        spacing={10}
      >
        <Heading width={"48vw"} fontSize={["3em", "3.5em", "4em"]}>
          Dapp Rent Portal
        </Heading>
        <Text color={"grey"} width={"46vw"} fontSize={"20px"}>
          So you want to rent a dapp for whitelisting and sale of your
          Collection but do you have a whitelist or sale contract that is
          compatible with all the dapps available on RentWeb3? No worries if you
          do not. You can create whitelist and sale contracts and then rent the
          dapp with nearly NO CODE. So, Let's start the process
        </Text>
        <Wrap width={"48vw"} spacing={10}>
          <WrapItem>
            <LinkButton
              title={"Create Whitelist"}
              href={"/CreateWhitelist"}
              color={"green"}
              variant={"solid"}
            />
          </WrapItem>
          <WrapItem>
            <LinkButton
              title={"Create Sale"}
              href={"/CreateSale"}
              color={"green"}
              variant={"solid"}
            />
          </WrapItem>

          <WrapItem>
            {" "}
            <LinkButton
              title={"Rent Dapp"}
              href={"/ExploreDapps"}
              color={"blue"}
              variant={"solid"}
            />
          </WrapItem>
        </Wrap>
      </VStack>
    </Center>
  );
}

export default RentDappInformation;
