
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7; 

/*
Purpose of Smart contract 

        ->  Take an Already deployed smart contract address ( NFT collection address )
        ->  Creating a Rentable version of old NFT collections which were based on ERC721 and ERC1151

Limitations:
        ->  Currently we just support ERC721 to Rentable Version of the contract 


Use Cases of renting NFTs

        ->  Use in Games (axie infinity ,gods unchained , crypto kitties)
        ->  Attend the Event
        ->  Host an Event
        ->  Rent your Personal data to organization for some time and charging them money for renting your provate data such as your interests and opinions and browsing history

Credit :
        ->  Contract help taken from Sidharth : https://medium.com/coinmonks/rentable-nfts-erc-4907-part-ii-954cc27d22e9

*/

/**                openzeppelin pre-made smart contracts         */
import "https://github.com/athiwatp/openzeppelin-solidity/blob/master/contracts/token/ERC721/IERC721Full.sol";
import "https://github.com/athiwatp/openzeppelin-solidity/blob/master/contracts/token/ERC721/IERC721Full.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/* the true masgic standard to make an NFT collection , rentable        */

import "./IERC4907.sol";

contract RentableNftFactory is IERC4907 {

    mapping(uint  => address) public users; // keeping record that who has rented a particular token Id ( NFT )
    mapping(uint  => uint) public expiresAt; // for how long a token is rented 
    IERC721Full nftContract;                 // just an interface to access functions of already deployed smart contract by calling it

    /**      Receiving the already created / deployed NFT collection smart contract address  to access the details of that collection          */

    constructor(address contractAddress){
         nftContract=IERC721(contractAddress);  // accessing the already deployed ERC721 contract by it's deployed address

     }

    // Purpose : This function assigns the usership of particular NFT to someone the NFT owner Wants.
    /**

        When will it not work ?
                ->  If the NFT is already rented 
                ->  If the time proposed for renting has already past.

        Otherise it will work smoothly
    
     */

    //      Technical information about the function

    /// @dev The zero address indicates there is no user 
    /// Throws if `tokenId` is not valid NFT
    /// @param user  The new user of the NFT
    /// @param expires  UNIX timestamp, The new user could use the NFT before expires
    function setUser(uint tokenId, address user, uint expires) public override virtual{
        
        require(expiresAt[tokenId]<block.timestamp,"User already assigned");
        require(expires > block.timestamp, "expires should be in future");
        users[tokenId]=user;
        expiresAt[tokenId]=expires;
        emit UpdateUser(tokenId,user,expires);
    }
    /*  
        Purpose:  Get the Current User address  of an NFT ( person who has rented the NFT at current time ) 
    
        Technical information about the function

        @dev The zero address indicates that there is no user or the user is expired

        @param tokenId The NFT to get the user address for
        @return The user address for this NFT
    
    */
    function userOf(uint256 tokenId) public view override virtual returns(address){
        return users[tokenId];
    }
    

    /*
        Purpose : Get the the time for which the NFT is rented

        Technical information about the function

        @dev The zero value indicates that there is no user 
        @param tokenId The NFT to get the user expires for
        @return The user expires for this NFT
    */

    function userExpires(uint256 tokenId) public view override virtual returns(uint256){
        return expiresAt[tokenId];        
    }

    /**
        Purpose :  Has someone currently rented the NFT or not
 
     */

    function isExpired(uint tokenId)public view returns(bool) {
        return userExpires(tokenId)<block.timestamp;
    }
    
    /*
        Implementing ERC721 features

        Refer to Openzeppelin's ERC721 documentation for detailed description 
        
    */
    function balanceOf(address _owner) external view returns (uint256){
        return nftContract.balanceOf(_owner);
    }

    function ownerOf(uint256 _tokenId) public view returns (address){
        return nftContract.ownerOf(_tokenId);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory data) external payable{
        nftContract.safeTransferFrom(_from,_to,_tokenId,data);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable{
        nftContract.safeTransferFrom(_from,_to,_tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable{
     nftContract.transferFrom(_from,_to,_tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable{
         nftContract.approve(_approved,_tokenId);

    }
    function isApprovedOrOwner(address _user,uint tokenId)public override view returns(bool){
        return ownerOf(tokenId)==_user || getApproved(tokenId)==_user;
    }
    function ownerOf(address tokenId)public override returns(address){
          return ownerOf(tokenId);
    }
   
    function setApprovalForAll(address _operator, bool _approved) external{
         nftContract.setApprovalForAll(_operator,_approved);
    }

    function getApproved(uint256 _tokenId) public view returns (address){
        return nftContract.getApproved(_tokenId);
    }

    function isApprovedForAll(address _owner, address _operator) external view returns (bool){
        return nftContract.isApprovedForAll(_owner,_operator);
    }

    // support for erc721 metadata and stuff to be added

    

} 
