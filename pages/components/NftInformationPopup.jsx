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
import NamedInput from "./NamedInput";
import LinkButton from "./LinkButton/LinkButton";
import {
  whitelistABI,
  whitelistTrackerABI,
  whitelistTrackerAddress,
} from "../data/Whitelist";
import { SaleTrackerABI, SaleTrackerAddress } from "../data/Sale";
import IntegrateFrontend from "./IntegrateFrontend";
import { getMinimalAddress } from "../../Utilities";
const ethers = require("ethers");

function NftInformationPopup({ NFT, displayToggle }) {
  let Nft = NFT;
  let owner = Nft.owner;
  let DisplayToggle = displayToggle;
  const [rentWill, setrentWill] = useState(false);
  const [rentPrice, setRentPrice] = useState(0);
  let bg = "black";
  let textColor = "white";
  async function rentNft() {
    // alert("purchasing...");
    setrentWill(true);
  }

  async function getNftPrice() {
    setRentPrice(0.02);
  }
  useEffect(() => {
    getNftPrice();
  }, [third]);

  return (
    <Center
      height={"100vh"}
      width={"100vw"}
      bg="rgba(0,0,0,0.9)"
      position={"fixed"}
      top={"0"}
    >
      {!rentWill ? (
        <VStack height={"50vh"} justify={"center"} color={textColor}>
          <Stack direction={["column", "colum", "row"]} spacing={10}>
            <Img
              height={"35vh"}
              width={"30vw"}
              borderRadius={"20px"}
              src={Nft.metadata.image}
            />
            <VStack align={"left"}>
              <Heading paddingBottom={"5vh"}>Nft information</Heading>
              <HStack justify="space-between" width="20vw">
                <b>Token ID : </b>
                <Text>{Nft.id}</Text>
              </HStack>
              <HStack
                justify="space-between"
                width="20vw"
                textTransform={"capitalize"}
              >
                <b>Rent Price : </b>
                <Text>{rentPrice}</Text>
              </HStack>
              <HStack justify="space-between" width="20vw">
                <b>Owner : </b>
                <Text>{getMinimalAddress(owner)}</Text>
              </HStack>
              {Nft.type && (
                <HStack justify="space-between" width="20vw">
                  <b>Type : </b> <Text>{Nft.type}</Text>
                </HStack>
              )}
              <HStack justify="space-between" width="20vw">
                <b>Availability : </b>
                <Text>{!Nft.rented ? "Available" : "Rented"}</Text>
              </HStack>

              <HStack paddingTop={"5vh"} spacing={20}>
                <LinkButton
                  onClick={() => {
                    if (Nft.rented) {
                      alert(
                        "Nft is already Rented ! \nCome again another time"
                      );
                      return;
                    }

                    integrate();
                  }}
                  title={`Rent`}
                  loadingMessage={`Purchasing..`}
                  color={"green"}
                  variant={"solid"}
                />
                <LinkButton
                  onClick={() => {
                    DisplayToggle(false);
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
        <Box bg={"black"}></Box>
      )}
    </Center>
  );
}

export default NftInformationPopup;
