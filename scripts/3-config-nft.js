import sdk from "./1-initialize-sdk.js";
import {readFileSync} from "fs";

const editionDrop = sdk.getEditionDrop("0x81d8950aeA472C1d3c39D11379102542e6194491");

(async () => {
    try{
        await editionDrop.createBatch([
            {
                name: "eXtreme Go Horse",
                description: "Esse NFT vai te dar acesso ao XGoHorseDAO",
                image: readFileSync("scripts/assets/eXtreme_Go_Horse.jpg"),
            },
        ]);
        console.log("✅ Novo NFT criado com sucesso no !");
    } catch(error){
        console.error("Falha ao criar NFT", error);
    }
})()