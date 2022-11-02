import React from 'react'
import {
  VStack,
  Text,
  Center,
  Heading,
  HStack,
  WrapItem,
  Wrap,
} from '@chakra-ui/react'
import LinkButton from './components/LinkButton/LinkButton'
import Head from 'next/head'
function Explore() {
  return (
    <VStack  height={'fit-content'} bg="black" textColor={'white'}>
      <Center>
        <VStack paddingTop={"10vh"}>
          <Heading paddingTop={'10vh'} fontSize={'4.5em'} width={'50vw'}>
            Your Destination to Rent Web3 Assets
          </Heading>
          <Text
            fontFamily={'sans-serif'}
            textColor={'grey'}
            fontSize={'18px'}
            width={'50vw'}
          >
            We provide you with the oporunity to rent NFTs of famous collections
            and Dapps ,made by the best developers in the space,for showing your
            NFT collections in an easy way. So you have an NFT from a collection
            that is not rentable ? Dont worry then even, we got you covered. Our
            smooth workflow is designed to make non-compatible things compatible
            in a no-code way. So what are you waiting For ?
          </Text>
          <hr/>
          <Heading padding={"5vh 0 5vh 0"}>Take Action</Heading>
          <Wrap width={"60vw"} paddingBottom={"10vh"} spacing={20}>
          <WrapItem>
            <LinkButton
              title={'Upload NFT'}
              href={'/NftUpload'}
              color={'blue'}
              variant={'solid'}
            />
          </WrapItem>
          <WrapItem>
            <LinkButton
              title={'Explore NFTs'}
              href={'/ExploreNfts'}
              color={'blue'}
              variant={'solid'}
            />
          </WrapItem>
          <WrapItem>
            <LinkButton
              title={'Upload Dapp'}
              href={'/CreateDapp'}
              color={'green'}
              variant={'solid'}
            />
          </WrapItem>
          <WrapItem>
            <LinkButton
              title={'Explore Dapps'}
              href={'/ExploreDapps'}
              color={'green'}
              variant={'solid'}
            />
          </WrapItem>
        </Wrap>

        </VStack>
      </Center>
    </VStack>
  )
}

export default Explore
