import { useEffect, useState } from "react";
import { ScaleFade, VStack, Heading, Input, HStack } from "@chakra-ui/react";
import NamedInput from "./NamedInput";
import LinkButton from "./LinkButton/LinkButton";
import DropDownMenu from "./DropDownMenu";
import { parseEther } from "ethers/lib/utils";
import { getCustomNetworkWebsiteRentContract } from "../../data/WebsiteRent";
import { useRef } from "react";
import { getProviderOrSigner } from "../../data/accountsConnection";
import { getMinimalAddress } from "../../Utilities";
import Link from "next/link";
import { getBlockchainSpecificWebsiteRentContract } from "../../data/Whitelist";
import { addScaleCorrector } from "framer-motion";
import { useSelector } from "react-redux";

function IntegrateFrontend(props) {
  const selectedBlockchainInformation = useSelector(
    (state) => state.blockchain.value
  );
  let Blockchain = selectedBlockchainInformation.name;
  let NetworkChain = selectedBlockchainInformation.network;

  let showToggle = props.showToggle;
  let _deployments = props.deployments;
  let _selectedOption = props.selected;
  let website = props.website;
  let type = props.type;
  let price = props.price;
  const [formStep, setFormStep] = useState(1);
  const [websiteURL, setWebsiteURL] = useState(website);
  const [selectedDeployment, setSelectedDeployment] = useState(null);
  const [deployments, setDeployments] = useState(_deployments);
  const [numDays, setNumDays] = useState(1);
  let web3ModalRef = useRef();
  let bg = "black";
  let textColor = "white";
  function setStatus(message) {
    let ele = document.getElementById("creationStatus");
    var p_tag = document.createElement("p");
    p_tag.key = `message${message}`;
    p_tag.textContent = "-> " + message;
    ele.append(p_tag);
  }

  async function integrate() {
    setFormStep((prev) => prev + 1);
    setStatus("Renting Started ✔ ");
    setStatus("Assembling arguments for upload ..");
    // need metamask sign on transaction
    let websiteRentContract = await getBlockchainSpecificWebsiteRentContract(
      Blockchain,
      NetworkChain,
      web3ModalRef
    );
    // console.log("website rent contract ", websiteRentContract);
    let dayPrice = price;
    let totalPrice = dayPrice * numDays;
    let days = parseInt(numDays);

    try {
      if (!selectedDeployment) {
        alert("select a deployment address first");
        showToggle(false)
        return;
      }
      setStatus("Making Dapp Rent Transaction");
      setStatus("Approve Transaction !");
      if (Blockchain == "tron") {
        setStatus("Transaction in progress..");
        console.log({websiteURL, selectedDeployment, days})
        let tx = await websiteRentContract
          .rentDapp(websiteURL, selectedDeployment, days)
          .send({
            feeLimit: 100000000,
            callValue: parseInt(totalPrice * 10 ** 6),
            tokenId: "",
            tokenValue: "",
            shouldPollResponse: true,
          });
        setStatus("SuccessFully Rented 🥳");
      } else if (Blockchain == "ethereum") {
        setStatus("Waiting for Transaction Completion");
        let options = {
          gasLimit: 3000000,
          value: parseEther(price.toString()) ,
        };

        let tx = await websiteRentContract.rentDapp(
          websiteURL,
          selectedDeployment,
          days,
          options
        );
        setStatus("Tx Hash is " + getMinimalAddress(tx.hash.toString()));
        await tx.wait();
        setStatus("FrontEnd is Integrated🎉");

      } else if (Blockchain == "polygon") {
        // yet to implement
      } else {
        return null;
      }
    } catch (e) {
      alert("Dapp renting failed , console for errors");
      console.log("Dapp rent failed ", e);
    }
  }

  return (
    <ScaleFade initialScale={0.96} delay={"500ms"} in={true}>
      <VStack
        align={"center"}
        zIndex={"11"}
        height={"100%"}
        width={"100%"}
        bg="rgba(0,0,0,0.95)"
        paddingTop={"10vh"}
      >
        {formStep == 1 && (
          <VStack align={"center"} color={textColor}>
            <Heading paddingBottom={"5vh"}>Rent a Dapp</Heading>
            <VStack spacing={30}>
              <NamedInput title={type + " " + "Address"}>
                {
                  <DropDownMenu
                    selector={(val) => {
                      setSelectedDeployment(val);
                    }}
                    options={_deployments}
                    selected={_deployments ? _deployments[0] : null}
                  />
                }
              </NamedInput>

              <NamedInput title={"Website URL"}>
                <Input
                  key={"Website URL"}
                  onChange={(e) => {
                    let res = e.target.value;
                    setWebsiteURL(res);
                  }}
                  variant="outline"
                  defaultValue={website ? website : null}
                  placeholder="https://project.com"
                />
              </NamedInput>
              <NamedInput title={"Days "}>
                <Input
                  key={"daysCount"}
                  onChange={(e) => {
                    let res = e.target.value;
                    setNumDays(res);
                  }}
                  variant="outline"
                  placeholder="Days to rent for"
                />
              </NamedInput>
              <NamedInput title={"Price to Pay"}>
                <Input
                  key={"daysCount"}
                  disabled
                  variant="outline"
                  value={numDays * price}
                />
              </NamedInput>

              <HStack spacing={10}>
                <LinkButton
                  title={`Back`}
                  loadingMessage={`Going Back`}
                  color={"white"}
                  variant={"outline"}
                  onClick={() => {
                    showToggle && showToggle(null);
                  }}
                />
                <LinkButton
                  onClick={integrate}
                  title={`Rent Now`}
                  color={"green"}
                  variant={"solid"}
                  href={"/Deployments"}
                  
                />
              </HStack>
            </VStack>
          </VStack>
        )}

        <VStack
          paddingTop={formStep != 2 ? "0" : "20vh"}
          height={formStep != 2 ? "0.01vh" : "100vh"}
          width={"100vw"}
          textColor={"white"}
        >
          <Heading> {formStep == 2 ? "FrontEnd Integration" : ""} </Heading>
          <VStack id="creationStatus" width={"50vw"} align={"center"}></VStack>
        </VStack>

        {formStep == 3 && (
          <VStack>
            <Heading>Successfully Integrated 🥳</Heading>
            <Link href="/ExploreDapps">Click Here</Link> to see the uploaded
            Dapps
          </VStack>
        )}
      </VStack>
    </ScaleFade>
  );
}

export default IntegrateFrontend;
