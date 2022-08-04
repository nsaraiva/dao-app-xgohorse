import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

// Voting contract.
const vote = sdk.getVote("0x98edcaea1e63BC79E117216c0d49cDEaB20b0328");

// ERC-20 contract
const token = sdk.getToken("0x4Be6f49B03Ca2D9AA5670522bd72c219a53c34E1");

(async () => {
  try {
    const amount = 420_000;
    // Proposal to mint 420,000 new tokens to DAO treasury
    const description = "Cunhar para a DAO uma quantidade adicional de " + amount + " tokens no tesouro?";

    const executions = [
      {
        // Token module actually performs the minting
        toAddress: token.getAddress(),
        // NativeToken is ETH. nativeTokenValue is the amount of ETH we want to send in this proposal. 
        // In the case 0 ETH. We are just minting new tokens to the treasury. leave 0
        nativeTokenValue: 0,
          // Making a mint on the vote. in this case, we use ethers.js 
          // to convert the quantity to the correct format. That's because the quantity needs to be in wei
        transactionData: token.encoder.encode(
          "mintTo", [
            vote.getAddress(),
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
      }
    ];

    await vote.propose(description, executions);


    console.log("✅ Proposta de cunhar tokens criada com sucesso!");
  } catch (error) {
    console.error("Falha ao criar primeira proposta", error);
    process.exit(1);
  }

  try {
    // Proposal to transfer to ourselves 6,900 tokens for being angry
    const amount = 6_900;

    const description = "A DAO deveria transferir " + amount + " tokens do tesouro para " +
      process.env.WALLET_ADDRESS + " por ser uma pessoa incrível?";

    const executions = [
      {
        // Again, sending ourselves 0 ETH. Just sending our own token
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          // We are making a transfer from the DAO treasury to our wallet
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),

        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Proposta de dar prêmio do tesouro para si mesmo criada com sucesso, vamos torcer para votarem sim!"
    );
  } catch (error) {
    console.error("Falha ao criar segunda proposta", error);
  }
})();