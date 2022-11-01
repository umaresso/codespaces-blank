import { Button, Heading, Box, Center, HStack, Img } from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import LinkButton from "../LinkButton/LinkButton";
import { Grid } from "@chakra-ui/react";
import { VStack, Stack } from "@chakra-ui/react";

function Introduction() {
  // theme
  let bg = "black";
  let textColor = "white";
  //  _____

  return (
    <Box width={"100vw"} color={textColor} height={"100vh"} bg={"black"}>
      <Stack direction={["column", "column", "column", "row"]}>
        <VStack
          align={"left"}
          padding={20}
          paddingBottom={0}
          spacing={3}
          width={["100%", "100%", "100%", "60%"]}
          paddingTop={["40vh", "40vh", "20vh"]}
        >
          <Heading
            fontSize={["2em", "4em", "6em"]}
            width={["80vw", "80vw", "80vw", "40vw"]}
          >
            Time to Rent Web3 Assets
          </Heading>
          <Box width={["80vw", "80vw", "80vw", "40vw"]}>
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

        <VStack bg={"black"} justifyContent={"center"} height={"100vh"}>
          <Img
            height={"fit-content"}
            width={"90%"}
            border={"10px solid black"}
            borderRadius={"40px"}
            transition={"200ms all ease-in-out"}
            // borderLeft={"150px solid black"}
            // borderRight={"150px solid black"}

            src="https://cdn.dribbble.com/users/1859790/screenshots/10750520/media/78cf0dccfeebd50268d23057e7568dac.png?compress=1&resize=1200x900&vertical=top"
            _hover={{
              transform: "scale(1.025)",
              cursor: "pointer",
            }}
          />
        </VStack>
      </Stack>
    </Box>
  );
}

export default Introduction;
