import { useEffect, useState } from "react";
import {
  ScaleFade,
  VStack,
  Heading,
  Input,
  HStack,
} from "@chakra-ui/react";
import NamedInput from "./NamedInput";
import LinkButton from "./LinkButton/LinkButton";
import DropDownMenu from "./DropDownMenu";
import { WebsiteRentContract } from "../data/WebsiteRent";
import { parseEther } from "ethers/lib/utils";


function IntegrateFrontend(props) {
  let showToggle = props.showToggle;
  let _deployments = props.deployments;
  let _selectedOption = props.selected;
  let website = props.website;
  let type=props.type;
  let price=props.price;
  console.log("props in integrate frinteened",props)

  const [websiteURL, setWebsiteURL] = useState(website);
  const [selectedDeployment, setSelectedDeployment] = useState(_deployments[0]);
  const [deployments, setDeployments] = useState(_deployments);
  const [numDays, setNumDays] = useState(1);
  let bg = "black";
  let textColor = "white";

  async function integrate() {
    alert("Started Renting..");

    // need metamask sign on transaction
    let websiteRentContract = WebsiteRentContract;
    let dayPrice = price;
    let totalPrice = (dayPrice * numDays).toString();
    let days=parseInt(numDays);
    console.log("price to pay", totalPrice)
    console.log("renting with ", {
      websiteURL, selectedDeployment, days
    })
    let tx = await websiteRentContract.rentDapp(websiteURL, selectedDeployment,days,{
      value:parseEther(totalPrice)
    });

    alert("Waiting for Transaction Mining...\nSee Console for Tx:Hash ");
    console.log("Tx Hash is ", tx.hash);
    await tx.wait();
    alert("FrontEnd is Integrated🎉");


  }


  return (
    <ScaleFade initialScale={0.96} delay={"500ms"} in={true}>
      <VStack
        align={"center"}
        zIndex={"11"}
        height={"100vh"}
        width={"100vw"}
        bg="rgba(0,0,0,0.95)"
        paddingTop={"10vh"}
      >
        <VStack align={"center"} color={textColor}>
          <Heading paddingBottom={"5vh"}>Rent a Dapp</Heading>
          <VStack spacing={30}>
            <NamedInput title={type + " " + "Address"}>
              {
                <DropDownMenu
                  selector={(val)=>{
                    console.log("slecting",val);
                    setSelectedDeployment(val)
                  }
                  }
                  options={_deployments}
                  selected={selectedDeployment}
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
                defaultValue={website}
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

            <HStack>
              <LinkButton
                title={`Back`}
                loadingMessage={`Going Back`}
                color={"white"}
                variant={"outline"}
                onClick={() => {
                  showToggle(null);
                }}
              />
              <LinkButton
                onClick={integrate}
                title={`Rent Now`}
                color={"green"}
                variant={"solid"}
                href={"/MySales"}
              />
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </ScaleFade>
  );
}

export default IntegrateFrontend;
