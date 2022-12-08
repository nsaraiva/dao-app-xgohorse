import sdk from "./1-initialize-sdk.js";
import {MaxUint256} from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x815297aAdA9F7EA17B4cfC5E67C156d16f85129e");

(async () => {
    try {
        const claimConditions = [{
            // When will people be able to claim their NFTs
            startTime: new Date(),
            // Maximum number of NFTs
            maxQuantity: 50_000,
            // the price of NFT (free)
            price: 0,
            // How many NFTs can be claimed per transaction.
            quantityLimitPerTransaction: 1,
            // wait time between transactions infinite means that each
            // person can only request a single NFT.
            waitInSeconds: MaxUint256,
        }]

        await editionDrop.claimConditions.set("0", claimConditions);
        console.log("✅ Condições de reinvidicação configuradas com sucesso!");
    } catch (error) {
        console.error("Falha ao definir condições de reinvidicação", error);
    }
})()