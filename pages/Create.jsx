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

function Create() {
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
          Let&apos;s Earn Money
        </Heading>
        <Text width={"40vw"} fontSize={"20px"}>
          After creating a dapp or owning an NFT , do you feel it&apos;s residing in
          the home with no use ? It&apos;Time to rent your work and passive
          income. Lend your previously created Dapps or NFTs with exchange of
          cool Money . So, Let&apos;s do it{" "}
        </Text>
        <Wrap width={"40vw"} spacing={5}>
          <WrapItem>
            <LinkButton
              title={"Create Rentable Dapp"}
              href={"/CreateDapp"}
              color={"blue"}
              variant={"solid"}
            />
          </WrapItem>

          <WrapItem>
            {" "}
            <LinkButton
              title={"Create Rentable NFT"}
              href={"/NftUpload"}
              color={"blue"}
              variant={"solid"}
            />
          </WrapItem>

          {/* <LinkButton
          title={"Create Whitelist"}
          href={"/CreateWhitelist"}
          color={"green"}
          variant={"solid"}
        />
        <LinkButton
          title={"Create Sale"}
          href={"/CreateSale"}
          color={"green"}
          variant={"solid"}
        /> */}
        </Wrap>
      </VStack>
    </Center>
  );
}

export default Create;
