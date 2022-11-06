import React from "react";
import { Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
function NamedInput(props) {
  let bg = "black";
  let textColor = "white";
let title=props.title;
let children=props.children;
  return (
    <InputGroup  {...props} borderRadius={"10px"}>
      <Input bg={"black"} textColor={"white"} borderTopRightRadius={"0"}borderBottomRadius={"0"} borderRight={"2px solid white"} value={title} contentEditable={false}  width={"fit-content"} minW={"200px"} textTransform={"capitalize"}
      />
      {
        children
      }
    </InputGroup>
  );
}

export default NamedInput;
