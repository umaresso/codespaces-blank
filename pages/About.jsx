import { Center, Heading } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'

function About() {
  let textColor="white";
  return (
    <Center
      height={["fit-content", "fit-content", "100vh"]}
      justify={"center"}
      bg="black"
      color={textColor}
      flexDirection={"column"}
    >
      <Heading>Coming Soon...</Heading>
    </Center>
  )
}

export default About
