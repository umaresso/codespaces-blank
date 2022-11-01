import { Heading, Box, Input, VStack, Link,Text,HStack } from '@chakra-ui/react'
import { ethers } from 'ethers'
import React from 'react'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
import Card from './components/Card/Card'
import LinkButton from './components/LinkButton/LinkButton'
import NamedInput from './components/NamedInput'
import { getProviderOrSigner } from './data/accountsConnection'
import {
  getCustomNetworkNFTFactoryContract,
  getCustomNetworkNFTTrackerContract,
} from './data/NftRenting'
let NetworkChain = 'goerli'

function NftUpload() {
  let bg = 'black'
  let textColor = 'white'
  const [formStep, setFormStep] = useState(1)
  const [contractAddress, setContractAddress] = useState(null)
  const [tokenId, setTokenId] = useState(0)
  const [pricePerDay, setPricePerDay] = useState(0)
  const [factoryContract, setFactoryContract] = useState(null)
  const [NftRentingTracker, setNftRentingTracker] = useState(null)
  const [owner, setOwner] = useState(null)
  const [deployedAddress, setDeployedAddress] = useState(null)
  const [loader, setLoader] = useState(false)
  const [blockchain,setBlockchain]=useState("ethereum");

  let web3ModelRef = useRef()
  function setStatus(message) {
    let ele = document.getElementById('creationStatus')
    var p_tag = document.createElement('p')
    p_tag.key = `message${message}`
    p_tag.textContent = '-> ' + message
    ele.append(p_tag)
  }

  function uploadNFT() {
    alert('uploading NFTs')
    deployNftUpload()
  }

  async function init() {
    getProviderOrSigner(NetworkChain, web3ModelRef, true).then((_signer) => {
      _signer.getAddress().then((_user) => {
        setOwner(_user)
      })
    })
    getCustomNetworkNFTFactoryContract(NetworkChain, web3ModelRef).then(
      (contract) => {
        setFactoryContract(contract)
      },
    )
    getCustomNetworkNFTTrackerContract(NetworkChain, web3ModelRef).then(
      (contract) => {
        setNftRentingTracker(contract)
      },
    )
  }

  /**
   *  NFT uploading Smart contracts and IPFS stuff
   *
   */

  async function deployNftUpload(sale) {
    if (blockchain == 'ethereum') {
      setFormStep((prev) => prev + 1)
      setStatus('Making Ethereum NftUpload..')
      deployEthNftUpload(sale)
    } else if (blockchain == 'tron') {
      setFormStep((prev) => prev + 1)

      setStatus('Making Tron NftUpload..')
    } else if (blockchain == 'polygon') {
      setFormStep((prev) => prev + 1)

      setStatus('Making Polygon NftUpload..')
    }
  }
  function deployEthNftUpload() {
    async function deploy() {
      try {
        console.log('inside deploy')
        let factory = factoryContract
        console.log('factory', factory)
        console.log('creating instance')
        setStatus('Creating Rentable Version of the Contract')

        const contract = await factory.deploy(contractAddress)
        await contract.deployed()
        
        setStatus(`Successfully Created 🎉`)

        setStatus('Contract Address := ')
        setStatus(getMinimalAddress(contract.address))
        setStatus('Starting Actual upload ')
        setStatus('Approve Transaction')
        await trackNftUploadDeployment(contract.address)
        setStatus(`Upload successful 🎉`)
        setFormStep((prev) => prev + 1)
        return contract.address
      } catch (e) {
        alert('Error : NFT is Not Uploaded !')
        console.log(e);
      }
      // Deploy the contract to Ethereum test network - Goerli
    }
    console.log('uploading rentable version of smart contract')
    deploy()
  }

  async function trackNftUploadDeployment(contractAddress, owner) {
    let contract = NftRentingTracker
    let tx = await contract.uploadNftForRent(
      contractAddress,
      tokenId,
      ethers.utils.parseEther(pricePerDay)
    )
    setStatus('Waiting for Transaction Completion..')
    setTimeout(() => {
      setStatus('Oh No ! Its Taking Longer : (')
      setStatus('Do not Worry , I am with You')
    }, 2000)

    await tx.wait()
    setStatus('Upload SuccessFull✅')
    setDeployedAddress(contractAddress)
  }

  /**
   *
   *
   */
   function getMinimalAddress(adr) {
    if (!adr) return "Fetching..";
    return adr.slice(0, 6) + ".." + adr.slice(38);
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Card>
      {formStep == 1 && (
        <Box
          height={'fit-content'}
          padding={[0, 10, 10]}
          width={'65vw'}
          borderRadius={'10px'}
          background={bg}
          color={textColor}
          justifyContent={'center'}
          alignItems={'center'}
          boxShadow={'1px 1px 1px 1px grey'}
        >
          <Heading align={'center'}>Upload NFTs</Heading>
          <VStack paddingTop={'2vh'} spacing={5}>
            <NamedInput title={'Contract Address'}>
              <Input
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x4b26..8c"
              />
            </NamedInput>
            <NamedInput title={'Token Id'}>
              <Input
                onChange={(e) => setTokenId(e.target.value)}
                placeholder="1"
              />
            </NamedInput>
            <NamedInput title={'Price'}>
              <Input
                onChange={(e) => setPricePerDay(e.target.value)}
                placeholder="price per day in "
              />
            </NamedInput>
            <NamedInput title={'Blockchain'}>
              <Input
                onChange={(e) => setBlockchain(e.target.value)}
                placeholder="Ethereum,Tron,polygon"
              />
            </NamedInput>
            <LinkButton
              color={'green'}
              variant={'solid'}
              onClick={() => uploadNFT()}
              title={'Upload NFT'}
            />
          </VStack>
        </Box>
      )}
      <VStack
        height={formStep ==2 ? '100vh' : '1px'}
        bg={'black'}
        color={'white'}
        width={'100vw'}
        paddingTop={'20vh'}
        align={'center'}
        display={deployedAddress || formStep!=2 ? 'none' : 'flex'}
      >
        <Heading>NFT Upload Status</Heading>
        <VStack spacing={10} width="60vw" id="creationStatus">
          <Text fontSize={'20px'}> {loader && 'Sale Creation Started..'}</Text>
        </VStack>
      </VStack>
    </Card>
  )
}

export default NftUpload
