//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract SaleTracker {
    mapping(address => address[]) public userToSale;
    mapping(address => uint256) public userNumberOfSales;
    address owner;
    uint256 public totalSales;

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }

    function addUserSale(address user, address saleAddress) public {
        userNumberOfSales[user] = userNumberOfSales[user] + 1;
        userToSale[user].push(saleAddress);
    }
}
