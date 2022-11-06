const ETH_BLOCK_EXPLORER='https://etherscan.io/address/';
const GOERLI_BLOCK_EXPLORER='https://goerli.etherscan.io/address/';
const POLYGON_BLOCK_EXPLORER='https://polygonscan.com/address/';
const MUMBAI_BLOCK_EXPLORER='https://mumbai.polygonscan.com/address/';
const TRON_BLOCK_EXPLORER='https://tronscan.org/#/address/';
const SHASTA_BLOCK_EXPLORER='https://shasta.tronscan.org/#/address/';


export function getBlockExplorer(network){
    switch (network) {
        case 'ethereum':
            return ETH_BLOCK_EXPLORER;
        case 'goerli':
            return GOERLI_BLOCK_EXPLORER;
        case 'tron':
            return TRON_BLOCK_EXPLORER;
        case 'shasta':
            return SHASTA_BLOCK_EXPLORER;
        case 'polygon':
            return POLYGON_BLOCK_EXPLORER;
        case 'mumbai':
            return MUMBAI_BLOCK_EXPLORER;                                    
        default:
            break;
    }
}


