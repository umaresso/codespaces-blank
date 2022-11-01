import React, { useEffect, useState } from 'react'
import {
  Heading,
  HStack,
  Text,
  VStack,
  Center,
  
} from '@chakra-ui/react'
import FilterMenuItem from './components/FilterMenuItem'
import { useRef } from 'react'

let NetworkChain = 'goerli'
export async function getStaticProps(context) {
  require('dotenv').config()
  return {
    props: { token: process.env.WEB3STORAGE_TOKEN }, // will be passed to the page component as props
  }
}

function Explorecontracts(props) {
  const [currentMenu, setCurrentMenu] = useState('all')
  const [owner, setOwner] = useState()
  const [contractAddresses,setContractAddresses]=useState(null);
  let web3ModalRef = useRef()

  /**
   *
   * IPFS
   *
   */

  function getAccessToken() {
    return props.token
  }
  async function storeWithProgress(files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {
      console.log("uploading files with cid:", cid);
    };

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
    let uploaded = 0;

    const onStoredChunk = (size) => {
      uploaded += size;
      const pct = 100 * (uploaded / totalSize);
    };

    const client = makeStorageClient();
    return client.put(files, { onRootCidReady, onStoredChunk });
  }
  async function StoreUpdatedcontractsOnIpfs(contractAddresses) {
    const _blob = new Blob(
      [
        JSON.stringify({
          contracts: [...contractAddresses],
        }),
      ],
      { type: "application/json" }
    );
    const updatedDappInfo = [new File([_blob], `contracts.json`)];
    let newCID = await storeWithProgress(updatedDappInfo);
    return newCID;
  }

  
  /**      */

  async function init() {
    
  }

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

export default Explorecontracts
