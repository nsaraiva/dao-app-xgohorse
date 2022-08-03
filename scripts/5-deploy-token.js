import {AddressZero} from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
    try {
        const tokenAddress = await sdk.deployer.deployToken({
            name: "Token de governança da XGoHorseDAO",
            symbol: "BUGS",
            primary_sale_recipient: AddressZero,
        });
        console.log("✅ Módulo de token implantado com sucesso. Endereço:", tokenAddress,);        
    } catch (error) {
        console.error("Falha ao implantar módulo de token", error);
    }
})();