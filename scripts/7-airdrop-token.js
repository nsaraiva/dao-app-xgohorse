import sdk from "./1-initialize-sdk.js";

// Affiliation NFT contract ERC-1155 address
const editionDrop = sdk.getEditionDrop("0x81d8950aeA472C1d3c39D11379102542e6194491");
// Address of the token's ERC20 contract.
const token = sdk.getToken("0x4Be6f49B03Ca2D9AA5670522bd72c219a53c34E1");

(async () => {
    try {
        // Address of all people who have the affiliation NFT, which has tokenId 0
        const walletAddress = await editionDrop.history.getAllClaimerAddresses(0);

        if(walletAddress.length === 0){
            console.log("Ninguém cunhou o NFT ainda, peça para alguns amigos fazerem isso e ganhar um NFT de graça!");
            process.exit(0);
        }
        // Loop in array of addresses
        const airdropTargets = walletAddress.map((address) => {
            // Pick a random # between 1000 and 10000
            const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
            console.log("✅ Vai enviar", randomAmount, "tokens para ", address);

            // Configure the target
            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
            };

            return airdropTarget;
        });

        // Call transferBatch on all airdrop targets.
        console.log("✈️ Começando o airdrop...");
        await token.transferBatch(airdropTargets);
        console.log("✅ Feito o airdrop de tokens para todos os donos de NFT!");
    } catch (error) {
        console.error("O airdrop de tokens falhou", error);
    }
})();