import{AddressZero} from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import {readFileSync} from "fs";

(async () => {
    try{
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            name: "Membro da eXtreme Go Horse DAO",
            description: "A única opção é a mais rápida!",
            image: readFileSync("scripts/assets/eXtreme_Go_Horse.jpg"),
            primary_sale_recipient: AddressZero,
        });

        const editionDrop = sdk.getEditionDrop(editionDropAddress);
        const metadata = await editionDrop.metadata.get();

        console.log("✅ Contrato editionDrop implantado com sucesso, endereço:",editionDropAddress,);

        console.log("✅ bundleDrop metadados:", metadata,);
    } catch(error){
        console.log("Falha ao implantar contrato editionDrop", error);
    }
})();