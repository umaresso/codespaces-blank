import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  GridItem,
  Heading,
  HStack,
  Img,
  Text,
  VStack,
  Wrap,
  Center,
  WrapItem,
  Button,
} from '@chakra-ui/react'
import FilterMenuItem from './components/FilterMenuItem'
import DappInformationPopup from './components/DappInformationPopup'
import { WebsiteRentContract } from './data/WebsiteRent'
import { fetchWhitelists } from './data/Whitelist'
import { fetchSales } from './data/Sale'
import {
  fetchDappsContent,
  getAllDappsUris,
  getImageLinkFromIPFS,
} from './data/ipfsStuff'
import { getProviderOrSigner } from './data/accountsConnection'
import { useRef } from 'react'
import Web3Modal from 'web3modal'

let NetworkChain = 'goerli'
export async function getStaticProps(context) {
  require('dotenv').config()
  return {
    props: { token: process.env.WEB3STORAGE_TOKEN }, // will be passed to the page component as props
  }
}

function ExploreDapps(props) {
  const [currentMenu, setCurrentMenu] = useState('all')
  const [owner, setOwner] = useState()
  let web3ModalRef = useRef()

  /**
   *
   * IPFS
   *
   */

  function getAccessToken() {
    return props.token
  }

  /**      */
  async function init() {}

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <VStack height={'100vh'} bg="black" textColor={'white'}>
        <Center>
          <VStack>
            <Heading paddingTop={'10vh'} fontSize={'5.5em'} width={'40vw'}>
              Rent yourself a Cool NFT
            </Heading>
            <Text
              fontFamily={'sans-serif'}
              textColor={'grey'}
              fontSize={'18px'}
              width={'40vw'}
            >
              RentWeb3 is your favorite place to rent awesome NFTs to use in
              your Next game , for attending an event or hosting your Phenomenal
              event in the Metaverse. We bring you the NFTs from World's best
              creators at affordable prices. So , if you want to be the part of
              the family ,Rent an NFT Now !
            </Text>
          </VStack>
        </Center>

        <HStack spacing={10}>
          <FilterMenuItem
            title={'all'}
            setter={setCurrentMenu}
            isClicked={currentMenu === 'all'}
          />
          <FilterMenuItem
            title={'available'}
            setter={setCurrentMenu}
            isClicked={currentMenu === 'whitelist'}
          />
          <FilterMenuItem
            title={'rented'}
            setter={setCurrentMenu}
            isClicked={currentMenu === 'sale'}
          />
        </HStack>
      </VStack>
    </>
  )
}

export default ExploreDapps
