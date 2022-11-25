// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/**

  Purpose       :   Create a sale contract that has presale and public sale features where you can set price of each NFT
  Pre-requisite :   whitelist contract address made by rentweb3 for presale part
  Compatible with ERC-721 standard ( ERC-1155 is coming soon )           

 */

// Help taken from Manav Vagdoda (vagdonic.github.io)

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./WhitelistFactory.sol";

contract Sale is ERC721, ERC721URIStorage{

    //    The Variable Names are simple enough to understand
    IWhitelist whitelistContract;    // an Interface object that we will use to access the already deployed whitelist contract through the deployed address
    uint256  openingTime;
    uint256  closingTime;
    address public  owner;
    uint256 public presaleMintRate;
    uint256 public publicMintRate;
    string public baseURI;
    string public baseExtension = ".json";
    address PLATFORM_BENEFICIARY=0xbe68eE8a43ce119a56625d7E645AbAF74652d5E1; // the platform owner address that will receive the 1% tax on each mint.
    uint MINTING_FEE_FRACTION=100; // 100th fraction means  we are taking just 1% fee on each minting
   
    uint public totalSupply;
    mapping(uint =>uint) updatedNFTPrice;
    enum Stage {locked, presale, publicsale}

 // The modifier that when applied on functions , they can only be executed by the platform owner 
 // - one usecase can be the withdrawl of all the money present in smart contract by cutting minting fees
      
    modifier onlyBeneficiary{ 
      require(PLATFORM_BENEFICIARY==msg.sender);
      _;
    } 
    modifier onlyOwner{
        require(owner==msg.sender,"You are not the owner");
        _;
    }

    // demo data to initialize with
    // 0xf51C21c44A836125A81da92556aaf5d67C7ca6d5,"Bitcoin Prime","bitcoin",0xf5a6Bf94e82972c8bf7B23858Ec62a8f840B8d79,"ipfs://QmVK3Cnfpuou3rg71kgBFxqo1rSmsBvCFCw9upHntbQhU6/",1665914714,1665919507,1000000000000000,2000000000000000,10

    // It is Just a constructor accepting various parameters and initailizing some variables for future
    constructor(
      address whitelistContractAddress,
      string memory name,
      string memory symbol,
      address _owner,
      string memory _baseURI,
      uint startTime,
      uint endTime,
      uint _presaleMintRate,
      uint _publicMintRate,
      uint _totalSupply
      
      ) 
      ERC721(name, symbol)
      {
      whitelistContract=IWhitelist(whitelistContractAddress); // accessing already deployed whitelist contract to lookup addresses if they are whitelisted when people attempt to mint tokens in Presale
      owner = _owner;
      PLATFORM_BENEFICIARY=msg.sender;
      openingTime=startTime;
      closingTime=endTime;
      presaleMintRate=_presaleMintRate;
      publicMintRate=_publicMintRate;
      baseURI=_baseURI;
      totalSupply=_totalSupply;
              
    }

    
    // get NFT price based upon the current stage of sale ( Presale , public sale )
    // it also adds platform fee to the original price of the NFT to mint ( and that's how we earn )

    function getNFTPrice(uint tokenId)public view returns(uint){
      uint price=0;
      if(checkStage()==Stage.presale)
        price=presaleMintRate;
      
      else if (checkStage()==Stage.publicsale)
        price=publicMintRate;
      
      if(updatedNFTPrice[tokenId]!=0)
        price=updatedNFTPrice[tokenId];
        uint minting_fee = price/MINTING_FEE_FRACTION;
        price =  price+ minting_fee;

      return price;

    }

    // the Platform owner can withdraw all the money earned by the minting of NFTs
    function withdraw()public onlyBeneficiary{
           payable(PLATFORM_BENEFICIARY).transfer(address(this).balance);
    }
    // simple functionality by name
    function MintThisToken(uint tokenId)internal {
      // If the token is already minted , we can not mint again
     if(!_exists(tokenId)) 
        _safeMint(msg.sender,tokenId);
     
    }
    /*
    
     NFT Purchase according to the stage and mint status
     
     There can be two cases
     
          - Token is not minted
          - Token is already Minted and now it's ownership can be transferred      
    */

    function purchaseThisToken(uint tokenId)public payable{
      // can not mint before time
      require(checkStage()!=Stage.locked,"Sale has not started yet");
      if(checkStage()==Stage.presale){ 
           require(isWhitelisted(msg.sender),"PRESALE:You are not Whitelisted !");         
         }

      uint _price=getNFTPrice(tokenId);
      require(msg.value>=_price,"Insufficient Funds sent for Token Purchase");

      MintThisToken(tokenId);

      // For transfer of token , the users have to allow the smart contract for transfrerring their tokens

      if(ownerOf(tokenId)!=msg.sender){
        // if the token owner is has not approved smart contract that it can transfer tokens to any other person
        // the transfer / purchase will be failed
        require(getApproved(tokenId)==address(this),"Token is not available to transfer");
        address tokenOwner = ownerOf(tokenId);
        this.safeTransferFrom(ownerOf(tokenId),msg.sender,tokenId);
        // deducting the platform fee and sending ramaining amount to the owner of that token
        _price=updatedNFTPrice[tokenId];
        uint minting_fee = _price/MINTING_FEE_FRACTION;
        uint amountToSend = _price- minting_fee;
        payable(tokenOwner).transfer(amountToSend);

      }
      else{
         payable(PLATFORM_BENEFICIARY).transfer(_price);
      }

    }

    // The NFT owner can set the price of NFT that it can be purchased for
    function setNFTPrice(uint tokenId,uint price)public {
      require(ownerOf(tokenId)==msg.sender,"Only Owners can change Price of NFT");
      updatedNFTPrice[tokenId]=price;

    }
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

  

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
         string memory finalURI = integerToString(tokenId);
          finalURI = string(abi.encodePacked(baseURI, finalURI, baseExtension));
          return finalURI;
    }

   




  // The Creator can start a sale after initial presale and public sale 
  function TimedCrowdsale(uint256 _openingTime, uint256 _closingTime) public onlyOwner{
    require(_openingTime >= block.timestamp,"Invalid Sale Opening Time");
    require(_closingTime >= _openingTime,"Invalid Sale Closing Time");
    openingTime = _openingTime;
    closingTime = _closingTime;
  }

// Helping and Utility functions
  
    function integerToString(uint256 _i) internal pure returns (string memory str) {
      if (_i == 0)
      {
        return "0";
      }
      uint256 j = _i;
      uint256 length;
      while (j != 0)
      {
        length++;
        j /= 10;
      }
      bytes memory bstr = new bytes(length);
      uint256 k = length;
      j = _i;
      while (j != 0)
      {
        bstr[--k] = bytes1(uint8(48 + j % 10));
        j /= 10;
      }
      str = string(bstr);
}


    function checkStage() public view returns (Stage stage){
      if(block.timestamp < openingTime) {
        stage = Stage.locked;
        return stage;
      }
      else if(block.timestamp >= openingTime && block.timestamp <= closingTime) {
        stage = Stage.presale;
        return stage;
      }
      else if(block.timestamp >= closingTime) {
        stage = Stage.publicsale;
        return stage;
        }
    }

    // Check if some address is whitelisted 
    function isWhitelisted(address addressToCheck) public returns (bool) {
    if(whitelistContract.isWhitelisted(addressToCheck))
        return true;
    return false;

    }

    // Platform Owner can set the address in which he / she can receive funds from smart contracts 
    function setPLATFORM_BENEFICIARY(address newBeneficiary)public onlyBeneficiary{
      PLATFORM_BENEFICIARY=newBeneficiary;
    }
    // Set NFT Minting fee in fraction
    // 100 means 100/100 = 1%
    // 10 means 100/10   = 10%
    // 20 means 100/20   = 5%

    function setMINTING_FEE_FRACTION(uint newFee)public onlyBeneficiary{
      MINTING_FEE_FRACTION=newFee;
    }
    function startTime()public view returns(uint){
      return openingTime;
    }
    
    function endTime()public view returns(uint){
      return closingTime;
    }
    function isTokenIdExists(uint tokenId)public view returns(bool){
      if(_exists(tokenId)==true)
        return true;
      return false;
    }
    
}