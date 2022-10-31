//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract WebsiteRent {
    mapping(string => address) public websiteToDeployment; // which smart contract is to be displayed on screen
    mapping(address => string) public deploymentToWebsite; // which smart contract is to be displayed on screen

    mapping(string => uint256) prices; // price of renting each Dapp
    mapping(string => uint256) public rentTime; // for how much time the Dapp is rented currently
    mapping(string => bool) public websiteExists; // keeping track of all the websites available on platform that can be rented
    mapping(string => address) public websiteOwner; // track of developers of website
    string public allWebsitesIPFSCid;

    address PLATFORM_BENEFICIARY;
    uint256 rentFeePercentage = 5; // 5% fee on each rent of a DAPP

    constructor(address _PLATFORM_BENEFICIARY) {
        PLATFORM_BENEFICIARY = _PLATFORM_BENEFICIARY;
    }

    // "google,com"
    // 1000000000000000000
    modifier onlyWebsiteOwner(string memory website) {
        require(msg.sender == websiteOwner[website]);
        _;
    }
    modifier onlyBeneficiary() {
        require(msg.sender == PLATFORM_BENEFICIARY);
        _;
    }
    modifier ifWebsiteExists(string memory website) {
        require(
            websiteExists[website],
            "The Website does not exist on HostMyNFT"
        );
        _;
    }

    function rentDapp(
        string memory website,
        address deployment,
        uint256 rentDays
    ) public payable ifWebsiteExists(website) {
        require(
            rentTime[website] < block.timestamp,
            "Website is already rented"
        );
        require(msg.value >= prices[website]);
        rentTime[website] = block.timestamp + (86400 * rentDays);
        websiteToDeployment[website] = deployment;
        deploymentToWebsite[deployment] = website;
        uint256 fee = (prices[website] * 5) / 100;
        payable(PLATFORM_BENEFICIARY).transfer(fee);
        payable(websiteOwner[website]).transfer(prices[website]);
    }

    // 1050000000000000000
    function getDappRentPrice(string memory website)
        public
        view
        ifWebsiteExists(website)
        returns (uint256)
    {
        uint256 rentingFee = (prices[website] * (5)) / 100;
        return prices[website] + rentingFee;
    }

    function updateDappRentPrice(string memory website, uint256 price)
        public
        ifWebsiteExists(website)
        onlyWebsiteOwner(website)
    {
        prices[website] = price;
    }

    function getCurrentDeployment(string memory website)
        public
        returns (address)
    {
        if (rentTime[website] > block.timestamp)
            return websiteToDeployment[website];
        rentTime[website] = 0;
        websiteToDeployment[website] = address(0x0);
        return address(0x0);
    }

    function uploadWebsite(
        string memory website,
        uint256 price,
        address owner
    ) public {
        require(websiteExists[website] == false, "website already exists");
        websiteExists[website] = true;
        websiteOwner[website] = owner;
        websiteToDeployment[website] = address(0x0);
        prices[website] = price;
    }

    function updateRentFee(uint256 Percentage) external onlyBeneficiary {
        rentFeePercentage = Percentage;
    }

    function updateWebsitesIPFSLink(string memory cid) public onlyBeneficiary {
        allWebsitesIPFSCid = cid;
    }
}
