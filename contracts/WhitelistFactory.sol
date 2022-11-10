//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


interface IWhitelist {

    function addAddressToWhitelist()external  ;
    function getMaxWhitelistedAddresses() external returns (uint);
    function isWhitelisted(address user) external  returns (bool);
    function setWhitelistStartTime(uint _time)  external  ;
    function setWhitelistEndTime(uint _time) external ;
    function WhitelistByPrivilege(address _user)  external;
}

contract WhitelistFactory is IWhitelist{
    string public name;
    string public symbol;
    
    // Max number of whitelisted addresses allowed
    uint public maxWhitelistedAddresses;

    // Create a mapping of whitelistedAddresses
    // if an address is whitelisted, we would set it to true, it is false by default for all other addresses.
    mapping(address => bool) whitelistedAddresses;

    // numAddressesWhitelisted would be used to keep track of how many addresses have been whitelisted
    // NOTE: Don't change this variable name, as it will be part of verification
    uint public numAddressesWhitelisted;

    // Setting the Max number of whitelisted addresses
    // User will put the value at the time of deployment
    address public owner;
    // whitelist sales start and end time
    uint public startTime;
    uint public endTime;
    string public baseURI;
    uint public totalSupply;

    constructor(
        string memory _name,
        string memory _symbol,
        uint _maxWhitelistedAddresses,
        address _owner,
        string memory _baseURI,
        uint _totalSupply,
        uint _startTime,
        uint _endTime
        ) {
    // Demo Data for testing
    // "seemal","sam",100,0x7bD5EBac8A1dD13f3698C7ddFC77803CdE039BA6,"//ipfs/QmVK3Cnfpuou3rg71kgBFxqo1rSmsBvCFCw9upHntbQhU6/",10,1665933948,1668042730
        maxWhitelistedAddresses =  _maxWhitelistedAddresses;
        name=_name;
        symbol=_symbol;
        owner = _owner;
        baseURI=_baseURI;
        startTime=_startTime;
        endTime=_endTime;
        totalSupply=_totalSupply;
        
    }

    /**
        addAddressToWhitelist - This function adds the address of the sender to the
        whitelist
     */
    function addAddressToWhitelist() override external {
        // check if the user has already been whitelisted
        require(block.timestamp >= startTime,"Whitelisting has not started yet");
        require(block.timestamp < endTime,"Whitelisting has ended");
        
        require(!whitelistedAddresses[msg.sender], "Sender has already been whitelisted");
        // check if the numAddressesWhitelisted < maxWhitelistedAddresses, if not then throw an error.
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "More addresses cant be added, limit reached");
        whitelistedAddresses[msg.sender] = true;       
        numAddressesWhitelisted += 1;

    }
    function WhitelistByPrivilege(address _user) override external onlyOwner{
        whitelistedAddresses[msg.sender] = true;
        numAddressesWhitelisted += 1;
        
    }
    modifier onlyOwner{
        require(msg.sender==owner);
        _;
    }

    function getMaxWhitelistedAddresses() override external view returns (uint){
        return maxWhitelistedAddresses;
    }
    function isWhitelisted(address user) override external  view returns (bool){
        return whitelistedAddresses[user]==true;
    }
   
    function setWhitelistStartTime(uint _time) override external onlyOwner  {
        startTime=_time;
    }
    function setWhitelistEndTime(uint _time) override external onlyOwner {
        endTime=_time;
    }

}