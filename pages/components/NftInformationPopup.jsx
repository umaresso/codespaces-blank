import { useState, useEffect } from "react";
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
import {
  getCustomNetworkNFTFactoryContract,
  getCustomNetworkNFTTrackerContract,
  getNftPrice,
  getRentableContract,
  rentNFT,
} from "../data/NftRenting";
import { useRef } from "react";
const ethers = require("ethers");
let NetwokChain = "goerli";
let bg = "black";
let textColor = "white";
let CurrentBlockchain = "Ethereum";
function getCurrency() {
  switch (CurrentBlockchain) {
    case "Ethereum" || "ethereum":
      return "Eth";

    default:
      break;
  }
}
function NftInformationPopup({ NFT, displayToggle }) {
  const [rentWill, setrentWill] = useState(false);
  const [rentPrice, setRentPrice] = useState("Fetching..");
  const [nftTrackerContract, setNftTrackerContract] = useState(null);
  const [rentableContract, setRentableContract] = useState(null);
  const [rentDays, setRentDays] = useState(1);
  console.log("NFT received",NFT)
  let Nft = NFT;
  let ErcContractAddress = Nft.contractAddress;
  let owner = Nft.owner;
  let DisplayToggle = displayToggle;

  let web3ModalRef = useRef();
  async function rentNft() {
    // alert("purchasing...");
    await rentNFT(nftTrackerContract, rentableContract, Nft.id, rentDays, rentPrice);
    //setrentWill(true);
    DisplayToggle(null);
  }

  async function init() {
    getCustomNetworkNFTTrackerContract(NetwokChain, web3ModalRef).then(
      async (TrackerContract) => {
        // console.log("Tracker contract is ", TrackerContract);
        let ErcContractAddress = NFT.tokenContract;
        let _contract = await getRentableContract(
          TrackerContract,
          ErcContractAddress,
          setRentableContract
        );

        getNftPrice(TrackerContract, _contract, NFT.id).then((_price) => {
          // console.log("price is ", _price);
          setRentPrice(_price);
        });

        setNftTrackerContract(TrackerContract);
      }
    );
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <Center height={"100vh"} width={"100vw"} position={"fixed"} top={"0"}>
      {!rentWill ? (
        <VStack height={"100%"} color={textColor}>
          <Stack
            align={"center"}
            height={"100%"}
            background="rgba(0,0,0,0.9)"
            width={"100vw"}
            padding={20}
            direction={["column", "colum", "row"]}
            spacing={10}
          >
            <Img
              height={"35vh"}
              width={"30vw"}
              borderRadius={"20px"}
              src={Nft.metadata.image}
            />
            <VStack align={"left"}>
              <Heading paddingBottom={"2vh"}>Nft information</Heading>
              <HStack align={"center"} justify="space-between">
                <b>Token ID : </b>
                <Text>{Nft.id}</Text>
              </HStack>
              <HStack
                align={"center"}
                justify="space-between"
                textTransform={"capitalize"}
              >
                <b>Rent Price : </b>
                <Text>
                  {rentPrice}
                  {getCurrency()}
                </Text>
              </HStack>
              <HStack align={"center"} justify="space-between">
                <b>Owner : </b>
                <Text>{getMinimalAddress(owner)}</Text>
              </HStack>
              {Nft.type && (
                <HStack align={"center"} justify="space-between">
                  <b>Type : </b> <Text>{Nft.type}</Text>
                </HStack>
              )}
              <HStack align={"center"} justify="space-between">
                <b>Availability : </b>
                <Text>{!Nft.rented ? "Yes" : "No"}</Text>
              </HStack>

              <HStack paddingTop={"5vh"} justify={"space-between"}>
                <LinkButton
                  onClick={() => {
                    if (Nft.rented) {
                      alert(
                        "Nft is already Rented ! \nCome again another time"
                      );
                      return;
                    }

                    setrentWill(true);
                  }}
                  title={`I want to Rent`}
                  color={"green"}
                  variant={"solid"}
                />
                <LinkButton
                  onClick={() => {
                    DisplayToggle(null);
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
        <VStack width={"100vw"} height={"100vh"} paddingLeft={"10vw"}paddingRight={"10vw"} paddingTop={20}  bg={"black"} color="whiteAlpha.700">
          <VStack spacing={10} width={"50vw"}>
          <Heading textColor={"white"}>Rent NFT</Heading>
          <NamedInput title={"Token Id"}>
            <Input readOnly value={Nft.id} />
          </NamedInput>
          <NamedInput title={"Rent Days"}>
            <Input
              placeholder="Number of days to rent for"
              onChange={(e) => {
                setRentDays(e.target.value);
              }}
            />
          </NamedInput>
          <NamedInput title={"Price to Pay"}>
            <Input value={rentPrice * rentDays + " " + getCurrency()} />
          </NamedInput>
          <HStack width={"50vw"} justify={"space-between"}>
            <LinkButton
              title={"Rent Now"}
              color={"green"}
              onClick={() => {
                rentNft();
              }}
            />
            <LinkButton
              onClick={() => {
                DisplayToggle(null);
              }}
              title={`Close`}
              color={"white"}
              variant={"outline"}
            />
          </HStack>

          </VStack>
        </VStack>
      )}
    </Center>
  );
}

export default NftInformationPopup;
