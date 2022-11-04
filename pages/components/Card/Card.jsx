import React from "react";
import { Center } from "@chakra-ui/react";
function Card(props) {
  return (
    <Center
      {...props}
      padding={[0, 10, 20]}
      justifyContent={"center"}
      width={"100%"}
      height={"fit-content"}
      paddingBottom={"5vh"}
      background={"#010208"}
      {...props}
    >
      {props.children}
    </Center>
  );
}

export default Card;
