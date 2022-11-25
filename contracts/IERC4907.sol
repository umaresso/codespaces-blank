// SPDX-License-Identifier: MIT

// This is standard interface to make an NFT Rentable .
// The feature is called Usership.
// After the release of this standard there can be two roles associated to each NFT
// 1. Owner ( as it was before in ERC721 )
// 2. User  ( holding the NFT for a small period  )
//          (A user does not have the access to NFT features 
//           like the real Owner do like transferring the temporarily owned NFT to another person
//           and receiving the money , this can only be done by owner)
// There are a number of concerns that this standard has addressed

// Now everyone can use the exact same standard to build on and it's universal so that each rentable NFT created is compatible with other
// This is the feature we have introduced in Rentweb3 and it's our plus point in the face of competitors like reNFT
// The point to Note_ here is that only the owner can assign the temporary usership  ( like renting  for some period ) to anyone.
// We Personally love this standard at rentWeb3


pragma solidity ^0.8.7;
// Contract help taken from Sidharth : https://medium.com/coinmonks/rentable-nfts-erc-4907-part-ii-954cc27d22e9

interface IERC4907 {
    // Logged when the user of a token assigns a new user or updates expires
    /// @notice Emitted when the `user` of an NFT or the `expires` of the `user` is changed
    /// The zero address for user indicates that there is no user address
    event UpdateUser(uint256 indexed tokenId, address indexed user, uint expires);

    /// @notice set the user and expires of a NFT
    /// @dev The zero address indicates there is no user 
    /// Throws if `tokenId` is not valid NFT
    /// @param user  The new user of the NFT
    /// @param expires  UNIX timestamp, The new user could use the NFT before expires
    function setUser(uint256 tokenId, address user, uint expires) external  ;
    function ownerOf(uint tokenId)external returns(address);
    /// @notice Get the user address of an NFT
    /// @dev The zero address indicates that there is no user or the user is expired
    /// @param tokenId The NFT to get the user address for
    /// @return The user address for this NFT
    function userOf(uint256 tokenId) external view returns(address);

    /// @notice Get the user expires of an NFT
    /// @dev The zero value indicates that there is no user 
    /// @param tokenId The NFT to get the user expires for
    /// @return The user expires for this NFT
    function userExpires(uint256 tokenId) external view returns(uint256);
    function isApprovedOrOwner(address _user,uint tokenId)external view returns(bool);
}
