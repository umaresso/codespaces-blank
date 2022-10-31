
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7; 

// Contract help taken from Sidharth : https://medium.com/coinmonks/rentable-nfts-erc-4907-part-ii-954cc27d22e9

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "./IERC4907.sol";

contract RentableNftFactory is IERC4907 {

// for each contract address maybe we have cached the rentable version

    mapping(uint  => address) public users;
    mapping(uint  => uint) public expiresAt;
    IERC721 nftContract;
    constructor(address contractAddress){
         nftContract=IERC721(contractAddress);

     }

    /// @notice set the user and expires of a NFT
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
    /// @notice Get the user address of an NFT
    /// @dev The zero address indicates that there is no user or the user is expired
    /// @param tokenId The NFT to get the user address for
    /// @return The user address for this NFT
    function userOf(uint256 tokenId) public view override virtual returns(address){
        return users[tokenId];
    }
    

    /// @notice Get the user expires of an NFT
    /// @dev The zero value indicates that there is no user 
    /// @param tokenId The NFT to get the user expires for
    /// @return The user expires for this NFT
    function userExpires(uint256 tokenId) public view override virtual returns(uint256){
        return expiresAt[tokenId];        
    }
    function isExpired(uint tokenId)public view returns(bool) {
        return userExpires(tokenId)<block.timestamp;
    }
    
    /*
        Implementing ERC721 features
    */
    function balanceOf(address _owner) external view returns (uint256){
        return nftContract.balanceOf(_owner);
    }

    function ownerOf(uint256 _tokenId) public override view returns (address){
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
