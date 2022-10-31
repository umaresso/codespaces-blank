import { Box, HStack, Button, Heading } from '@chakra-ui/react'
import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  getProviderOrSigner,
  connectWallet,
} from '../../data/accountsConnection'
import { BigNumber, Contract, ethers, providers, utils } from 'ethers'
import Web3Modal from 'web3modal'
import { connect } from 'formik'

let NetworkChain = 'goerli'
function Navbar() {
  const [walletAddress, setWalletAddress] = useState(null)
  const web3ModalRef = useRef()
  let connectionCheckerId = 0
  // theme
  let textColor = 'white'
  let background = 'black'
  let theme = {
    textColor,
    background,
  }

  //  _____

  // for intra and inter-Blockchain connection

  async function Connect() {
    getProviderOrSigner(NetworkChain, web3ModalRef, true).then((signer) => {
      if (signer) {
        signer.getAddress().then((user) => {
          setWalletAddress(user)
        })
      }
    })
  }
  useEffect(() => {
    let connectionCheckerId = setInterval(() => {
      if (!walletAddress) {
        Connect()
      } else {
        clearInterval(connectionCheckerId)
      }
    }, 3000)
  }, [])

  function getMinimalAddress(_adr) {
    let adr = _adr.toString()
    return adr.slice(0, 6) + '..' + adr.slice(40)
  }
  console.log(walletAddress)
  return (
    <HStack
      position={'fixed'}
      top={'0'}
      paddingLeft={5}
      paddingRight={5}
      justifyContent={'space-between'}
      width={'100%'}
      height={'50px'}
      boxShadow={'1px 1px 1px 1px white'}
      {...theme}
      zIndex={'10'}
    >
      <Box width={'10vw'}>
        <Link href="/">
          <Heading
            _hover={{ cursor: 'pointer' }}
            as="h5"
            fontSize={'18px'}
            width={'max-content'}
          >
            RentWeb3
          </Heading>
        </Link>
      </Box>
      <HStack
        display={['none', 'none', 'flex']}
        spacing={[5, 10, 12]}
        width="40vw"
        justifyContent={'space-between'}
        fontSize={['12px', '12px', '14px']}
        fontWeight={'semibold'}
      >
        <Link href="/">Home</Link>
        <Link href="/Create">Create</Link>
        <Link href="/Explore">Explore</Link>
        <Link href="/Deployments">Deployments</Link>
        <Link href="/About">About</Link>
      </HStack>

      <Button
        colorScheme={'green'}
        _hover={{
          cursor: 'pointer',
        }}
        variant={walletAddress ? 'solid' : 'outline'}
        onClick={Connect}
        as="h5"
        fontSize={'18px'}
        width={'max-content'}
      >
        {walletAddress ? getMinimalAddress(walletAddress) : 'Connect'}
      </Button>
    </HStack>
  )
}

export default Navbar
