import TronWeb from "tronweb";
import { getMinimalAddress } from "../Utilities";
export const tronConnect = async () => {
  try {
    //      debugger;
    await window.tronLink.request({ method: "tron_requestAccounts" });
    let accounts = await window.tronLink;
    let address = accounts.tronWeb.defaultAddress.base58;
    console.log(accounts.tronWeb);
    return address;
  } catch (err) {
    console.log("Error: ", err);
    alert("Error: TronLink extension is not installed");
  }
};

async function getTronwebNile() {}
async function getTronwebShasta() {
  const HttpProvider = TronWeb.providers.HttpProvider;
  const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
  const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
  const eventServer = new HttpProvider("https://api.shasta.trongrid.io");
  const privateKey =
    "9c0bebe2250a767277e0cd5d849d9de28e7bf6353c45b198af6174f355a80ca6";
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
  return tronWeb;
}
async function getTronwebMainnet() {}

async function getNetworkTronweb(network) {
  let Network = network.toString().toLowerCase();
  switch (Network) {
    case "shasta":
      return getTronwebShasta();
    case "nile":
      return getTronwebNile();
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
  statusUpdater
) {
  try {
    const HttpProvider = TronWeb.providers.HttpProvider;
    // const fullNode = new HttpProvider("https://api.shasta.trongrid.io");
    // const solidityNode = new HttpProvider("https://api.shasta.trongrid.io");
    // const eventServer = new HttpProvider("https://api.shasta.trongrid.io");

    const fullNode = new HttpProvider("https://api.nileex.io/");
    const solidityNode = new HttpProvider("https://api.nileex.io/");
    const eventServer = new HttpProvider("https://event.nileex.io/");

    const privateKey =
      "9c0bebe2250a767277e0cd5d849d9de28e7bf6353c45b198af6174f355a80ca6";
    let tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

    // let tronWeb = getNetworkTronweb(network);

    statusUpdater("Creting contract instance..");
    statusUpdater("Deploying your smart contract");
    let contract_instance = await tronWeb.contract().new({
      abi: abi,
      bytecode: bytecode.object,
      feeLimit: 1000000000,
      callValue: 0,
      userFeePercentage: 1,
      originEnergyLimit: 10000000,
      parameters: parameters,
    });

    let scAddress = contract_instance.address;
    statusUpdater("Deployed Successfully 🥳 ");
    let contract = await tronWeb.contract().at(scAddress);
    console.log(contract);
    let name = await contract.name().call();
    statusUpdater(
      name + " is deployed to address := " + getMinimalAddress(scAddress)
    );
    return scAddress;
  } catch (e) {
    console.log("error : ", e);
  }
}
