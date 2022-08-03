import sdk from "./1-initialize-sdk.js";

// ERC-20 contract address
const token = sdk.getToken("0x4Be6f49B03Ca2D9AA5670522bd72c219a53c34E1");

(async () => {
    try {
        // What is the maximum supply you want? 1,000,000 is a cool number!
        const amount = 1_000_000;
        // Interacting with the ERC-20 contract and minting the tokens!
        await token.mintToSelf(amount);
        const totalSupply = await token.totalSupply();

        // Showing how many tokens there are now!
        console.log("✅ Agora temos", totalSupply.displayValue, "$BIKES em circulação");
    } catch (error) {
        console.error("Falha ao imprimir o dinheiro", error);
    }
})();