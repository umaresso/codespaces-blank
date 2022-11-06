import { useState } from "react";
import {
  Box,
  VStack,
  Stack,
  Heading,
  Input,
  Text,
  HStack,
  Center,
  Img,
} from "@chakra-ui/react";
import LinkButton from "./LinkButton/LinkButton";
import IntegrateFrontend from "./IntegrateFrontend";
const ethers = require("ethers");

function DappInformationPopup(props) {
  let dapp = props.dapp;
  let displayToggle = props.displayToggle;
  let sales = props.sales;
  let whitelists = props.whitelists;
  const [websiteURL, setWebsiteURL] = useState("");
  const [purchaseWill, setPurchaseWill] = useState(false);

  let bg = "black";
  let textColor = "white";
  async function integrate() {
    // alert("purchasing...");
    setPurchaseWill(true);
  }
  return (
    <Center
      height={"100vh"}
      width={"100vw"}
      bg="rgba(0,0,0,0.9)"
      position={"fixed"}
      top={"0"}
    >
      {!purchaseWill ? (
        <VStack height={"50vh"} justify={"center"} color={textColor}>
          <Stack direction={["column", "colum", "row"]} spacing={10}>
            <Img
              height={"35vh"}
              width={"30vw"}
              borderRadius={"20px"}
              src={dapp.image}
            />
            <VStack align={"left"}>
              <Heading paddingBottom={"5vh"}>Dapp information</Heading>
              <HStack justify="space-between" width="20vw">
                <b>Name:</b><Text>{dapp.name}</Text>

              </HStack>
              <HStack justify="space-between" width="20vw" textTransform={"capitalize"}>
                <b>Rent Price:</b><Text>{ dapp.rentPrice} {dapp.currency}</Text>
              </HStack>
              <HStack justify="space-between" width="20vw">
                <b>Owned By:</b><Text>{dapp.owner.slice(0, 5)}..
                  {dapp.owner.slice(40)}
                </Text>
              </HStack>
              <HStack justify="space-between" width="20vw">
                <b>Type:</b> <Text>{dapp.type}</Text>
              </HStack>
              <HStack justify="space-between" width="20vw">
                <b>Availability:</b><Text>{!dapp.rented ? "Available" : "Rented"}</Text>
              </HStack>

              <HStack paddingTop={"5vh"} spacing={20}>
                <LinkButton
                  onClick={() => {
                    if (dapp.rented) {
                      alert("Dapp is already Rented ! \nCome again another time");
                      return;
                    }

                    integrate();
                  }
                  }
                  title={`Rent`}
                  loadingMessage={`Purchasing..`}
                  color={"green"}
                  variant={"solid"}
                />
                <LinkButton
                  onClick={() => {

                    displayToggle(false);
                  }}
                  title={`Close`}
                  color={"white"}
                  variant={"outline"}
                />
              </HStack>
            </VStack>
          </Stack>
        </VStack>
      ) : (
        <Box bg={"black"}>
          <IntegrateFrontend
            showToggle={() => {
              setPurchaseWill(false);
            }}
            website={dapp.url}
            type={dapp.type}
            deployments={
              dapp.type == "whitelist" ? whitelists : sales
            }
            price={dapp.rentPrice}
            selected={dapp.type == "whitelist" ? whitelists[0] : sales[0]}

          />
        </Box>
      )}
    </Center>
  );
}

export default DappInformationPopup;
