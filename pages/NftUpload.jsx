import {
  Heading,
  Box,
  Input,
  VStack,
  Link,
  Text,
  HStack,
  Button,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import React from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { Web3Storage } from "web3.storage";
import Card from "./components/Card/Card";
import LinkButton from "./components/LinkButton/LinkButton";
import NamedInput from "./components/NamedInput";
import { getProviderOrSigner } from "../data/accountsConnection";
import {
  getBlockchainSpecificERC721Contract,
  getCustomNetworkERC721Contract,
  getPureTokenUri,
  getTokenOwner,
} from "../data/ERC721";
import {
  getAllContractAddressess,
  getAllContractTokens,
  getTokenMetadata,
} from "../data/ipfsStuff";
import {
  getBlockchainSpecificNFTFactory,
  getBlockchainSpecificNFTTracker,
  getCustomNetworkNFTFactoryContract,
  getCustomNetworkNFTTrackerContract,
  getRentableContract,
  NftRentingFactoryABI,
  NftRentingFactoryBytecode,
} from "../data/NftRenting";
import { getCurrentConnectedOwner } from "../data/blockchainSpecificExports";
import { deploy_tron_contract } from "../data/TronAccountsManagement";
import { useSelector } from "react-redux";
import { isGetAccessor } from "typescript";

export async function getStaticProps(context) {
  require("dotenv").config();
  return {
    props: { token: process.env.WEB3STORAGE_TOKEN }, // will be passed to the page component as props
  };
}

function NftUpload(props) {
  const selectedBlockchainInformation = useSelector(
    (state) => state.blockchain.value
  );
  let _Blockchain = selectedBlockchainInformation.name;
  let _NetworkChain = selectedBlockchainInformation.network;
  let connectedAddress = selectedBlockchainInformation.address;
  let bg = "black";
  let textColor = "white";
  /**
   * Default values
   */

  /**
   *
   */
  const [formStep, setFormStep] = useState(1);
  // has to change it
  const [nftUploaded, setNftUploaded] = useState(false);

  const [contractAddress, setContractAddress] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [pricePerDay, setPricePerDay] = useState(null);
  const [Blockchain, setBlockchain] = useState(null);

  const [factoryContract, setFactoryContract] = useState(null);
  const [NftRentingTracker, setNftRentingTracker] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  const [loader, setLoader] = useState(false);
  const [contractAddresses, setContractAddresses] = useState(null);
  const [contractTokens, setContractTokens] = useState(null);
  const [uploadError, setUploadError] = useState(false);
  const [shouldDisabled, setShouldDisabled] = useState(false);

  let web3ModelRef = useRef();
  function setStatus(message, color) {
    let ele = document.getElementById("creationStatus");
    let newElement = document.createElement("p");
    newElement.key = `message${message}`;
    newElement.textContent = "-> " + message;
    newElement.style.color = color;

    ele.append(newElement);
  }

  function isValidBlockchain() {
    if (!_Blockchain) return false;
    let blockchainPlatform = _Blockchain.toString().toLowerCase();
    if (
      blockchainPlatform == "ethereum" ||
      blockchainPlatform == "eth" ||
      blockchainPlatform == "tron" ||
      blockchainPlatform == "polygon"
    )
      return true;
    return false;
  }

  function projectError(elementId, message) {
    document.getElementById(elementId).textContent = message;
    document.getElementById(elementId).style.color = "#f14651";
  }
  function areValidArguments() {
    /**
     *   contractAddressValidation
            tokenIdValidation
            priceValidation
            blockchainValidation
     */
    if (contractAddress == null) {
      projectError(
        "contractAddressValidation",
        "Please enter Contract address of NFT"
      );
      return false;
    }
    if (!tokenId || tokenId == 0) {
      projectError("tokenIdValidation", "Please Enter Non-Zero token ID");
      return false;
    }
    if (pricePerDay <= 0) {
      projectError("priceValidation", "Please Enter Price greater than zero");
      return false;
    }
    if (!isValidBlockchain()) {
      projectError(
        "blockchainValidation",
        "Sorry , We do not support " + Blockchain + " yet"
      );
      return false;
    }
    // console.log("Arguments are valid");
    setShouldDisabled(true);
    return true;
  }
  async function GatherTokenInformation() {
    let erc721Contract = await getBlockchainSpecificERC721Contract(
      _Blockchain,
      _NetworkChain,
      web3ModelRef,
      contractAddress
    );

    try {
      let _owner =
        _Blockchain == "tron"
          ? await erc721Contract.ownerOf(tokenId).call()
          : await erc721Contract.ownerOf(tokenId);
      let tokenCid = await getPureTokenUri(
        erc721Contract,
        tokenId,
        _Blockchain
      );
      // console.log("Token Cid is ", tokenCid);
      if (tokenCid == "") {
        alert("Unable to read token metadata");
        return null;
      }
      let tokenData = await getTokenMetadata(tokenCid);
      // console.log("Token Metadata is ", tokenData);
      let _NftRentingTracker = await getBlockchainSpecificNFTTracker(
        _Blockchain,
        _NetworkChain,
        web3ModelRef
      );

      let rentableContractAddress = await getRentableContract(
        _NftRentingTracker,
        contractAddress,
        null,
        _Blockchain
      );
      // console.log("Rentable contract is ", rentableContract);

      let token = { ...tokenData };
      if (_owner && !_owner.toString().includes("00000000")) {
        token.owner = _owner;
      }

      if (
        rentableContractAddress &&
        !rentableContractAddress.toString().includes("00000000")
      ) {
        token.rentableContractAddress = rentableContractAddress;
      }
      token.erc721ContractAddress = contractAddress;
      token.id = tokenId;
      // console.log("token is ", token);

      return token;
    } catch (e) {
      if (e?.toString().includes("invalid token ID")) {
        alert("Invalid TokenID");
      } else {
        alert("Unable to Fetch Token Information ..Do you own the Token?");
        console.log(e);
      }
      return null;
    }
  }
  async function uploadNFT() {
    if (areValidArguments()) {
      document.getElementById("upload-btn").textContent = "Checking Token..";

      let tokenDeploymentInstance = await GatherTokenInformation();
      if (tokenDeploymentInstance == null) {
        document.getElementById("upload-btn").textContent = "Upload";
        return null;
      }
      await deployNftUpload(tokenDeploymentInstance);
    }
  }

  async function init() {
    if (!walletAddress) return;
    if (_Blockchain == "ethereum") {
      let fact = await getBlockchainSpecificNFTFactory(
        _Blockchain,
        _NetworkChain,
        web3ModelRef
      );

      // console.log("factory obtained  ", fact);
      setFactoryContract(fact);
    }
    await getBlockchainSpecificNFTTracker(
      _Blockchain,
      _NetworkChain,
      web3ModelRef
    ).then((contract) => {
      // console.log('NFT tracker contract is ',contract);
      getAllContractTokens(contract,null,_Blockchain).then((_contractTokens) => {
        if (!_contractTokens) {
          setContractTokens(null);
          setContractAddress(null);
          return 0;
        }
        // console.log("The all contrac tokens are", _contractTokens);
        // console.log("The all addresses are", Object.keys(_contractTokens));
        let arr = Object.keys(_contractTokens).map((item) => item);
        setContractTokens(_contractTokens);
        setContractAddresses(arr);
      });
      setNftRentingTracker(contract);
    });
  }

  /**
   *  NFT uploading Smart contracts and IPFS stuff
   *
   */

  async function deployNftUpload(tokenDeploymentInstance) {
    setFormStep((prev) => prev + 1);
    setStatus("Making " + _Blockchain + "NftUpload..");
    NFT_Upload(tokenDeploymentInstance);
  }

  async function NFT_Upload(tokenDeploymentInstance) {
    async function deploy() {
      try {
        setStatus("Seems we did not have this awesome collection before");
        setStatus("Creating Rentable Version of your collection ");
        if (_Blockchain == "tron") {
          let abi = NftRentingFactoryABI;
          let bytecode = NftRentingFactoryBytecode;
          let parameters = [contractAddress];
          let adr = await deploy_tron_contract(
            _NetworkChain,
            abi,
            bytecode,
            parameters,
            setStatus
          );
          await trackNFTUpload(adr, tokenDeploymentInstance);
        } else if (_Blockchain == "ethereum") {
          console.log("factory contract is", factoryContract);
          let _factory = factoryContract;

          const contract = await _factory.deploy(contractAddress);
          await contract.deployed();
          await trackNFTUpload(contract.address, tokenDeploymentInstance);
          return contract.address;
        } else if (_Blockchain == "polygon") {
          //
        } else {
          // we dont support this blockchain yet
        }
      } catch (e) {
        if (e.toString().includes("user rejected transaction")) {
          setStatus("You Rejected Uploading..");
          return 0;
        } else {
          setStatus(e.message);
        }
        alert("Error : NFT is Not Uploaded !");
        console.log(e);
      }
      // Deploy the contract to Ethereum test network - Goerli
    }
    setStatus("Checking if Rentable Version Already exists !");
    let response = tokenDeploymentInstance.rentableContractAddress;
    console.log("rentable version :", response);
    if (response != undefined && !response.toString().includes("000000")) {
      setStatus("Wow ! The Rentable contract already Exists !");
      setStatus("Let's Update available contracts on IPFS ");
      StoreUpdatedcontractsOnIpfs(contractAddresses);
      setStatus("Directly Uploading your NFT for rent");

      trackNFTUpload(response.toString(), tokenDeploymentInstance);
    } else {
      deploy(tokenDeploymentInstance);
    }
  }

  async function trackNFTUpload(deployedContractAddress, tokenInstance) {
    let contract = await getBlockchainSpecificNFTTracker(
      _Blockchain,
      _NetworkChain,
      web3ModelRef
    );
    // console.log("uploading", {
    //   contractAddress,
    //   deployedContractAddress,
    //   tokenId,
    //   price: ethers.utils.parseEther(pricePerDay.toString()),
    // });
    setStatus(`Rentable version of NFT contract is Successfully Created 🎉`);
    setStatus("Starting Token Upload");

    setStatus("Storing on IPFS ");
    StoreUpdatedcontractsOnIpfs(contractAddresses).then(
      async (contracts_file_cid) => {
        // console.log("current tokenId", tokenId);
        await StoreUpdatedContractsTokensOnIpfs(
          contractTokens,
          contractAddress,
          tokenInstance
        ).then(async (contractTokens_Cid) => {
          if (!contractTokens_Cid) {
            setStatus("Token Already Available for Rent x ", "red");
            return;
          }
          try {
            setStatus("Successfully stored on IPFS 🥳");
            setStatus("Time to Store on Blockchain");

            setStatus("Approving Transaction");
            let options = {
              gasLimit: 300000,
            };

            let tx =
              _Blockchain == "tron"
                ? await contract
                    .uploadNftForRent(
                      contractAddress,
                      deployedContractAddress,
                      tokenId,
                      (pricePerDay * 1000000).toString(),
                      contracts_file_cid,
                      contractTokens_Cid
                    )
                    .send({
                      feeLimit: 100000000,
                      callValue: 0,
                      tokenId: "",
                      tokenValue: "",
                      shouldPollResponse: true,
                    })
                : await contract.uploadNftForRent(
                    contractAddress,
                    deployedContractAddress,
                    tokenId,
                    ethers.utils.parseEther(pricePerDay.toString()),
                    contracts_file_cid,
                    contractTokens_Cid,
                    options
                  );

            setStatus("Waiting for Transaction Completion..");
            if (_Blockchain !== "tron") {
              await tx.wait();
            }
            setNftUploaded(true);

            setFormStep((prev) => prev + 1);
          } catch (e) {
            console.log("\n\nNFT upload Error", e, "\n\n");

            setStatus("NFT Upload Error !");

            if (e.toString().includes("invalid token")) {
              setStatus("This NFT is not Minted by anyone", "red");
              setStatus(e.error?.message, "red");
            } else if (
              e.message.toString().includes("User denied transaction signature")
            ) {
              setStatus("You have rejected the transaction", "red");
            } else {
              setStatus("You probably do not own the token", "red");
            }
            setUploadError(true);
          }
        });
      }
    );
  }
  async function StoreUpdatedcontractsOnIpfs() {
    console.log("previous contracts are ", contractAddresses);
    console.log("current contract address", contractAddress);
    let uniqueContracts = [...contractAddresses];
    let exists = false;
    uniqueContracts.map((item) => {
      if (item.toString() == contractAddress) {
        exists = true;
      }
    });
    if (!exists) uniqueContracts.push(contractAddress);
    console.log("\n\n------\nUnique Contracts to upload", uniqueContracts);
    console.log("\n\n\n");

    const _blob = new Blob(
      [
        JSON.stringify({
          contracts: [...uniqueContracts],
        }),
      ],
      { type: "application/json" }
    );
    const updatedDappInfo = [new File([_blob], `contracts.json`)];
    let newCID = await storeWithProgress(updatedDappInfo);
    return newCID;
  }
  async function StoreUpdatedContractsTokensOnIpfs(
    _contractTokens,
    currentContract,
    tokenDeploymentInstance
  ) {
    console.log("Previous Tokens are ", _contractTokens);
    let newTokenInstance = tokenDeploymentInstance;
    console.log("New Token instance is ", newTokenInstance);
    let __contractTokens = _contractTokens ? _contractTokens : [];
    let tokensList = [];
    if (__contractTokens) {
      tokensList = __contractTokens[currentContract];
      if (tokensList == undefined) tokensList = [];
    } else {
      tokensList = [];
    }
    let alreadyExists = false;
    let uniqueTokensList = [];
    tokensList?.map((item) => {
      if (item.id == newTokenInstance.id) {
        alreadyExists = true;
      } else {
        uniqueTokensList.push(item);
      }
    });
    if (alreadyExists) {
      return null;
    }
    uniqueTokensList.push(newTokenInstance);
    console.log("\n\n------\n Tokens to upload", " \n---");
    console.log(uniqueTokensList);
    console.log("\n\n\n");

    let updatedContractTokens = {
      ...__contractTokens,
      [currentContract]: uniqueTokensList,
    };
    console.log(
      "Storing Tokens",
      JSON.stringify({
        contractTokens: updatedContractTokens,
      })
    );
    const _blob = new Blob(
      [
        JSON.stringify({
          contractTokens: updatedContractTokens,
        }),
      ],
      { type: "application/json" }
    );
    const updatedNFTs = [new File([_blob], `contractTokens.json`)];
    let newCID = await storeWithProgress(updatedNFTs);
    return newCID;
  }

  async function storeWithProgress(files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {
      console.log("uploading files with cid:", cid);
    };

    // when each chunk is stored, update the percentage complete and display

    const client = makeStorageClient();
    return client.put(files, { onRootCidReady });
  }
  function getAccessToken() {
    return props.token;
  }
  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
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
    init();

    if (!walletAddress) {
      setWalletAddress(connectedAddress);
    }
  }, [walletAddress, _Blockchain]);

  return (
    <>
      {!walletAddress && (
        <Card height={"100vh"}>
          <Button
            onClick={async () => {
              if (connectedAddress) {
                setWalletAddress(connectedAddress);
                return 0;
              }

              let user = await getCurrentConnectedOwner(
                _Blockchain,
                _NetworkChain,
                web3ModelRef
              );
              setWalletAddress(user);
              return 0;
            }}
            colorScheme={"blue"}
            variant={"solid"}
          >
            Connect Wallet
          </Button>
        </Card>
      )}

      {walletAddress && (
        <Card height={"fit-content"} minHeight={"100vh"}>
          {formStep == 1 && (
            <Box
              height={"fit-content"}
              padding={[0, 10, 10]}
              width={"50vw"}
              borderRadius={"10px"}
              background={bg}
              color={textColor}
              justifyContent={"center"}
              alignItems={"center"}
              boxShadow={"1px 1px 1px 1px grey"}
            >
              <Heading align={"center"}>Upload NFTs</Heading>
              <VStack paddingTop={"2vh"} spacing={5}>
                <Box>
                  <NamedInput title={"Contract Address"}>
                    <Input
                      onChange={(e) => {
                        setContractAddress(e.target.value);
                      }}
                      placeholder="0x4b26..8c"
                    />
                  </NamedInput>
                  <Box id="contractAddressValidation"></Box>
                </Box>
                {/* 
            contractAddressValidation
            tokenIdValidation
            priceValidation
            blockchainValidation
            */}
                <Box>
                  <NamedInput title={"Token Id"}>
                    <Input
                      onChange={(e) => setTokenId(e.target.value)}
                      placeholder="1"
                    />
                  </NamedInput>
                  <Box id="tokenIdValidation"></Box>
                </Box>

                <Box>
                  <NamedInput title={"Price per day"}>
                    <Input
                      onChange={(e) => setPricePerDay(e.target.value)}
                      placeholder="price per day in "
                    />
                  </NamedInput>
                  <Box id="priceValidation"></Box>
                </Box>

                <Box>
                  <NamedInput title={"Blockchain"}>
                    <Input
                      textTransform={"capitalize"}
                      //                      onChange={(e) => setBlockchain(e.target.value)}
                      disabled={true}
                      placeholder="Ethereum,Tron,polygon"
                      value={_Blockchain}
                    />
                  </NamedInput>
                  <Box id="blockchainValidation"></Box>
                </Box>

                <LinkButton
                  color={"green"}
                  variant={"solid"}
                  onClick={() => uploadNFT()}
                  title={"Upload NFT"}
                  id="upload-btn"
                />
              </VStack>
            </Box>
          )}
          <VStack
            height={formStep >= 2 ? "110vh" : "1px"}
            bg={"black"}
            color={"white"}
            width={"100vw"}
            paddingTop={"2=10vh"}
            align={"center"}
            display={nftUploaded || formStep < 2 ? "none" : "flex"}
          >
            <Heading>NFT Upload Status</Heading>
            <VStack spacing={3} width="60vw" id="creationStatus">
              <Text fontSize={"20px"}>
                {" "}
                {loader && "Sale Creation Started.."}
              </Text>
            </VStack>
            {uploadError && (
              <VStack height={"100vh"} justify={"center"}>
                <Heading color={"whiteAlpha.800"}>
                  NFT is uploaded Unsuccessful
                </Heading>
                <LinkButton
                  title={"Explore NFTs"}
                  href={"/ExploreNfts"}
                  color={"messenger"}
                  variant={"solid"}
                />
              </VStack>
            )}
          </VStack>
          {nftUploaded && (
            <VStack justify={"center"}>
              <Heading color={"white"}>NFT is uploaded Successfully 🥳</Heading>
              <LinkButton
                title={"Check here"}
                href={"ExploreNfts"}
                color={"messenger"}
                variant={"solid"}
              />
            </VStack>
          )}
        </Card>
      )}
    </>
  );
}

export default NftUpload;
