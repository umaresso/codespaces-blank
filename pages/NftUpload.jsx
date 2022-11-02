import {
  Heading,
  Box,
  Input,
  VStack,
  Link,
  Text,
  HStack,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import React from 'react'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
import { Web3Storage } from 'web3.storage'
import Card from './components/Card/Card'
import LinkButton from './components/LinkButton/LinkButton'
import NamedInput from './components/NamedInput'
import SuccessfulDeployment from './components/SuccessfulDeployment'
import { getProviderOrSigner } from './data/accountsConnection'
import {
  getAllContractAddressess,
  getAllContractTokens,
} from './data/ipfsStuff'
import {
  getCustomNetworkNFTFactoryContract,
  getCustomNetworkNFTTrackerContract,
} from './data/NftRenting'
let NetworkChain = 'goerli'
export async function getStaticProps(context) {
  require('dotenv').config()
  return {
    props: { token: process.env.WEB3STORAGE_TOKEN }, // will be passed to the page component as props
  }
}

function NftUpload(props) {
  let bg = 'black'
  let textColor = 'white'
  /**
   * Default values
   */
  let _erc721 = '0xC6d8fcC4abb9F0E16dc14F991fD6b014cfc3Db94'
  let _blockchain = 'ethereum'
  let _price = 0.02
  let _tokenId = 1
  /**
   *
   */
  const [formStep, setFormStep] = useState(1)
  const [contractAddress, setContractAddress] = useState(_erc721)
  const [tokenId, setTokenId] = useState(_tokenId)
  const [pricePerDay, setPricePerDay] = useState(_price)
  const [blockchain, setBlockchain] = useState(_blockchain)

  const [factoryContract, setFactoryContract] = useState(null)
  const [NftRentingTracker, setNftRentingTracker] = useState(null)
  const [owner, setOwner] = useState(null)
  const [deployedAddress, setDeployedAddress] = useState(null)
  const [loader, setLoader] = useState(false)
  const [contractAddresses, setContractAddresses] = useState(null)
  const [contractTokens, setContractTokens] = useState(null)
  let web3ModelRef = useRef()
  function setStatus(message, color) {
    let ele = document.getElementById('creationStatus')
    let newElement = document.createElement('p')
    newElement.key = `message${message}`
    newElement.textContent = '-> ' + message
    newElement.style.color = color

    ele.append(newElement)
  }

  function uploadNFT() {
    deployNftUpload()
  }

  async function init() {
    getProviderOrSigner(NetworkChain, web3ModelRef, true).then((_signer) => {
      _signer?.getAddress().then((_user) => {
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
        getAllContractAddressess(contract, setContractAddresses)
        getAllContractTokens(contract, setContractTokens)
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
      EthUpload(sale)
    } else if (blockchain == 'tron') {
      setFormStep((prev) => prev + 1)

      setStatus('Making Tron NftUpload..')
    } else if (blockchain == 'polygon') {
      setFormStep((prev) => prev + 1)

      setStatus('Making Polygon NftUpload..')
    }
  }
  async function EthUpload() {
    async function deploy() {
      try {
        console.log('upload')
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
        await trackNFTUpload(contract.address)
        return contract.address
      } catch (e) {
        setStatus(e.message)
        alert('Error : NFT is Not Uploaded !')
        console.log(e)
      }
      // Deploy the contract to Ethereum test network - Goerli
    }
    setStatus('Checking if Rentable Version Already exists !')
    let response = await NftRentingTracker.erc721ToRentableContract(
      contractAddress,
    )
    console.log('rentable version :', response)
    if (!response.toString().includes('0x000')) {
      setStatus('Wow ! The Rentable contract already Exists !')
      setStatus("Let's Update available contracts on IPFS ")
      StoreUpdatedcontractsOnIpfs(contractAddresses)
      setStatus('Directly Uploading your NFT for rent')

      trackNFTUpload(response.toString())
    } else {
      console.log('uploading rentable version of smart contract')
      deploy()
    }
  }

  async function trackNFTUpload(deployedContractAddress) {
    let contract = NftRentingTracker
    console.log('uploading', {
      contractAddress,
      deployedContractAddress,
      tokenId,
      price: ethers.utils.parseEther(pricePerDay.toString()),
    })
    console.log('Storing on IPFS ')
    StoreUpdatedcontractsOnIpfs(contractAddresses).then(
      async (contracts_file_cid) => {
        console.log('current tokenId', tokenId)
        await StoreUpdatedContractsTokensOnIpfs(
          contractTokens,
          contractAddress,
          tokenId,
        ).then(async (contractTokens_Cid) => {
          if (!contractTokens_Cid) {
            setStatus('Token Already Available for Rent x ', 'red')
            return
          }
          try {
            console.log('Successfully stored on IPFS !')
            setStatus('Storing on blockchain')

            setStatus('Approve Transaction')

            let tx = await contract.uploadNftForRent(
              contractAddress,
              deployedContractAddress,
              tokenId,
              ethers.utils.parseEther(pricePerDay.toString()),
              contracts_file_cid,
              contractTokens_Cid,
            )
            setStatus('Waiting for Transaction Completion..')
            await tx.wait()
            setDeployedAddress(deployedContractAddress)

            setFormStep((prev) => prev + 1)
          } catch (e) {
            console.log('Upload Error := ', e)
            if (e.toString().includes('invalid token')) {
              setStatus('This NFT is not Minted by anyone', 'red')
            }
            setStatus(e.error.message, 'red')
          }
        })
      },
    )
  }
  async function StoreUpdatedcontractsOnIpfs(_contractAddresses) {
    let __contracts = _contractAddresses ? _contractAddresses : []
    let uniqueContracts = __contracts.map((item) => item != contractAddress)
    uniqueContracts.push(contractAddress)

    const _blob = new Blob(
      [
        JSON.stringify({
          contracts: [...uniqueContracts],
        }),
      ],
      { type: 'application/json' },
    )
    const updatedDappInfo = [new File([_blob], `contracts.json`)]
    let newCID = await storeWithProgress(updatedDappInfo)
    return newCID
  }
  async function StoreUpdatedContractsTokensOnIpfs(
    _contractTokens,
    currentContract,
    newToken,
  ) {
    let __contractTokens = _contractTokens ? _contractTokens : []
    let tokensList
    console.log('Contract tokens array', _contractTokens, ' token id ', tokenId)
    if (__contractTokens) {
      console.log('not undefined !')
      tokensList = __contractTokens[currentContract]
      if (tokensList == undefined) tokensList = []
    } else {
      tokensList = []
    }
    console.log('tokens before pushing', tokensList)
    let alreadyExists = false
    let uniqueTokensList = []
    tokensList.map((item) => {
      if (Number(item) === Number(newToken)) {
        alreadyExists = true
      } else {
        uniqueTokensList.push(Number(item))
      }
    })
    if (alreadyExists) {
      return null
    }
    uniqueTokensList.push(Number(newToken))
    console.log('tokens after pushing', uniqueTokensList)

    let updatedContractTokens = {
      ...__contractTokens,
      [currentContract]: uniqueTokensList,
    }
    console.log(
      'Storing Tokens',
      JSON.stringify({
        contractTokens: updatedContractTokens,
      }),
    )
    const _blob = new Blob(
      [
        JSON.stringify({
          contractTokens: updatedContractTokens,
        }),
      ],
      { type: 'application/json' },
    )
    const updatedDappInfo = [new File([_blob], `contractTokens.json`)]
    let newCID = await storeWithProgress(updatedDappInfo)
    return newCID
  }

  async function storeWithProgress(files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {
      console.log('uploading files with cid:', cid)
    }

    // when each chunk is stored, update the percentage complete and display

    const client = makeStorageClient()
    return client.put(files, { onRootCidReady })
  }
  function getAccessToken() {
    return props.token
  }
  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() })
  }

  /**
   *
   *
   */
  function getMinimalAddress(adr) {
    if (!adr) return 'Fetching..'
    return adr.slice(0, 6) + '..' + adr.slice(38)
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
          width={'50vw'}
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
        height={formStep >= 2 ? '100vh' : '1px'}
        bg={'black'}
        color={'white'}
        width={'100vw'}
        paddingTop={'20vh'}
        align={'center'}
        display={deployedAddress || formStep < 2 ? 'none' : 'flex'}
      >
        <Heading>NFT Upload Status</Heading>
        <VStack spacing={5} width="60vw" id="creationStatus">
          <Text fontSize={'20px'}> {loader && 'Sale Creation Started..'}</Text>
        </VStack>
      </VStack>
      {deployedAddress !== null && (
        <VStack height={'90vh'} justify={'center'}>
          <Heading color={'whiteAlpha.800'}>
            NFT is uploaded Successfully 🥳
          </Heading>
          <LinkButton
            title={'Check here'}
            href={'ExploreNfts'}
            color={'messenger'}
            variant={'solid'}
          />
        </VStack>
      )}
    </Card>
  )
}

export default NftUpload
