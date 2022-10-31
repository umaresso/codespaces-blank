import { Button, Heading, Box, Center, HStack, Img } from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import LinkButton from "../LinkButton/LinkButton";
import { Grid } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";

function Introduction() {
  // theme
  let bg = "black";
  let textColor = "white";
  //  _____

  return (
    <Box
      backgroundImage={
        "https://cdn.dribbble.com/users/1859790/screenshots/10750520/media/78cf0dccfeebd50268d23057e7568dac.png?compress=1&resize=1200x900&vertical=top"
      }
      backgroundRepeat={"no-repeat"}
      backgroundSize={"cover"}
    >
      <Box
        width={"100%"}
        color={textColor}
        height={"100vh"}
        paddingTop={["60vh", "40vh", "10vh"]}
        background={"rgba(0,0,0,0.75)"}
      >
        <VStack
          align={"left"}
          padding={20}
          paddingTop={["20vh", "20vh", "5vh"]}
          spacing={3}
        >
          <Heading
            fontSize={["2em", "4em", "6em"]}
            width={["80vw", "70vw", "50vw"]}
          >
            Time to Rent Web3 Assets
          </Heading>
          <Box width={"40vw"}>
            <Box fontSize={18} textColor={"whiteAlpha.800"}>
              RentWeb3 is a place where you can quickly start Renting your NFTs
              and Various Dapps.We provide you with a simple series of steps to
              get you help with whitelisting , presale and Public sale of your
              NFT Collection and Host them on one of the templates available or
              Rent NFTs at suitable prices.
            </Box>
            <Box fontSize={22} fontWeight={"700"}>
              So What are you waiting for ?
            </Box>
          </Box>
          <LinkButton
            href={"/Create"}
            title={"Get Started"}
            color={"green"}
            variant={"solid"}
          />
        </VStack>
      </Box>
    </Box>
  );
}

export default Introduction;
