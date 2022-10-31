// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyToken is ERC721 {
    constructor() ERC721("MyToken", "MTK") {
        
    }
    function mint(uint tokenId)public{
        _mint(msg.sender,tokenId);
    }
}

// flow

// create Rentable from contract address
// user  -approval for all-  rentable conract address for transactions
// track the rentable contract in nftTrackingContract
// 
