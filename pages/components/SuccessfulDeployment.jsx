import React from "react";
import { VStack, Heading, Text } from "@chakra-ui/react";
import { getBlockExplorer } from "../../data/blockchainSpecificExports";
import Link from "next/link";
import LinkButton from "./LinkButton/LinkButton";
function SuccessfulDeployment(props) {
  let address = props.address;
  let network = props.network;
  let isSuccessful = props.successful;
  let blockExplorer = getBlockExplorer(network);
  if (!network) return <></>;
  return (
    <VStack height={"100vh"} justify={"center"} bg={"black"} color={"white"}>
      <Heading>
        Contract is{" "}
        {isSuccessful ? "Successfully Deployed 🎉" : "not Deployed ! "}{" "}
      </Heading>
      <Text fontSize={"16px"} textDecoration={"underline"}>
        {isSuccessful && (
          <Link href={blockExplorer + address?.toString()}>
            <a target={"_blank"}>Check Here</a>
          </Link>
        )}
      </Text>

      <LinkButton
        title={
          isSuccessful ? "Check All Deployments" : "Check Previous Deployments"
        }
        href="/Deployments"
        color={"White"}
        variant={"outline"}
        key={"see deployments"}
      />
    </VStack>
  );
}

export default SuccessfulDeployment;
