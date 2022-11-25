// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// A Simple Smart contract for Making an NFT collection
// This is technical and better documentation can be found online 
// if you are a non technical person and are not willing to deep dive into the details,
//  you should just know that these code lines are written for making an NFT collection
// otherwise you can visit https://docs.openzeppelin.com/contracts/3.x/erc721 to know more

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyToken is ERC721, ERC721URIStorage {
    string baseURI;

    // "bitcoin prime","bitcoin","ipfs://QmVK3Cnfpuou3rg71kgBFxqo1rSmsBvCFCw9upHntbQhU6/"

    constructor(
        string memory name,
        string memory symbol,
        string memory _baseUri
    ) ERC721("MyToken", "MTK") {
        baseURI = _baseUri;
    }

    function mint(uint256 tokenId) public {
        _mint(msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        _requireMinted(tokenId);

        string memory __baseURI = _baseURI();
        return
            bytes(__baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        __baseURI,
                        Strings.toString(tokenId),
                        ".json"
                    )
                )
                : "";
    }

    function _baseURI()
        internal
        view
        virtual
        override(ERC721)
        returns (string memory)
    {
        return baseURI;
    }

    function _burn(uint256 tokenId)
        internal
        virtual
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }
}

// flow

// create Rentable from contract address
// user  -approval for all-  rentable conract address for transactions
// track the rentable contract in nftTrackingContract
//
