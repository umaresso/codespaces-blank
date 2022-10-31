import { HStack,VStack,Box, LinkBox } from '@chakra-ui/react'
import React from 'react'
import LinkButton from './components/LinkButton/LinkButton'

function Create() {
    let textColor="white";
  return (
    <VStack height={"100vh"} justify={"center"} bg="black" color={textColor}>
        <HStack spacing={5} >
            <LinkButton title={"Create Whitelist"} href={"/CreateWhitelist"} color={"green"} variant={"solid"}  />
            <LinkButton title={"Create Sale"} href={"/CreateSale"} color={"green"} variant={"solid"}  />
            <LinkButton title={"Upload Dapp"} href={"/CreateDapp"} color={"green"} variant={"solid"}  />
            
        </HStack>
    </VStack>
  )
}

export default Create
