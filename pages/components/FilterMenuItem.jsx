import { Box, Button } from '@chakra-ui/react';
import React, { useState } from 'react'

function FilterMenuItem({title,isClicked,setter}) {
    const [clicked,setClicked]=useState(isClicked);
    function clickHandler(){
        setter(title);

    }
  return (
    <Button _hover={{background:"black"}} _active={{background:"white",color:"black"}} bg="black" onClick={clickHandler} style={{
        textTransform:"capitalize",
        textDecoration:clicked?"underline":"none",
        fontSize:"16px",
        fontWeight:clicked?"700":"500",
        paddingBottom:"5px"
    }}>
    {title}
    </Button>
  )
}

export default FilterMenuItem
