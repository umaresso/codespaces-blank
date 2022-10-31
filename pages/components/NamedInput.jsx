import React from "react";
import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
function NamedInput(props) {
  let bg = "black";
  let textColor = "white";

  return (
    <InputGroup  {...props} borderRadius={"10px"}>
      <InputLeftAddon textTransform={"capitalize"}
        width={["150px","170px","180px"]}
        fontWeight={"700"}
        bg={bg}
        fontSize={["12px","14px","14px"]}
        color={textColor}
        children={props.title}
        borderRight={"2px white solid"}
      />
      {props.children}
    </InputGroup>
  );
}

export default NamedInput;
