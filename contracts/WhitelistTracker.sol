//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


/**

    A contract that keeps the record of how many and which whitelists are deployed by a particular person ( address )
    It stores the address of deployed smart contracts that were created on rentweb3 during 'Create Whitelist ' phase.
    
    In short , a container for deployed 'Whitelist Factory ' smart contracts
    
 */
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
