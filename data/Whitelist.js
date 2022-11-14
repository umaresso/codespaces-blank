import {
  getCustomNetworkWebsiteRentContract,
  getTronWebsiteRentContract,
  WebsiteRentContract,
} from "./WebsiteRent";
import { getProviderOrSigner } from "./accountsConnection";
import { getNetworkTronweb } from "./TronAccountsManagement";
export const whitelistABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_maxWhitelistedAddresses",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "_baseURI",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_totalSupply",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endTime",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "WhitelistByPrivilege",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "addAddressToWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "endTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMaxWhitelistedAddresses",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "isWhitelisted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "maxWhitelistedAddresses",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "numAddressesWhitelisted",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_time",
        type: "uint256",
      },
    ],
    name: "setWhitelistEndTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_time",
        type: "uint256",
      },
    ],
    name: "setWhitelistStartTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
export const whitelistByteCode = {
  object:
    "60806040523480156200001157600080fd5b506040516200133538038062001335833981810160405281019062000037919062000249565b85600281905550876000908051906020019062000056929190620000ed565b5086600190805190602001906200006f929190620000ed565b5084600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508360089080519060200190620000c9929190620000ed565b50816006819055508060078190555082600981905550505050505050505062000565565b828054620000fb9062000442565b90600052602060002090601f0160209004810192826200011f57600085556200016b565b82601f106200013a57805160ff19168380011785556200016b565b828001600101855582156200016b579182015b828111156200016a5782518255916020019190600101906200014d565b5b5090506200017a91906200017e565b5090565b5b80821115620001995760008160009055506001016200017f565b5090565b6000620001b4620001ae8462000398565b6200036f565b905082815260208101848484011115620001d357620001d262000511565b5b620001e08482856200040c565b509392505050565b600081519050620001f98162000531565b92915050565b600082601f8301126200021757620002166200050c565b5b8151620002298482602086016200019d565b91505092915050565b60008151905062000243816200054b565b92915050565b600080600080600080600080610100898b0312156200026d576200026c6200051b565b5b600089015167ffffffffffffffff8111156200028e576200028d62000516565b5b6200029c8b828c01620001ff565b985050602089015167ffffffffffffffff811115620002c057620002bf62000516565b5b620002ce8b828c01620001ff565b9750506040620002e18b828c0162000232565b9650506060620002f48b828c01620001e8565b955050608089015167ffffffffffffffff81111562000318576200031762000516565b5b620003268b828c01620001ff565b94505060a0620003398b828c0162000232565b93505060c06200034c8b828c0162000232565b92505060e06200035f8b828c0162000232565b9150509295985092959890939650565b60006200037b6200038e565b905062000389828262000478565b919050565b6000604051905090565b600067ffffffffffffffff821115620003b657620003b5620004dd565b5b620003c18262000520565b9050602081019050919050565b6000620003db82620003e2565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b838110156200042c5780820151818401526020810190506200040f565b838111156200043c576000848401525b50505050565b600060028204905060018216806200045b57607f821691505b60208210811415620004725762000471620004ae565b5b50919050565b620004838262000520565b810181811067ffffffffffffffff82111715620004a557620004a4620004dd565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b6200053c81620003ce565b81146200054857600080fd5b50565b620005568162000402565b81146200056257600080fd5b50565b610dc080620005756000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80634011d7cd116100975780638e7314d9116100665780638e7314d91461025257806395d89b411461025c578063b9d6ed301461027a578063ef87fa0814610296576100f5565b80634011d7cd146101da5780636c0360eb146101f857806378e97925146102165780638da5cb5b14610234576100f5565b80631c0ce3d3116100d35780631c0ce3d3146101525780633197cbb61461016e57806331a721881461018c5780633af32abf146101aa576100f5565b806306fdde03146100fa57806316c1f0bb1461011857806318160ddd14610134575b600080fd5b6101026102b4565b60405161010f9190610a1c565b60405180910390f35b610132600480360381019061012d919061089a565b610342565b005b61013c610411565b6040516101499190610abe565b60405180910390f35b61016c600480360381019061016791906108c7565b610417565b005b61017661047b565b6040516101839190610abe565b60405180910390f35b610194610481565b6040516101a19190610abe565b60405180910390f35b6101c460048036038101906101bf919061089a565b610487565b6040516101d19190610a01565b60405180910390f35b6101e26104e4565b6040516101ef9190610abe565b60405180910390f35b6102006104ea565b60405161020d9190610a1c565b60405180910390f35b61021e610578565b60405161022b9190610abe565b60405180910390f35b61023c61057e565b60405161024991906109e6565b60405180910390f35b61025a6105a4565b005b610264610774565b6040516102719190610a1c565b60405180910390f35b610294600480360381019061028f91906108c7565b610802565b005b61029e610866565b6040516102ab9190610abe565b60405180910390f35b600080546102c190610bc6565b80601f01602080910402602001604051908101604052809291908181526020018280546102ed90610bc6565b801561033a5780601f1061030f5761010080835404028352916020019161033a565b820191906000526020600020905b81548152906001019060200180831161031d57829003601f168201915b505050505081565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461039c57600080fd5b6001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506001600460008282546104079190610af5565b9250508190555050565b60095481565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461047157600080fd5b8060068190555050565b60075481565b60025481565b600060011515600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515149050919050565b60045481565b600880546104f790610bc6565b80601f016020809104026020016040519081016040528092919081815260200182805461052390610bc6565b80156105705780601f1061054557610100808354040283529160200191610570565b820191906000526020600020905b81548152906001019060200180831161055357829003601f168201915b505050505081565b60065481565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6006544210156105e9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105e090610a7e565b60405180910390fd5b600754421061062d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161062490610a5e565b60405180910390fd5b600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16156106ba576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106b190610a9e565b60405180910390fd5b60025460045410610700576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106f790610a3e565b60405180910390fd5b6001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555060016004600082825461076b9190610af5565b92505081905550565b6001805461078190610bc6565b80601f01602080910402602001604051908101604052809291908181526020018280546107ad90610bc6565b80156107fa5780601f106107cf576101008083540402835291602001916107fa565b820191906000526020600020905b8154815290600101906020018083116107dd57829003601f168201915b505050505081565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461085c57600080fd5b8060078190555050565b6000600254905090565b60008135905061087f81610d5c565b92915050565b60008135905061089481610d73565b92915050565b6000602082840312156108b0576108af610c56565b5b60006108be84828501610870565b91505092915050565b6000602082840312156108dd576108dc610c56565b5b60006108eb84828501610885565b91505092915050565b6108fd81610b4b565b82525050565b61090c81610b5d565b82525050565b600061091d82610ad9565b6109278185610ae4565b9350610937818560208601610b93565b61094081610c5b565b840191505092915050565b6000610958602b83610ae4565b915061096382610c6c565b604082019050919050565b600061097b601683610ae4565b915061098682610cbb565b602082019050919050565b600061099e602083610ae4565b91506109a982610ce4565b602082019050919050565b60006109c1602383610ae4565b91506109cc82610d0d565b604082019050919050565b6109e081610b89565b82525050565b60006020820190506109fb60008301846108f4565b92915050565b6000602082019050610a166000830184610903565b92915050565b60006020820190508181036000830152610a368184610912565b905092915050565b60006020820190508181036000830152610a578161094b565b9050919050565b60006020820190508181036000830152610a778161096e565b9050919050565b60006020820190508181036000830152610a9781610991565b9050919050565b60006020820190508181036000830152610ab7816109b4565b9050919050565b6000602082019050610ad360008301846109d7565b92915050565b600081519050919050565b600082825260208201905092915050565b6000610b0082610b89565b9150610b0b83610b89565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610b4057610b3f610bf8565b5b828201905092915050565b6000610b5682610b69565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60005b83811015610bb1578082015181840152602081019050610b96565b83811115610bc0576000848401525b50505050565b60006002820490506001821680610bde57607f821691505b60208210811415610bf257610bf1610c27565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600080fd5b6000601f19601f8301169050919050565b7f4d6f7265206164647265737365732063616e742062652061646465642c206c6960008201527f6d69742072656163686564000000000000000000000000000000000000000000602082015250565b7f57686974656c697374696e672068617320656e64656400000000000000000000600082015250565b7f57686974656c697374696e6720686173206e6f74207374617274656420796574600082015250565b7f53656e6465722068617320616c7265616479206265656e2077686974656c697360008201527f7465640000000000000000000000000000000000000000000000000000000000602082015250565b610d6581610b4b565b8114610d7057600080fd5b50565b610d7c81610b89565b8114610d8757600080fd5b5056fea264697066735822122011f3858d80734bbedb0f19eb0fe61e4227b5550f491436a1863e924bd380a47a64736f6c63430008070033",
};

export const whitelistTrackerABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "address",
        name: "whitelistAddress",
        type: "address",
      },
    ],
    name: "addUserWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalWhitelists",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userNumberOfWhitelists",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userToWhitelist",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
export const whitelistTrackerByteCode = {
  object:
    "608060405234801561001057600080fd5b506040516106563803806106568339818101604052810190610032919061008e565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610109565b600081519050610088816100f2565b92915050565b6000602082840312156100a4576100a36100ed565b5b60006100b284828501610079565b91505092915050565b60006100c6826100cd565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600080fd5b6100fb816100bb565b811461010657600080fd5b50565b61053e806101186000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80632187ed66146100515780633ed9602e146100815780639ef2dca7146100b1578063a1b89b70146100cd575b600080fd5b61006b600480360381019061006691906102ca565b6100eb565b60405161007891906103b0565b60405180910390f35b61009b60048036038101906100969190610337565b610103565b6040516100a89190610395565b60405180910390f35b6100cb60048036038101906100c691906102f7565b610151565b005b6100d561029a565b6040516100e291906103b0565b60405180910390f35b60016020528060005260406000206000915090505481565b6000602052816000526040600020818154811061011f57600080fd5b906000526020600020016000915091509054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60018060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461019c91906103cb565b600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360008154809291906102919061045d565b91905055505050565b60035481565b6000813590506102af816104da565b92915050565b6000813590506102c4816104f1565b92915050565b6000602082840312156102e0576102df6104d5565b5b60006102ee848285016102a0565b91505092915050565b6000806040838503121561030e5761030d6104d5565b5b600061031c858286016102a0565b925050602061032d858286016102a0565b9150509250929050565b6000806040838503121561034e5761034d6104d5565b5b600061035c858286016102a0565b925050602061036d858286016102b5565b9150509250929050565b61038081610421565b82525050565b61038f81610453565b82525050565b60006020820190506103aa6000830184610377565b92915050565b60006020820190506103c56000830184610386565b92915050565b60006103d682610453565b91506103e183610453565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610416576104156104a6565b5b828201905092915050565b600061042c82610433565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600061046882610453565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561049b5761049a6104a6565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600080fd5b6104e381610421565b81146104ee57600080fd5b50565b6104fa81610453565b811461050557600080fd5b5056fea264697066735822122072e74b0a2d1ecf78ddfda9de5194ec98b3bb821b038db5692110b28b5023421064736f6c63430008070033",
};
// Ethereum
// Goerli Network Deployed Address
export const whitelistTrackerAddress =
  "0x91c027c2d98d1292B7788A0b6962B8251bdF5724";

// Tron
// Nile
export const whitelistTrackerTronNileAddress =
  "TEy4cELfgsoEgiLvsMqwannhXvLz8pYKB9";

// Shasta
export const whitelistTrackerTronShastaAddress = null;
//

// Polygon

const ethers = require("ethers");

export const fetchWhitelistAddresses = async (
  contract,
  owner,
  setter,
  Blockchain
) => {
  // console.log("Tracker  is ", contract);
  let TrackerContract = contract;
  let numWhitelists = 0;
  if (Blockchain == "tron") {
    numWhitelists = await TrackerContract.userNumberOfWhitelists(owner).call();
  } else {
    numWhitelists = await TrackerContract.userNumberOfWhitelists(owner);
  }

  let allWhitelists = [];
  // console.log("Owner has ", numWhitelists, " Whitelists");
  for (let index = 0; index < numWhitelists; index++) {
    let whitelistAddress = null;
    if (Blockchain == "tron") {
      whitelistAddress = await TrackerContract.userToWhitelist(
        owner,
        index
      ).call();
    } else if (
      !Blockchain ||
      Blockchain == "ethereum" ||
      Blockchain == "polygon"
    ) {
      whitelistAddress = await TrackerContract.userToWhitelist(owner, index);
    }
    allWhitelists.push(whitelistAddress);
  }

  if (setter != undefined) {
    setter(allWhitelists);
  }
  return allWhitelists;
};

export async function getBlockchainSpecificWebsiteRentContract(
  Blockchain,
  NetworkChain,
  web3modalRef
) {
  let websiteRentContract = null;
  if (Blockchain == "tron") {
    websiteRentContract = await getTronWebsiteRentContract(NetworkChain);
    console.log({ websiteRentContract });
    return websiteRentContract;
  } else if (!Blockchain || Blockchain == "ethereum") {
    websiteRentContract = await getCustomNetworkWebsiteRentContract(
      NetworkChain,
      web3modalRef
    );
    return websiteRentContract;
  } else if (Blockchain == "polygon") {
    //to be implemented yet
  }
  return websiteRentContract;
}
export async function getBlockchainSpecificWhitelistTrackerContract(
  Blockchain,
  NetworkChain,
  web3modalRef
) {
  let WhitelistTracker = null;
  if (Blockchain == "tron") {
    WhitelistTracker = await getTronWhitelistTrackerContract(NetworkChain);
    // console.log("want to return whitelistTracker ", WhitelistTracker);
    return WhitelistTracker;
  } else if (!Blockchain || Blockchain == "ethereum") {
    WhitelistTracker = await getCustomNetworkWhitelistTrackerContract(
      NetworkChain,
      web3modalRef
    );
    return WhitelistTracker;
  } else if (Blockchain == "polygon") {
    //to be implemented yet
    return WhitelistTracker;
  } else {
    return null;
  }
}
export async function getBlockchainSpecificWhitelistFactoryContract(
  Blockchain,
  NetworkChain,
  web3modalRef,
  contractAddress
) {
  let contract = null;
  if (Blockchain == "tron") {
    contract = await getTronWhitelistFactory(NetworkChain, contractAddress);
    // console.log("want to return whitelistTracker ", contract);
    return contract;
  } else if (!Blockchain || Blockchain == "ethereum") {
    contract = await getCustomNetworkWhitelistContract(
      NetworkChain,
      web3modalRef,
      contractAddress
    );
    return contract;
  } else if (Blockchain == "polygon") {
    //to be implemented yet
    return contract;
  } else {
    return null;
  }
}

export const fetchWhitelists = async (
  NetworkChain,
  web3modalRef,
  owner,
  arraySetter,
  Blockchain
) => {
  //   console.log("obtaining whitelists for ", owner);

  // console.log("fetching whitelists");
  let websiteRentContract = await getBlockchainSpecificWebsiteRentContract(
    Blockchain,
    NetworkChain,
    web3modalRef
  );
  let whitelistTracker = await getBlockchainSpecificWhitelistTrackerContract(
    Blockchain,
    NetworkChain,
    web3modalRef
  );
  // console.log(websiteRentContract,"\n\n");
  // console.log(whitelistTracker,"\n\n");

  let whitelists = await fetchWhitelistAddresses(
    whitelistTracker,
    owner,
    arraySetter,
    Blockchain
  );
  // console.log("all whitelists are ", whitelists);
  let allWhitelists = [];
  // console.log("iterating over");
  whitelists.map(async (_whitelist, index) => {
    let whitelistContract = await getBlockchainSpecificWhitelistFactoryContract(
      Blockchain,
      NetworkChain,
      web3modalRef,
      _whitelist
    );

    let hostedWebsite = "";
    let rentTime = 0;
    if (Blockchain == "tron") {
      console.log("website rent contract is ",websiteRentContract)
      // console.log("checking website for ", _whitelist);
      hostedWebsite = await websiteRentContract
        .deploymentToWebsite(_whitelist)
        .call();
      if (hostedWebsite != "") {
        let deployment = await websiteRentContract
          .websiteToDeployment(hostedWebsite)
          .call();
        if (deployment.toString() !== _whitelist.toString()) {
          hostedWebsite = "";
        } else {
          rentTime = await websiteRentContract.rentTime(hostedWebsite).call();
        }
      }
    } else if (!Blockchain || Blockchain == "ethereum") {
      hostedWebsite = await websiteRentContract.deploymentToWebsite(_whitelist);
      if (hostedWebsite != "") {
        let deployment = await websiteRentContract.websiteToDeployment(
          hostedWebsite
        );
        if (deployment.toString() !== _whitelist.toString()) {
          hostedWebsite = "";
        } else {
          rentTime = await websiteRentContract.rentTime(hostedWebsite);
        }
      }
    } else if (Blockchain == "polygon") {
      // polygon pull
    } else {
      // no support
    }
    hostedWebsite =
      rentTime * 1000 > new Date().getTime() ? hostedWebsite : null;

    let name, symbol, baseURI, whitelistedCount, startTime, endTime;
    if (Blockchain == "tron") {
      name = await whitelistContract.name().call();
      symbol = await whitelistContract.symbol().call();
      baseURI = await whitelistContract.baseURI().call();
      whitelistedCount = await whitelistContract
        .numAddressesWhitelisted()
        .call();
      startTime = await whitelistContract.startTime().call();
      endTime = await whitelistContract.endTime().call();
    } else if (!Blockchain || Blockchain == "ethereum") {
      name = await whitelistContract.name();
      symbol = await whitelistContract.symbol();
      baseURI = await whitelistContract.baseURI();
      whitelistedCount = await whitelistContract.numAddressesWhitelisted();
      startTime = await whitelistContract.startTime();
      endTime = await whitelistContract.endTime();
    }

    let whitelistInstance = {
      id: index + 1,
      name,
      symbol,
      baseURI,
      address: _whitelist,
      website: hostedWebsite,
      users: whitelistedCount,
      startTime,
      endTime,
      owner,
      rentTime: rentTime * 1000,
    };
    // console.log("whitelist instance", whitelistInstance);
    allWhitelists.push(whitelistInstance);
    if (index + 1 == whitelists.length) {
      if (arraySetter != undefined) {
        arraySetter(allWhitelists);
      }
    }
  });
  // console.log("returning");
  return allWhitelists;
};

export const getCustomNetworkWhitelistContract = async (
  network,
  web3modalRef,
  contractAddress
) => {
  let signer = await getProviderOrSigner(network, web3modalRef, true);
  let whitelistfactory = new ethers.ContractFactory(
    whitelistABI,
    whitelistByteCode.object,
    signer
  );
  if (contractAddress) {
    whitelistfactory = new ethers.Contract(
      contractAddress,
      whitelistABI,
      signer
    );
  }
  return whitelistfactory;
};

export const getCustomNetworkWhitelistTrackerContract = async (
  network,
  web3modalRef
) => {
  let signer = await getProviderOrSigner(network, web3modalRef, true);
  const whitelistTrackerContract = new ethers.Contract(
    whitelistTrackerAddress,
    whitelistTrackerABI,
    signer
  );
  return whitelistTrackerContract;
};

export const getTronWhitelistTrackerContract = async (network) => {
  let contractAddress = null;
  if (network == "nile") {
    contractAddress = whitelistTrackerTronNileAddress;
  }
  let tronWeb = await getNetworkTronweb(network);
  let contract = await tronWeb.contract().at(contractAddress);
  return contract;
};
export const getTronWhitelistFactory = async (network, contractAddress) => {
  let tronWeb = await getNetworkTronweb(network);
  let contract = await tronWeb.contract().at(contractAddress);
  return contract;
};
