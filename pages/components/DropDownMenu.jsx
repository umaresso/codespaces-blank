import React, { useEffect } from "react";
import { Menu, MenuItem, MenuButton, MenuList, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";

function DropDownMenu(props) {
  let title = props.title;
  let options = props.options;
  let selector = props.selector;
  let theme = { background: "white", textColor: "black" };
  let selected = props.selected;
  function getMinimalAddress() {
    let adr = props.selected;
    if (!adr) return "No Option Selected ";
    return adr.slice(0, 6) + ".." + adr.slice(40);
  }

  useEffect(() => {
  selector(selected);
    
  }, [])
  
  return (
    <Menu colorScheme={"green"}>
      <MenuButton
        {...theme}
        width={"100%"}
        _hover={theme}
        _active={theme}
        as={Button}
        rightIcon={<ChevronDownIcon />}
      >
        { getMinimalAddress()}
      </MenuButton>
      {options !== undefined && (
        <MenuList {...theme}>
          {options?.map((option, index) => {
            return (
              <MenuItem
                key={"menu_" + option + index}
                _hover={theme}
                _active={theme}
                _selected={selected == option}
                onClick={() => selector(option)}
              >
                {option}
              </MenuItem>
            );
          })}
        </MenuList>
      )}
    </Menu>
  );
}

export default DropDownMenu;
