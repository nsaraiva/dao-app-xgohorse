import sdk from "./1-initialize-sdk.js";

// ERC-20 contract address
const token = sdk.getToken("0xf2B80A49943D132D762f5877e48b1FdCa445521D");

(async () => {
    try {
        // What is the maximum supply you want? 1,000,000 is a cool number!
        const amount = 1_000_000;
        // Interacting with the ERC-20 contract and minting the tokens!
        await token.mintToSelf(amount);
        const totalSupply = await token.totalSupply();

        // Showing how many tokens there are now!
        console.log("✅ Agora temos", totalSupply.displayValue, "$BUGS em circulação");
    } catch (error) {
        console.error("Falha ao imprimir o dinheiro", error);
    }
})();