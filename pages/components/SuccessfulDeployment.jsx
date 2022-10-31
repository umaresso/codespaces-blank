import React from "react";
import { VStack, Heading, Text } from "@chakra-ui/react";
import { getBlockExplorer } from "../data/blockchainSpecificExports";
import Link from "next/link";
import LinkButton from "./LinkButton/LinkButton";
function SuccessfulDeployment({ address, network }) {
  let blockExplorer = getBlockExplorer(network);
  return (
    <VStack height={"100vh"} justify={"center"} bg={"black"} color={"white"}>
      <Heading>
        Contract is Successfully Deployed 🎉
       
      </Heading>
      <Text fontSize={"16px"} textDecoration={"underline"}>
          <Link href={blockExplorer + address.toString()}>
            <a target={"_blank"}>Check Here</a>
          </Link>
        </Text>
        <LinkButton title={"Check All Deployments"} href="/Deployments" color={"White"} variant={"outline"} key={"see deployments"} />
        
    </VStack>
  );
}

export default SuccessfulDeployment;
