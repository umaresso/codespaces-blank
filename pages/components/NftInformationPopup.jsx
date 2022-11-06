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
  selector,
} from "@chakra-ui/react";
import NamedInput from "./NamedInput";
import LinkButton from "./LinkButton/LinkButton";
import { getMinimalAddress } from "../../Utilities";
import {
  getCustomNetworkNFTTrackerContract,
  getRentableContract,
  rentNFT,
} from "../../data/NftRenting";
import { useRef } from "react";
import { getIpfsImageLink } from "../../data/ipfsStuff";
import { getProviderOrSigner } from "../../data/accountsConnection";
import { useRouter } from "next/router";

const ethers = require("ethers");
let NetworkChain = "goerli";
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
function NftInformationPopup(props) {
  let NFT=props.NFT;
  let displayToggle=props.displayToggle;
  let Nft = NFT;
  const router = useRouter();
  const [rentWill, setrentWill] = useState(false);
  const [rentPrice, setRentPrice] = useState(Nft?.rentPrice);
  const [nftTrackerContract, setNftTrackerContract] = useState(null);
  const [rentableContract, setRentableContract] = useState(null);
  const [rentDays, setRentDays] = useState(1);
  const [walletAddress, setWalletAddress] = useState(null);
  const [reload, setReload] = useState(false);
  // console.log("NFT received", NFT);
  let ErcContractAddress = Nft?.erc721ContractAddress;
  let owner = Nft?.owner;
  let DisplayToggle = displayToggle;

  let web3ModalRef = useRef();
  function setStatus(message) {
    let ele = document.getElementById("creationStatus");
    var p_tag = document.createElement("p");
    p_tag.key = `message${message}`;
    p_tag.textContent = "-> " + message;
    ele.append(p_tag);
  }

  async function rentNft() {
    let totalPrice = rentPrice * rentDays;
    setStatus("Renting Started 🌟");
    setStatus("Approve Transaction");

    await rentNFT(
      nftTrackerContract,
      rentableContract,
      Nft?.id,
      rentDays,
      totalPrice,
      setStatus,
      router.push,
      "/Explore"
    );
  }
  async function connectWallet() {
    getProviderOrSigner(NetworkChain, web3ModalRef, true).then((signer) => {
      if (signer && !walletAddress) {
        signer.getAddress().then((user) => {
          setWalletAddress(user);
        });
      }
    });
  }

  async function init() {
    !walletAddress && connectWallet();

    getCustomNetworkNFTTrackerContract(NetworkChain, web3ModalRef).then(
      async (TrackerContract) => {
        if (!Nft?.rentableContract) {
          getRentableContract(TrackerContract, Nft?.erc721ContractAddress).then(
            (rentableSmartContractInstance) => {
              setRentableContract(rentableSmartContractInstance);
            }
          );
        }

        setNftTrackerContract(TrackerContract);
      }
    );
  }

  useEffect(() => {
    init();
  }, [walletAddress]);
  let image = getIpfsImageLink(Nft?.image);
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
            direction={["column", "column", "row"]}
            spacing={10}
          >
            <Img
              height={"35vh"}
              width={"30vw"}
              borderRadius={"20px"}
              src={image}
            />
            <VStack align={"left"}>
              <Heading paddingBottom={"2vh"}>NFT information</Heading>
              <HStack align={"center"} justify="space-between">
                <b>Token ID : </b>
                <Text>{Nft?.id}</Text>
              </HStack>
              <HStack
                align={"center"}
                justify="space-between"
                textTransform={"capitalize"}
              >
                <b>Rent Price : </b>
                <Text>
                  {rentPrice + " "} {getCurrency()}
                </Text>
              </HStack>
              <HStack align={"center"} justify="space-between">
                <b>Owner : </b>
                <Text>
                  {walletAddress == Nft?.owner && "You -> "}
                  {getMinimalAddress(owner)}
                </Text>
              </HStack>
              {Nft?.type && (
                <HStack align={"center"} justify="space-between">
                  <b>Type : </b> <Text>{Nft?.type}</Text>
                </HStack>
              )}

              <HStack align={"center"} justify="space-between">
                <b>Availability : </b>
                <Text>{!Nft?.rented ? "Yes" : "No"}</Text>
              </HStack>
              {Nft?.rented && (
                <HStack align={"center"} justify="space-between">
                  <b>Current User : </b>

                  <Text>
                    {" "}
                    {walletAddress == Nft?.user && "You -> "}
                    {getMinimalAddress(Nft?.user)}
                  </Text>
                </HStack>
              )}
              <HStack paddingTop={"5vh"} justify={"space-between"}>
                <LinkButton
                  onClick={() => {
                    if (Nft?.rented) {
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
        <VStack
          width={"100vw"}
          height={"100vh"}
          paddingLeft={"10vw"}
          paddingRight={"10vw"}
          paddingTop={20}
          bg={"black"}
          color="whiteAlpha.700"
        >
          <VStack spacing={10} width={"50vw"}>
            <Heading textColor={"white"}>Rent NFT</Heading>
            <NamedInput title={"Token Id"}>
              <Input readOnly value={Nft?.id} />
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
              <Input
                readOnly
                value={rentPrice * rentDays + " " + getCurrency()}
              />
            </NamedInput>
            <HStack width={"50vw"} justify={"space-between"}>
              <LinkButton
                title={"Rent Now"}
                id={"rent-btn"}
                color={"green"}
                href={"/Explore"}
                onClick={async () => {
                  await rentNft();
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
          <div id="creationStatus"></div>
        </VStack>
      )}
    </Center>
  );
}

export default NftInformationPopup;
