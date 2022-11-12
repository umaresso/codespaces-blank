import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Input,
  Heading,
  Center,
  VStack,
  background,
} from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";

import Card from "./Card/Card";
import NamedInput from "./NamedInput";
import LinkButton from "./LinkButton/LinkButton";

import { useRouter } from "next/router";
import { getProviderOrSigner } from "../../data/accountsConnection";
import { getCurrentConnectedOwner } from "../../data/blockchainSpecificExports";
import { useSelector } from "react-redux";

function Sale(props) {
  const selectedBlockchainInformation = useSelector(
    (state) => state.blockchain.value
  );
  let _Blockchain = selectedBlockchainInformation.name;
  let _NetworkChain = selectedBlockchainInformation.network;
  let connectedAddress = selectedBlockchainInformation.address;
  const [Blockchain, setBlockchain] = useState(null);
  const [NetworkChain, setNetworkChain] = useState(null);

  let bg = "black";
  let textColor = "white";
  let Children = props.children;
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [endTime, setEndTime] = useState(new Date().getTime());
  const [saleSupply, setSaleSupply] = useState(null);
  const [name, setName] = useState(props._name);
  const [symbol, setSymbol] = useState(props._symbol);
  const [owner, setOwner] = useState(null);
  const [baseURI, setBaseURI] = useState(props._baseURI);
  const [maxWhitelists, setMaxWhitelists] = useState(null);
  const [metadataContract, setMetadataContract] = useState(null);
  const router = useRouter();
  let Web3ModalRef = useRef();
  let saleType = props.saleType;

  function validateArguments() {}
  async function createSale() {
    validateArguments();

    let obj = {
      name,
      symbol,
      saleSupply,
      maxWhitelists,
      owner:connectedAddress,
      baseURI,
      _Blockchain,
      startTime: parseInt(startTime / 1000),
      endTime: parseInt(endTime / 1000),
    };
    console.log("sale object is ", obj);
    await props.deploySale(obj);
  }

  useEffect(() => {
    getCurrentConnectedOwner(_Blockchain, NetworkChain, Web3ModalRef, setOwner);
  }, []);
  async function RefreshToNewBlockchain() {
    setBlockchain(_Blockchain);
    setNetworkChain(_NetworkChain);

    if (!connectedAddress) {
      let user = await getCurrentConnectedOwner(
        _Blockchain,
        _NetworkChain,
        Web3ModalRef
      );
      setOwner(user);
    } else setOwner(connectedAddress);

    // console.log("calling init");
  }
  if (_Blockchain != Blockchain) {
    RefreshToNewBlockchain();
  }
  return (
    <Card>
      <Box
        height={"fit-content"}
        padding={[0, 10, 10]}
        width={"65vw"}
        borderRadius={"10px"}
        background={bg}
        color={textColor}
        justifyContent={"center"}
        alignItems={"center"}
        boxShadow={"1px 1px 1px 1px grey"}
      >
        <Center paddingBottom={"4vh"}>
          <Heading textTransform={"capitalize"}>
            Create {props.saleType}
          </Heading>
        </Center>
        <VStack spacing={5}>
          <NamedInput title={"Name"}>
            <Input
              key={"contract_name"}
              onChange={(e) => {
                let res = e.target.value;
                setName(res);
              }}
              variant="outline"
              defaultValue={name}
              placeholder={"e.g Bored Ape Yacht Club"}
            />
          </NamedInput>
          <NamedInput title={"Symbol"}>
            {" "}
            <Input
              key={"contract_symbol"}
              onChange={(e) => {
                let res = e.target.value;
                setSymbol(res);
              }}
              variant="outline"
              defaultValue={symbol}
              placeholder={"e.g Ape"}
            />
          </NamedInput>
          <NamedInput title={"Owner"}>
            {" "}
            <Input
              key={"contract_Owner"}
              onChange={(e) => {
                let res = e.target.value;
                setOwner(res);
              }}
              variant="outline"
              defaultValue={owner}
            />
          </NamedInput>
          {saleType == "whitelist" && (
            <NamedInput title={"Max Whitelists"}>
              {" "}
              <Input
                key={"Sale Supply"}
                type={"number"}
                onChange={(e) => {
                  let res = e.target.value;
                  setMaxWhitelists(res);
                }}
                variant="outline"
                defaultValue={maxWhitelists}
                placeholder={"e.g 100"}
              />
            </NamedInput>
          )}
          <NamedInput title={"Total Supply"}>
            {" "}
            <Input
              key={"Total Supply"}
              type={"number"}
              onChange={(e) => {
                let res = e.target.value;
                setSaleSupply(res);
              }}
              variant="outline"
              defaultValue={saleSupply}
              placeholder={"Tokens total supply e.g 100"}
            />
          </NamedInput>

          <NamedInput title={"Blockchain"}>
            {" "}
            <Input
              key={"Blockchain"}
              onChange={(e) => {
                let res = e.target.value;
                setBlockchain(res);
              }}
              textTransform={"capitalize"}
              variant="outline"
              // defaultValue={""}
              // placeholder={"Ethereum , Tron or Polygon"}
              value={Blockchain ? Blockchain : null}
              disabled={Blockchain ? true : false}
            />
          </NamedInput>

          <NamedInput title={"baseURI"}>
            {" "}
            <Input
              key={"baseURI"}
              onChange={(e) => {
                let res = e.target.value;
                setBaseURI(res);
              }}
              variant="outline"
              placeholder={
                "e.g ipfs://QmVK3Cnfpuou3rg71kgBFxqo1rSmsBvCFCw9upHntbQhU6"
              }
            />
          </NamedInput>

          <NamedInput background={"white"} color={"black"} title={"Start Time"}>
            {" "}
            <SingleDatepicker
              key={"start time"}
              name="date-input"
              date={new Date(startTime)}
              borderLeft={"3px solid black"}
              onDateChange={(e) => {
                let date = new Date(e);
                let epochTime = date.getTime();
                setStartTime(epochTime);
              }}
            />
          </NamedInput>

          <NamedInput background={"white"} color={"black"} title={"End Time"}>
            {" "}
            <SingleDatepicker
              key={"end time"}
              name="date-input"
              date={new Date(endTime)}
              borderLeft={"3px solid black"}
              onDateChange={(e) => {
                let date = new Date(e);
                let epochTime = date.getTime();
                setEndTime(epochTime);
              }}
            />
          </NamedInput>
          {Children && props.children}
          <LinkButton
            onClick={createSale}
            title={`Create ${props.saleType}`}
            loadingMessage={`Creating ${props.saleType}..`}
            color={"green"}
            variant={"solid"}
          />
        </VStack>
      </Box>
    </Card>
  );
}

export default Sale;
