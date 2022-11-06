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

let NetworkChain = "goerli";

function IntegrateFrontend(props) {
  console.log("props are ",props);
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
    setStatus("Renting Statrted ✔ ");
    setStatus("Assembling arguments for upload ..");
    // need metamask sign on transaction
    let websiteRentContract = await getCustomNetworkWebsiteRentContract(
      NetworkChain,
      web3ModalRef
    );
    console.log("website rent contract ", websiteRentContract);
    let dayPrice = price;
    let totalPrice = dayPrice * numDays;
    let days = parseInt(numDays);
    // console.log("price to pay", totalPrice);
    // console.log("renting with ", {
    //   websiteURL,
    //   selectedDeployment,
    //   days,
    // });

    // console.log("Selected Deply is ", selectedDeployment);

    try {
      if (!selectedDeployment) {
        alert("select a deployment address first");
        return;
      }
      let signer = await getProviderOrSigner(NetworkChain, web3ModalRef);
      let gasPrice = await signer.getGasPrice();
      //      gasPrice = parseInt(gasPrice);
      console.log("gasPrices are ", gasPrice);
      setStatus("Making Dapp Rent Transaction");
      setStatus("Approve Transaction");
      var options = {
        gasLimit: 3000000,
        value: parseEther(totalPrice.toString()),
      };
      console.log("renting with ", {
        websiteURL,
        selectedDeployment,
        days,
        options,
      });
      let tx = await websiteRentContract.rentDapp(
        websiteURL,
        selectedDeployment,
        days,
        options
      );

      setStatus("Waiting for Transaction Completion");
      setStatus("Tx Hash is " + getMinimalAddress(tx.hash.toString()));
      await tx.wait();
      setStatus("FrontEnd is Integrated🎉");
    } catch (e) {
      alert("Dapp renting failed , console for erros");
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
                    selected={_deployments? _deployments[0]:null}
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
                  defaultValue={() => {
                    return website ? website : "";
                  }}
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
                  value={numDays * price }
                />
              </NamedInput>

              <HStack>
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
          <Heading> {formStep == 2 ? "Dapp Renting Status" : ""} </Heading>
          <VStack id="creationStatus" width={"50vw"} align={"center"}></VStack>
        </VStack>

        {formStep == 3 && (
          <VStack>
            <Heading>Successfully Published 🥳</Heading>
            <Link href="/ExploreDapps">Click Here</Link> to see the uploaded
            Dapps
          </VStack>
        )}
      </VStack>
    </ScaleFade>
  );
}

export default IntegrateFrontend;
