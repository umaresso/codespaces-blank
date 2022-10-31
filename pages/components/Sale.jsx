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

import Card from "./Card/Card"
import NamedInput from "./NamedInput";
import LinkButton from "./LinkButton/LinkButton";

import { useRouter } from "next/router";
import { getProviderOrSigner } from "../data/accountsConnection";
let NetworkChain = "ethereum";

function Sale(props) {
  let bg = "black";
  let textColor = "white";
  let Children = props.children;
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [endTime, setEndTime] = useState(new Date().getTime());
  const [saleSupply, setSaleSupply] = useState(100);
  const [name, setName] = useState(props._name);
  const [symbol, setSymbol] = useState(props._symbol);
  const [owner, setOwner] = useState(props._owner);
  const [baseURI, setBaseURI] = useState(props._baseURI);
  const [blockchain, setBlockchain] = useState(NetworkChain);
  const [metadataContract, setMetadataContract] = useState(null);
  const router = useRouter();
  let Web3ModalRef = useRef();


  function validateArguments() { }
  async function createSale() {
    validateArguments();

    let obj = {
      name,
      symbol,
      saleSupply,
      owner,
      baseURI,
      blockchain,
      startTime: parseInt(startTime / 1000),
      endTime: parseInt(endTime / 1000),
    };

    await props.deploySale(obj);
  }

  async function getOwner() {
    getProviderOrSigner(NetworkChain, Web3ModalRef, true).then(signer => {
      signer.getAddress().then(setOwner).catch(console.log);

    });

  }

  useEffect(() => {

    getOwner();

  }, [])


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
          <NamedInput title={"Supply"}>
            {" "}
            <Input
              key={"Sale Supply"}
              type={"number"}
              onChange={(e) => {
                let res = e.target.value;
                setSaleSupply(res);
              }}
              variant="outline"
              defaultValue={saleSupply}
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
              variant="outline"
              defaultValue={""}
              placeholder={"ethereum , tron or polygon"}
            />
          </NamedInput>

          {baseURI && (
            <NamedInput title={"baseURI"}>
              {" "}
              <Input
                key={"baseURI"}
                onChange={(e) => {
                  let res = e.target.value;
                  setBaseURI(res);
                }}
                variant="outline"
                defaultValue={baseURI}
              />
            </NamedInput>
          )}

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
