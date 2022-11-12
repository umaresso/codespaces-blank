import TronWeb from "tronweb";
import { getMinimalAddress } from "../Utilities";
import { getCurrentConnectedOwner } from "./blockchainSpecificExports";
const tronPrivateKey =
  "88cd69e757d4ce34abbd4b6693b40a6417e20da9e28bf8955f3d76302f9b440c";

export const tronConnect = async () => {
  try {
    //      debugger;
    let tronlink = await window.tronLink;
    if (!tronlink) {
      alert("Please Install tronlink First ");
      return null;
    }

    await tronlink.request({ method: "tron_requestAccounts" });

    let tronWeb = await tronlink?.tronWeb;
    if (tronWeb == false) return null;
    let address = tronWeb.defaultAddress;
    return address.base58;
  } catch (err) {
    console.log("Error: ", err);
    alert("Error: TronLink extension is not installed");
    return null;
  }
};

async function getTronwebShasta() {
  const HttpProvider = TronWeb.providers.HttpProvider;
  const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
  const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
  const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
  const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    tronPrivateKey
  );
  return tronWeb;
}
export function getNileTronWeb() {
  const HttpProvider = TronWeb.providers.HttpProvider;
  const fullNode = new HttpProvider("https://api.nileex.io/");
  const solidityNode = new HttpProvider("https://api.nileex.io/");
  const eventServer = new HttpProvider("https://event.nileex.io/");
  let tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer,
    tronPrivateKey
  );
  // console.log("returning tron nile web", tronWeb);
  return tronWeb;
}

async function getTronwebMainnet() {}

export async function getNetworkTronweb(network) {
  let Network = network.toString().toLowerCase();
  switch (Network) {
    case "shasta":
      return getTronwebShasta();
    case "nile":
      let trwb = await getNileTronWeb();
      // console.log("Network returns ", trwb);
      return trwb;
    case "mainnet":
      return getTronwebMainnet();

    default:
      break;
  }
}

export async function deploy_tron_contract(
  network,
  abi,
  bytecode,
  parameters,
  statusUpdater,
  SuccessFallback
) {
  try {
    let tronWeb = await getNetworkTronweb(network);
    // console.log("tronweb inside deploy ", tronWeb);
    statusUpdater("Creting contract instance..");
    statusUpdater("Deploying your smart contract");
    console.log("paramters received ", {
      abi: abi,
      bytecode: bytecode.object,
      feeLimit: 1000000000,
      callValue: 0,
      userFeePercentage: 1,
      originEnergyLimit: 10000000,
      parameters: parameters,
      shouldPollResponse: true,
    });
    let contract_instance = await tronWeb.contract().new({
      abi: abi,
      bytecode: bytecode.object,
      feeLimit: 1000000000,
      callValue: 0,
      userFeePercentage: 1,
      originEnergyLimit: 10000000,
      parameters: parameters,
      shouldPollResponse: true,
    });
    let scAddress = contract_instance.address;
    statusUpdater("Deployed Successfully 🥳 ");
    let contract = await tronWeb.contract().at(scAddress);
    let currentConnectedUser = await tronConnect();
    if(SuccessFallback)
      SuccessFallback(scAddress, currentConnectedUser);
    return scAddress;
  } catch (e) {
    if (e.message.toString().includes('insufficient')) {
      alert("You do not have enough bandwidth and energy to deploy whitelist");
      
    } else alert("Whitelist Creation Unsuccessful");
    console.log("error : ", e);
    return null;
  }
}

export const getCurrentUserTronWeb = async () => {
  let tronlink = await window.tronLink;
  await tronlink.request({ method: "tron_requestAccounts" });
  let tronWeb = await tronlink?.tronWeb;
  return tronWeb;
};
