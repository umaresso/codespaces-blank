import { getProviderOrSigner } from "./accountsConnection";
import { ethers } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ChainMismatchError } from "wagmi";
const NftContractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
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
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const NftRentingFactoryABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "expires",
        type: "uint256",
      },
    ],
    name: "UpdateUser",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_approved",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "expiresAt",
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
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "isApprovedOrOwner",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "isExpired",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "expires",
        type: "uint256",
      },
    ],
    name: "setUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "userExpires",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "userOf",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "users",
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
export const NftRentingFactoryBytecode = {
  object:
    "60806040523480156200001157600080fd5b50604051620015e2380380620015e2833981810160405281019062000037919062000096565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506200011b565b600081519050620000908162000101565b92915050565b600060208284031215620000af57620000ae620000fc565b5b6000620000bf848285016200007f565b91505092915050565b6000620000d582620000dc565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600080fd5b6200010c81620000c8565b81146200011857600080fd5b50565b6114b7806200012b6000396000f3fe6080604052600436106100f35760003560e01c80636352211e1161008a578063b88d4fde11610059578063b88d4fde14610349578063c2f1f14a14610365578063d9548e53146103a2578063e985e9c5146103df576100f3565b80636352211e1461026957806370a08231146102a65780638fc88c48146102e3578063a22cb46514610320576100f3565b806323b872dd116100c657806323b872dd146101b7578063365b98b2146101d357806342842e0e14610210578063430c20811461022c576100f3565b8063081812fc146100f8578063095ea7b31461013557806317c95709146101515780631b8a910d1461018e575b600080fd5b34801561010457600080fd5b5061011f600480360381019061011a9190610f70565b61041c565b60405161012c91906110c9565b60405180910390f35b61014f600480360381019061014a9190610f03565b6104d0565b005b34801561015d57600080fd5b5061017860048036038101906101739190610f70565b610563565b604051610185919061123d565b60405180910390f35b34801561019a57600080fd5b506101b560048036038101906101b09190610fca565b61057b565b005b6101d160048036038101906101cc9190610ded565b6106cf565b005b3480156101df57600080fd5b506101fa60048036038101906101f59190610f70565b610765565b60405161020791906110c9565b60405180910390f35b61022a60048036038101906102259190610ded565b610798565b005b34801561023857600080fd5b50610253600480360381019061024e9190610f03565b61082e565b60405161026091906111e2565b60405180910390f35b34801561027557600080fd5b50610290600480360381019061028b9190610f70565b6108ad565b60405161029d91906110c9565b60405180910390f35b3480156102b257600080fd5b506102cd60048036038101906102c89190610d53565b610961565b6040516102da919061123d565b60405180910390f35b3480156102ef57600080fd5b5061030a60048036038101906103059190610f70565b610a15565b604051610317919061123d565b60405180910390f35b34801561032c57600080fd5b5061034760048036038101906103429190610ec3565b610a32565b005b610363600480360381019061035e9190610e40565b610ac5565b005b34801561037157600080fd5b5061038c60048036038101906103879190610f70565b610b5e565b60405161039991906110c9565b60405180910390f35b3480156103ae57600080fd5b506103c960048036038101906103c49190610f70565b610b9a565b6040516103d691906111e2565b60405180910390f35b3480156103eb57600080fd5b5061040660048036038101906104019190610dad565b610bae565b60405161041391906111e2565b60405180910390f35b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663081812fc836040518263ffffffff1660e01b8152600401610479919061123d565b60206040518083038186803b15801561049157600080fd5b505afa1580156104a5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104c99190610d80565b9050919050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663095ea7b383836040518363ffffffff1660e01b815260040161052d9291906111b9565b600060405180830381600087803b15801561054757600080fd5b505af115801561055b573d6000803e3d6000fd5b505050505050565b60016020528060005260406000206000915090505481565b426001600085815260200190815260200160002054106105d0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105c79061121d565b60405180910390fd5b428111610612576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610609906111fd565b60405180910390fd5b8160008085815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508060016000858152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff16837fd0d4d2465fbaaa658444f22a71af0576dc66d910f58504ac3091a8f2e7e0462d836040516106c2919061123d565b60405180910390a3505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8484846040518463ffffffff1660e01b815260040161072e9392919061110d565b600060405180830381600087803b15801561074857600080fd5b505af115801561075c573d6000803e3d6000fd5b50505050505050565b60006020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166342842e0e8484846040518463ffffffff1660e01b81526004016107f79392919061110d565b600060405180830381600087803b15801561081157600080fd5b505af1158015610825573d6000803e3d6000fd5b50505050505050565b60008273ffffffffffffffffffffffffffffffffffffffff16610850836108ad565b73ffffffffffffffffffffffffffffffffffffffff1614806108a557508273ffffffffffffffffffffffffffffffffffffffff1661088d8361041c565b73ffffffffffffffffffffffffffffffffffffffff16145b905092915050565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636352211e836040518263ffffffff1660e01b815260040161090a919061123d565b60206040518083038186803b15801561092257600080fd5b505afa158015610936573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061095a9190610d80565b9050919050565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff1660e01b81526004016109be91906110c9565b60206040518083038186803b1580156109d657600080fd5b505afa1580156109ea573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a0e9190610f9d565b9050919050565b600060016000838152602001908152602001600020549050919050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a22cb46583836040518363ffffffff1660e01b8152600401610a8f929190611190565b600060405180830381600087803b158015610aa957600080fd5b505af1158015610abd573d6000803e3d6000fd5b505050505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b88d4fde858585856040518563ffffffff1660e01b8152600401610b269493929190611144565b600060405180830381600087803b158015610b4057600080fd5b505af1158015610b54573d6000803e3d6000fd5b5050505050505050565b600080600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600042610ba683610a15565b109050919050565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e985e9c584846040518363ffffffff1660e01b8152600401610c0d9291906110e4565b60206040518083038186803b158015610c2557600080fd5b505afa158015610c39573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c5d9190610f43565b905092915050565b6000610c78610c738461127d565b611258565b905082815260208101848484011115610c9457610c936113ca565b5b610c9f848285611323565b509392505050565b600081359050610cb68161143c565b92915050565b600081519050610ccb8161143c565b92915050565b600081359050610ce081611453565b92915050565b600081519050610cf581611453565b92915050565b600082601f830112610d1057610d0f6113c5565b5b8135610d20848260208601610c65565b91505092915050565b600081359050610d388161146a565b92915050565b600081519050610d4d8161146a565b92915050565b600060208284031215610d6957610d686113d4565b5b6000610d7784828501610ca7565b91505092915050565b600060208284031215610d9657610d956113d4565b5b6000610da484828501610cbc565b91505092915050565b60008060408385031215610dc457610dc36113d4565b5b6000610dd285828601610ca7565b9250506020610de385828601610ca7565b9150509250929050565b600080600060608486031215610e0657610e056113d4565b5b6000610e1486828701610ca7565b9350506020610e2586828701610ca7565b9250506040610e3686828701610d29565b9150509250925092565b60008060008060808587031215610e5a57610e596113d4565b5b6000610e6887828801610ca7565b9450506020610e7987828801610ca7565b9350506040610e8a87828801610d29565b925050606085013567ffffffffffffffff811115610eab57610eaa6113cf565b5b610eb787828801610cfb565b91505092959194509250565b60008060408385031215610eda57610ed96113d4565b5b6000610ee885828601610ca7565b9250506020610ef985828601610cd1565b9150509250929050565b60008060408385031215610f1a57610f196113d4565b5b6000610f2885828601610ca7565b9250506020610f3985828601610d29565b9150509250929050565b600060208284031215610f5957610f586113d4565b5b6000610f6784828501610ce6565b91505092915050565b600060208284031215610f8657610f856113d4565b5b6000610f9484828501610d29565b91505092915050565b600060208284031215610fb357610fb26113d4565b5b6000610fc184828501610d3e565b91505092915050565b600080600060608486031215610fe357610fe26113d4565b5b6000610ff186828701610d29565b935050602061100286828701610ca7565b925050604061101386828701610d29565b9150509250925092565b611026816112db565b82525050565b611035816112ed565b82525050565b6000611046826112ae565b61105081856112b9565b9350611060818560208601611332565b611069816113d9565b840191505092915050565b6000611081601b836112ca565b915061108c826113ea565b602082019050919050565b60006110a46015836112ca565b91506110af82611413565b602082019050919050565b6110c381611319565b82525050565b60006020820190506110de600083018461101d565b92915050565b60006040820190506110f9600083018561101d565b611106602083018461101d565b9392505050565b6000606082019050611122600083018661101d565b61112f602083018561101d565b61113c60408301846110ba565b949350505050565b6000608082019050611159600083018761101d565b611166602083018661101d565b61117360408301856110ba565b8181036060830152611185818461103b565b905095945050505050565b60006040820190506111a5600083018561101d565b6111b2602083018461102c565b9392505050565b60006040820190506111ce600083018561101d565b6111db60208301846110ba565b9392505050565b60006020820190506111f7600083018461102c565b92915050565b6000602082019050818103600083015261121681611074565b9050919050565b6000602082019050818103600083015261123681611097565b9050919050565b600060208201905061125260008301846110ba565b92915050565b6000611262611273565b905061126e8282611365565b919050565b6000604051905090565b600067ffffffffffffffff82111561129857611297611396565b5b6112a1826113d9565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600082825260208201905092915050565b60006112e6826112f9565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015611350578082015181840152602081019050611335565b8381111561135f576000848401525b50505050565b61136e826113d9565b810181811067ffffffffffffffff8211171561138d5761138c611396565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f657870697265732073686f756c6420626520696e206675747572650000000000600082015250565b7f5573657220616c72656164792061737369676e65640000000000000000000000600082015250565b611445816112db565b811461145057600080fd5b50565b61145c816112ed565b811461146757600080fd5b50565b61147381611319565b811461147e57600080fd5b5056fea2646970667358221220363711c58f133b795abf455a36b93ae839712be750547566bd0929d32db6a8a464736f6c63430008070033",
};

export const NftRentingTrackerABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "claimOwnerTokenRent",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "claimUserTokenRent",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractAddressesIpfsLink",
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
    name: "contractTokensIpfsLink",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "erc721ToRentableContract",
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
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getTokenRentPrice",
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
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getUserNftByIndex",
    outputs: [
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
        name: "contractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "isRented",
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
    name: "rentFee",
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
        name: "contractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "daysToRentFor",
        type: "uint256",
      },
    ],
    name: "rentNFT",
    outputs: [],
    stateMutability: "payable",
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
    name: "rentableToErc721Contract",
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
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "setTokenRentPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "erc721Address",
        type: "address",
      },
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "newContractAddressesIPFSLink",
        type: "string",
      },
      {
        internalType: "string",
        name: "newContractTokensIPFSLink",
        type: "string",
      },
    ],
    name: "uploadNftForRent",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "userNfts",
    outputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
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
    name: "userNftsCount",
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
    name: "withdrawPlatformMoney",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
// Deployment Addresses
// Ethereum
const NftRentingTrackerAddress = "0x65e5bF619B30828EF9dB4747EBD5B02FDE9230fE";
// Tron
const NftRentingTrackerAddressNile = "TNzA8RCgWGykhAStQSCirGvK61MJ6893Cj";
const NftRentingTrackerAddressShasta = "0x65e5bF619B30828EF9dB4747EBD5B02FDE9230fE";

// Polygon


export const getCustomNetworkNFTFactoryContract = async (
  network,
  web3modalRef,
  contractAddress
) => {
  let signer = await getProviderOrSigner(network, web3modalRef);
  let nftFactory = new ethers.ContractFactory(
    NftRentingFactoryABI,
    NftRentingFactoryBytecode.object,
    signer
  );
  if (contractAddress) {
    nftFactory = new ethers.Contract(
      contractAddress,
      NftRentingFactoryABI,
      signer
    );
  }
  return nftFactory;
};
async function getTronNetworkNFTTracker(network){
	let contractAddress=null;
	if(network=="nile"){	
		contractAddress=nftnile;
	}
	// let tronWeb =await getNetworkTronweb(network);
	console.log("tronlink is ",  window.tronLink)
	let tronWeb=await window.tronLink.tronWeb;

	let contract = await tronWeb.contract().at(contractAddress);
	return contract;

}

export async function getBlockchainSpecificNFTTracker(Blockchain,NetworkChain,web3ModalRef){
if(Blockchain=="tron"){
  let contract = await getTronNetworkNFTTracker(NetworkChain);
  return contract;
}
else if(Blockchain=="ethereum"){
let contract =await getCustomNetworkNFTTrackerContract(NetworkChain,web3ModalRef);
return contract;
}
else if(Blockchain=="polygon"){

}
else{
  // no support 
  return null;
}
}
export const getCustomNetworkNFTTrackerContract = async (
  network,
  web3modalRef,Blockchain
) => {
  let signer = await getProviderOrSigner(network, web3modalRef, true);
  let nftTracker = new ethers.Contract(
    NftRentingTrackerAddress,
    NftRentingTrackerABI,
    signer
  );

  return nftTracker;
};

export const getRentableContract = async (
  contract,
  ercContractAddress,
  setter
) => {
  if (!contract) return null;
  let rentable = await contract.erc721ToRentableContract(ercContractAddress);
  if (setter) {
    setter(rentable);
  }
  return rentable;
};
export const getNftPrice = async (
  TrackerContract,
  contractAddress,
  tokenId
) => {
  try {
    //    console.log("Tracker",TrackerContract,"\ncontract",contractAddress,"\ntoken",tokenId)
    let price = await TrackerContract.getTokenRentPrice(
      contractAddress,
      tokenId
    );
    price = parseInt(price) / 10 ** 18;
    return price;
  } catch (e) {
    console.log("Error in fetching price", e);
  }
};
export const getNftUser = async (rentableContract, tokenId) => {
  try {
    //    console.log("Tracker",TrackerContract,"\ncontract",contractAddress,"\ntoken",tokenId)
    let _user = await rentableContract.userOf(tokenId);
    return _user;
  } catch (e) {
    console.log("Error in fetching current User", e);
  }
};

export const isRented = async (TrackerContract, contractAddress, tokenId) => {
  let rentStatus = await TrackerContract.isRented(contractAddress, tokenId);
  return rentStatus;
};

export const getNftUserAddress = async (
  NetworkChain,
  web3modalRef,
  rentableContractAddress,
  tokenId
) => {
  let user;

  user = await getCustomNetworkNFTFactoryContract(
    NetworkChain,
    web3modalRef,
    rentableContractAddress
  ).then(async (rentableContract) => {
    user = await rentableContract.userOf(tokenId);
    return user;
  });
  return user;
};

export const rentNFT = async (
  Trackercontract,
  contractAddress,
  tokenId,
  days,
  price,
  statusUpdater,
  successFunction,
  successParams
) => {
  try {
    let tx = await Trackercontract.rentNFT(contractAddress, tokenId, days, {
      value: parseEther(price.toString()),
    });
    statusUpdater("Wating for Transaction Completion");
    await tx.wait();
    statusUpdater("Successfully Rented NFT 🥳");
    setTimeout(() => {
      successFunction(successParams);
    }, 2000);
    alert("NFT Rented Successfully !");
  } catch (e) {
    if (e.toString().includes("user rejected transaction")) {
      statusUpdater("You Rejected Transaction ");
      console.log(e);
    } else if (e.toString().includes("insufficient funds for gas")) {
      statusUpdater("You have Insufficient funds for paying Transaction gas ");
      statusUpdater("We Want you to come again after deposit !");
    }
  }
};
