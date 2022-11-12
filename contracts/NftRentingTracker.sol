// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./IERC4907.sol";
contract NftRentingTracker{
/*
    Use Cases
-> Use in Games (axie infinity ,gods unchained , crypto kitties)
-> Attend the Event
-> Host an Event
-> Use Personal data for organization
*/
address platformOwner;
constructor(){
platformOwner=msg.sender;
}
 struct NFT{
        address contractAddress;
        uint tokenId;
        uint timestamp;
    }
    mapping(address =>mapping(uint=>uint)) rentPrices; // token id price of some contract address
    // for specific user address , we will go through all contracts
    // we get contract addresses from ipfs
    // for each 
    mapping(address =>mapping(uint=>bool)) tokensAvailable; // tokens available on platform
    mapping(address=>NFT[]) public userNfts;
    mapping(address=>uint) public userNftsCount;
    mapping(address=>address)public erc721ToRentableContract;
    mapping(address=>address)public rentableToErc721Contract;
    
    // token rent to pay to owner

    // store new contract addresses on ipfs
    string public contractAddressesIpfsLink;
    string public contractTokensIpfsLink;

    uint public rentFee = 1;  // 1% fee on every renting..

    // each owner has many tokens inside many contract addresses
    // we could use an array but this third mapping reducecs redundancy of tokens
    mapping(address =>mapping(address=>mapping(uint=>uint))) ownerTokensRentToPay; // token id price of some contract address
    mapping(address =>mapping(address=>mapping(uint=>uint))) userRentTime; // token id price of some contract address
    

//      ToDO
// user can claim his 50% money in case of fraud before 50% of time is spent to be fair to both
// owner can claim there half of rent immediately and half after the renting is finished
// owner can stop renting..
modifier ifOwnerOrApproved(address contractAddress,uint tokenId,address sender){
    IERC4907 _contract =IERC4907(contractAddress);
    require( _contract.isApprovedOrOwner(sender,tokenId),"Caller is neither owner nor approved !");
    _;

}
function uploadNftForRent(address erc721Address,address contractAddress,uint tokenId,uint price,string memory newContractAddressesIPFSLink,string memory newContractTokensIPFSLink,address sender)public ifOwnerOrApproved(contractAddress,tokenId,sender){
    require(!tokensAvailable[contractAddress][tokenId],"Token is Already present on Platform");
    tokensAvailable[contractAddress][tokenId]=true;
    rentPrices[contractAddress][tokenId]=price;
    erc721ToRentableContract[erc721Address]=contractAddress;
    rentableToErc721Contract[contractAddress]=erc721Address;
    contractAddressesIpfsLink=newContractAddressesIPFSLink;
    contractTokensIpfsLink=newContractTokensIPFSLink;
    
}
function rentNFT(address contractAddress,uint tokenId,uint daysToRentFor)public payable {
    // 1000000000000000000
    // 2020000000000000000
    // 4040000000000000000
    require(tokensAvailable[contractAddress][tokenId],"Token is not available on Platform");
    require(tokensAvailable[contractAddress][tokenId]);
    uint priceToPay=getTokenRentPrice(contractAddress,tokenId)*daysToRentFor;
    require(priceToPay<=msg.value,"Insufficent Funds for NFT rent");
    //recording current time
    uint timeNow=block.timestamp; 
    // 
    uint _timestampToRentFor = timeNow + 60*daysToRentFor; // to be corrected , replace 60 with 86400

    // setting msg.sender as user of the NFT 
    IERC4907 _contract =IERC4907(contractAddress);
    _contract.setUser(tokenId,msg.sender,_timestampToRentFor);
    // Keeping track of user's Rented NFTs
    NFT memory _nft=NFT(contractAddress,tokenId,_timestampToRentFor);
    userNfts[msg.sender].push(_nft);

    // calculation of price for owner to pay after deduction in fee
    address _owner=_contract.ownerOf(tokenId);
    uint tokenPrice=rentPrices[contractAddress][tokenId];
    uint feePrice=(tokenPrice*rentFee)/100;
    ownerTokensRentToPay[_owner][contractAddress][tokenId]+=(priceToPay-feePrice);
    userRentTime[msg.sender][contractAddress][tokenId]=timeNow;

}


function claimUserTokenRent(address contractAddress,uint tokenId)public payable{
    uint timeNow=block.timestamp;
    IERC4907 _contract =IERC4907(contractAddress);
    address user=_contract.userOf(tokenId);

    uint rentingAt= userRentTime[msg.sender][contractAddress][tokenId];
    uint expiryTime = _contract.userExpires(tokenId);
    uint durationOfRent=expiryTime-rentingAt;
    uint fiftyPercentOfDuration=(durationOfRent*50)/100;
    // time for the moment when fifty percent of the renting duration has been passed
    uint fiftyPercentDurationPassed=rentingAt+fiftyPercentOfDuration; 
// if user has not spent more than fifty percent of time
    uint currentTokenPrice=rentPrices[contractAddress][tokenId] ;
    if(timeNow<fiftyPercentDurationPassed){
        uint fee = ( currentTokenPrice*rentFee)/100;
        uint refundPrice=( (currentTokenPrice*50) / 100 )-fee; // refund 50% amount after deducting fee 
        payable(user).transfer(refundPrice); 
    }
    else{ } // no refund , it will be refunded back to owner

}

function claimOwnerTokenRent(address contractAddress,uint tokenId)public payable{
    IERC4907 _contract =IERC4907(contractAddress);
    address _owner=_contract.ownerOf(tokenId);
    require(msg.sender==_owner,"Not an Owner of the Token");
    uint totalAmount = ownerTokensRentToPay[_owner][contractAddress][tokenId];
    uint amountToPay;
    if(_contract.userExpires(tokenId)<block.timestamp){
        amountToPay=totalAmount; // pay 100% of the available rent
    }
    else{
        amountToPay=totalAmount-((totalAmount*50)/100); // pay 50% of the available rent for that token
    }
    payable(_owner).transfer(amountToPay);
}
function getUserNftByIndex(uint index)public view returns(address,uint,uint){
    address contractAddress=userNfts[msg.sender][index].contractAddress;
    IERC4907 _contract =IERC4907(contractAddress);
    uint tokenId=userNfts[msg.sender][index].tokenId;
    uint _timestamp=userNfts[msg.sender][index].timestamp;
    return (contractAddress,tokenId,_timestamp);
}

function setTokenRentPrice(address contractAddress,uint tokenId,uint price,address sender)public ifOwnerOrApproved(contractAddress,tokenId,sender){
 rentPrices[contractAddress][tokenId]=price;
   
}
function getTokenRentPrice(address contractAddress,uint tokenId)public view returns(uint){
 uint tokenPrice=rentPrices[contractAddress][tokenId];
 uint feePrice=(tokenPrice*rentFee)/100;
 return tokenPrice+feePrice;
} 
function isRented(address contractAddress,uint tokenId)public view returns(bool){
 IERC4907 _contract =IERC4907(contractAddress);
 return _contract.userExpires(tokenId)>block.timestamp;

}

function withdrawPlatformMoney()public payable{
    require(msg.sender==platformOwner,"You are not an Owner of Platform");
    payable(msg.sender).transfer(address(this).balance);

}
    


}
