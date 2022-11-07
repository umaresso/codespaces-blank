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
        <Heading width={"40vw"} fontSize={["3em", "3.5em", "4em"]}>
          Dapp Rent Portal
        </Heading>
        <Text width={"40vw"} fontSize={"20px"}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia fuga
          eaque ratione molestias quod quisquam atque debitis, enim commodi
          neque harum optio asperiores voluptatem consequatur blanditiis nemo
          explicabo facere soluta!
        </Text>
        <Wrap width={"40vw"} spacing={5}>
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
