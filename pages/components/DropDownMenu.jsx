import React, { useEffect } from "react";
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Button,
  color,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";

function DropDownMenu(props) {
  let title = props.title;
  let options = props.options;
  console.log("options recived ",options)
  let selector = props.selector;
  let textMenu = props.textMenu;
  let theme = props.theme;
  if (!theme) theme = { background: "white", textColor: "black" };
  let _hoverTheme = {
    background: theme.textColor,
    textColor: theme.background,
  };
  let selected = props.selected;
  function getMinimalAddress() {
    let adr = props.selected;
    if (!adr) return "No Option Selected ";
    return adr.slice(0, 6) + ".." + adr.slice(40);
  }

  useEffect(() => {
    selector(selected);
  }, []);

  return (
    <Menu  colorScheme={textMenu?"blue":"green"} >
      <MenuButton
        textTransform={textMenu ? "capitalize" : "none"}
        {...theme}
        width={textMenu ? "fit-content" : "100%"}
        _hover={_hoverTheme}
        as={Button}
        _active={theme} _focus={theme}
        rightIcon={<ChevronDownIcon />}
      >
        {textMenu ? selected : getMinimalAddress()}
      </MenuButton>
      {options !== undefined && (
        <MenuList {...theme}>
          {options?.map((option, index) => {
            return (
              <MenuItem
                fontWeight={textMenu?"500":"normal"}
                key={"menu_" + option + index}
                textTransform={textMenu ? "capitalize" : "none"}
                _hover={{
                  background: "black",
                  color: "white",
                }}
                _active={{
                  background: "transparent",
                }}
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
