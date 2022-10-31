//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract WhitelistTracker{
    mapping(address=>address[])public userToWhitelist;
    mapping(address=>uint) public userNumberOfWhitelists;
    address owner;
    constructor(address _owner){
        owner=_owner;
    }
    modifier onlyOwner{
        require(owner==msg.sender);
        _;

    }

    function addUserWhitelist(address user,address whitelistAddress) public {
        userNumberOfWhitelists[user]=userNumberOfWhitelists[user]+1;
        userToWhitelist[user].push(whitelistAddress);

    }

}
